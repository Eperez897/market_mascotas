import { Notification } from '../models/Notification.js'

export async function notify({ type, title, message, refId = null }) {
  try {
    await Notification.create({ type, title, message, refId })
  } catch (err) {
    console.error('Error al crear notificación:', err.message)
  }
}

export const LOW_STOCK_THRESHOLD = 5

export async function checkLowStock(product) {
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    await notify({
      type: 'low_stock',
      title: 'Stock bajo',
      message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades)`,
      refId: product._id,
    })
  }
}