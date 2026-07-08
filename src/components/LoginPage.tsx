import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PawPrint, Eye, EyeOff, Loader2 } from 'lucide-react'

type Mode = 'login' | 'register'

interface RegisterForm {
  companyName: string
  companyRut: string
  companyAddress: string
  companyPhone: string
  name: string
  email: string
  password: string
  confirmPassword: string
}

const emptyRegisterForm: RegisterForm = {
  companyName: '',
  companyRut: '',
  companyAddress: '',
  companyPhone: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')

  // --- Login state ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // --- Register state ---
  const [form, setForm] = useState<RegisterForm>(emptyRegisterForm)
  const [showRegPassword, setShowRegPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.companyName.trim() || !form.companyRut.trim()) {
      setError('Completa el nombre y RUT de la empresa')
      return
    }
    if (!form.name.trim() || !form.email.trim()) {
      setError('Completa tus datos de administrador')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await register({
        companyName: form.companyName.trim(),
        companyRut: form.companyRut.trim(),
        companyAddress: form.companyAddress.trim(),
        companyPhone: form.companyPhone.trim(),
        companyEmail: form.email.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <PawPrint size={28} className="text-white" />
          </div>
          <h1 className="text-[20px] font-semibold text-stone-800">Market Mascotas</h1>
          <p className="text-[13px] text-stone-400 mt-1">
            {mode === 'login' ? 'Ingresa a tu cuenta' : 'Registra tu tienda'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-stone-100 rounded-xl p-1 mb-4">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@market.com"
                  required
                  className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 pr-10 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-white font-medium text-[13.5px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Datos de la empresa */}
              <div>
                <p className="text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Datos de la tienda
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      Nombre de la empresa
                    </label>
                    <input
                      value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="Pet Shop Los Amigos SpA"
                      required
                      className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      RUT de la empresa
                    </label>
                    <input
                      value={form.companyRut}
                      onChange={e => setForm(f => ({ ...f, companyRut: e.target.value }))}
                      placeholder="76.123.456-7"
                      required
                      className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                        Dirección
                      </label>
                      <input
                        value={form.companyAddress}
                        onChange={e => setForm(f => ({ ...f, companyAddress: e.target.value }))}
                        placeholder="Opcional"
                        className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                        Teléfono
                      </label>
                      <input
                        value={form.companyPhone}
                        onChange={e => setForm(f => ({ ...f, companyPhone: e.target.value }))}
                        placeholder="Opcional"
                        className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              {/* Datos del administrador */}
              <div>
                <p className="text-[11.5px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Datos del administrador
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre"
                      required
                      className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="admin@tutienda.com"
                      required
                      className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Mínimo 6 caracteres"
                        required
                        className="w-full px-3 py-2.5 pr-10 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-medium text-stone-600 mb-1.5">
                      Confirmar contraseña
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2.5 text-[13px] border border-stone-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-[12.5px] px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-white font-medium text-[13.5px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}