import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Wishlist from '@/db/models/wishlist'
import User from '@/db/models/user'
import { getSessionUserId } from '@/lib/auth'
import { ensureProductDocumentById } from '@/lib/products'

async function getAuthedUserId() {
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

async function readWishlistProductIds(userId: string) {
  const items = await Wishlist.find({ user: userId }).sort({ createdAt: -1 })
  return items.map((item: { productId: string }) => item.productId)
}

export async function GET() {
  try {
    await dbConnect()

    const userId = await getAuthedUserId()
    if (userId instanceof NextResponse) {
      return userId
    }

    return NextResponse.json({ success: true, productIds: await readWishlistProductIds(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load wishlist.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const userId = await getAuthedUserId()
    if (userId instanceof NextResponse) {
      return userId
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required.' }, { status: 400 })
    }

    const product = await ensureProductDocumentById(productId)
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 })
    }

    await Wishlist.updateOne(
      { user: userId, product: product._id },
      {
        $setOnInsert: {
          user: userId,
          product: product._id,
          productId,
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, productIds: await readWishlistProductIds(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add wishlist item.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()

    const userId = await getAuthedUserId()
    if (userId instanceof NextResponse) {
      return userId
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required.' }, { status: 400 })
    }

    await Wishlist.deleteOne({ user: userId, productId })

    return NextResponse.json({ success: true, productIds: await readWishlistProductIds(userId) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove wishlist item.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
