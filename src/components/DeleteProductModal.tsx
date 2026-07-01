import { X, AlertCircle } from 'lucide-react'
import type { Product } from '../types'

interface DeleteProductModalProps {
  product: Product
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProductModal({ product, onConfirm, onClose }: DeleteProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-stone-800">Eliminar producto</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X size={16} className="text-stone-500" />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <AlertCircle size={18} className="text-rose-600" />
            </div>
            <div>
              <p className="text-[13.5px] text-stone-700 font-medium leading-snug">
                ¿Eliminar <span className="font-semibold">"{product.name}"</span>?
              </p>
              <p className="text-[12.5px] text-stone-400 mt-1">Esta acción no se puede deshacer.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
