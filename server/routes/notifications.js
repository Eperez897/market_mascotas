import { Router } from 'express'
import { Notification } from '../models/Notification.js'
import { requireAuth } from '../middleware/auth.js'

export const notificationsRouter = Router()

notificationsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50)
    const unreadCount = await Notification.countDocuments({ read: false })
    res.json({ notifications, unreadCount })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notificaciones', detail: err.message })
  }
})

notificationsRouter.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' })
    res.json(notification)
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar notificación', detail: err.message })
  }
})

notificationsRouter.patch('/read-all', requireAuth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar notificaciones', detail: err.message })
  }
})

notificationsRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar notificación', detail: err.message })
  }
})