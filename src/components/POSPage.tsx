import { useEffect, useRef, useState } from 'react'
import {
  Search, Plus, Minus, Trash2, ShoppingCart,
  Phone, MapPin, UserRound, CreditCard, Banknote,
  BookOpen, Building2, ArrowLeftRight, Loader2, CheckCircle2,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { formatCLP } from '../types'
import { productsApi, invoicesApi } from '../api'

interface POSProduct {
  id: string
  name: string
  sku: string
  barcode: string
  stock: number
  price: number
}

interface CartItem {
  productId: string
  productName: string
  productSku: string
  stock: number
  quantity: number
  unitPrice: number
}

type PaymentMethod = 'efectivo' | 'credito' | 'debito' | 'anotado' | 'casa_matriz' | 'transferencia'

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { key: 'efectivo',      label: 'Efectivo',      icon: <Banknote size={14} /> },
  { key: 'credito',       label: 'Crédito',       icon: <CreditCard size={14} /> },
  { key: 'debito',        label: 'Débito',        icon: <CreditCard size={14} /> },
  { key: 'anotado',       label: 'Anotado',       icon: <BookOpen size={14} /> },
  { key: 'casa_matriz',   label: 'Casa matriz',   icon: <Building2 size={14} /> },
  { key: 'transferencia', label: 'Transferencia', icon: <ArrowLeftRight size={14} /> },
]

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  onStockChange: () => void
}

