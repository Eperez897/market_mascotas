import { Router } from 'express'
import { Category } from '../models/Category.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { notify } from '../utils/notify.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías', detail: err.message })
  }
})

const category = await Category.create({ name })

await notify({
  type: 'category_created',
  title: 'Nueva categoría agregada',
  message: `Se agregó la categoría "${category.name}"`,
  refId: category._id,
})

res.status(201).json(category)

categoriesRouter.delete('/:id', requireAuth, requirePermission('manageCategories'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar categoría', detail: err.message })
  }
})