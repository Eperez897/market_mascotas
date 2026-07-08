import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface UserPermissions {
  modifyProducts: boolean
  modifyPrices: boolean
  createInvoices: boolean
  manageCategories: boolean
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'cajero'
  permissions: UserPermissions
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  can: (permission: keyof UserPermissions) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('mm_token')
    const savedUser = localStorage.getItem('mm_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  async function login(email: string, password: string) {
  const base = import.meta.env.VITE_API_URL ?? ''
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')

  localStorage.setItem('mm_token', data.token)
  localStorage.setItem('mm_user', JSON.stringify(data.user))
  setToken(data.token)
  setUser(data.user)
}

  function logout() {
    localStorage.removeItem('mm_token')
    localStorage.removeItem('mm_user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  function can(permission: keyof UserPermissions): boolean {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions[permission] ?? false
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}