import { MoreHorizontal } from 'lucide-react'

type OrderStatus = 'Completado' | 'En proceso' | 'Pendiente' | 'Cancelado'

interface Order {
  id: string
  customer: string
  product: string
  date: string
  amount: string
  status: OrderStatus
}

const statusStyles: Record<OrderStatus, string> = {
  Completado: 'bg-emerald-50 text-emerald-700',
  'En proceso': 'bg-amber-50 text-amber-700',
  Pendiente: 'bg-sky-50 text-sky-700',
  Cancelado: 'bg-rose-50 text-rose-600',
}

const statusDots: Record<OrderStatus, string> = {
  Completado: 'bg-emerald-500',
  'En proceso': 'bg-amber-500',
  Pendiente: 'bg-sky-500',
  Cancelado: 'bg-rose-500',
}

// Placeholder rows — usuario llenará con datos reales
const orders: Order[] = [
  { id: '#0001', customer: '—', product: '—', date: '—', amount: '$—', status: 'Pendiente' },
  { id: '#0002', customer: '—', product: '—', date: '—', amount: '$—', status: 'En proceso' },
  { id: '#0003', customer: '—', product: '—', date: '—', amount: '$—', status: 'Completado' },
  { id: '#0004', customer: '—', product: '—', date: '—', amount: '$—', status: 'Cancelado' },
]

export function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-stone-800">Pedidos recientes</h2>
          <p className="text-[12px] text-stone-400 mt-0.5">Últimas transacciones</p>
        </div>
        <button className="text-[12.5px] font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
          Ver todos →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {['Pedido', 'Cliente', 'Producto', 'Fecha', 'Monto', 'Estado', ''].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider px-6 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50/60 transition-colors group">
                <td className="px-6 py-4 text-[13px] font-mono font-medium text-stone-600">{order.id}</td>
                <td className="px-6 py-4 text-[13px] text-stone-700">{order.customer}</td>
                <td className="px-6 py-4 text-[13px] text-stone-500">{order.product}</td>
                <td className="px-6 py-4 text-[13px] text-stone-500">{order.date}</td>
                <td className="px-6 py-4 text-[13px] font-semibold text-stone-700">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status]}`} />
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-all cursor-pointer">
                    <MoreHorizontal size={14} className="text-stone-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
