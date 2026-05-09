export const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}${random}`
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const getStockStatus = (current: number, threshold: number): 'good' | 'low-stock' | 'out-of-stock' => {
  if (current === 0) return 'out-of-stock'
  if (current <= threshold) return 'low-stock'
  return 'good'
}

export const calculateProfit = (revenue: number, cost: number, expenses: number): number => {
  return revenue - cost - expenses
}

export const getStartOfDay = (timestamp: number = Date.now()): number => {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export const getEndOfDay = (timestamp: number = Date.now()): number => {
  const date = new Date(timestamp)
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

export const isToday = (timestamp: number): boolean => {
  const today = getStartOfDay()
  const compareDate = getStartOfDay(timestamp)
  return today === compareDate
}

export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': 'text-success bg-success/10',
    'cancelled': 'text-destructive bg-destructive/10',
    'refunded': 'text-warning bg-warning/10',
    'active': 'text-success bg-success/10',
    'inactive': 'text-muted-foreground bg-muted',
    'good': 'text-success bg-success/10',
    'low-stock': 'text-warning bg-warning/10',
    'out-of-stock': 'text-destructive bg-destructive/10',
  }
  return statusMap[status] || 'text-foreground bg-muted'
}

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    'cash': 'Cash',
    'bkash': 'bKash',
    'nagad': 'Nagad',
    'rocket': 'Rocket',
    'card': 'Card'
  }
  return labels[method] || method
}

export const getExpenseCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'rent': 'Rent',
    'salary': 'Salary',
    'utility': 'Utility',
    'raw-materials': 'Raw Materials',
    'packaging': 'Packaging',
    'delivery-cost': 'Delivery Cost',
    'maintenance': 'Maintenance',
    'other': 'Other'
  }
  return labels[category] || category
}

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    'owner': 'Owner',
    'admin': 'Admin',
    'branch-manager': 'Branch Manager',
    'cashier': 'Cashier',
    'waiter': 'Waiter'
  }
  return labels[role] || role
}

export const getOrderTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'dine-in': 'Dine-in',
    'takeaway': 'Takeaway',
    'delivery': 'Delivery'
  }
  return labels[type] || type
}
