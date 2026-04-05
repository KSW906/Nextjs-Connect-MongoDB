import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
      required: true,
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
)

const ShippingInfoSchema = new mongoose.Schema(
  {
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    zipcode: {
      type: String,
      default: '',
      trim: true,
      maxlength: 20,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    addressDetail: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  }
)

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator(items: unknown[]) {
          return Array.isArray(items) && items.length > 0
        },
        message: 'Order must contain at least one item.',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'transfer', 'kakaopay'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    shippingInfo: {
      type: ShippingInfoSchema,
      required: true,
    },
    courier: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    trackingNumber: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    estimatedDelivery: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'processing', 'refunded', 'rejected'],
      default: 'none',
      index: true,
    },
    memo: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
)

OrderSchema.index({ user: 1, createdAt: -1 })
OrderSchema.index({ user: 1, status: 1, createdAt: -1 })
OrderSchema.index({ paymentStatus: 1, status: 1, createdAt: -1 })
OrderSchema.index({ trackingNumber: 1 })
OrderSchema.index({ refundStatus: 1, createdAt: -1 })

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order
