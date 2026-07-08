import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { Company } from '../models/Company.js'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod'

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' })
}

function toSafeUser(user, company) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    company: company
      ? { id: company._id, name: company.name, rut: company.rut }
      : undefined,
  }
}

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

    const company = user.companyId ? await Company.findById(user.companyId) : null

    res.json({ token: signToken(user), user: toSafeUser(user, company) })
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', detail: err.message })
  }
})

// POST /api/auth/register - crea la empresa (tienda) y su usuario administrador
authRouter.post('/register', async (req, res) => {
  try {
    const {
      companyName,
      companyRut,
      companyAddress,
      companyPhone,
      companyEmail,
      name,
      email,
      password,
    } = req.body

    if (!companyName || !companyRut || !name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    const companyExists = await Company.findOne({ rut: companyRut })
    if (companyExists) {
      return res.status(409).json({ error: 'Ya existe una empresa registrada con ese RUT' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({ error: 'Ese correo ya está registrado' })
    }

    const company = await Company.create({
      name: companyName,
      rut: companyRut,
      address: companyAddress || '',
      phone: companyPhone || '',
      email: companyEmail || '',
    })

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      companyId: company._id,
      permissions: {
        modifyProducts: true,
        modifyPrices: true,
        createInvoices: true,
        manageCategories: true,
      },
    })

    res.status(201).json({ token: signToken(user), user: toSafeUser(user, company) })
  } catch (err) {
    res.status(400).json({ error: 'Error al crear la cuenta', detail: err.message })
  }
})

// POST /api/auth/logout (el frontend solo borra el token, pero lo registramos)
authRouter.post('/logout', (req, res) => {
  res.json({ success: true })
})