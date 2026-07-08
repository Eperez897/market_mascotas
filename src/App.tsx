import { useEffect, useState } from 'react'
import { DollarSign, ShoppingBag, Users, Package, MoreHorizontal } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { RecentOrders } from './components/RecentOrders'
import { TopProducts } from './components/TopProducts'
import { QuickActions } from './components/QuickActions'
import { ActivityFeed } from './components/ActivityFeed'
import { ProductsPage } from './components/ProductsPage'
import { CategoriesPage } from './components/CategoriesPage'
import { UsersPage } from './components/UsersPage'
import { LoginPage } from './components/LoginPage'
import { InvoicesPage } from './components/InvoicesPage'
import { Toast } from './components/Toast'
import type { Product, Category } from './types'
import { productsApi, categoriesApi } from './api'
import { useAuth } from './context/AuthContext'

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <MoreHorizontal size={22} className="text-stone-400" />
      </div>
      <h2 className="text-[16px] font-semibold text-stone-700">{name}</h2>
      <p className="text-[13px] text-stone-400 mt-1">Esta sección estará disponible próximamente.</p>
    </div>
  )
}

function DashboardPage({ products }: { products: Product[] }) {
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-stone-800 leading-tight">Panel principal</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">Resumen general de tu tienda</p>
        </div>
        <select className="text-[12.5px] text-stone-500 bg-white border border-stone-200 rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-stone-300 transition-colors">
          <option>Este mes</option>
          <option>Esta semana</option>
          <option>Este año</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Ventas totales" value="$—" change={0} icon={DollarSign} color="amber" />
        <StatCard label="Pedidos" value="—" change={0} icon={ShoppingBag} color="green" />
        <StatCard label="Clientes" value="—" change={0} icon={Users} color="blue" />
        <StatCard label="Productos activos" value={String(products.length)} change={0} icon={Package} color="rose" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><TopProducts /></div>
        <div><QuickActions /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><RecentOrders /></div>
        <div><ActivityFeed /></div>
      </div>
    </>
  )
}

function App() {
  const { user, isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('Panel principal')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  async function refreshProducts() {
    try {
      const data = await productsApi.list()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!user) return
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.list(),
          categoriesApi.list(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        showToast('No se pudo conectar con el servidor', 'error')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  if (!user) return <LoginPage />

  function renderPage() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-[13px] text-stone-400">
          Cargando datos…
        </div>
      )
    }
    switch (activePage) {
      case 'Panel principal':
        return <DashboardPage products={products} />
      case 'Productos':
        return <ProductsPage products={products} setProducts={setProducts} showToast={showToast} />
      case 'Categorías':
        return (
          <CategoriesPage
            categories={categories}
            setCategories={setCategories}
            products={products}
            showToast={showToast}
          />
        )
      case 'Facturas':
        return (
          <InvoicesPage
            showToast={showToast}
            onStockChange={refreshProducts}
          />
        )
      case 'Usuarios':
        return isAdmin ? <UsersPage showToast={showToast} /> : <PlaceholderPage name="Sin acceso" />
      default:
        return <PlaceholderPage name={activePage} />
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-stone-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default App