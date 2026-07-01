import { Plus, Upload, Tag, Users } from 'lucide-react'

const actions = [
  { icon: Plus, label: 'Nuevo producto', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  { icon: Upload, label: 'Importar stock', color: 'text-sky-600 bg-sky-50 hover:bg-sky-100' },
  { icon: Tag, label: 'Crear oferta', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
  { icon: Users, label: 'Ver clientes', color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <h2 className="text-[14px] font-semibold text-stone-800 mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-all cursor-pointer group ${color}`}
          >
            <Icon size={18} />
            <span className="text-[12px] font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
