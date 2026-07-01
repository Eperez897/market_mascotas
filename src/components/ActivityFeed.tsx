import { ShoppingCart, Package, UserPlus, AlertCircle } from 'lucide-react'

interface ActivityItem {
  icon: React.ReactNode
  iconBg: string
  title: string
  time: string
}

const items: ActivityItem[] = [
  {
    icon: <ShoppingCart size={13} />,
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Nuevo pedido recibido',
    time: 'Hace 2 min',
  },
  {
    icon: <Package size={13} />,
    iconBg: 'bg-sky-100 text-sky-600',
    title: 'Stock actualizado',
    time: 'Hace 18 min',
  },
  {
    icon: <UserPlus size={13} />,
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'Nuevo cliente registrado',
    time: 'Hace 1h',
  },
  {
    icon: <AlertCircle size={13} />,
    iconBg: 'bg-rose-100 text-rose-600',
    title: 'Producto con stock bajo',
    time: 'Hace 3h',
  },
]

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <h2 className="text-[14px] font-semibold text-stone-800 mb-4">Actividad reciente</h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-stone-700 font-medium leading-snug">{item.title}</p>
              <p className="text-[11.5px] text-stone-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-5 text-[12.5px] font-medium text-stone-400 hover:text-stone-600 transition-colors cursor-pointer text-center py-1">
        Ver historial completo
      </button>
    </div>
  )
}
