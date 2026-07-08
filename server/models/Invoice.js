import mongoose from 'mongoose'

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productSku: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true },
})

const invoiceSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    companyName: { type: String, default: '' },
    items: [invoiceItemSchema],
    total: { type: Number, required: true },
    comment: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    cancelReason: { type: String, default: '' },
    cancelledAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

// Índice único por código + empresa
invoiceSchema.index({ code: 1, company: 1 }, { unique: true })

export const Invoice = mongoose.model('Invoice', invoiceSchema)