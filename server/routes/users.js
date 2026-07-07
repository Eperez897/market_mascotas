import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

export const usersRouter = Router()

// GET /api/users - listar usuarios (solo admin)
usersRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', detail: err.message })
  }
})

// POST /api/users - crear usuario (solo admin)
usersRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'El email ya está registrado' })

    const user = await User.create({ name, email, password, role })
    const { password: _, ...safe } = user.toObject()
    res.status(201).json(safe)
  } catch (err) {
    res.status(400).json({ error: 'Error al crear usuario', detail: err.message })
  }
})

// PATCH /api/users/:id/permissions - actualizar permisos (solo admin)
usersRouter.patch('/:id/permissions', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { permissions } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar permisos', detail: err.message })
  }
})

// PATCH /api/users/:id/active - activar/desactivar usuario (solo admin)
usersRouter.patch('/:id/active', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { active } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    ).select('-password')

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario', detail: err.message })
  }
})

// DELETE /api/users/:id - eliminar usuario (solo admin)
usersRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    // No permitir eliminar el propio usuario
    if (req.user.id === req.params.id)
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' })

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar usuario', detail: err.message })
  }
})