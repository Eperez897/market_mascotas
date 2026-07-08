import { useEffect, useState } from 'react'
import { Plus, Search, Eye, XCircle, ChevronUp, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatCLP } from '../types'
import { NewInvoiceModal } from './NewInvoiceModal'

interface InvoiceItem {
  product: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface Invoice {
  _id: string
  code: string
  company: { _id: string; name: string; rut: string } | null
  companyName: string
  items: InvoiceItem[]
  total: number
  comment: string
  status: 'active' | 'cancelled'
  cancelReason: string
  cancelledAt: string | null
  createdBy: { name: string }
  createdAt: string
}

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  onStockChange: () => void
}

export function InvoicesPage({ showToast, onStockChange }: Props) {
  const { token } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/invoices', { headers })
      const data = await res.json()
      setInvoices(data)
    } catch {
      showToast('Error al cargar facturas', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCancel(id: string) {
    const reason = prompt('Motivo de anulación (opcional):') ?? ''
    if (reason === null) return
    setCancellingId(id)
    try {
      const res = await fetch(`/api/invoices/${id}/cancel`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInvoices(prev => prev.map(inv => inv._id === id ? data : inv))
      showToast('Factura anulada', 'success')
      onStockChange()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setCancellingId(null)
    }
  }

  function handleNewInvoice(invoice: Invoice) {
    setInvoices(prev => [invoice, ...prev])
    showToast('Factura creada', 'success')
    setShowNew(false)
    onStockChange()
  }

  const filtered = invoices.filter(inv =>
    inv.code.toLowerCase().includes(search.toLowerCase()) ||
    inv.companyName.toLowerCase().includes(search.toLowerCase()) ||
    inv.company?.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.company?.rut.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Facturas</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">{invoices.length} facturas en total</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-white text-[13px] font-semibold rounded-xl hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} />
          Nueva factura
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código o empresa…"
          className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-[13px] text-stone-400">
          Cargando facturas…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-[13px] text-stone-400">
          {invoices.length === 0 ? 'Aún no hay facturas.' : 'No se encontraron resultados.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(inv => (
            <div key={inv._id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${
              inv.status === 'cancelled' ? 'border-red-200 opacity-75' : 'border-stone-200'
            }`}>
              {/* Fila principal */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] font-semibold text-stone-800">#{inv.code}</span>
                    {inv.company && (
                      <span className="text-[12px] text-stone-500">
                        {inv.company.name} · {inv.company.rut}
                      </span>
                    )}
                    {inv.status === 'cancelled' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                        Anulada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[12px] text-stone-400">
                      {new Date(inv.createdAt).toLocaleDateString('es-CL', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span className="text-[12px] text-stone-400">·</span>
                    <span className="text-[12px] text-stone-400">{inv.createdBy?.name}</span>
                  </div>
                </div>

                <span className="text-[14px] font-semibold text-stone-800 shrink-0">
                  {formatCLP(inv.total)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === inv._id ? null : inv._id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Ver detalle"
                  >
                    {expandedId === inv._id ? <ChevronUp size={15} /> : <Eye size={15} />}
                  </button>
                  {inv.status === 'active' && (
                    <button
                      onClick={() => handleCancel(inv._id)}
                      disabled={cancellingId === inv._id}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Anular factura"
                    >
                      {cancellingId === inv._id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <XCircle size={15} />
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* Detalle expandido */}
              {expandedId === inv._id && (
                <div className="border-t border-stone-100 px-5 py-4 bg-stone-50 space-y-3">
                  {/* Productos */}
                  <table className="w-full">
                    <thead>
                      <tr>
                        {['Producto', 'SKU', 'Cant.', 'Precio unit.', 'Subtotal'].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-stone-400 uppercase tracking-wider pb-2">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {inv.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 text-[13px] text-stone-700">{item.productName}</td>
                          <td className="py-2 text-[12px] text-stone-400">{item.productSku || '—'}</td>
                          <td className="py-2 text-[13px] text-stone-700">{item.quantity}</td>
                          <td className="py-2 text-[13px] text-stone-700">{formatCLP(item.unitPrice)}</td>
                          <td className="py-2 text-[13px] font-semibold text-stone-800">{formatCLP(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Total + comentario */}
                  <div className="flex items-start justify-between pt-2 border-t border-stone-200">
                    <div>
                      {inv.comment && (
                        <p className="text-[12.5px] text-stone-500">
                          <span className="font-medium">Comentario:</span> {inv.comment}
                        </p>
                      )}
                      {inv.status === 'cancelled' && inv.cancelReason && (
                        <p className="text-[12.5px] text-red-500 mt-1">
                          <span className="font-medium">Motivo anulación:</span> {inv.cancelReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-stone-400">Total</p>
                      <p className="text-[16px] font-bold text-stone-800">{formatCLP(inv.total)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <NewInvoiceModal
          onSave={handleNewInvoice}
          onClose={() => setShowNew(false)}
          showToast={showToast}
        />
      )}
    </div>
  )
}