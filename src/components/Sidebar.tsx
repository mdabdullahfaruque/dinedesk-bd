import { ChartBar, ShoppingCart, Receipt, Buildings, BookOpen, Package, CurrencyDollar, Users, ChartLine, Gear } from '@phosphor-icons/react'

export interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBar },
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: Receipt },
  { id: 'branches', label: 'Branches', icon: Buildings },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'expenses', label: 'Expenses', icon: CurrencyDollar },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'reports', label: 'Reports', icon: ChartLine },
  { id: 'settings', label: 'Settings', icon: Gear },
]

interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">DineDesk BD</h1>
        <p className="text-xs text-muted-foreground mt-1">Restaurant Management</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Logged in as</div>
          <div>Restaurant Owner</div>
        </div>
      </div>
    </div>
  )
}
