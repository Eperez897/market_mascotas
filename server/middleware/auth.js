import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'No autenticado' })

  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Acceso restringido a administradores' })
  next()
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    try {
      const user = await User.findById(req.user?.id).select('permissions')
      if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })
      if (!user.permissions?.[permission])
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' })
      next()
    } catch {
      res.status(500).json({ error: 'Error al verificar permisos' })
    }
  }
}