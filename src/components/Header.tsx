import { useEffect, useRef, useState } from 'react'
import { Search, Bell, SlidersHorizontal, Package, FileText, PlusCircle, Tag, CheckCheck } from 'lucide-react'
import type { AppNotification } from '../types'
import { notificationsApi } from '../api'

const POLL_INTERVAL_MS = 15000

function iconFor(type: AppNotification['type']) {
  switch (type) {
    case 'low_stock':
      return <Package size={13} className="text-rose-600" />
    case 'invoice_created':
      return <FileText size={13} className="text-sky-600" />
    case 'product_created':
      return <PlusCircle size={13} className="text-emerald-600" />
    case 'category_created':
      return <Tag size={13} className="text-amber-600" />
  }
}

function iconBgFor(type: AppNotification['type']) {
  switch (type) {
    case 'low_stock':
      return 'bg-rose-100'
    case 'invoice_created':
      return 'bg-sky-100'
    case 'product_created':
      return 'bg-emerald-100'
    case 'category_created':
      return 'bg-amber-100'
  }
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Ahora mismo'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `Hace ${days}d`
}

export function Header() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  async function loadNotifications() {
    try {
      const { notifications, unreadCount } = await notificationsApi.list()
      setNotifications(notifications)
      setUnreadCount(unreadCount)
    } catch {
      // silencioso
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleToggle() {
    const next = !open
    setOpen(next)
    if (next) await loadNotifications()
  }

  async function handleMarkAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((c) => Math.max(0, c - 1))
    try {
      await notificationsApi.markAsRead(id)
    } catch {
      loadNotifications()
    }
  }

  async function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    try {
      await notificationsApi.markAllAsRead()
    } catch {
      loadNotifications()
    }
  }

  return (
    <header className="h-[60px] bg-white border-b border-stone-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-sm relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar productos, pedidos…"
          className="w-full pl-8 pr-4 py-2 text-[13px] bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400 text-stone-700 placeholder:text-stone-400 transition-colors"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 text-[13px] text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg border border-stone-200 transition-all cursor-pointer">
          <SlidersHorizontal size={14} />
          <span>Filtros</span>
        </button>

        <div className="relative" ref={containerRef}>
          <button
            onClick={handleToggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-50 border border-stone-200 cursor-pointer transition-all relative"
          >
            <Bell size={16} className="text-stone-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <h3 className="text-[13px] font-semibold text-stone-800">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[11.5px] text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
                  >
                    <CheckCheck size={12} />
                    Marcar todas
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[12.5px] text-stone-400 text-center py-8">No hay notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => !n.read && handleMarkAsRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-stone-50 last:border-b-0 hover:bg-stone-50 transition-colors cursor-pointer ${
                        n.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconBgFor(n.type)}`}>
                        {iconFor(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] text-stone-700 font-medium leading-snug">{n.title}</p>
                        <p className="text-[12px] text-stone-500 mt-0.5 leading-snug">{n.message}</p>
                        <p className="text-[11px] text-stone-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-1.5" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}