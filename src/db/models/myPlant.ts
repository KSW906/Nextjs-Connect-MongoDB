import mongoose from 'mongoose'

const MyPlantSchema = new mongoose.Schema(
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
    nickname: {
      type: String,
      default: '',
      trim: true,
      maxlength: 50,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    acquiredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      enum: ['purchase', 'gift', 'manual'],
      default: 'purchase',
      index: true,
    },
    status: {
      type: String,
      enum: ['healthy', 'growing', 'dormant', 'sick', 'archived'],
      default: 'healthy',
      index: true,
    },
    lastWateredAt: {
      type: Date,
      default: null,
    },
    lastRepottedAt: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    memo: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'my_plants',
  }
)

MyPlantSchema.index({ user: 1, status: 1, acquiredAt: -1 })
MyPlantSchema.index({ user: 1, product: 1, archivedAt: 1 })

const MyPlant = mongoose.models.MyPlant || mongoose.model('MyPlant', MyPlantSchema)

export default MyPlant
