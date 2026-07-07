// Ejecutar UNA vez: node server/scripts/createAdmin.js
import 'dotenv/config'
import mongoose from 'mongoose'
import { User } from '../models/User.js'

await mongoose.connect(process.env.MONGODB_URI)

const existing = await User.findOne({ role: 'admin' })
if (existing) {
  console.log('⚠️  Ya existe un admin:', existing.email)
  process.exit(0)
}

await User.create({
  name: 'Administrador',
  email: 'admin@market.com',
  password: 'admin1234',
  role: 'admin',
})

console.log('✅ Admin creado')
console.log('   Email:    admin@market.com')
console.log('   Password: admin1234')
console.log('   ⚠️  Cambia la contraseña después del primer login')
process.exit(0)