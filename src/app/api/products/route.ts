import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/product'
import User from '@/db/models/user'
import { getSessionUserId } from '@/lib/auth'
import type { Product as ProductType } from '@/types'

type SessionUser = {
  _id: { toString(): string }
  isAdmin?: boolean
}

type ProductPayload = {
  id?: string
  name?: string
  description?: string
  detailedDescription?: string
  careInstructions?: string
  price?: number
  stock?: number
  category?: string
  image?: string
  createdAt?: string
}

async function getSessionUser() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }

  return (await User.findById(userId).lean()) as SessionUser | null
}

function serializeProduct(product: Record<string, any>): ProductType {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    detailedDescription: product.detailedDescription,
    careInstructions: product.careInstructions,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image: product.image,
    createdAt: product.createdAt.toISOString(),
  }
}

function validateProductInput(payload: ProductPayload, requireAllFields: boolean) {
  const requiredFields: Array<keyof ProductPayload> = [
    'name',
    'description',
    'detailedDescription',
    'careInstructions',
    'price',
    'stock',
    'category',
    'image',
  ]

  if (requireAllFields) {
    for (const field of requiredFields) {
      const value = payload[field]
      if (value === undefined || value === null || value === '') {
        return `${field} is required.`
      }
    }
  }

  if (
    payload.price !== undefined &&
    (typeof payload.price !== 'number' || Number.isNaN(payload.price) || payload.price < 0)
  ) {
    return 'price must be a non-negative number.'
  }

  if (
    payload.stock !== undefined &&
    (typeof payload.stock !== 'number' || Number.isNaN(payload.stock) || payload.stock < 0)
  ) {
    return 'stock must be a non-negative number.'
  }

  return null
}

function buildProductData(payload: ProductPayload) {
  return {
    ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
    ...(payload.description !== undefined ? { description: payload.description.trim() } : {}),
    ...(payload.detailedDescription !== undefined ? { detailedDescription: payload.detailedDescription.trim() } : {}),
    ...(payload.careInstructions !== undefined ? { careInstructions: payload.careInstructions.trim() } : {}),
    ...(payload.price !== undefined ? { price: payload.price } : {}),
    ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
    ...(payload.category !== undefined ? { category: payload.category.trim() } : {}),
    ...(payload.image !== undefined ? { image: payload.image.trim() } : {}),
  }
}

export async function GET() {
  try {
    await dbConnect()

    const products = await Product.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json(
      {
        success: true,
        products: products.map((product) => serializeProduct(product)),
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load products.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 })
    }

    const payload = (await request.json()) as ProductPayload
    const validationError = validateProductInput(payload, true)
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 })
    }

    const productId = payload.id?.trim() || Date.now().toString()
    const createdProduct = await Product.findOneAndUpdate(
      { id: productId },
      {
        $set: buildProductData(payload),
        $setOnInsert: {
          id: productId,
          createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
        },
      },
      {
        new: true,
        upsert: true,
      }
    ).lean()

    return NextResponse.json(
      {
        success: true,
        product: createdProduct ? serializeProduct(createdProduct) : null,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 })
    }

    const payload = (await request.json()) as ProductPayload
    if (!payload.id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 })
    }

    const validationError = validateProductInput(payload, false)
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 })
    }

    const update = buildProductData(payload)
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update.' }, { status: 400 })
    }

    const updatedProduct = await Product.findOneAndUpdate({ id: payload.id }, { $set: update }, { new: true }).lean()

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        product: serializeProduct(updatedProduct),
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 })
    }

    const payload = (await request.json()) as ProductPayload
    if (!payload.id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 })
    }

    const deletedProduct = await Product.findOneAndDelete({ id: payload.id }).lean()
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
