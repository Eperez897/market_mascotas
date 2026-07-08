export interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  category: string
  stock: number
  price: number
  sold: number
}

export interface Category {
  id: string
  name: string
}


export const DEFAULT_CATEGORIES = [
  'Alimentación',
  'Higiene',
  'Accesorios',
  'Salud',
  'Juguetes',
  'Transporte',
]

export function formatCLP(n: number) {
  return '$' + Number(n).toLocaleString('es-CL')
}

export interface AppNotification {
  id: string
  type: 'low_stock' | 'invoice_created' | 'product_created' | 'category_created'
  title: string
  message: string
  read: boolean
  createdAt: string
}