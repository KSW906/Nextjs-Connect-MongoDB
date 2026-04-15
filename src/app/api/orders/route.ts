import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Cart from '@/db/models/cart'
import Order from '@/db/models/order'
import Product from '@/db/models/product'
import User from '@/db/models/user'
import { getSessionUserId } from '@/lib/auth'
import type { Order as OrderType, OrderStatus, PaymentMethod, Product as ProductType, RefundStatus } from '@/types'

type MongoId = {
  toString(): string
}

type SessionUser = {
  _id: MongoId
  isAdmin?: boolean
}

type ProductDocument = Omit<ProductType, 'createdAt'> & {
  createdAt: Date
}

type OrderItemDocument = {
  productId: string
  productName: string
  productImage: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

type OrderDocument = Omit<OrderType, 'id' | 'userId' | 'createdAt' | 'estimatedDelivery'> & {
  _id: MongoId
  user: string | MongoId
  items: OrderItemDocument[]
  createdAt: Date
  estimatedDelivery?: Date | null
  paidAt?: Date | null
  shippedAt?: Date | null
  deliveredAt?: Date | null
  cancelledAt?: Date | null
  refundedAt?: Date | null
}

type PopulatedCartItem = {
  product: {
    _id: { toString(): string }
    id: string
    name: string
    image: string
    price: number
    stock: number
  } | null
  quantity: number
}

async function getSessionUser() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }

  const user = (await User.findById(userId).lean()) as SessionUser | null
  return user
}

