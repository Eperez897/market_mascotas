import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Product } from '../types'

interface Props {
  product: Product
  onSave: (id: string, data: Pick<Product, 'name' | 'sku' | 'barcode'>) => void
  onClose: () => void
}

export function EditProductModal({ product, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku ?? '',
    barcode: product.barcode ?? '',
  })
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!form.name.trim()) {
      setError('El nombre es requerido')
      return
    }
    setError('')
    onSave(product.id, {
      name: form.name.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-[15px] font-semibold text-stone-800">Editar producto</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X size={16} className="text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                ${error ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
            />
            {error && <p className="text-[11.5px] text-rose-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              SKU
            </label>
            <input
              value={form.sku}
              onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
              placeholder="Ej. PRD-001"
              className="w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Código de barras
            </label>
            <input
              value={form.barcode}
              onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))}
              placeholder="Ej. 7891234567890"
              className="w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={14} />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}