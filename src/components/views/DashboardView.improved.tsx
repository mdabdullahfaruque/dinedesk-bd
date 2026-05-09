import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/helpers'
import { CurrencyDollar, Receipt, Wallet, TrendUp, Warning, Trophy, Fire, Package, ClockCountdown, CheckCircle, XCircle, CreditCard } from '@phosphor-icons/react'
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
  const yesterday = today - 86400000
  const last7Days = Array.from({ length: 7 }, (_, i) => today - i * 86400000).reverse()
  
  const filteredOrders = selectedBranchId 
    ? orders.filter(o => o.branchId === selectedBranchId)
    : orders
  
  const filteredExpenses = selectedBranchId
    ? expenses.filter(e => e.branchId === selectedBranchId)
    : expenses
  
  const filteredInventory = selectedBranchId
    ? inventory.filter(i => i.branchId === selectedBranchId)
    : inventory
  
  const filteredClosings = selectedBranchId
    ? dailyClosings.filter(dc => dc.branchId === selectedBranchId)
    : dailyClosings
  
  const todayOrders = filteredOrders.filter(o => {
    const orderDate = new Date(o.createdAt).setHours(0, 0, 0, 0)
    return orderDate === today && o.status === 'completed'
  })
  
  const yesterdayOrders = filteredOrders.filter(o => {
    const orderDate = new Date(o.createdAt).setHours(0, 0, 0, 0)
    return orderDate === yesterday && o.status === 'completed'
  })
  
  const todayExpenses = filteredExpenses.filter(e => {
    const expenseDate = new Date(e.date).setHours(0, 0, 0, 0)
    return expenseDate === today
  })
  
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const yesterdaySales = yesterdayOrders.reduce((sum, o) => sum + o.total, 0)
  const salesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100) : 0
  
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
  
  const salesTrendData = last7Days.map(dayTimestamp => {
    const dayOrders = filteredOrders.filter(o => {
      const orderDate = new Date(o.createdAt).setHours(0, 0, 0, 0)
      return orderDate === dayTimestamp && o.status === 'completed'
    })
    const sales = dayOrders.reduce((sum, o) => sum + o.total, 0)
    return {
      date: new Date(dayTimestamp).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' }),
      sales
    }
  })
  
  const paymentMethodData = [
    { name: 'Cash', value: totalCashCollected, color: '#10b981' },
    { 
      name: 'bKash', 
      value: todayOrders.filter(o => o.paymentMethod === 'bkash').reduce((sum, o) => sum + o.total, 0),
      color: '#e91e63'
    },
    { 
      name: 'Nagad', 
      value: todayOrders.filter(o => o.paymentMethod === 'nagad').reduce((sum, o) => sum + o.total, 0),
      color: '#ff9800'
    },
    { 
      name: 'Rocket', 
      value: todayOrders.filter(o => o.paymentMethod === 'rocket').reduce((sum, o) => sum + o.total, 0),
      color: '#9c27b0'
    },
    { 
      name: 'Card', 
      value: todayOrders.filter(o => o.paymentMethod === 'card').reduce((sum, o) => sum + o.total, 0),
      color: '#3f51b5'
    },
  ].filter(p => p.value > 0)
  
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
  
  const lowStockAlerts = filteredInventory
    .filter(i => i.currentStock <= i.lowStockThreshold)
    .map(i => ({
      itemName: i.name,
      branchName: branches.find(b => b.id === i.branchId)?.name || 'Unknown',
      currentStock: i.currentStock,
      threshold: i.lowStockThreshold,
      unit: i.unit
    }))
    .slice(0, 5)
  
  const branchRankings = branches.map(branch => {
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
  
  const todayClosings = filteredClosings.filter(dc => {
    const closingDate = new Date(dc.date).setHours(0, 0, 0, 0)
    return closingDate === today
  })
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          {selectedBranchId 
            ? `Viewing: ${branches.find(b => b.id === selectedBranchId)?.name}` 
            : 'Viewing: All Branches (Chain-Level Data)'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          icon={CurrencyDollar}
          trend={salesChange !== 0 ? `${salesChange > 0 ? '+' : ''}${salesChange.toFixed(1)}% vs yesterday` : undefined}
          trendUp={salesChange > 0}
        />
        <MetricCard
          title="Today's Orders"
          value={todayOrdersCount.toString()}
          icon={Receipt}
        />
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(averageOrderValue)}
          icon={TrendUp}
        />
        <MetricCard
          title="Estimated Profit"
          value={formatCurrency(estimatedProfit)}
          icon={Wallet}
          trend={estimatedProfit > 0 ? 'Positive' : estimatedProfit < 0 ? 'Negative' : 'Break-even'}
          trendUp={estimatedProfit > 0}
        />
      </div>
      
      {!selectedBranchId && branches.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-accent" weight="fill" />
              Branch Rankings (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branchRankings.map((branch, index) => (
                <div key={branch.branchId} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                    index === 1 ? 'bg-gray-400/20 text-gray-600' :
                    index === 2 ? 'bg-orange-500/20 text-orange-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{branch.branchName}</p>
                    <p className="text-sm text-muted-foreground">{branch.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(branch.sales)}</p>
                    <p className="text-sm text-muted-foreground">
                      Profit: <span className={branch.profit >= 0 ? 'text-success' : 'text-destructive'}>
                        {formatCurrency(branch.profit)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="text-primary" weight="duotone" />
              Sales Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Line type="monotone" dataKey="sales" stroke="oklch(0.45 0.15 250)" strokeWidth={3} dot={{ fill: 'oklch(0.45 0.15 250)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="text-accent" weight="duotone" />
              Payment Methods Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No payment data for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fire className="text-accent" weight="fill" />
              Top 5 Selling Items (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topSellingItems.length > 0 ? (
              <div className="space-y-3">
                {topSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                    </div>
                    <p className="font-bold">{formatCurrency(item.revenue)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sales data for today</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="text-warning" weight="duotone" />
              Low Stock Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockAlerts.length > 0 ? (
              <div className="space-y-3">
                {lowStockAlerts.map((alert, index) => (
                  <Alert key={index} className="border-warning/50 bg-warning/5">
                    <Warning className="text-warning" weight="fill" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{alert.itemName}</p>
                          <p className="text-sm text-muted-foreground">{alert.branchName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-warning">{alert.currentStock} {alert.unit}</p>
                          <p className="text-xs text-muted-foreground">Threshold: {alert.threshold}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">All items are well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockCountdown className="text-primary" weight="duotone" />
            Daily Closing Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayClosings.length > 0 ? (
            <div className="space-y-3">
              {todayClosings.map(closing => {
                const branch = branches.find(b => b.id === closing.branchId)
                const status = closing.difference === 0 ? 'matched' : closing.difference < 0 ? 'shortage' : 'excess'
                
                return (
                  <div key={closing.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      {status === 'matched' ? (
                        <CheckCircle className="text-success" weight="fill" size={24} />
                      ) : (
                        <XCircle className={status === 'shortage' ? 'text-destructive' : 'text-warning'} weight="fill" size={24} />
                      )}
                      <div>
                        <p className="font-semibold">{branch?.name}</p>
                        <p className="text-sm text-muted-foreground">Closed by {closing.closedBy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        status === 'matched' ? 'bg-success/20 text-success hover:bg-success/30' :
                        status === 'shortage' ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' :
                        'bg-warning/20 text-warning hover:bg-warning/30'
                      }>
                        {status === 'matched' ? 'Matched' : status === 'shortage' ? 'Shortage' : 'Excess'}
                      </Badge>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Difference:</span>{' '}
                        <span className={closing.difference === 0 ? 'text-success' : closing.difference < 0 ? 'text-destructive' : 'text-warning'}>
                          {formatCurrency(Math.abs(closing.difference))}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockCountdown className="mx-auto text-muted-foreground mb-2" size={48} weight="duotone" />
              <p className="text-muted-foreground">No closing completed for today</p>
              <p className="text-sm text-muted-foreground mt-1">Complete daily closing from Settings</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
