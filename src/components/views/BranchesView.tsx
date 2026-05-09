import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatTime, formatCurrency, generateId, getStatusColor } from '@/lib/helpers'
import { Plus, Pencil } from '@phosphor-icons/react'
import { Branch } from '@/lib/types'
import { toast } from 'sonner'

interface BranchesViewProps {
  branches: Branch[]
  orders: any[]
  expenses: any[]
  onCreateBranch: (branch: Branch) => void
  onUpdateBranch: (branch: Branch) => void
}

export function BranchesView({ branches, orders, expenses, onCreateBranch, onUpdateBranch }: BranchesViewProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    location: '',
    phone: '',
    managerName: '',
    openingTime: '09:00',
    closingTime: '22:00',
    isActive: true
  })
  
  const handleSubmit = () => {
    if (!formData.name || !formData.location) {
      toast.error('Please fill in required fields')
      return
    }
    
    if (editingBranch) {
      onUpdateBranch({ ...editingBranch, ...formData } as Branch)
      toast.success('Branch updated successfully')
    } else {
      onCreateBranch({
        ...formData,
        id: generateId(),
        createdAt: Date.now()
      } as Branch)
      toast.success('Branch created successfully')
    }
    
    setShowDialog(false)
    setEditingBranch(null)
    setFormData({
      name: '',
      location: '',
      phone: '',
      managerName: '',
      openingTime: '09:00',
      closingTime: '22:00',
      isActive: true
    })
  }
  
  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData(branch)
    setShowDialog(true)
  }
  
  const today = new Date().setHours(0, 0, 0, 0)
  
  const getBranchMetrics = (branchId: string) => {
    const branchOrders = orders.filter(o => 
      o.branchId === branchId && 
      o.status === 'completed' &&
      new Date(o.createdAt).setHours(0, 0, 0, 0) === today
    )
    const branchExpenses = expenses.filter(e => 
      e.branchId === branchId &&
      new Date(e.date).setHours(0, 0, 0, 0) === today
    )
    
    const sales = branchOrders.reduce((sum, o) => sum + o.total, 0)
    const ordersCount = branchOrders.length
    const expensesTotal = branchExpenses.reduce((sum, e) => sum + e.amount, 0)
    const profit = sales - expensesTotal
    
    return { sales, orders: ordersCount, expenses: expensesTotal, profit }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">Branches</h2>
          <p className="text-muted-foreground">Manage restaurant branches and locations</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="mr-2" size={20} />
          Add Branch
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => {
          const metrics = getBranchMetrics(branch.id)
          
          return (
            <Card key={branch.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{branch.name}</h3>
                  <Badge className={getStatusColor(branch.isActive ? 'active' : 'inactive')}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" onClick={() => openEditDialog(branch)}>
                  <Pencil size={16} />
                </Button>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{branch.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{branch.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Manager:</span>
                  <p className="font-medium">{branch.managerName || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hours:</span>
                  <p className="font-medium">{formatTime(branch.openingTime)} - {formatTime(branch.closingTime)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today's Sales</span>
                  <span className="font-semibold">{formatCurrency(metrics.sales)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orders</span>
                  <span className="font-semibold">{metrics.orders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expenses</span>
                  <span className="font-semibold text-destructive">{formatCurrency(metrics.expenses)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-medium">Profit</span>
                  <span className={`font-bold ${metrics.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(metrics.profit)}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open)
        if (!open) {
          setEditingBranch(null)
          setFormData({
            name: '',
            location: '',
            phone: '',
            managerName: '',
            openingTime: '09:00',
            closingTime: '22:00',
            isActive: true
          })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Branch Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dhanmondi"
              />
            </div>
            <div>
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Road 27, Dhanmondi, Dhaka"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +880 1XXX-XXXXXX"
              />
            </div>
            <div>
              <Label>Manager Name</Label>
              <Input
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Opening Time</Label>
                <Input
                  type="time"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                />
              </div>
              <div>
                <Label>Closing Time</Label>
                <Input
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90">
              {editingBranch ? 'Update' : 'Create'} Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
