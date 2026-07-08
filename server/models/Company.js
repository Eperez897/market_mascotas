import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rut: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

export const Company = mongoose.model('Company', companySchema)