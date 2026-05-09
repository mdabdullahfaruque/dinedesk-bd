export type UserRole = 'owner' | 'admin' | 'branch-manager' | 'cashier' | 'waiter'

export type OrderType = 'dine-in' | 'takeaway' | 'delivery'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' | 'refunded'

export type KitchenStatus = 'new' | 'preparing' | 'ready' | 'served'

export type PaymentMethod = 
  | 'cash' 
  | 'bkash' 
  | 'nagad' 
  | 'rocket' 
  | 'card' 
  | 'bank-transfer'
  | 'foodpanda'
  | 'pathao-food'
  | 'other'

export type OrderSource = 
  | 'walk-in'
  | 'phone'
  | 'facebook'
  | 'foodpanda'
  | 'pathao-food'
  | 'website'
  | 'other'

export type DeliveryStatus = 
  | 'pending'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export type ExpenseCategory = 
  | 'rent' 
  | 'staff-salary' 
  | 'gas-bill' 
  | 'electricity-bill'
  | 'water-bill'
  | 'raw-materials' 
  | 'meat-purchase'
  | 'rice-purchase'
  | 'packaging' 
  | 'cleaning'
  | 'delivery-cost' 
  | 'maintenance' 
  | 'marketing'
  | 'other'

export type StockUnit = 'kg' | 'litre' | 'piece' | 'packet'

export type StockStatus = 'good' | 'low-stock' | 'out-of-stock'

export interface Branch {
  id: string
  name: string
  location: string
  phone: string
  managerName: string
  openingTime: string
  closingTime: string
  isActive: boolean
  createdAt: number
}

export interface MenuCategory {
  id: string
  name: string
  order: number
}

export interface MenuItem {
  id: string
  name: string
  categoryId: string
  price: number
  estimatedCost: number
  availableBranches: string[]
  isActive: boolean
  isPopular: boolean
  createdAt: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface DeliveryInfo {
  customerName: string
  phone: string
  address: string
  deliveryCharge: number
  riderName?: string
  status: DeliveryStatus
}

export interface Order {
  id: string
  orderNumber: string
  branchId: string
  orderType: OrderType
  orderSource: OrderSource
  tableNumber?: string
  deliveryInfo?: DeliveryInfo
  items: Array<{
    menuItemId: string
    name: string
    price: number
    quantity: number
    kitchenStatus?: KitchenStatus
    startedAt?: number
    completedAt?: number
  }>
  subtotal: number
  discount: number
  serviceCharge: number
  vat: number
  total: number
  paymentMethod: PaymentMethod
  paidAmount: number
  changeAmount: number
  status: OrderStatus
  kitchenStatus?: KitchenStatus
  cancellationReason?: string
  createdAt: number
  createdBy: string
  acceptedAt?: number
  startedPreparingAt?: number
  readyAt?: number
  servedAt?: number
}

export interface Staff {
  id: string
  name: string
  phone: string
  role: UserRole
  assignedBranchId: string
  isActive: boolean
  createdAt: number
}

export interface InventoryItem {
  id: string
  name: string
  branchId: string
  unit: StockUnit
  openingStock: number
  purchasedStock: number
  usedStock: number
  wastage: number
  currentStock: number
  lowStockThreshold: number
  status: StockStatus
  lastUpdated: number
}

export interface Expense {
  id: string
  branchId: string
  date: number
  category: ExpenseCategory
  amount: number
  paymentMethod: PaymentMethod
  note: string
  createdAt: number
  createdBy: string
}

export interface DailyClosing {
  id: string
  branchId: string
  date: number
  openingCash: number
  cashSales: number
  digitalSales: number
  expensesFromCash: number
  expectedCash: number
  actualCash: number
  difference: number
  note: string
  closedBy: string
  closedAt: number
}

export interface Settings {
  restaurantName: string
  businessType: 'single' | 'multi-branch'
  currency: string
  vatEnabled: boolean
  defaultVatPercentage: number
  serviceChargeEnabled: boolean
  defaultServiceChargePercentage: number
  applyServiceChargeOnlyForDineIn: boolean
  enabledPaymentMethods: PaymentMethod[]
  receiptFooter: string
  receiptPhone: string
  receiptAddress: string
  receiptBinNumber: string
  language: 'en' | 'bn'
}

export interface DashboardMetrics {
  todaySales: number
  todayOrders: number
  averageOrderValue: number
  totalCashCollected: number
  totalDigitalCollected: number
  todayExpenses: number
  estimatedProfit: number
  topSellingItems: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  lowStockAlerts: Array<{
    itemName: string
    branchName: string
    currentStock: number
    threshold: number
  }>
  branchPerformance: Array<{
    branchId: string
    branchName: string
    sales: number
    orders: number
    expenses: number
    profit: number
  }>
}
