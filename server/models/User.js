import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'cajero'], default: 'cajero' },
    permissions: {
      modifyProducts: { type: Boolean, default: false },
      modifyPrices: { type: Boolean, default: false },
      createInvoices: { type: Boolean, default: false },
      manageCategories: { type: Boolean, default: false },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

export const User = mongoose.model('User', userSchema)