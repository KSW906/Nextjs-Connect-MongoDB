import mongoose from 'mongoose'

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
      index: true,
    },
    memo: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    notificationEnabled: {
      type: Boolean,
      default: false,
    },
    lastNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'wishlist',
  }
)

WishlistSchema.index({ user: 1, product: 1 }, { unique: true })
WishlistSchema.index({ user: 1, createdAt: -1 })
WishlistSchema.index({ user: 1, notificationEnabled: 1, updatedAt: -1 })

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema)

export default Wishlist
