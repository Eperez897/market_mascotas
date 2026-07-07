import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, default: '' },
    barcode: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: '' },
    stock: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    strict: false,
  }
)

export const Product = mongoose.model('Product', productSchema)