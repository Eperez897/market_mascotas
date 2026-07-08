import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['low_stock', 'invoice_created', 'product_created', 'category_created'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    refId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
)

export const Notification = mongoose.model('Notification', notificationSchema)