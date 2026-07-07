import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Trash2, Shield, ShieldOff, Loader2, Eye, EyeOff } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'cajero'
  active: boolean
  permissions: {
    modifyProducts: boolean
    modifyPrices: boolean
    createInvoices: boolean
    manageCategories: boolean
  }
}

const PERMISSION_LABELS: Record<string, string> = {
  modifyProducts: 'Modificar productos',
  modifyPrices: 'Modificar precios',
  createInvoices: 'Crear/anular facturas',
  manageCategories: 'Gestionar categorías',
}

interface Props {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function UsersPage({ showToast }: Props) {
  const { token, user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cajero' })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/users', { headers })
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Usuario creado', 'success')
      setForm({ name: '', email: '', password: '', role: 'cajero' })
      setShowForm(false)
      load()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function togglePermission(userId: string, key: string, current: boolean) {
    const user = users.find(u => u._id === userId)
    if (!user) return
    const newPerms = { ...user.permissions, [key]: !current }
    const res = await fetch(`/api/users/${userId}/permissions`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ permissions: newPerms }),
    })
    const data = await res.json()
    if (!res.ok) return showToast(data.error, 'error')
    setUsers(prev => prev.map(u => u._id === userId ? data : u))
    showToast(!current ? 'Permiso otorgado' : 'Permiso removido', 'success')
  }

  async function toggleActive(userId: string, current: boolean) {
    const res = await fetch(`/api/users/${userId}/active`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ active: !current }),
    })
    const data = await res.json()
    if (!res.ok) return showToast(data.error, 'error')
    setUsers(prev => prev.map(u => u._id === userId ? data : u))
    showToast(!current ? 'Usuario activado' : 'Usuario desactivado', 'success')
  }

  async function deleteUser(userId: string) {
    if (!confirm('¿Eliminar este usuario?')) return
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE', headers })
    const data = await res.json()
    if (!res.ok) return showToast(data.error, 'error')
    setUsers(prev => prev.filter(u => u._id !== userId))
    showToast('Usuario eliminado', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Usuarios</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">Gestiona accesos y permisos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus size={15} />
          Nuevo usuario
        </button>
      </div>

      {/* Formulario nuevo usuario */}
      {showForm && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <h2 className="text-[14px] font-semibold text-stone-700 mb-4">Crear usuario</h2>
          <form onSubmit={createUser} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-stone-500 mb-1">Nombre</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-stone-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400"
              />
            </div>
            <div className="relative">
              <label className="block text-[12px] font-medium text-stone-500 mb-1">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-3 py-2 pr-9 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-stone-400">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-stone-500 mb-1">Rol</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400"
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-[13px] text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-[13px] bg-amber-400 hover:bg-amber-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 size={13} className="animate-spin" />}
                Crear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-[13px] text-stone-400">
          Cargando usuarios…
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user._id} className={`bg-white border rounded-2xl p-5 ${!user.active ? 'opacity-60' : 'border-stone-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-stone-800">{user.name}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      user.role === 'admin'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Cajero'}
                    </span>
                    {!user.active && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-stone-400 mt-0.5">{user.email}</p>
                </div>

                {/* Acciones — no se puede actuar sobre uno mismo */}
                {user._id !== me?.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(user._id, user.active)}
                      title={user.active ? 'Desactivar' : 'Activar'}
                      className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      {user.active ? <ShieldOff size={15} /> : <Shield size={15} />}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Permisos extra (solo para cajeros) */}
              {user.role === 'cajero' && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-[11.5px] font-medium text-stone-500 mb-2">Permisos adicionales</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                      const active = user.permissions[key as keyof typeof user.permissions]
                      return (
                        <button
                          key={key}
                          onClick={() => togglePermission(user._id, key, active)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                            active
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-stone-50 text-stone-500 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-stone-300'}`} />
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}