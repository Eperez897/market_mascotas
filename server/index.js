import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import { productsRouter } from './routes/products.js'
import { categoriesRouter } from './routes/categories.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { invoicesRouter } from './routes/invoices.js'
import { companiesRouter } from './routes/companies.js'
import { notificationsRouter } from './routes/notifications.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api/notifications', notificationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/companies', companiesRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

async function start() {
  await connectDB()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  })
}

start()