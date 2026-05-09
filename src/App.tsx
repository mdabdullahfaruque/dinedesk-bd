import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { DashboardView } from './components/views/DashboardView'
import { POSView } from './components/views/POSView'
import { OrdersView } from './components/views/OrdersView'
import { BranchesView } from './components/views/BranchesView'
import { InventoryView, ExpensesView, StaffView, ReportsView } from './components/views/AllViews'
import { MenuView } from './components/views/MenuView'
import { SettingsView } from './components/views/SettingsView'
import { Branch, Order, MenuItem, MenuCategory, Expense, InventoryItem, Settings, DailyClosing } from './lib/types'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)
  
  const [branches, setBranches] = useKV<Branch[]>('branches', [
    {
      id: 'branch-dhanmondi',
      name: 'Dhanmondi',
      location: 'Dhanmondi 27, Dhaka 1209',
      phone: '+880 1712-345678',
      managerName: 'Karim Ahmed',
      openingTime: '10:00',
      closingTime: '23:00',
      isActive: true,
      createdAt: Date.now() - 86400000 * 90
    },
    {
      id: 'branch-gulshan',
      name: 'Gulshan',
      location: 'Gulshan Avenue, Dhaka 1212',
      phone: '+880 1712-345679',
      managerName: 'Rahim Mia',
      openingTime: '10:00',
      closingTime: '23:30',
      isActive: true,
      createdAt: Date.now() - 86400000 * 60
    },
    {
      id: 'branch-mirpur',
      name: 'Mirpur',
      location: 'Mirpur 10, Dhaka 1216',
      phone: '+880 1712-345680',
      managerName: 'Salam Khan',
      openingTime: '11:00',
      closingTime: '22:30',
      isActive: true,
      createdAt: Date.now() - 86400000 * 45
    },
    {
      id: 'branch-chattogram',
      name: 'Chattogram',
      location: 'Agrabad, Chattogram 4100',
      phone: '+880 1712-345681',
      managerName: 'Jamal Uddin',
      openingTime: '11:00',
      closingTime: '22:00',
      isActive: true,
      createdAt: Date.now() - 86400000 * 30
    },
  ])
  
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [menuItems, setMenuItems] = useKV<MenuItem[]>('menu-items', [])
  const [categories, setCategories] = useKV<MenuCategory[]>('categories', [])
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', [])
  const [dailyClosings, setDailyClosings] = useKV<DailyClosing[]>('daily-closings', [])
  const [settings, setSettings] = useKV<Settings>('settings', {
    restaurantName: 'DineDesk BD Restaurant',
    businessType: 'multi-branch',
    currency: 'BDT',
    vatEnabled: true,
    defaultVatPercentage: 5,
    serviceChargeEnabled: true,
    defaultServiceChargePercentage: 10,
    applyServiceChargeOnlyForDineIn: true,
    enabledPaymentMethods: ['cash', 'bkash', 'nagad', 'rocket', 'card', 'bank-transfer', 'foodpanda', 'pathao-food', 'other'],
    receiptFooter: 'Thank you for dining with us! Visit again soon.',
    receiptPhone: '+880 1712-345678',
    receiptAddress: 'Dhanmondi, Dhaka',
    receiptBinNumber: '000000000000',
    language: 'en'
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
      
      <Sidebar activeView={activeView} onNavigate={setActiveView} settings={settings!} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          branches={branches || []}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
          settings={settings!}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === 'dashboard' && (
            <DashboardView
              branches={branches || []}
              orders={orders || []}
              expenses={expenses || []}
              inventory={inventory || []}
              menuItems={menuItems || []}
              dailyClosings={dailyClosings || []}
              selectedBranchId={selectedBranchId}
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
          
          {activeView === 'menu' && <MenuView branches={branches || []} settings={settings!} />}
          {activeView === 'inventory' && <InventoryView branches={branches || []} settings={settings!} />}
          {activeView === 'expenses' && <ExpensesView branches={branches || []} settings={settings!} />}
          {activeView === 'staff' && <StaffView branches={branches || []} settings={settings!} />}
          {activeView === 'reports' && <ReportsView branches={branches || []} orders={orders || []} expenses={expenses || []} settings={settings!} />}
          
          {activeView === 'settings' && (
            <SettingsView
              settings={settings!}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