function buildOrderNumber() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ORD-${yyyy}${mm}${dd}-${random}`
}

function serializeUpdatedProduct(product: ProductDocument): ProductType {
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

function serializeOrder(order: OrderDocument): OrderType {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    userId: typeof order.user === 'string' ? order.user : order.user.toString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingInfo: {
      recipientName: order.shippingInfo.recipientName,
      zipcode: order.shippingInfo.zipcode || '',
      address: order.shippingInfo.address,
      addressDetail: order.shippingInfo.addressDetail || '',
      phone: order.shippingInfo.phone,
      message: order.shippingInfo.message || '',
    },
    createdAt: order.createdAt.toISOString(),
    estimatedDelivery: order.estimatedDelivery?.toISOString() || '',
    paidAt: order.paidAt?.toISOString() || null,
    shippedAt: order.shippedAt?.toISOString() || null,
    deliveredAt: order.deliveredAt?.toISOString() || null,
    cancelledAt: order.cancelledAt?.toISOString() || null,
    refundedAt: order.refundedAt?.toISOString() || null,
    cancelReason: order.cancelReason || '',
    courier: order.courier || '',
    trackingNumber: order.trackingNumber || '',
    refundStatus: order.refundStatus || 'none',
    memo: order.memo || '',
  }
}

export async function GET() {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 })
    }

    const query = user.isAdmin ? {} : { user: user._id }
    const orders = (await Order.find(query).sort({ createdAt: -1 }).lean()) as unknown as OrderDocument[]

    return NextResponse.json(
      {
        success: true,
        orders: orders.map((order) => serializeOrder(order)),
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load orders.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 })
    }

    const body = await request.json()
    const { shippingInfo, paymentMethod } = body as {
      shippingInfo?: {
        recipientName?: string
        zipcode?: string
        address?: string
        addressDetail?: string
        phone?: string
        message?: string
      }
      paymentMethod?: PaymentMethod
    }

    if (!shippingInfo?.recipientName || !shippingInfo.address || !shippingInfo.phone) {
      return NextResponse.json({ success: false, message: 'Shipping info is required.' }, { status: 400 })
    }

    if (!paymentMethod || !['card', 'transfer', 'kakaopay'].includes(paymentMethod)) {
      return NextResponse.json({ success: false, message: 'Valid payment method is required.' }, { status: 400 })
    }

    const cart = await Cart.findOne({ user: user._id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty.' }, { status: 400 })
    }

    const cartItems = cart.items as unknown as PopulatedCartItem[]
    const invalidItem = cartItems.find((item) => !item.product)
    if (invalidItem) {
      return NextResponse.json({ success: false, message: 'Cart contains unavailable products.' }, { status: 400 })
    }

    for (const item of cartItems) {
      if (!item.product) continue
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `${item.product.name} does not have enough stock.` },
          { status: 400 }
        )
      }
    }

    const orderItems = cartItems.map((item) => {
      const product = item.product!
      const lineTotal = product.price * item.quantity

      return {
        product: product._id,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const shippingFee = subtotal >= 50000 ? 0 : 3000
    const total = subtotal + shippingFee

    for (const item of cartItems) {
      const product = item.product!
      const updated = await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      )

      if (updated.modifiedCount !== 1) {
        return NextResponse.json(
          { success: false, message: `${product.name} stock changed. Please try again.` },
          { status: 409 }
        )
      }
    }

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

    const createdOrder = await Order.create({
      orderNumber: buildOrderNumber(),
      user: user._id,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      status: 'paid',
      paymentMethod,
      paymentStatus: 'paid',
      paidAt: new Date(),
      shippingInfo: {
        recipientName: shippingInfo.recipientName,
        zipcode: shippingInfo.zipcode || '',
        address: shippingInfo.address,
        addressDetail: shippingInfo.addressDetail || '',
        phone: shippingInfo.phone,
        message: shippingInfo.message || '',
      },
      estimatedDelivery,
      refundStatus: 'none',
    })

    cart.items = []
    cart.checkedOutAt = new Date()
    await cart.save()

    const updatedProducts = (await Product.find({
      _id: { $in: orderItems.map((item) => item.product) },
    }).lean()) as unknown as ProductDocument[]

    return NextResponse.json(
      {
        success: true,
        order: serializeOrder(createdOrder.toObject() as OrderDocument),
        cartItems: [],
        updatedProducts: updatedProducts.map((product) => serializeUpdatedProduct(product)),
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect()

    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      orderId,
      status,
      cancelReason = '',
      trackingNumber = '',
      courier = '',
      refundStatus,
      memo,
    } = body as {
      orderId?: string
      status?: OrderStatus
      cancelReason?: string
      trackingNumber?: string
      courier?: string
      refundStatus?: RefundStatus
      memo?: string
    }

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'orderId and status are required.' }, { status: 400 })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 })
    }

    const isOwner = order.user.toString() === user._id.toString()
    if (!user.isAdmin && !isOwner) {
      return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 })
    }

    if (user.isAdmin) {
      order.status = status

      if (typeof memo === 'string') {
        order.memo = memo
      }

      if (typeof courier === 'string') {
        order.courier = courier
      }

      if (typeof trackingNumber === 'string') {
        order.trackingNumber = trackingNumber
      }

      if (refundStatus && ['none', 'requested', 'processing', 'refunded', 'rejected'].includes(refundStatus)) {
        order.refundStatus = refundStatus
        order.refundedAt = refundStatus === 'refunded' ? new Date() : null
        if (refundStatus === 'refunded') {
          order.paymentStatus = 'refunded'
        }
      }
    } else {
      if (status !== 'cancelled') {
        return NextResponse.json({ success: false, message: 'Users can only cancel orders.' }, { status: 403 })
      }

      if (['shipping', 'delivered', 'cancelled'].includes(order.status)) {
        return NextResponse.json({ success: false, message: 'This order cannot be cancelled.' }, { status: 400 })
      }

      order.status = 'cancelled'
      order.paymentStatus = 'cancelled'
      order.cancelledAt = new Date()
      order.cancelReason = cancelReason
      order.refundStatus = 'requested'

      for (const item of order.items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
      }
    }

    if (user.isAdmin) {
      if (status === 'paid' && !order.paidAt) {
        order.paidAt = new Date()
        order.paymentStatus = 'paid'
      }

      if (status === 'shipping') {
        order.shippedAt = order.shippedAt || new Date()
        order.paymentStatus = 'paid'
      }

      if (status === 'delivered') {
        order.deliveredAt = new Date()
      }

      if (status === 'cancelled') {
        order.paymentStatus = 'cancelled'
        order.cancelledAt = order.cancelledAt || new Date()
        order.cancelReason = cancelReason
        order.refundStatus = order.refundStatus === 'none' ? 'requested' : order.refundStatus
      }
    }

    await order.save()

    return NextResponse.json(
      {
        success: true,
        order: serializeOrder(order.toObject() as OrderDocument),
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
