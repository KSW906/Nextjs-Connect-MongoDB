import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
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
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['visible', 'hidden', 'deleted'],
      default: 'visible',
      index: true,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
)

ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)

export default Review
