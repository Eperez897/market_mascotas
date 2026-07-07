import {
  LayoutDashboard, Package, Tag, ShoppingCart, FileText,
  DollarSign, Users, LogOut, PawPrint,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Panel principal', icon: LayoutDashboard },
  { label: 'Productos', icon: Package },
  { label: 'Categorías', icon: Tag },
  { label: 'Lista de precios', icon: DollarSign },
  { label: 'Facturas', icon: FileText },
  { label: 'Punto de venta', icon: ShoppingCart },
]

interface Props {
  activePage: string
  setActivePage: (page: string) => void
}

export function Sidebar({ activePage, setActivePage }: Props) {
  const { user, isAdmin, logout } = useAuth()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-stone-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-stone-100">
        <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
          <PawPrint size={16} className="text-white" />
        </div>
        <span className="text-[14px] font-semibold text-stone-800">Market Mascotas</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActivePage(label)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
              activePage === label
                ? 'bg-amber-50 text-amber-600'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {/* Usuarios solo para admin */}
        {isAdmin && (
          <button
            onClick={() => setActivePage('Usuarios')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
              activePage === 'Usuarios'
                ? 'bg-amber-50 text-amber-600'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
            }`}
          >
            <Users size={16} />
            Usuarios
          </button>
        )}
      </nav>

      {/* Footer - user info + logout */}
      <div className="px-3 py-4 border-t border-stone-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-[12.5px] font-medium text-stone-700 truncate">{user?.name}</p>
          <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
          <span className={`inline-block mt-1 text-[10.5px] px-2 py-0.5 rounded-full font-medium ${
            user?.role === 'admin'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-stone-100 text-stone-500'
          }`}>
            {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}