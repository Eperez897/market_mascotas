import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Product } from '../types'

interface AddProductModalProps {
  onSave: (data: Pick<Product, 'name' | 'sku' | 'barcode'>) => void
  onClose: () => void
}

interface FormState {
  name: string
  sku: string
  barcode: string
}

export function AddProductModal({ onSave, onClose }: AddProductModalProps) {
  const [form, setForm] = useState<FormState>({ name: '', sku: '', barcode: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Nombre requerido'
    if (!form.sku.trim()) e.sku = 'SKU requerido'
    if (!form.barcode.trim()) e.barcode = 'Código de barras requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSave({
      name: form.name.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-[15px] font-semibold text-stone-800">Nuevo producto</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={16} className="text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Alimento Premium Perro"
              className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
            />
            {errors.name && <p className="text-[11.5px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              SKU
            </label>
            <input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder="Ej. ALM-PREM-001"
              className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                ${errors.sku ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
            />
            {errors.sku && <p className="text-[11.5px] text-rose-500 mt-1">{errors.sku}</p>}
          </div>

          {/* Código de barras */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Código de barras
            </label>
            <input
              value={form.barcode}
              onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
              placeholder="Ej. 7801234567890"
              className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                ${errors.barcode ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
            />
            {errors.barcode && <p className="text-[11.5px] text-rose-500 mt-1">{errors.barcode}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={14} />
            Agregar producto
          </button>
        </div>
      </div>
    </div>
  )
}