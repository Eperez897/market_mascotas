import { useState } from 'react'
import { Tag, Plus, Trash2, Package } from 'lucide-react'
<<<<<<< HEAD
import type { Product, Category } from '../types'
import { categoriesApi } from '../api'

interface CategoriesPageProps {
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
=======
import type { Product } from '../types'

interface CategoriesPageProps {
  categories: string[]
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
>>>>>>> origin/main
  products: Product[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export function CategoriesPage({ categories, setCategories, products, showToast }: CategoriesPageProps) {
  const [newCategory, setNewCategory] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

<<<<<<< HEAD
  function countProducts(catName: string) {
    return products.filter((p) => p.category === catName).length
  }

  async function handleAdd() {
    const name = newCategory.trim()
    if (!name) return
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      showToast('Esa categoría ya existe', 'error')
      return
    }
    try {
      const created = await categoriesApi.create(name)
      setCategories((prev) => [...prev, created])
      setNewCategory('')
      showToast('Categoría agregada', 'success')
    } catch (err) {
      showToast('No se pudo guardar la categoría en MongoDB', 'error')
      console.error(err)
    }
  }

  async function handleDelete(cat: Category) {
    const inUse = countProducts(cat.name)
    if (inUse > 0) {
      showToast(`No puedes eliminar "${cat.name}": tiene ${inUse} producto(s) asignado(s)`, 'error')
      setConfirmDelete(null)
      return
    }
    try {
      await categoriesApi.remove(cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      showToast('Categoría eliminada', 'info')
    } catch (err) {
      showToast('No se pudo eliminar la categoría en MongoDB', 'error')
      console.error(err)
    } finally {
      setConfirmDelete(null)
    }
=======
  function countProducts(cat: string) {
    return products.filter((p) => p.category === cat).length
  }

  function handleAdd() {
    const name = newCategory.trim()
    if (!name) return
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      showToast('Esa categoría ya existe', 'error')
      return
    }
    setCategories((prev) => [...prev, name])
    setNewCategory('')
    showToast('Categoría agregada', 'success')
  }

  function handleDelete(cat: string) {
    const inUse = countProducts(cat)
    if (inUse > 0) {
      showToast(`No puedes eliminar "${cat}": tiene ${inUse} producto(s) asignado(s)`, 'error')
      setConfirmDelete(null)
      return
    }
    setCategories((prev) => prev.filter((c) => c !== cat))
    setConfirmDelete(null)
    showToast('Categoría eliminada', 'info')
>>>>>>> origin/main
  }

  return (
    <div className="space-y-5">
      {/* Header de sección */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Categorías</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">
            Organiza tus productos como quieras: {categories.length} categorías creadas
          </p>
        </div>
      </div>

      {/* Agregar categoría */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Nueva categoría
        </label>
        <div className="flex gap-2 max-w-md">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ej. Ropa, Electrónica, Ferretería…"
            className="flex-1 px-3.5 py-2.5 text-[13.5px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-white text-[13px] font-semibold rounded-lg hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-10 text-center text-[13px] text-stone-400">
            Aún no tienes categorías. Crea la primera arriba.
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {categories.map((cat) => (
<<<<<<< HEAD
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50/60 transition-colors group">
=======
              <div key={cat} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50/60 transition-colors group">
>>>>>>> origin/main
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    <Tag size={14} className="text-stone-400" />
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="text-[13px] font-medium text-stone-700">{cat.name}</p>
                    <p className="text-[11.5px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Package size={11} />
                      {countProducts(cat.name)} producto(s)
=======
                    <p className="text-[13px] font-medium text-stone-700">{cat}</p>
                    <p className="text-[11.5px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Package size={11} />
                      {countProducts(cat)} producto(s)
>>>>>>> origin/main
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                {confirmDelete === cat.id ? (
=======
                {confirmDelete === cat ? (
>>>>>>> origin/main
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-stone-500">¿Eliminar?</span>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="px-3 py-1.5 text-[12px] font-semibold text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1.5 text-[12px] font-medium text-stone-600 bg-white border border-stone-200 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
<<<<<<< HEAD
                    onClick={() => setConfirmDelete(cat.id)}
=======
                    onClick={() => setConfirmDelete(cat)}
>>>>>>> origin/main
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Eliminar categoría"
                  >
                    <Trash2 size={13} className="text-rose-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
