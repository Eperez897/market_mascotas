import { useEffect, useState } from 'react'
import { X, Search, Plus, Trash2, Building2, Loader2 } from 'lucide-react'
import { formatCLP } from '../types'
import { productsApi, companiesApi, invoicesApi, type RawCompany, type RawInvoice } from '../api'

interface CartItem {
  productId: string
  productName: string
  productSku: string
  stock: number
  quantity: number
  unitPrice: number
}

interface Props {
  onSave: (invoice: RawInvoice) => void
  onClose: () => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function NewInvoiceModal({ onSave, onClose, showToast }: Props) {
  const [code, setCode] = useState('')
  const [comment, setComment] = useState('')
  const [items, setItems] = useState<CartItem[]>([])
  const [saving, setSaving] = useState(false)

  // Productos
  const [products, setProducts] = useState<{ id: string; name: string; sku: string; stock: number; price: number }[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)

  // Empresas
  const [companies, setCompanies] = useState<RawCompany[]>([])
  const [selectedCompany, setSelectedCompany] = useState<RawCompany | null>(null)
  const [showCompanyPanel, setShowCompanyPanel] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const [newCompany, setNewCompany] = useState({ name: '', rut: '', address: '', phone: '', email: '' })
  const [showNewCompany, setShowNewCompany] = useState(false)
  const [savingCompany, setSavingCompany] = useState(false)

  useEffect(() => {
    productsApi.list().then(data =>
      setProducts(data.map(p => ({ id: p.id, name: p.name, sku: p.sku, stock: p.stock, price: p.price })))
    )
    companiesApi.list().then(setCompanies)
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8)

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.rut.toLowerCase().includes(companySearch.toLowerCase())
  )

  function addProduct(p: typeof products[0]) {
    if (items.find(i => i.productId === p.id)) {
      showToast('Producto ya agregado', 'info')
      return
    }
    setItems(prev => [...prev, {
      productId: p.id,
      productName: p.name,
      productSku: p.sku,
      stock: p.stock,
      quantity: 1,
      unitPrice: p.price,
    }])
    setProductSearch('')
    setShowProductSearch(false)
  }

  function updateItem(idx: number, field: 'quantity' | 'unitPrice', value: number) {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item
      if (field === 'quantity') {
        return { ...item, quantity: Math.max(1, Math.min(item.stock, Math.floor(value))) }
      }
      return { ...item, unitPrice: Math.max(0, value) }
    }))
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  async function saveCompany() {
    if (!newCompany.name || !newCompany.rut) {
      showToast('Nombre y RUT son requeridos', 'error')
      return
    }
    setSavingCompany(true)
    try {
      const data = await companiesApi.create(newCompany)
      setCompanies(prev => [...prev, data])
      setSelectedCompany(data)
      setShowNewCompany(false)
      setNewCompany({ name: '', rut: '', address: '', phone: '', email: '' })
      showToast('Empresa creada', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setSavingCompany(false)
    }
  }

  async function handleSubmit() {
    if (!code.trim()) return showToast('El código de factura es requerido', 'error')
    if (items.length === 0) return showToast('Agrega al menos un producto', 'error')

    setSaving(true)
    try {
      const data = await invoicesApi.create({
        code: code.trim(),
        companyId: selectedCompany?._id ?? null,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        comment,
      })
      onSave(data)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear factura', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
          <h2 className="text-[15px] font-semibold text-stone-800">Nueva factura</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors">
            <X size={16} className="text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Código + empresa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Código de factura *
              </label>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Ej. F-001234"
                className="w-full px-3.5 py-2.5 text-[13.5px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Empresa (opcional)
              </label>
              <button
                onClick={() => setShowCompanyPanel(!showCompanyPanel)}
                className="w-full px-3.5 py-2.5 text-[13px] rounded-lg border border-stone-200 bg-stone-50 outline-none text-left flex items-center gap-2 hover:border-stone-400 transition-colors"
              >
                <Building2 size={14} className="text-stone-400 shrink-0" />
                <span className={selectedCompany ? 'text-stone-700' : 'text-stone-400'}>
                  {selectedCompany ? `${selectedCompany.name} · ${selectedCompany.rut}` : 'Seleccionar empresa…'}
                </span>
              </button>
            </div>
          </div>

          {/* Panel empresa */}
          {showCompanyPanel && (
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-stone-600">Empresas</p>
                <button
                  onClick={() => setShowNewCompany(!showNewCompany)}
                  className="text-[12px] text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <Plus size={13} /> Nueva empresa
                </button>
              </div>

              {showNewCompany && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-stone-200">
                  {[
                    { key: 'name', label: 'Nombre *', placeholder: 'Razón social' },
                    { key: 'rut', label: 'RUT *', placeholder: 'Ej. 76.123.456-7' },
                    { key: 'address', label: 'Dirección', placeholder: 'Opcional' },
                    { key: 'phone', label: 'Teléfono', placeholder: 'Opcional' },
                    { key: 'email', label: 'Email', placeholder: 'Opcional' },
                  ].map(f => (
                    <div key={f.key} className={f.key === 'address' || f.key === 'email' ? 'col-span-2' : ''}>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">{f.label}</label>
                      <input
                        value={newCompany[f.key as keyof typeof newCompany]}
                        onChange={e => setNewCompany(prev => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2 text-[12.5px] border border-stone-200 rounded-lg outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                  <div className="col-span-2 flex justify-end gap-2">
                    <button onClick={() => setShowNewCompany(false)} className="px-3 py-1.5 text-[12px] text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50">
                      Cancelar
                    </button>
                    <button onClick={saveCompany} disabled={savingCompany}
                      className="px-3 py-1.5 text-[12px] bg-amber-400 hover:bg-amber-500 text-white rounded-lg flex items-center gap-1 disabled:opacity-60">
                      {savingCompany && <Loader2 size={12} className="animate-spin" />}
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  placeholder="Buscar empresa o RUT…"
                  className="w-full pl-8 pr-4 py-2 text-[12.5px] border border-stone-200 rounded-lg outline-none focus:border-stone-400 bg-white"
                />
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                <button
                  onClick={() => { setSelectedCompany(null); setShowCompanyPanel(false) }}
                  className="w-full text-left px-3 py-2 text-[12.5px] text-stone-400 hover:bg-stone-100 rounded-lg"
                >
                  Sin empresa
                </button>
                {filteredCompanies.map(c => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedCompany(c); setShowCompanyPanel(false) }}
                    className={`w-full text-left px-3 py-2 text-[12.5px] rounded-lg transition-colors ${
                      selectedCompany?._id === c._id
                        ? 'bg-amber-50 text-amber-700'
                        : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-stone-400 ml-2">{c.rut}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buscador de productos */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Agregar productos
            </label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={productSearch}
                onChange={e => { setProductSearch(e.target.value); setShowProductSearch(true) }}
                onFocus={() => setShowProductSearch(true)}
                placeholder="Buscar por nombre o SKU…"
                className="w-full pl-8 pr-4 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-stone-400 bg-stone-50"
              />
              {showProductSearch && productSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
                  {filteredProducts.length === 0 ? (
                    <p className="px-4 py-3 text-[12.5px] text-stone-400">No se encontraron productos</p>
                  ) : (
                    filteredProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-stone-50 transition-colors"
                      >
                        <div className="text-left">
                          <p className="text-[13px] font-medium text-stone-700">{p.name}</p>
                          <p className="text-[11.5px] text-stone-400">{p.sku || 'Sin SKU'} · Stock: {p.stock}</p>
                        </div>
                        <span className="text-[12.5px] font-semibold text-stone-600">{formatCLP(p.price)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {['Producto', 'Stock', 'Cant.', 'Precio unit.', 'Subtotal', ''].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-4 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {items.map((item, idx) => (
                    <tr key={item.productId}>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium text-stone-700">{item.productName}</p>
                        <p className="text-[11.5px] text-stone-400">{item.productSku || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-[12.5px] text-stone-500">{item.stock}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-16 px-2 py-1 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={item.unitPrice}
                          onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))}
                          className="w-28 px-2 py-1 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-stone-700">
                        {formatCLP(item.quantity * item.unitPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeItem(idx)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Comentario */}
          <div>
            <label className="block text-[12px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Notas adicionales sobre la factura…"
              rows={2}
              className="w-full px-3.5 py-2.5 text-[13px] rounded-lg border border-stone-200 bg-stone-50 outline-none focus:border-stone-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-6 py-4 bg-stone-50 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[11.5px] text-stone-400">Total</p>
            <p className="text-[18px] font-bold text-stone-800">{formatCLP(total)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-5 py-2.5 text-[13px] font-semibold text-white bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Crear factura
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}