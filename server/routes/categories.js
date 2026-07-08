import { Router } from 'express'
import { Category } from '../models/Category.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías', detail: err.message })
  }
})

categoriesRouter.post('/', requireAuth, requirePermission('manageCategories'), async (req, res) => {
  try {
    const { name } = req.body
    const exists = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') })
    if (exists) return res.status(409).json({ error: 'Esa categoría ya existe' })
    const category = await Category.create({ name })
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ error: 'Error al crear categoría', detail: err.message })
  }
})

categoriesRouter.delete('/:id', requireAuth, requirePermission('manageCategories'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar categoría', detail: err.message })
  }
})