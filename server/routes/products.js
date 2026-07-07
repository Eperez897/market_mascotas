import { Router } from 'express'
import { Product } from '../models/Product.js'

export const productsRouter = Router()


productsRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', detail: err.message })
  }
})


productsRouter.post('/', async (req, res) => {
  try {
    const { name, sku, barcode, category, stock, price, sold } = req.body
    const product = await Product.create({ name, sku, barcode, category, stock, price, sold })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto', detail: err.message })
  }
})


productsRouter.put('/:id', async (req, res) => {
  try {
    const { name, sku, barcode, category, stock, price, sold } = req.body
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, barcode, category, stock, price, sold },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar producto', detail: err.message })
  }
})

productsRouter.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar producto', detail: err.message })
  }
})
