import { Router } from 'express'
import { Invoice } from '../models/Invoice.js'
import { Product } from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

export const invoicesRouter = Router()

// GET /api/invoices
invoicesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('company', 'name rut')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
    res.json(invoices)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener facturas', detail: err.message })
  }
})

// GET /api/invoices/:id
invoicesRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('company', 'name rut address phone email')
      .populate('createdBy', 'name')
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' })
    res.json(invoice)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener factura', detail: err.message })
  }
})

// POST /api/invoices
invoicesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { code, companyId, items, comment } = req.body

    if (!items || items.length === 0)
      return res.status(400).json({ error: 'La factura debe tener al menos un producto' })

    // Verificar stock disponible
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` })
      if (product.stock < item.quantity)
        return res.status(400).json({ error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}` })
    }

    // Construir items y calcular total
    const invoiceItems = []
    let total = 0

    for (const item of items) {
      const product = await Product.findById(item.productId)
      const subtotal = item.quantity * item.unitPrice
      invoiceItems.push({
        product: product._id,
        productName: product.name,
        productSku: product.sku ?? '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal,
      })
      total += subtotal
    }

    // Obtener nombre de empresa si aplica
    let companyName = ''
    if (companyId) {
      const { Company } = await import('../models/Company.js')
      const company = await Company.findById(companyId)
      if (company) companyName = company.name
    }

    const invoice = await Invoice.create({
      code,
      company: companyId || null,
      companyName,
      items: invoiceItems,
      total,
      comment: comment ?? '',
      createdBy: req.user.id,
    })

    // Descontar stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      })
    }

    const populated = await Invoice.findById(invoice._id)
      .populate('company', 'name rut')
      .populate('createdBy', 'name')

    res.status(201).json(populated)
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Ya existe una factura con ese código para esta empresa' })
    res.status(400).json({ error: 'Error al crear factura', detail: err.message })
  }
})

// PATCH /api/invoices/:id/cancel - anular factura
invoicesRouter.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { reason } = req.body
    const invoice = await Invoice.findById(req.params.id)
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' })
    if (invoice.status === 'cancelled')
      return res.status(400).json({ error: 'La factura ya está anulada' })

    invoice.status = 'cancelled'
    invoice.cancelReason = reason ?? ''
    invoice.cancelledAt = new Date()
    await invoice.save()

    // Reponer stock
    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      })
    }

    const populated = await Invoice.findById(invoice._id)
      .populate('company', 'name rut')
      .populate('createdBy', 'name')

    res.json(populated)
  } catch (err) {
    res.status(400).json({ error: 'Error al anular factura', detail: err.message })
  }
})