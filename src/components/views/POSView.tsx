import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, generateOrderNumber, generateId, formatDateTime } from '@/lib/helpers'
import { Plus, Minus, Trash, X } from '@phosphor-icons/react'
import { Branch, MenuItem, MenuCategory, CartItem, Order, OrderType, PaymentMethod, Settings } from '@/lib/types'
import { toast } from 'sonner'

interface POSViewProps {
  branches: Branch[]
  menuItems: MenuItem[]
  categories: MenuCategory[]
  settings: Settings
  onCreateOrder: (order: Order) => void
}

export function POSView({ branches, menuItems, categories, settings, onCreateOrder }: POSViewProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '')
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [tableNumber, setTableNumber] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [serviceCharge, setServiceCharge] = useState(settings.defaultServiceChargePercentage)
  const [vat, setVat] = useState(settings.defaultVatPercentage)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  
  const activeBranch = branches.find(b => b.id === selectedBranchId)
  const branchMenuItems = menuItems.filter(item => 
    item.isActive && item.availableBranches.includes(selectedBranchId)
  )
  
  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  const discountAmount = discount
  const serviceChargeAmount = (subtotal - discountAmount) * (serviceCharge / 100)
  const vatAmount = (subtotal - discountAmount + serviceChargeAmount) * (vat / 100)
  const total = subtotal - discountAmount + serviceChargeAmount + vatAmount
  
  const addToCart = (menuItem: MenuItem) => {
    setCart(current => {
      const existing = current.find(item => item.menuItem.id === menuItem.id)
      if (existing) {
        return current.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { menuItem, quantity: 1 }]
    })
  }
  
  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(current =>
      current.map(item => {
        if (item.menuItem.id === menuItemId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    )
  }
  
  const removeFromCart = (menuItemId: string) => {
    setCart(current => current.filter(item => item.menuItem.id !== menuItemId))
  }
  
  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setTableNumber('')
  }
  
  const completeOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }
    
    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('Please enter table number')
      return
    }
    
    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      branchId: selectedBranchId,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      items: cart.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity
      })),
      subtotal,
      discount: discountAmount,
      serviceCharge: serviceChargeAmount,
      vat: vatAmount,
      total,
      paymentMethod,
      paidAmount: total,
      changeAmount: 0,
      status: 'completed',
      createdAt: Date.now(),
      createdBy: 'Cashier'
    }
    
    onCreateOrder(order)
    setLastOrder(order)
    setShowReceipt(true)
    clearCart()
    toast.success('Order completed successfully')
  }
  
  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Point of Sale</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Branch</Label>
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in">Dine-in</SelectItem>
                  <SelectItem value="takeaway">Takeaway</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {orderType === 'dine-in' && (
              <div>
                <Label>Table Number</Label>
                <Input
                  type="text"
                  placeholder="e.g. T-5"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue={categories[0]?.id || 'all'}>
            <TabsList className="mb-4">
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {branchMenuItems
                    .filter(item => item.categoryId === cat.id)
                    .map(item => (
                      <Card
                        key={item.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => addToCart(item)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            {item.isPopular && (
                              <Badge variant="secondary" className="mb-2 text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
      
      <Card className="w-96 p-6 flex flex-col h-[calc(100vh-8rem)] sticky top-6">
        <h3 className="text-xl font-semibold mb-4">Current Order</h3>
        
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.menuItem.id} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.menuItem.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.menuItem.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => updateQuantity(item.menuItem.id, -1)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => updateQuantity(item.menuItem.id, 1)}
                  >
                    <Plus size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={() => removeFromCart(item.menuItem.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Discount (৳)</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Service (%)</Label>
              <Input
                type="number"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(Number(e.target.value))}
                className="h-9"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings.enabledPaymentMethods.map(method => (
                  <SelectItem key={method} value={method}>
                    {method === 'cash' ? 'Cash' : method === 'bkash' ? 'bKash' : method === 'nagad' ? 'Nagad' : method === 'rocket' ? 'Rocket' : 'Card'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 py-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-destructive">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge ({serviceCharge}%)</span>
              <span>{formatCurrency(serviceChargeAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT ({vat}%)</span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
              <X className="mr-2" size={16} />
              Clear
            </Button>
            <Button onClick={completeOrder} disabled={cart.length === 0} className="bg-accent hover:bg-accent/90">
              Complete Order
            </Button>
          </div>
        </div>
      </Card>
      
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Receipt</DialogTitle>
          </DialogHeader>
          {lastOrder && (
            <div className="space-y-4 text-sm">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">{settings.restaurantName}</h3>
                <p className="text-muted-foreground">{activeBranch?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{activeBranch?.location}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order #</span>
                  <span className="font-semibold">{lastOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date/Time</span>
                  <span>{formatDateTime(lastOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{lastOrder.orderType}</span>
                </div>
                {lastOrder.tableNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Table</span>
                    <span>{lastOrder.tableNumber}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {lastOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(lastOrder.subtotal)}</span>
                </div>
                {lastOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-destructive">-{formatCurrency(lastOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Charge</span>
                  <span>{formatCurrency(lastOrder.serviceCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT</span>
                  <span>{formatCurrency(lastOrder.vat)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(lastOrder.total)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold">{lastOrder.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span>{formatCurrency(lastOrder.paidAmount)}</span>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">{settings.receiptFooter}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