export function POSPage({ showToast, onStockChange }: Props) {
  const [products, setProducts] = useState<POSProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Datos del cliente
  const [showClient, setShowClient] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  // Modal cantidad para código de barras
  const [barcodeModal, setBarcodeModal] = useState<{ product: POSProduct; qty: number } | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    productsApi.list().then(data =>
      setProducts(data.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        stock: p.stock,
        price: p.price,
      })))
    )
  }, [])

  const query = search.trim().toLowerCase()
  const filtered = query
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.barcode.toLowerCase().includes(query)
        )
        .slice(0, 8)
    : []

  function looksLikeBarcode(val: string) {
    return /^\d{4,}$/.test(val.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const val = search.trim()
    if (!val) return

    if (looksLikeBarcode(val)) {
      const match = products.find(p => p.barcode === val)
      if (match) {
        if (match.stock === 0) {
          showToast(`Sin stock: ${match.name}`, 'error')
          setSearch('')
          return
        }
        setBarcodeModal({ product: match, qty: 1 })
        setSearch('')
        setShowResults(false)
      } else {
        showToast('Código de barras no encontrado', 'error')
      }
    }
  }

  function addToCart(product: POSProduct, qty = 1) {
    if (product.stock === 0) {
      showToast(`Sin stock: ${product.name}`, 'error')
      return
    }
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock)
        return prev.map(i =>
          i.productId === product.id ? { ...i, quantity: newQty } : i
        )
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        stock: product.stock,
        quantity: Math.min(qty, product.stock),
        unitPrice: product.price,
      }]
    })
    setSearch('')
    setShowResults(false)
  }

  function confirmBarcode() {
    if (!barcodeModal) return
    addToCart(barcodeModal.product, barcodeModal.qty)
    setBarcodeModal(null)
  }

  function changeQty(productId: string, delta: number) {
    setCart(prev =>
      prev.map(i => {
        if (i.productId !== productId) return i
        const newQty = Math.max(1, Math.min(i.stock, i.quantity + delta))
        return { ...i, quantity: newQty }
      })
    )
  }

  function setQtyDirect(productId: string, val: number) {
    setCart(prev =>
      prev.map(i => {
        if (i.productId !== productId) return i
        return { ...i, quantity: Math.max(1, Math.min(i.stock, Math.floor(val) || 1)) }
      })
    )
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(i => i.productId !== productId))
  }

  const total = cart.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  async function handleCheckout() {
    if (cart.length === 0) return showToast('El carrito está vacío', 'error')
    if (!paymentMethod) return showToast('Selecciona un medio de pago', 'error')

    setSaving(true)
    try {
      const comment = [
        `Medio de pago: ${PAYMENT_METHODS.find(m => m.key === paymentMethod)?.label}`,
        clientName    ? `Cliente: ${clientName}`      : '',
        clientPhone   ? `Teléfono: ${clientPhone}`    : '',
        clientAddress ? `Domicilio: ${clientAddress}` : '',
      ].filter(Boolean).join(' | ')

      await invoicesApi.create({
        code: `POS-${Date.now()}`,
        companyId: null,
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        comment,
      })

      setSuccess(true)
      onStockChange()

      setTimeout(() => {
        setCart([])
        setPaymentMethod(null)
        setClientName('')
        setClientPhone('')
        setClientAddress('')
        setShowClient(false)
        setSuccess(false)
        searchRef.current?.focus()
      }, 1800)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al procesar venta', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-116px)] min-h-0">

      {/* ── Izquierda: buscador + carrito ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Punto de venta</h1>
            <p className="text-[13px] text-stone-400 mt-0.5">Escanea o busca productos para agregar al carrito</p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-[12.5px] text-red-400 hover:text-red-600 transition-colors"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 relative">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              ref={searchRef}
              autoFocus
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por nombre, SKU… o escanear código de barras y presionar Enter"
              className="w-full pl-9 pr-4 py-2.5 text-[13.5px] rounded-xl border border-stone-200 bg-stone-50 outline-none focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>

          {/* Resultados */}
          {showResults && filtered.length > 0 && (
            <div className="absolute left-4 right-4 top-[68px] z-20 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onMouseDown={() => addToCart(p)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors border-b border-stone-50 last:border-0"
                >
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-stone-800">{p.name}</p>
                    <p className="text-[11.5px] text-stone-400 mt-0.5">
                      {p.sku || 'Sin SKU'}
                      {p.barcode ? ` · ${p.barcode}` : ''}
                      {' · '}
                      <span className={p.stock === 0 ? 'text-red-400' : 'text-stone-400'}>
                        Stock: {p.stock}
                      </span>
                    </p>
                  </div>
                  <span className="text-[13px] font-semibold text-stone-700 ml-4 shrink-0">
                    {formatCLP(p.price)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showResults && query && filtered.length === 0 && (
            <div className="absolute left-4 right-4 top-[68px] z-20 bg-white border border-stone-200 rounded-xl shadow-lg px-4 py-3">
              <p className="text-[13px] text-stone-400">Sin resultados para "{query}"</p>
            </div>
          )}
        </div>

        {/* Carrito */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col min-h-0">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-3">
                <ShoppingCart size={22} className="text-stone-300" />
              </div>
              <p className="text-[13.5px] font-medium text-stone-400">El carrito está vacío</p>
              <p className="text-[12px] text-stone-300 mt-1">Busca un producto o escanea un código de barras</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-stone-50 border-b border-stone-100 z-10">
                  <tr>
                    {['Producto', 'Precio unit.', 'Cantidad', 'Subtotal', ''].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {cart.map(item => (
                    <tr key={item.productId} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-stone-800">{item.productName}</p>
                        <p className="text-[11.5px] text-stone-400 mt-0.5">
                          {item.productSku || 'Sin SKU'} · Stock: {item.stock}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-stone-600">
                        {formatCLP(item.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => changeQty(item.productId, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={e => setQtyDirect(item.productId, Number(e.target.value))}
                            className="w-12 text-center text-[13px] font-medium border border-stone-200 rounded-lg py-1 outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => changeQty(item.productId, 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        {item.quantity >= item.stock && (
                          <p className="text-[10.5px] text-amber-500 mt-1">Máximo disponible</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13.5px] font-semibold text-stone-800">
                        {formatCLP(item.quantity * item.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Derecha: pago + cliente ── */}
      <div className="w-72 flex flex-col gap-4 shrink-0">

        {/* Resumen */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider mb-3">Resumen</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] text-stone-500">Productos</span>
            <span className="text-[13px] text-stone-700">{totalItems} unid.</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-3">
            <span className="text-[13px] font-semibold text-stone-700">Total</span>
            <span className="text-[20px] font-bold text-stone-900">{formatCLP(total)}</span>
          </div>
        </div>

        {/* Medio de pago */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider mb-3">Medio de pago</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12.5px] font-medium transition-all ${
                  paymentMethod === m.key
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <button
            onClick={() => setShowClient(!showClient)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <UserRound size={14} className="text-stone-400" />
              <span className="text-[12.5px] font-semibold text-stone-500 uppercase tracking-wider">
                Datos del cliente
              </span>
              <span className="text-[11px] text-stone-300">(opcional)</span>
            </div>
            {showClient
              ? <ChevronUp size={14} className="text-stone-400" />
              : <ChevronDown size={14} className="text-stone-400" />
            }
          </button>

          {showClient && (
            <div className="px-5 pb-5 space-y-3 border-t border-stone-100">
              <div className="pt-3">
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5">Nombre</label>
                <div className="relative">
                  <UserRound size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full pl-8 pr-3 py-2 text-[12.5px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 bg-stone-50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full pl-8 pr-3 py-2 text-[12.5px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 bg-stone-50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5">Domicilio</label>
                <div className="relative">
                  <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input
                    value={clientAddress}
                    onChange={e => setClientAddress(e.target.value)}
                    placeholder="Dirección de entrega"
                    className="w-full pl-8 pr-3 py-2 text-[12.5px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 bg-stone-50 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón cobrar */}
        <button
          onClick={handleCheckout}
          disabled={saving || success || cart.length === 0}
          className={`w-full py-4 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2.5 transition-all ${
            success
              ? 'bg-green-500 text-white'
              : cart.length === 0 || !paymentMethod
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-stone-800 hover:bg-stone-700 text-white shadow-sm'
          }`}
        >
          {success ? (
            <>
              <CheckCircle2 size={18} />
              Venta registrada
            </>
          ) : saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Procesando…
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Cobrar {cart.length > 0 ? formatCLP(total) : ''}
            </>
          )}
        </button>
      </div>

      {/* ── Modal cantidad barcode ── */}
      {barcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6">
            <p className="text-[15px] font-semibold text-stone-800 mb-1">{barcodeModal.product.name}</p>
            <p className="text-[12.5px] text-stone-400 mb-5">
              Stock disponible: <span className="font-medium text-stone-600">{barcodeModal.product.stock}</span>
            </p>
            <label className="block text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Cantidad
            </label>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setBarcodeModal(prev => prev ? { ...prev, qty: Math.max(1, prev.qty - 1) } : prev)}
                className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min={1}
                max={barcodeModal.product.stock}
                value={barcodeModal.qty}
                onChange={e => setBarcodeModal(prev =>
                  prev ? { ...prev, qty: Math.max(1, Math.min(prev.product.stock, Number(e.target.value) || 1)) } : prev
                )}
                className="flex-1 text-center text-[18px] font-bold border border-stone-200 rounded-xl py-2 outline-none focus:border-amber-400"
              />
              <button
                onClick={() => setBarcodeModal(prev => prev ? { ...prev, qty: Math.min(prev.product.stock, prev.qty + 1) } : prev)}
                disabled={barcodeModal.qty >= barcodeModal.product.stock}
                className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setBarcodeModal(null)}
                className="flex-1 py-2.5 text-[13px] font-medium text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBarcode}
                className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}