import { useState } from 'react'
import { Search, Package, Plus } from 'lucide-react'
import { formatCLP, type Product } from '../types'
import { AddProductModal } from './AddProductModal'
import { productsApi } from '../api'

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

interface ProductsPageProps {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function ProductsPage({ products, setProducts, showToast }: ProductsPageProps) {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAdd(data: Pick<Product, 'name' | 'sku' | 'barcode'>) {
    try {
      const created = await productsApi.create({
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        category: '',
        stock: 0,
        price: 0,
        sold: 0,
      })
      setProducts((prev) => [created, ...prev])
      showToast('Producto agregado', 'success')
      setShowAddModal(false)
    } catch (err) {
      showToast('No se pudo guardar el producto en MongoDB', 'error')
      console.error(err)
    }
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
          onClick={() => setShowAddModal(true)}
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
          placeholder="Buscar producto, SKU o código…"
          className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {['Producto', 'SKU', 'Código de barras', 'Categoría', 'Vendidos', 'Stock', 'Precio'].map((h) => (
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
                <td colSpan={7} className="px-6 py-10 text-center text-[13px] text-stone-400">
                  {products.length === 0
                    ? 'Aún no hay productos. Agrega el primero con el botón de arriba.'
                    : 'No se encontraron productos.'}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <Package size={14} className="text-stone-400" />
                      </div>
                      <span className="text-[13px] font-medium text-stone-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-stone-500">{p.sku || '—'}</td>
                  <td className="px-6 py-4 text-[13px] text-stone-500">{p.barcode || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                      {p.category || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-stone-700">{p.sold}</td>
                  <td className="px-6 py-4">
                    <StockBar value={p.stock} />
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-stone-700">{formatCLP(p.price)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de agregar */}
      {showAddModal && (
        <AddProductModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}