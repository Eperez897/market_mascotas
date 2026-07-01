import mongoose from 'mongoose'

// Documento flexible: no hay claves foráneas ni relaciones rígidas.
// "category" se guarda como texto libre (no como FK a otra tabla).
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    strict: false, // permite agregar campos nuevos sin migrar "esquema" (propio de NoSQL)
  }
)

export const Product = mongoose.model('Product', productSchema)
