import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, TrendUp, TrendDown, Download } from '@phosphor-icons/react'
import { InventoryItem, Expense, Staff, Branch, Settings,  Order } from '@/lib/types'
import { generateId } from '@/lib/helpers'
import { useTranslation, getExpenseCategoryLabel } from '@/lib/translations'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface InventoryViewProps {
  branches: Branch[]
  settings: Settings
}

export function InventoryView({ branches, settings }: InventoryViewProps) {
  const t = useTranslation(settings.language)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [filterBranch, setFilterBranch] = useState<string>('all')
  
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', [
    {
      id: 'inv-1',
      name: 'Rice (Basmati)',
      branchId: branches[0]?.id || '',
      unit: 'kg',
      openingStock: 500,
      purchasedStock: 200,
      usedStock: 350,
      wastage: 10,
      currentStock: 340,
      lowStockThreshold: 100,
      status: 'good',
      lastUpdated: Date.now()
    },
    {
      id: 'inv-2',
      name: 'Chicken',
      branchId: branches[0]?.id || '',
      unit: 'kg',
      openingStock: 100,
      purchasedStock: 50,
      usedStock: 130,
      wastage: 5,
      currentStock: 15,
      lowStockThreshold: 20,
      status: 'low-stock',
      lastUpdated: Date.now()
    },
    {
      id: 'inv-3',
      name: 'Beef',
      branchId: branches[0]?.id || '',
      unit: 'kg',
      openingStock: 80,
      purchasedStock: 40,
      usedStock: 115,
      wastage: 5,
      currentStock: 0,
      lowStockThreshold: 15,
      status: 'out-of-stock',
      lastUpdated: Date.now()
    },
  ])

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const openingStock = Number(formData.get('openingStock'))
    const purchasedStock = Number(formData.get('purchasedStock'))
    const usedStock = Number(formData.get('usedStock'))
    const wastage = Number(formData.get('wastage'))
    const currentStock = openingStock + purchasedStock - usedStock - wastage
    const lowStockThreshold = Number(formData.get('lowStockThreshold'))
    
    let status: 'good' | 'low-stock' | 'out-of-stock' = 'good'
    if (currentStock === 0) status = 'out-of-stock'
    else if (currentStock <= lowStockThreshold) status = 'low-stock'
    
    const newItem: InventoryItem = {
      id: editingItem?.id || generateId(),
      name: formData.get('name') as string,
      branchId: formData.get('branchId') as string,
      unit: formData.get('unit') as 'kg' | 'litre' | 'piece' | 'packet',
      openingStock,
      purchasedStock,
      usedStock,
      wastage,
      currentStock,
      lowStockThreshold,
      status,
      lastUpdated: Date.now()
    }
    
    if (editingItem) {
      setInventory(items => (items || []).map(item => item.id === editingItem.id ? newItem : item))
    } else {
      setInventory(items => [...(items || []), newItem])
    }
    
    toast.success(t.settingsUpdated)
    setDialogOpen(false)
    setEditingItem(null)
  }

  const filteredItems = (inventory || []).filter(item => 
    filterBranch === 'all' || item.branchId === filterBranch
  )

  const lowStockCount = filteredItems.filter(i => i.status === 'low-stock').length
  const outOfStockCount = filteredItems.filter(i => i.status === 'out-of-stock').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{t.inventoryManagement}</h2>
          <p className="text-muted-foreground">{t.inventoryManagementDesc}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)} className="bg-accent hover:bg-accent/90">
              <Plus size={20} weight="bold" />
              {t.addInventoryItem}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? t.editInventoryItem : t.addInventoryItem}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <Label htmlFor="name">{t.stockItem}</Label>
                <Input id="name" name="name" defaultValue={editingItem?.name} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branchId">{t.branchName}</Label>
                  <Select name="branchId" defaultValue={editingItem?.branchId || branches[0]?.id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="unit">{t.unit}</Label>
                  <Select name="unit" defaultValue={editingItem?.unit || 'kg'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">{t.kg}</SelectItem>
                      <SelectItem value="litre">{t.litre}</SelectItem>
                      <SelectItem value="piece">{t.piece}</SelectItem>
                      <SelectItem value="packet">{t.packet}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openingStock">{t.openingStock}</Label>
                  <Input id="openingStock" name="openingStock" type="number" step="0.01" defaultValue={editingItem?.openingStock || 0} required />
                </div>
                
                <div>
                  <Label htmlFor="purchasedStock">{t.purchasedStock}</Label>
                  <Input id="purchasedStock" name="purchasedStock" type="number" step="0.01" defaultValue={editingItem?.purchasedStock || 0} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usedStock">{t.usedStock}</Label>
                  <Input id="usedStock" name="usedStock" type="number" step="0.01" defaultValue={editingItem?.usedStock || 0} />
                </div>
                
                <div>
                  <Label htmlFor="wastage">{t.wastage}</Label>
                  <Input id="wastage" name="wastage" type="number" step="0.01" defaultValue={editingItem?.wastage || 0} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="lowStockThreshold">{t.lowStockThreshold}</Label>
                <Input id="lowStockThreshold" name="lowStockThreshold" type="number" step="0.01" defaultValue={editingItem?.lowStockThreshold || 0} />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {t.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{t.totalExpenses}</div>
          <div className="text-2xl font-bold">{filteredItems.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-destructive mb-1">{t.lowStock}</div>
          <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-destructive mb-1">{t.outOfStock}</div>
          <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allBranches}</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.stockItem}</TableHead>
              <TableHead>{t.branchName}</TableHead>
              <TableHead>{t.currentStock}</TableHead>
              <TableHead>{t.unit}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t.noDataAvailable}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map(item => {
                const branch = branches.find(b => b.id === item.branchId)
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{branch?.name}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'good' ? 'default' : 
                        item.status === 'low-stock' ? 'secondary' : 
                        'destructive'
                      }>
                        {item.status === 'good' ? t.good : item.status === 'low-stock' ? t.lowStock : t.outOfStock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

interface ExpensesViewProps {
  branches: Branch[]
  settings: Settings
}

export function ExpensesView({ branches, settings }: ExpensesViewProps) {
  const t = useTranslation(settings.language)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filterBranch, setFilterBranch] = useState<string>('all')
  
  const [expenses, setExpenses] = useKV<Expense[]>('expenses', [])

  const handleSaveExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newExpense: Expense = {
      id: editingExpense?.id || generateId(),
      branchId: formData.get('branchId') as string,
      date: new Date(formData.get('date') as string).getTime(),
      category: formData.get('category') as any,
      amount: Number(formData.get('amount')),
      paymentMethod: formData.get('paymentMethod') as any,
      note: formData.get('note') as string,
      createdAt: editingExpense?.createdAt || Date.now(),
      createdBy: 'Owner'
    }
    
    if (editingExpense) {
      setExpenses(items => (items || []).map(item => item.id === editingExpense.id ? newExpense : item))
    } else {
      setExpenses(items => [...(items || []), newExpense])
    }
    
    toast.success(t.settingsUpdated)
    setDialogOpen(false)
    setEditingExpense(null)
  }

  const filteredExpenses = (expenses || []).filter(expense => 
    filterBranch === 'all' || expense.branchId === filterBranch
  )

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const expensesByCategory = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{t.expenseManagement}</h2>
          <p className="text-muted-foreground">{t.expenseManagementDesc}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExpense(null)} className="bg-accent hover:bg-accent/90">
              <Plus size={20} weight="bold" />
              {t.addExpense}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? t.editExpense : t.addExpense}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <Label htmlFor="branchId">{t.branchName}</Label>
                <Select name="branchId" defaultValue={editingExpense?.branchId || branches[0]?.id}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">{t.date}</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  defaultValue={editingExpense ? format(editingExpense.date, 'yyyy-MM-dd') : format(Date.now(), 'yyyy-MM-dd')} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="category">{t.category}</Label>
                <Select name="category" defaultValue={editingExpense?.category || 'other'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">{t.rent}</SelectItem>
                    <SelectItem value="staff-salary">{t.staffSalary}</SelectItem>
                    <SelectItem value="gas-bill">{t.gasBill}</SelectItem>
                    <SelectItem value="electricity-bill">{t.electricityBill}</SelectItem>
                    <SelectItem value="water-bill">{t.waterBill}</SelectItem>
                    <SelectItem value="raw-materials">{t.rawMaterials}</SelectItem>
                    <SelectItem value="meat-purchase">{t.meatPurchase}</SelectItem>
                    <SelectItem value="rice-purchase">{t.ricePurchase}</SelectItem>
                    <SelectItem value="packaging">{t.packaging}</SelectItem>
                    <SelectItem value="cleaning">{t.cleaning}</SelectItem>
                    <SelectItem value="delivery-cost">{t.deliveryCost}</SelectItem>
                    <SelectItem value="maintenance">{t.maintenance}</SelectItem>
                    <SelectItem value="marketing">{t.marketing}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">{t.amount} ({settings.currency})</Label>
                <Input id="amount" name="amount" type="number" step="0.01" defaultValue={editingExpense?.amount} required />
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">{t.paymentMethod}</Label>
                <Select name="paymentMethod" defaultValue={editingExpense?.paymentMethod || 'cash'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t.cash}</SelectItem>
                    <SelectItem value="bkash">{t.bkash}</SelectItem>
                    <SelectItem value="nagad">{t.nagad}</SelectItem>
                    <SelectItem value="rocket">{t.rocket}</SelectItem>
                    <SelectItem value="card">{t.card}</SelectItem>
                    <SelectItem value="bank-transfer">{t.bankTransfer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="note">{t.notes}</Label>
                <Textarea id="note" name="note" defaultValue={editingExpense?.note} rows={3} />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {t.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">{t.totalExpenses}</div>
          <div className="text-3xl font-bold">{settings.currency} {totalExpenses.toLocaleString()}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">{t.byCategory}</div>
          <div className="space-y-1">
            {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
              <div key={category} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{getExpenseCategoryLabel(category, settings.language)}</span>
                <span className="font-medium">{settings.currency} {amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allBranches}</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.branchName}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead>{t.amount}</TableHead>
              <TableHead>{t.paymentMethod}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t.noDataAvailable}
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map(expense => {
                const branch = branches.find(b => b.id === expense.branchId)
                return (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, 'dd MMM yyyy')}</TableCell>
                    <TableCell>{branch?.name}</TableCell>
                    <TableCell>{getExpenseCategoryLabel(expense.category, settings.language)}</TableCell>
                    <TableCell>{settings.currency} {expense.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{expense.paymentMethod}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExpense(expense)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

interface StaffViewProps {
  branches: Branch[]
  settings: Settings
}

export function StaffView({ branches, settings }: StaffViewProps) {
  const t = useTranslation(settings.language)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [filterBranch, setFilterBranch] = useState<string>('all')
  
  const [staff, setStaff] = useKV<Staff[]>('staff', [
    {
      id: 'staff-1',
      name: 'Karim Ahmed',
      phone: '+880 1712-345678',
      role: 'branch-manager',
      assignedBranchId: branches[0]?.id || '',
      isActive: true,
      createdAt: Date.now() - 86400000 * 90
    },
    {
      id: 'staff-2',
      name: 'Rahim Mia',
      phone: '+880 1712-345679',
      role: 'branch-manager',
      assignedBranchId: branches[1]?.id || '',
      isActive: true,
      createdAt: Date.now() - 86400000 * 60
    },
  ])

  const handleSaveStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newStaff: Staff = {
      id: editingStaff?.id || generateId(),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as any,
      assignedBranchId: formData.get('assignedBranchId') as string,
      isActive: formData.get('isActive') === 'on',
      createdAt: editingStaff?.createdAt || Date.now()
    }
    
    if (editingStaff) {
      setStaff(items => (items || []).map(item => item.id === editingStaff.id ? newStaff : item))
    } else {
      setStaff(items => [...(items || []), newStaff])
    }
    
    toast.success(t.settingsUpdated)
    setDialogOpen(false)
    setEditingStaff(null)
  }

  const filteredStaff = (staff || []).filter(member => 
    filterBranch === 'all' || member.assignedBranchId === filterBranch
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{t.staffManagement}</h2>
          <p className="text-muted-foreground">{t.staffManagementDesc}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStaff(null)} className="bg-accent hover:bg-accent/90">
              <Plus size={20} weight="bold" />
              {t.addStaff}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStaff ? t.editStaff : t.addStaff}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <Label htmlFor="name">{t.staffName}</Label>
                <Input id="name" name="name" defaultValue={editingStaff?.name} required />
              </div>
              
              <div>
                <Label htmlFor="phone">{t.phoneNumber}</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={editingStaff?.phone} required />
              </div>
              
              <div>
                <Label htmlFor="role">{t.role}</Label>
                <Select name="role" defaultValue={editingStaff?.role || 'cashier'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">{t.owner}</SelectItem>
                    <SelectItem value="admin">{t.admin}</SelectItem>
                    <SelectItem value="branch-manager">{t.branchManager}</SelectItem>
                    <SelectItem value="cashier">{t.cashier}</SelectItem>
                    <SelectItem value="waiter">{t.waiter}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedBranchId">{t.assignedBranch}</Label>
                <Select name="assignedBranchId" defaultValue={editingStaff?.assignedBranchId || branches[0]?.id}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingStaff?.isActive ?? true}
                />
                <Label htmlFor="isActive" className="font-normal cursor-pointer">
                  {t.active}
                </Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {t.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allBranches}</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.phoneNumber}</TableHead>
              <TableHead>{t.role}</TableHead>
              <TableHead>{t.assignedBranch}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t.noDataAvailable}
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map(member => {
                const branch = branches.find(b => b.id === member.assignedBranchId)
                return (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell className="capitalize">{member.role.replace('-', ' ')}</TableCell>
                    <TableCell>{branch?.name}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? 'default' : 'secondary'}>
                        {member.isActive ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStaff(member)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

interface ReportsViewProps {
  branches: Branch[]
  orders: Order[]
  expenses: Expense[]
  settings: Settings
}

export function ReportsView({ branches, orders, expenses, settings }: ReportsViewProps) {
  const t = useTranslation(settings.language)
  const [dateRange, setDateRange] = useState<string>('today')
  const [filterBranch, setFilterBranch] = useState<string>('all')

  const getDateRange = () => {
    const now = Date.now()
    const today = new Date(now).setHours(0, 0, 0, 0)
    
    switch (dateRange) {
      case 'today':
        return { start: today, end: now }
      case 'yesterday':
        return { start: today - 86400000, end: today }
      case 'thisWeek':
        return { start: today - 86400000 * 7, end: now }
      case 'thisMonth':
        return { start: today - 86400000 * 30, end: now }
      default:
        return { start: 0, end: now }
    }
  }

  const { start, end } = getDateRange()

  const filteredOrders = orders.filter(order => {
    const inDateRange = order.createdAt >= start && order.createdAt <= end
    const inBranch = filterBranch === 'all' || order.branchId === filterBranch
    return inDateRange && inBranch && order.status === 'completed'
  })

  const filteredExpenses = expenses.filter(expense => {
    const inDateRange = expense.date >= start && expense.date <= end
    const inBranch = filterBranch === 'all' || expense.branchId === filterBranch
    return inDateRange && inBranch
  })

  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const profit = totalSales - totalExpenses

  const salesByBranch = branches.map(branch => {
    const branchOrders = filteredOrders.filter(o => o.branchId === branch.id)
    const branchExpenses = filteredExpenses.filter(e => e.branchId === branch.id)
    return {
      name: branch.name,
      sales: branchOrders.reduce((sum, o) => sum + o.total, 0),
      expenses: branchExpenses.reduce((sum, e) => sum + e.amount, 0)
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">{t.reportsAnalytics}</h2>
        <p className="text-muted-foreground">{t.reportsAnalyticsDesc}</p>
      </div>

      <div className="flex gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{t.today}</SelectItem>
            <SelectItem value="yesterday">{t.yesterday}</SelectItem>
            <SelectItem value="thisWeek">{t.thisWeek}</SelectItem>
            <SelectItem value="thisMonth">{t.thisMonth}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterBranch} onValueChange={setFilterBranch}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allBranches}</SelectItem>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="ml-auto bg-primary hover:bg-primary/90">
          <Download size={20} weight="bold" />
          {t.export}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">{t.salesReport}</div>
            <TrendUp className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold">{settings.currency} {totalSales.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">{filteredOrders.length} {t.orders}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">{t.expenseReport}</div>
            <TrendDown className="text-red-500" size={20} />
          </div>
          <div className="text-3xl font-bold">{settings.currency} {totalExpenses.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">{filteredExpenses.length} {t.expenses}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">{t.profitReport}</div>
            <TrendUp className={profit >= 0 ? 'text-green-500' : 'text-red-500'} size={20} />
          </div>
          <div className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {settings.currency} {profit.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((profit / totalSales) * 100).toFixed(1)}% {t.margin || 'margin'}
          </div>
        </Card>
      </div>

      {settings.businessType === 'multi-branch' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.branches} {t.salesReport}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.branchName}</TableHead>
                <TableHead>{t.salesReport}</TableHead>
                <TableHead>{t.expenseReport}</TableHead>
                <TableHead>{t.profitReport}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByBranch.map(branch => {
                const branchProfit = branch.sales - branch.expenses
                return (
                  <TableRow key={branch.name}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{settings.currency} {branch.sales.toLocaleString()}</TableCell>
                    <TableCell>{settings.currency} {branch.expenses.toLocaleString()}</TableCell>
                    <TableCell className={branchProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {settings.currency} {branchProfit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
