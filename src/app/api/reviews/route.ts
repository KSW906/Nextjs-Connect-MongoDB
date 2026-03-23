import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Review from '@/db/models/review'
import Product from '@/db/models/product'
import User from '@/db/models/user'
import { getSessionUserId } from '@/lib/auth'
import { maskReviewerName } from '@/lib/review'

type ReviewResponse = {
  id: string
  userId: string
  productId: string
  userName: string
  rating: number
  content: string
  createdAt: string
  updatedAt?: string
}

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

function serializeReview(review: {
  _id: { toString(): string }
  user: { _id: { toString(): string } }
  product: { id: string }
  userName: string
  rating: number
  content: string
  createdAt: Date
  updatedAt?: Date
}): ReviewResponse {
  return {
    id: review._id.toString(),
    userId: review.user._id.toString(),
    productId: review.product.id,
    userName: review.userName,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt?.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const productId = request.nextUrl.searchParams.get('productId')
    const query: Record<string, unknown> = { status: 'visible' }

    if (productId) {
      const product = await Product.findOne({ id: productId })
      if (!product) {
        return NextResponse.json({ success: true, reviews: [] }, { status: 200 })
      }
      query.product = product._id
    }

    const reviews = await Review.find(query)
      .populate('user')
      .populate('product')
      .sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        reviews: reviews.map(serializeReview),
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load reviews.'
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
    const { productId, rating, content } = body

    if (!productId || typeof rating !== 'number' || !content?.trim()) {
      return NextResponse.json({ success: false, message: 'productId, rating and content are required.' }, { status: 400 })
    }

    const user = await User.findById(userId)
    const product = await Product.findOne({ id: productId })

    if (!user || !product) {
      return NextResponse.json({ success: false, message: 'User or product not found.' }, { status: 404 })
    }

    const existingReview = await Review.findOne({ user: userId, product: product._id })
    if (existingReview) {
      return NextResponse.json({ success: false, message: 'You already reviewed this product.' }, { status: 409 })
    }

    const review = await Review.create({
      user: user._id,
      product: product._id,
      userName: maskReviewerName(user.name),
      rating,
      content: content.trim(),
    })

    const populatedReview = await Review.findById(review._id).populate('user').populate('product')

    return NextResponse.json(
      {
        success: true,
        review: populatedReview ? serializeReview(populatedReview as never) : null,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create review.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect()

    const userId = await getAuthedUserId()
    if (userId instanceof NextResponse) {
      return userId
    }

    const body = await request.json()
    const { id, content, rating } = body

    if (!id || typeof rating !== 'number' || !content?.trim()) {
      return NextResponse.json({ success: false, message: 'id, rating and content are required.' }, { status: 400 })
    }

    const review = await Review.findOne({ _id: id, user: userId, status: 'visible' })
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found.' }, { status: 404 })
    }

    review.content = content.trim()
    review.rating = rating
    review.editedAt = new Date()
    await review.save()

    const populatedReview = await Review.findById(review._id).populate('user').populate('product')

    return NextResponse.json(
      {
        success: true,
        review: populatedReview ? serializeReview(populatedReview as never) : null,
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update review.'
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
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 })
    }

    const deleted = await Review.findOneAndDelete({ _id: id, user: userId })
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Review not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete review.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
