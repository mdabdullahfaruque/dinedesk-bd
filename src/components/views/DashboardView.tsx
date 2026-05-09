import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/helpers'
import { CurrencyDollar, Receipt, Wallet, TrendUp, Warning, Trophy, Fire, Package, ClockCountdown, CheckCircle, XCircle } from '@phosphor-icons/react'
import { Branch, Order, Expense, InventoryItem, MenuItem, DailyClosing } from '@/lib/types'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardViewProps {
  branches: Branch[]
  orders: Order[]
  expenses: Expense[]
  inventory: InventoryItem[]
  menuItems: MenuItem[]
  dailyClosings: DailyClosing[]
  selectedBranchId: string | null
}

export function DashboardView({ branches, orders, expenses, inventory, menuItems, dailyClosings, selectedBranchId }: DashboardViewProps) {
  const today = new Date().setHours(0, 0, 0, 0)
  
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt).setHours(0, 0, 0, 0)
    return orderDate === today && o.status === 'completed'
  })
  
  const todayExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date).setHours(0, 0, 0, 0)
    return expenseDate === today
  })
  
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const todayOrdersCount = todayOrders.length
  const averageOrderValue = todayOrdersCount > 0 ? todaySales / todayOrdersCount : 0
  
  const totalCashCollected = todayOrders
    .filter(o => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0)
  
  const totalDigitalCollected = todayOrders
    .filter(o => o.paymentMethod !== 'cash')
    .reduce((sum, o) => sum + o.total, 0)
  
  const todayExpensesTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  const todayRevenueCost = todayOrders.reduce((sum, order) => {
    const cost = order.items.reduce((itemSum, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId)
      return itemSum + (menuItem?.estimatedCost || 0) * item.quantity
    }, 0)
    return sum + cost
  }, 0)
  
  const estimatedProfit = todaySales - todayRevenueCost - todayExpensesTotal
  
  const topSellingItems = Object.values(
    todayOrders.flatMap(o => o.items).reduce((acc, item) => {
      if (!acc[item.menuItemId]) {
        acc[item.menuItemId] = {
          name: item.name,
          quantity: 0,
          revenue: 0
        }
      }
      acc[item.menuItemId].quantity += item.quantity
      acc[item.menuItemId].revenue += item.price * item.quantity
      return acc
    }, {} as Record<string, { name: string; quantity: number; revenue: number }>)
  ).sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  
  const lowStockAlerts = inventory
    .filter(i => i.currentStock <= i.lowStockThreshold)
    .map(i => ({
      itemName: i.name,
      branchName: branches.find(b => b.id === i.branchId)?.name || 'Unknown',
      currentStock: i.currentStock,
      threshold: i.lowStockThreshold,
      unit: i.unit
    }))
    .slice(0, 5)
  
  const branchPerformance = branches.map(branch => {
    const branchOrders = todayOrders.filter(o => o.branchId === branch.id)
    const branchExpenses = todayExpenses.filter(e => e.branchId === branch.id)
    
    const sales = branchOrders.reduce((sum, o) => sum + o.total, 0)
    const ordersCount = branchOrders.length
    const expensesTotal = branchExpenses.reduce((sum, e) => sum + e.amount, 0)
    
    const cost = branchOrders.reduce((sum, order) => {
      const orderCost = order.items.reduce((itemSum, item) => {
        const menuItem = menuItems.find(m => m.id === item.menuItemId)
        return itemSum + (menuItem?.estimatedCost || 0) * item.quantity
      }, 0)
      return sum + orderCost
    }, 0)
    
    const profit = sales - cost - expensesTotal
    
    return {
      branchId: branch.id,
      branchName: branch.name,
      sales,
      orders: ordersCount,
      expenses: expensesTotal,
      profit
    }
  }).sort((a, b) => b.sales - a.sales)
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Overview of today's restaurant performance</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Today's Sales"
          value={todaySales}
          prefix="৳"
          icon={CurrencyDollar}
        />
        <MetricCard
          title="Today's Orders"
          value={todayOrdersCount}
          icon={Receipt}
        />
        <MetricCard
          title="Average Order Value"
          value={averageOrderValue}
          prefix="৳"
          icon={TrendUp}
        />
        <MetricCard
          title="Estimated Profit"
          value={estimatedProfit}
          prefix="৳"
          icon={Wallet}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Payment Collection</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Cash Collected</span>
              <span className="text-base sm:text-lg font-semibold">{formatCurrency(totalCashCollected)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Digital Payment</span>
              <span className="text-base sm:text-lg font-semibold">{formatCurrency(totalDigitalCollected)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium">Total Collected</span>
              <span className="text-lg sm:text-xl font-bold text-primary">{formatCurrency(todaySales)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Today's Expenses</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Expenses</span>
              <span className="text-base sm:text-lg font-semibold text-destructive">{formatCurrency(todayExpensesTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Revenue Cost</span>
              <span className="text-base sm:text-lg font-semibold text-warning">{formatCurrency(todayRevenueCost)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium">Net Profit</span>
              <span className={`text-lg sm:text-xl font-bold ${estimatedProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(estimatedProfit)}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      {lowStockAlerts.length > 0 && (
        <Alert className="border-warning bg-warning/10">
          <Warning className="h-5 w-5 text-warning" />
          <AlertDescription>
            <span className="font-semibold">Low Stock Alerts: </span>
            {lowStockAlerts.length} items need restocking
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Top Selling Items</h3>
          {topSellingItems.length > 0 ? (
            <div className="space-y-3">
              {topSellingItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.quantity} sold</p>
                  </div>
                  <span className="font-semibold text-sm sm:text-base flex-shrink-0">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs sm:text-sm">No sales today</p>
          )}
        </Card>
        
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Low Stock Alerts</h3>
          {lowStockAlerts.length > 0 ? (
            <div className="space-y-3">
              {lowStockAlerts.map((item, index) => (
                <div key={index} className="flex justify-between items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base">{item.itemName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.branchName}</p>
                  </div>
                  <Badge variant="destructive" className="flex-shrink-0 text-xs">
                    {item.currentStock} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs sm:text-sm">All stock levels are good</p>
          )}
        </Card>
      </div>
      
      {branches.length > 1 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Branch Performance</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Branch</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Sales</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Orders</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Expenses</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchPerformance.map((branch) => (
                    <TableRow key={branch.branchId}>
                      <TableCell className="font-medium whitespace-nowrap">{branch.branchName}</TableCell>
                      <TableCell className="text-right font-semibold whitespace-nowrap">{formatCurrency(branch.sales)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{branch.orders}</TableCell>
                      <TableCell className="text-right text-destructive whitespace-nowrap">{formatCurrency(branch.expenses)}</TableCell>
                      <TableCell className={`text-right font-semibold whitespace-nowrap ${branch.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(branch.profit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
