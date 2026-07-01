import { Search, Bell, SlidersHorizontal } from 'lucide-react'

export function Header() {
  return (
    <header className="h-[60px] bg-white border-b border-stone-200 flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar productos, pedidos…"
          className="w-full pl-8 pr-4 py-2 text-[13px] bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400 text-stone-700 placeholder:text-stone-400 transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 text-[13px] text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg border border-stone-200 transition-all cursor-pointer">
          <SlidersHorizontal size={14} />
          <span>Filtros</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-50 border border-stone-200 cursor-pointer transition-all">
            <Bell size={16} className="text-stone-500" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  )
}
