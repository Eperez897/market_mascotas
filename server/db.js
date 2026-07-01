import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('❌ Falta la variable de entorno MONGODB_URI (revisa tu archivo .env)')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Conectado a MongoDB')
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message)
    process.exit(1)
  }
}
