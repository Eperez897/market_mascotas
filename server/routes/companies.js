import { Router } from 'express'
import { Company } from '../models/Company.js'
import { requireAuth } from '../middleware/auth.js'

export const companiesRouter = Router()

// GET /api/companies
companiesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 })
    res.json(companies)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empresas', detail: err.message })
  }
})

// POST /api/companies
companiesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { name, rut, address, phone, email } = req.body
    const exists = await Company.findOne({ rut })
    if (exists) return res.status(409).json({ error: 'Ya existe una empresa con ese RUT' })
    const company = await Company.create({ name, rut, address, phone, email })
    res.status(201).json(company)
  } catch (err) {
    res.status(400).json({ error: 'Error al crear empresa', detail: err.message })
  }
})

// PUT /api/companies/:id
companiesRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, rut, address, phone, email } = req.body
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name, rut, address, phone, email },
      { new: true, runValidators: true }
    )
    if (!company) return res.status(404).json({ error: 'Empresa no encontrada' })
    res.json(company)
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar empresa', detail: err.message })
  }
})

// DELETE /api/companies/:id
companiesRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id)
    if (!company) return res.status(404).json({ error: 'Empresa no encontrada' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar empresa', detail: err.message })
  }
})