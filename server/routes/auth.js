import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod'

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña requeridos' })

    const user = await User.findOne({ email, active: true })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', detail: err.message })
  }
})

// POST /api/auth/logout (el frontend solo borra el token, pero lo registramos)
authRouter.post('/logout', (req, res) => {
  res.json({ success: true })
})