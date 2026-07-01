import { Package, MoreHorizontal } from 'lucide-react'

interface Product {
  name: string
  category: string
  sold: number
  stock: number
  price: string
}

// Placeholder — usuario llenará con datos reales
const products: Product[] = [
  { name: '—', category: '—', sold: 0, stock: 0, price: '$—' },
  { name: '—', category: '—', sold: 0, stock: 0, price: '$—' },
  { name: '—', category: '—', sold: 0, stock: 0, price: '$—' },
  { name: '—', category: '—', sold: 0, stock: 0, price: '$—' },
]

function StockBar({ value, max = 100 }: { value: number; max?: number }) {
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

export function TopProducts() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-stone-800">Productos destacados</h2>
          <p className="text-[12px] text-stone-400 mt-0.5">Más vendidos este mes</p>
        </div>
        <button className="text-[12.5px] font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
          Ver catálogo →
        </button>
      </div>

      <div className="divide-y divide-stone-50">
        {products.map((p, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/60 transition-colors group">
            {/* Thumbnail placeholder */}
            <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
              <Package size={15} className="text-stone-400" />
            </div>

            {/* Name + category */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-stone-700 truncate">{p.name}</p>
              <p className="text-[11.5px] text-stone-400 truncate">{p.category}</p>
            </div>

            {/* Sold */}
            <div className="text-right shrink-0">
              <p className="text-[12px] text-stone-400">Vendidos</p>
              <p className="text-[13px] font-semibold text-stone-700">{p.sold}</p>
            </div>

            {/* Stock bar */}
            <div className="shrink-0">
              <p className="text-[12px] text-stone-400 mb-1">Stock</p>
              <StockBar value={p.stock} />
            </div>

            {/* Price */}
            <div className="text-right shrink-0 w-14">
              <p className="text-[13px] font-semibold text-stone-700">{p.price}</p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-all cursor-pointer">
              <MoreHorizontal size={14} className="text-stone-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
