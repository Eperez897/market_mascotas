import { useState } from 'react'
import { Search, Plus, Package, Pencil, Trash2 } from 'lucide-react'
import { formatCLP, type Product } from '../types'
import { ProductModal } from './ProductModal'
import { DeleteProductModal } from './DeleteProductModal'
<<<<<<< HEAD
import { productsApi } from '../api'
=======
>>>>>>> origin/main

interface StockBarProps {
  value: number
}

function StockBar({ value }: StockBarProps) {
  const max = 100
  const pct = Math.min((value / max) * 100, 100)
  const color = pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-rose-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] text-stone-500">{value}</span>
    </div>
  )
}

type ModalState =
  | { mode: 'add' }
  | { mode: 'edit'; product: Product }
  | { mode: 'delete'; product: Product }
  | null

interface ProductsPageProps {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  categories: string[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function ProductsPage({ products, setProducts, categories, showToast }: ProductsPageProps) {
  const [modal, setModal] = useState<ModalState>(null)
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

<<<<<<< HEAD
  async function handleSave(data: Omit<Product, 'id'> & { id?: string }) {
    try {
      if (data.id) {
        const updated = await productsApi.update(data.id, data)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        showToast('Producto actualizado', 'success')
      } else {
        const created = await productsApi.create(data)
        setProducts((prev) => [created, ...prev])
        showToast('Producto agregado', 'success')
      }
      setModal(null)
    } catch (err) {
      showToast('No se pudo guardar el producto en MongoDB', 'error')
      console.error(err)
    }
  }

  async function handleDelete() {
    if (modal?.mode !== 'delete') return
    try {
      await productsApi.remove(modal.product.id)
      setProducts((prev) => prev.filter((p) => p.id !== modal.product.id))
      showToast('Producto eliminado', 'info')
    } catch (err) {
      showToast('No se pudo eliminar el producto en MongoDB', 'error')
      console.error(err)
    } finally {
      setModal(null)
    }
=======
  function handleSave(data: Omit<Product, 'id'> & { id?: number }) {
    if (data.id) {
      setProducts((prev) => prev.map((p) => (p.id === data.id ? { ...p, ...data, id: data.id! } : p)))
      showToast('Producto actualizado', 'success')
    } else {
      setProducts((prev) => [...prev, { ...data, id: Date.now() }])
      showToast('Producto agregado', 'success')
    }
    setModal(null)
  }

  function handleDelete() {
    if (modal?.mode !== 'delete') return
    setProducts((prev) => prev.filter((p) => p.id !== modal.product.id))
    showToast('Producto eliminado', 'info')
    setModal(null)
>>>>>>> origin/main
  }

  return (
    <div className="space-y-5">
      {/* Header de sección */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Productos</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">{products.length} productos en catálogo</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-colors cursor-pointer"
        >
          <Plus size={15} />
          Agregar producto
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {['Producto', 'Categoría', 'Vendidos', 'Stock', 'Precio', ''].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider px-6 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[13px] text-stone-400">
                  {products.length === 0
                    ? 'Aún no hay productos. Agrega el primero con el botón de arriba.'
                    : 'No se encontraron productos.'}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <Package size={14} className="text-stone-400" />
                      </div>
                      <span className="text-[13px] font-medium text-stone-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-stone-700">{p.sold}</td>
                  <td className="px-6 py-4">
                    <StockBar value={p.stock} />
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-stone-700">{formatCLP(p.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ mode: 'edit', product: p })}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={13} className="text-stone-500" />
                      </button>
                      <button
                        onClick={() => setModal({ mode: 'delete', product: p })}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={13} className="text-rose-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modal?.mode === 'add' && (
        <ProductModal categories={categories} onSave={handleSave} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <ProductModal
          product={modal.product}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === 'delete' && (
        <DeleteProductModal product={modal.product} onConfirm={handleDelete} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
