import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart2,
  Settings,
  PawPrint,
  LogOut,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Panel principal' },
  { icon: <Package size={18} />, label: 'Productos' },
  { icon: <ShoppingCart size={18} />, label: 'Pedidos', badge: 5 },
  { icon: <Users size={18} />, label: 'Clientes' },
  { icon: <Tag size={18} />, label: 'Categorías' },
  { icon: <BarChart2 size={18} />, label: 'Reportes' },
  { icon: <Settings size={18} />, label: 'Configuración' },
]

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-stone-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
            <PawPrint size={16} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-stone-800 leading-none">Market</p>
            <p className="text-[11px] text-stone-400 leading-none mt-0.5">Mascotas</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-2 mb-3">
          Menú
        </p>
        {navItems.map((item) => {
          const active = activePage === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActivePage(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all cursor-pointer group
                ${active ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}
            >
              <span className={active ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-600'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full
                  ${active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-white/50" />}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-stone-50 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-stone-600">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-stone-700 leading-none truncate">Admin</p>
            <p className="text-[11px] text-stone-400 leading-none mt-0.5 truncate">admin@market.cl</p>
          </div>
          <LogOut size={14} className="text-stone-300 group-hover:text-stone-500 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
