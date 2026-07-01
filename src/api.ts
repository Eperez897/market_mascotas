import type { Product, Category } from './types'

// En dev, Vite hace proxy de /api hacia el backend (ver vite.config.ts).
// En producción (Render), se usa la URL completa del backend definida
// en la variable de entorno VITE_API_URL.
const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`

type RawDoc = { _id: string; [key: string]: unknown }

function toProduct(doc: RawDoc): Product {
  return {
    id: doc._id,
    name: doc.name as string,
    category: doc.category as string,
    stock: doc.stock as number,
    price: doc.price as number,
    sold: doc.sold as number,
  }
}

function toCategory(doc: RawDoc): Category {
  return { id: doc._id, name: doc.name as string }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
