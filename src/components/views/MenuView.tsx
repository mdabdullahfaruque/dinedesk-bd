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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Star } from '@phosphor-icons/react'
import { MenuItem, MenuCategory, Branch, Settings } from '@/lib/types'
import { generateId } from '@/lib/helpers'
import { useTranslation } from '@/lib/translations'
import { toast } from 'sonner'

interface MenuViewProps {
  branches: Branch[]
  settings: Settings
}

export function MenuView({ branches, settings }: MenuViewProps) {
  const t = useTranslation(settings.language)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  const [menuItems, setMenuItems] = useKV<MenuItem[]>('menu-items', [
    {
      id: 'item-1',
      name: 'Kacchi Half',
      categoryId: 'cat-rice',
      price: 350,
      estimatedCost: 200,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: true,
      createdAt: Date.now() - 86400000 * 30
    },
    {
      id: 'item-2',
      name: 'Kacchi Full',
      categoryId: 'cat-rice',
      price: 650,
      estimatedCost: 380,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: true,
      createdAt: Date.now() - 86400000 * 30
    },
    {
      id: 'item-3',
      name: 'Chicken Roast',
      categoryId: 'cat-main',
      price: 280,
      estimatedCost: 150,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: true,
      createdAt: Date.now() - 86400000 * 25
    },
    {
      id: 'item-4',
      name: 'Beef Tehari',
      categoryId: 'cat-rice',
      price: 300,
      estimatedCost: 170,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: false,
      createdAt: Date.now() - 86400000 * 20
    },
    {
      id: 'item-5',
      name: 'Borhani',
      categoryId: 'cat-drinks',
      price: 50,
      estimatedCost: 20,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: true,
      createdAt: Date.now() - 86400000 * 20
    },
    {
      id: 'item-6',
      name: 'Firni',
      categoryId: 'cat-dessert',
      price: 80,
      estimatedCost: 35,
      availableBranches: branches.map(b => b.id),
      isActive: true,
      isPopular: false,
      createdAt: Date.now() - 86400000 * 18
    },
  ])
  
  const [categories] = useKV<MenuCategory[]>('categories', [
    { id: 'cat-rice', name: 'Rice Dishes', order: 1 },
    { id: 'cat-main', name: 'Main Course', order: 2 },
    { id: 'cat-drinks', name: 'Beverages', order: 3 },
    { id: 'cat-dessert', name: 'Desserts', order: 4 },
  ])

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const selectedBranches = branches
      .filter(b => formData.get(`branch-${b.id}`) === 'on')
      .map(b => b.id)
    
    const newItem: MenuItem = {
      id: editingItem?.id || generateId(),
      name: formData.get('name') as string,
      categoryId: formData.get('categoryId') as string,
      price: Number(formData.get('price')),
      estimatedCost: Number(formData.get('estimatedCost')),
      availableBranches: selectedBranches,
      isActive: formData.get('isActive') === 'on',
      isPopular: formData.get('isPopular') === 'on',
      createdAt: editingItem?.createdAt || Date.now()
    }
    
    if (editingItem) {
      setMenuItems(items => (items || []).map(item => item.id === editingItem.id ? newItem : item))
      toast.success(t.settingsUpdated)
    } else {
      setMenuItems(items => [...(items || []), newItem])
      toast.success(t.add)
    }
    
    setDialogOpen(false)
    setEditingItem(null)
  }

  const filteredItems = (menuItems || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{t.menuManagement}</h2>
          <p className="text-muted-foreground">{t.menuManagementDesc}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)} className="bg-accent hover:bg-accent/90">
              <Plus size={20} weight="bold" />
              {t.addMenuItem}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? t.editMenuItem : t.addMenuItem}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <Label htmlFor="name">{t.itemName}</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="categoryId">{t.category}</Label>
                <Select name="categoryId" defaultValue={editingItem?.categoryId || categories?.[0]?.id}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories || []).map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t.price} ({settings.currency})</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.price}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedCost">{t.estimatedCost} ({settings.currency})</Label>
                  <Input
                    id="estimatedCost"
                    name="estimatedCost"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.estimatedCost}
                  />
                </div>
              </div>
              
              <div>
                <Label>{t.availableBranches}</Label>
                <div className="space-y-2 mt-2">
                  {branches.map(branch => (
                    <div key={branch.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`branch-${branch.id}`}
                        name={`branch-${branch.id}`}
                        defaultChecked={editingItem?.availableBranches.includes(branch.id) ?? true}
                      />
                      <Label htmlFor={`branch-${branch.id}`} className="font-normal cursor-pointer">
                        {branch.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingItem?.isActive ?? true}
                />
                <Label htmlFor="isActive" className="font-normal cursor-pointer">
                  {t.active}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  name="isPopular"
                  defaultChecked={editingItem?.isPopular ?? false}
                />
                <Label htmlFor="isPopular" className="font-normal cursor-pointer">
                  {t.markAsPopular}
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
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allBranches}</SelectItem>
              {(categories || []).map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.estimatedCost}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t.noItemsFound}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map(item => {
                const category = (categories || []).find(c => c.id === item.categoryId)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.name}
                        {item.isPopular && (
                          <Star size={16} weight="fill" className="text-accent" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{category?.name}</TableCell>
                    <TableCell>{settings.currency} {item.price}</TableCell>
                    <TableCell>{settings.currency} {item.estimatedCost}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? t.active : t.inactive}
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
