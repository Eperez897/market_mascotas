import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Product } from '../types'

interface ProductModalProps {
  product?: Product | null
  categories: string[]
<<<<<<< HEAD
  onSave: (data: Omit<Product, 'id'> & { id?: string }) => void
=======
<<<<<<< HEAD
  onSave: (data: Omit<Product, 'id'> & { id?: string }) => void
=======
  onSave: (data: Omit<Product, 'id'> & { id?: number }) => void
>>>>>>> origin/main
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
  onClose: () => void
}

interface FormState {
  name: string
  category: string
  stock: string
  price: string
}

export function ProductModal({ product, categories, onSave, onClose }: ProductModalProps) {
  const isEdit = Boolean(product?.id)
  const [form, setForm] = useState<FormState>({
    name: product?.name ?? '',
    category: product?.category ?? categories[0] ?? '',
    stock: product ? String(product.stock) : '',
    price: product ? String(product.price) : '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const noCategories = categories.length === 0

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Nombre requerido'
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock inválido'
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Precio inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSave({
      id: product?.id,
      name: form.name.trim(),
      category: form.category,
      stock: Number(form.stock),
      price: Number(form.price),
      sold: product?.sold ?? 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-[15px] font-semibold text-stone-800">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h2>
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

          {/* Categoría */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            {noCategories ? (
              <p className="text-[12.5px] text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                Aún no tienes categorías. Ve a "Categorías" en el menú para crear la primera.
              </p>
            ) : (
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* Stock + Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                  ${errors.stock ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
              />
              {errors.stock && <p className="text-[11.5px] text-rose-500 mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Precio (CLP)
              </label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
                className={`w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border outline-none transition-colors
                  ${errors.price ? 'border-rose-400 bg-rose-50' : 'border-stone-200 focus:border-stone-400 bg-stone-50'}`}
              />
              {errors.price && <p className="text-[11.5px] text-rose-500 mt-1">{errors.price}</p>}
            </div>
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
            disabled={noCategories}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            {isEdit ? 'Guardar cambios' : 'Agregar producto'}
          </button>
        </div>
      </div>
    </div>
  )
}
