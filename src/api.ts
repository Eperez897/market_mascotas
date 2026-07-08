import type { Product, Category } from './types'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`

type RawDoc = { _id: string; [key: string]: unknown }

function toProduct(doc: RawDoc): Product {
  return {
    id: doc._id,
    name: doc.name as string,
    sku: (doc.sku as string) ?? '',
    barcode: (doc.barcode as string) ?? '',
    category: (doc.category as string) ?? '',
    stock: (doc.stock as number) ?? 0,
    price: (doc.price as number) ?? 0,
    sold: (doc.sold as number) ?? 0,
  }
}

function toCategory(doc: RawDoc): Category {
  return { id: doc._id, name: doc.name as string }
}

function getToken(): string {
  return localStorage.getItem('mm_token') ?? ''
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Error en la petición (${res.status})`)
  }
  return res.json()
}

export const productsApi = {
  async list(): Promise<Product[]> {
    const docs = await request<RawDoc[]>('/products')
    return docs.map(toProduct)
  },
  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const doc = await request<RawDoc>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return toProduct(doc)
  },
  async update(id: string, data: Omit<Product, 'id'>): Promise<Product> {
    const doc = await request<RawDoc>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return toProduct(doc)
  },
  async remove(id: string): Promise<void> {
    await request(`/products/${id}`, { method: 'DELETE' })
  },
}

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const docs = await request<RawDoc[]>('/categories')
    return docs.map(toCategory)
  },
  async create(name: string): Promise<Category> {
    const doc = await request<RawDoc>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    return toCategory(doc)
  },
  async remove(id: string): Promise<void> {
    await request(`/categories/${id}`, { method: 'DELETE' })
  },
}

export interface RawCompany {
  _id: string
  name: string
  rut: string
  address: string
  phone: string
  email: string
}

export interface RawInvoice {
  _id: string
  code: string
  company: { _id: string; name: string; rut: string } | null
  companyName: string
  items: {
    product: string
    productName: string
    productSku: string
    quantity: number
    unitPrice: number
    subtotal: number
  }[]
  total: number
  comment: string
  status: 'active' | 'cancelled'
  cancelReason: string
  cancelledAt: string | null
  createdBy: { name: string }
  createdAt: string
}

export const companiesApi = {
  async list(): Promise<RawCompany[]> {
    return request<RawCompany[]>('/companies')
  },
  async create(data: Omit<RawCompany, '_id'>): Promise<RawCompany> {
    return request<RawCompany>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export const invoicesApi = {
  async list(): Promise<RawInvoice[]> {
    return request<RawInvoice[]>('/invoices')
  },
  async create(payload: {
    code: string
    companyId: string | null
    items: { productId: string; quantity: number; unitPrice: number }[]
    comment: string
  }): Promise<RawInvoice> {
    return request<RawInvoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  async cancel(id: string, reason: string): Promise<RawInvoice> {
    return request<RawInvoice>(`/invoices/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  },
}