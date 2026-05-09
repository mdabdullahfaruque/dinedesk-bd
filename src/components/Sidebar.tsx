import { ChartBar, ShoppingCart, Receipt, Buildings, BookOpen, Package, CurrencyDollar, Users, ChartLine, Gear } from '@phosphor-icons/react'
import { Settings } from '@/lib/types'
import { useTranslation } from '@/lib/translations'

export interface NavItem {
  id: string
  labelKey: string
  icon: React.ElementType
}

export const navItems: NavItem[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: ChartBar },
  { id: 'pos', labelKey: 'pos', icon: ShoppingCart },
  { id: 'orders', labelKey: 'orders', icon: Receipt },
  { id: 'branches', labelKey: 'branches', icon: Buildings },
  { id: 'menu', labelKey: 'menu', icon: BookOpen },
  { id: 'inventory', labelKey: 'inventory', icon: Package },
  { id: 'expenses', labelKey: 'expenses', icon: CurrencyDollar },
  { id: 'staff', labelKey: 'staff', icon: Users },
  { id: 'reports', labelKey: 'reports', icon: ChartLine },
  { id: 'settings', labelKey: 'settings', icon: Gear },
]

interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
  settings: Settings
}

export function Sidebar({ activeView, onNavigate, settings }: SidebarProps) {
  const t = useTranslation(settings.language)
  
  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">DineDesk BD</h1>
        <p className="text-xs text-muted-foreground mt-1">{t.restaurantManagement}</p>
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
                  {t[item.labelKey as keyof typeof t] as string}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">{t.loggedInAs}</div>
          <div>{t.restaurantOwner}</div>
        </div>
      </div>
    </div>
  )
}
