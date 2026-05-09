import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { Sidebar } from './components/Sidebar'
import { DashboardView } from './components/views/DashboardView'
import { POSView } from './components/views/POSView'
import { OrdersView } from './components/views/OrdersView'
import { BranchesView } from './components/views/BranchesView'
import { MenuView, InventoryView, ExpensesView, StaffView, ReportsView } from './components/views/OtherViews'
import { SettingsView } from './components/views/SettingsView'
import { Branch, Order, MenuItem, MenuCategory, Expense, InventoryItem, Settings } from './lib/types'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  
  const [branches, setBranches] = useKV<Branch[]>('branches', [])
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [menuItems, setMenuItems] = useKV<MenuItem[]>('menu-items', [])
  const [categories, setCategories] = useKV<MenuCategory[]>('categories', [])
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', [])
  const [settings, setSettings] = useKV<Settings>('settings', {
    restaurantName: 'DineDesk BD Restaurant',
    businessType: 'multi-branch',
    currency: 'BDT',
    defaultVatPercentage: 5,
    defaultServiceChargePercentage: 10,
    enabledPaymentMethods: ['cash', 'bkash', 'nagad', 'rocket', 'card'],
    receiptFooter: 'Thank you for dining with us! Visit again soon.'
  })
  
  const handleCreateOrder = (order: Order) => {
    setOrders((current) => [...(current || []), order])
  }
  
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((current) =>
      (current || []).map(order => order.id === updatedOrder.id ? updatedOrder : order)
    )
  }
  
  const handleCreateBranch = (branch: Branch) => {
    setBranches((current) => [...(current || []), branch])
  }
  
  const handleUpdateBranch = (updatedBranch: Branch) => {
    setBranches((current) =>
      (current || []).map(branch => branch.id === updatedBranch.id ? updatedBranch : branch)
    )
  }
  
  const handleUpdateSettings = (updatedSettings: Settings) => {
    setSettings(updatedSettings)
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />
      
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      
      <main className="flex-1 overflow-y-auto p-6">
        {activeView === 'dashboard' && (
          <DashboardView
            branches={branches || []}
            orders={orders || []}
            expenses={expenses || []}
            inventory={inventory || []}
            menuItems={menuItems || []}
          />
        )}
        
        {activeView === 'pos' && (
          <POSView
            branches={branches || []}
            menuItems={menuItems || []}
            categories={categories || []}
            settings={settings!}
            onCreateOrder={handleCreateOrder}
          />
        )}
        
        {activeView === 'orders' && (
          <OrdersView
            orders={orders || []}
            branches={branches || []}
            onUpdateOrder={handleUpdateOrder}
          />
        )}
        
        {activeView === 'branches' && (
          <BranchesView
            branches={branches || []}
            orders={orders || []}
            expenses={expenses || []}
            onCreateBranch={handleCreateBranch}
            onUpdateBranch={handleUpdateBranch}
          />
        )}
        
        {activeView === 'menu' && <MenuView />}
        {activeView === 'inventory' && <InventoryView />}
        {activeView === 'expenses' && <ExpensesView />}
        {activeView === 'staff' && <StaffView />}
        {activeView === 'reports' && <ReportsView />}
        
        {activeView === 'settings' && (
          <SettingsView
            settings={settings!}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>
    </div>
  )
}

export default App
