import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Cart from '@/db/models/cart'
import User from '@/db/models/user'
import { getSessionUserId } from '@/lib/auth'
import { ensureProductDocumentById } from '@/lib/products'

type SerializedCartItem = {
  productId: string
  quantity: number
}

async function ensureUser() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 })
  }

  const user = await User.findById(userId)
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
  }

  return userId
}

async function readCartItems(userId: string): Promise<SerializedCartItem[]> {
  const cart = await Cart.findOne({ user: userId }).populate('items.product')

  if (!cart) {
    return []
  }

  return cart.items
    .map((item: { product: { id?: string } | null; quantity: number }) => {
      if (!item.product?.id) {
        return null
      }

      return {
        productId: item.product.id,
        quantity: item.quantity,
      }
    })
    .filter((item: SerializedCartItem | null): item is SerializedCartItem => item !== null)
}

export async function GET() {
  try {
    await dbConnect()

    const userId = await ensureUser()
    if (userId instanceof NextResponse) {
      return userId
    }

    const items = await readCartItems(userId)
    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load cart.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required.' }, { status: 400 })
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ success: false, message: 'quantity must be at least 1.' }, { status: 400 })
    }

    const userId = await ensureUser()
    if (userId instanceof NextResponse) {
      return userId
    }

    const product = await ensureProductDocumentById(productId)
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
    }

    const cart = (await Cart.findOne({ user: userId })) || (await Cart.create({ user: userId, items: [] }))
    const existingItem = cart.items.find(
      (item: { product: { toString(): string } }) => item.product.toString() === product._id.toString()
    )

    const nextQuantity = existingItem ? existingItem.quantity + quantity : quantity
    if (nextQuantity > product.stock) {
      return NextResponse.json({ success: false, message: 'Not enough stock available.' }, { status: 400 })
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity
      existingItem.addedAt = new Date()
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        addedAt: new Date(),
      })
    }

    await cart.save()

    return NextResponse.json({ success: true, items: await readCartItems(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add to cart.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || typeof quantity !== 'number') {
      return NextResponse.json({ success: false, message: 'productId and quantity are required.' }, { status: 400 })
    }

    const userId = await ensureUser()
    if (userId instanceof NextResponse) {
      return userId
    }

    const product = await ensureProductDocumentById(productId)
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
    }

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ success: true, items: [] }, { status: 200 })
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item: { product: { toString(): string } }) => item.product.toString() !== product._id.toString()
      )
    } else {
      if (quantity > product.stock) {
        return NextResponse.json({ success: false, message: 'Not enough stock available.' }, { status: 400 })
      }

      const targetItem = cart.items.find(
        (item: { product: { toString(): string } }) => item.product.toString() === product._id.toString()
      )

      if (!targetItem) {
        return NextResponse.json({ success: false, message: 'Cart item not found.' }, { status: 404 })
      }

      targetItem.quantity = quantity
      targetItem.addedAt = new Date()
    }

    await cart.save()

    return NextResponse.json({ success: true, items: await readCartItems(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update cart.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { productId } = body

    const userId = await ensureUser()
    if (userId instanceof NextResponse) {
      return userId
    }

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ success: true, items: [] }, { status: 200 })
    }

    if (!productId) {
      cart.items = []
    } else {
      const product = await ensureProductDocumentById(productId)
      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
      }

      cart.items = cart.items.filter(
        (item: { product: { toString(): string } }) => item.product.toString() !== product._id.toString()
      )
    }

    await cart.save()

    return NextResponse.json({ success: true, items: await readCartItems(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clear cart.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
