import { useState, useEffect } from 'react'
import { Order, Branch, Settings, KitchenStatus } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, CookingPot, Package, X } from '@phosphor-icons/react'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface KDSViewProps {
  orders: Order[]
  branches: Branch[]
  settings: Settings
  onUpdateOrder: (order: Order) => void
}

export function KDSView({ orders, branches, settings, onUpdateOrder }: KDSViewProps) {
  const t = useTranslation(settings.language)
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'preparing' | 'ready'>('all')
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const activeOrders = orders.filter(order => {
    const isPending = order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
    const matchesBranch = !selectedBranchId || order.branchId === selectedBranchId
    const matchesFilter = filter === 'all' || order.kitchenStatus === filter
    return isPending && matchesBranch && matchesFilter
  })

  const sortedOrders = [...activeOrders].sort((a, b) => {
    const priority: Record<KitchenStatus, number> = { new: 0, preparing: 1, ready: 2, served: 3 }
    const aPriority = priority[a.kitchenStatus || 'new']
    const bPriority = priority[b.kitchenStatus || 'new']
    if (aPriority !== bPriority) return aPriority - bPriority
    return a.createdAt - b.createdAt
  })

  const handleAcceptOrder = (order: Order) => {
    const updatedOrder: Order = {
      ...order,
      kitchenStatus: 'preparing',
      status: 'preparing',
      acceptedAt: Date.now(),
      startedPreparingAt: Date.now()
    }
    onUpdateOrder(updatedOrder)
    toast.success(settings.language === 'bn' ? 'অর্ডার গ্রহণ করা হয়েছে' : 'Order accepted')
  }

  const handleMarkReady = (order: Order) => {
    const updatedOrder: Order = {
      ...order,
      kitchenStatus: 'ready',
      status: 'ready',
      readyAt: Date.now()
    }
    onUpdateOrder(updatedOrder)
    toast.success(settings.language === 'bn' ? 'অর্ডার তৈরি' : 'Order ready')
  }

  const handleMarkServed = (order: Order) => {
    const updatedOrder: Order = {
      ...order,
      kitchenStatus: 'served',
      status: 'completed',
      servedAt: Date.now()
    }
    onUpdateOrder(updatedOrder)
    toast.success(settings.language === 'bn' ? 'অর্ডার সার্ভ করা হয়েছে' : 'Order served')
  }

  const formatElapsedTime = (timestamp: number) => {
    const elapsed = Math.floor((currentTime - timestamp) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = (timestamp: number) => {
    const elapsed = (currentTime - timestamp) / 60000
    if (elapsed < 5) return 'text-success'
    if (elapsed < 10) return 'text-warning'
    return 'text-destructive'
  }

  const getKitchenStatusBadge = (status?: KitchenStatus) => {
    const statusMap: Record<KitchenStatus, { label: string; labelBn: string; variant: 'default' | 'secondary' | 'success' | 'warning' }> = {
      new: { label: 'New', labelBn: 'নতুন', variant: 'warning' },
      preparing: { label: 'Preparing', labelBn: 'রান্না হচ্ছে', variant: 'default' },
      ready: { label: 'Ready', labelBn: 'তৈরি', variant: 'success' },
      served: { label: 'Served', labelBn: 'সার্ভ করা', variant: 'secondary' }
    }
    
    const config = statusMap[status || 'new']
    return (
      <Badge variant={config.variant as any}>
        {settings.language === 'bn' ? config.labelBn : config.label}
      </Badge>
    )
  }

  const getOrderTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; labelBn: string }> = {
      'dine-in': { label: 'Dine-in', labelBn: 'ডাইন-ইন' },
      'takeaway': { label: 'Takeaway', labelBn: 'টেকঅ্যাওয়ে' },
      'delivery': { label: 'Delivery', labelBn: 'ডেলিভারি' }
    }
    
    const config = typeMap[type] || { label: type, labelBn: type }
    return (
      <Badge variant="outline">
        {settings.language === 'bn' ? config.labelBn : config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {settings.language === 'bn' ? 'রান্নাঘর ডিসপ্লে সিস্টেম' : 'Kitchen Display System'}
          </h1>
          <p className="text-muted-foreground">
            {settings.language === 'bn' 
              ? 'রিয়েল-টাইম অর্ডার ট্র্যাকিং এবং প্রস্তুতি স্ট্যাটাস' 
              : 'Real-time order tracking and preparation status'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedBranchId || 'all'} onValueChange={(v) => setSelectedBranchId(v === 'all' ? null : v)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {settings.language === 'bn' ? 'সব শাখা' : 'All Branches'}
              </SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">
            {settings.language === 'bn' ? 'সব' : 'All'} ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            {settings.language === 'bn' ? 'নতুন' : 'New'} ({activeOrders.filter(o => (o.kitchenStatus || 'new') === 'new').length})
          </TabsTrigger>
          <TabsTrigger value="preparing">
            {settings.language === 'bn' ? 'রান্না হচ্ছে' : 'Preparing'} ({activeOrders.filter(o => o.kitchenStatus === 'preparing').length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            {settings.language === 'bn' ? 'তৈরি' : 'Ready'} ({activeOrders.filter(o => o.kitchenStatus === 'ready').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <CookingPot size={64} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
          <h3 className="text-lg font-medium mb-2">
            {settings.language === 'bn' ? 'কোন অর্ডার নেই' : 'No Orders'}
          </h3>
          <p className="text-muted-foreground">
            {settings.language === 'bn' 
              ? 'নতুন অর্ডার এখানে প্রদর্শিত হবে' 
              : 'New orders will appear here'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map(order => {
            const branch = branches.find(b => b.id === order.branchId)
            const kitchenStatus = order.kitchenStatus || 'new'
            const timestamp = order.startedPreparingAt || order.acceptedAt || order.createdAt
            
            return (
              <Card 
                key={order.id} 
                className={`p-4 ${
                  kitchenStatus === 'new' ? 'border-l-4 border-l-warning' :
                  kitchenStatus === 'preparing' ? 'border-l-4 border-l-primary' :
                  kitchenStatus === 'ready' ? 'border-l-4 border-l-success' :
                  ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                        {getKitchenStatusBadge(kitchenStatus)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={16} />
                        <span className={getTimeColor(timestamp)}>
                          {formatElapsedTime(timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {getOrderTypeBadge(order.orderType)}
                      {order.tableNumber && (
                        <div className="mt-1 text-sm font-medium">
                          {settings.language === 'bn' ? 'টেবিল' : 'Table'} {order.tableNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {branch && (
                    <div className="text-xs text-muted-foreground">
                      {branch.name}
                    </div>
                  )}

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                        </div>
                        <div className="text-right font-medium ml-2">
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.orderType === 'delivery' && order.deliveryInfo && (
                    <div className="pt-3 border-t border-border text-xs space-y-1">
                      <div className="font-medium">
                        {settings.language === 'bn' ? 'ডেলিভারি তথ্য:' : 'Delivery Info:'}
                      </div>
                      <div>{order.deliveryInfo.customerName}</div>
                      <div className="text-muted-foreground">{order.deliveryInfo.phone}</div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-border">
                    {kitchenStatus === 'new' && (
                      <Button 
                        onClick={() => handleAcceptOrder(order)}
                        className="flex-1"
                        size="sm"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        {settings.language === 'bn' ? 'গ্রহণ করুন' : 'Accept'}
                      </Button>
                    )}
                    
                    {kitchenStatus === 'preparing' && (
                      <Button 
                        onClick={() => handleMarkReady(order)}
                        className="flex-1"
                        size="sm"
                        variant="default"
                      >
                        <Package size={16} className="mr-1" />
                        {settings.language === 'bn' ? 'তৈরি চিহ্নিত করুন' : 'Mark Ready'}
                      </Button>
                    )}
                    
                    {kitchenStatus === 'ready' && (
                      <Button 
                        onClick={() => handleMarkServed(order)}
                        className="flex-1 bg-success hover:bg-success/90"
                        size="sm"
                      >
                        <CheckCircle size={16} weight="fill" className="mr-1" />
                        {settings.language === 'bn' ? 'সার্ভ করা হয়েছে' : 'Served'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock size={24} className="text-warning" weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {activeOrders.filter(o => (o.kitchenStatus || 'new') === 'new').length}
              </div>
              <div className="text-sm text-muted-foreground">
                {settings.language === 'bn' ? 'নতুন অর্ডার' : 'New Orders'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CookingPot size={24} className="text-primary" weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {activeOrders.filter(o => o.kitchenStatus === 'preparing').length}
              </div>
              <div className="text-sm text-muted-foreground">
                {settings.language === 'bn' ? 'রান্না হচ্ছে' : 'Preparing'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Package size={24} className="text-success" weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {activeOrders.filter(o => o.kitchenStatus === 'ready').length}
              </div>
              <div className="text-sm text-muted-foreground">
                {settings.language === 'bn' ? 'তৈরি' : 'Ready'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <CheckCircle size={24} className="text-accent" weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {orders.filter(o => 
                  o.status === 'completed' && 
                  new Date(o.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">
                {settings.language === 'bn' ? 'আজ সম্পন্ন' : 'Today Completed'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
