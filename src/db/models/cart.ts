import mongoose from 'mongoose'

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
)

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
      validate: {
        validator(items: Array<{ product: mongoose.Types.ObjectId }>) {
          const ids = items.map((item) => item.product.toString())
          return new Set(ids).size === ids.length
        },
        message: 'Cart cannot contain duplicate products.',
      },
    },
    checkedOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'carts',
  }
)

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)

export default Cart
