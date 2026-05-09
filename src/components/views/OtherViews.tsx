import { Card } from '@/components/ui/card'

export function MenuView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Menu Management</h2>
        <p className="text-muted-foreground">Manage food items, categories, and pricing</p>
      </div>
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Menu management interface - Managed through POS for MVP</p>
      </Card>
    </div>
  )
}

export function InventoryView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Inventory</h2>
        <p className="text-muted-foreground">Track stock levels and manage inventory</p>
      </div>
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Inventory tracking interface</p>
      </Card>
    </div>
  )
}

export function ExpensesView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Expenses</h2>
        <p className="text-muted-foreground">Track and categorize business expenses</p>
      </div>
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Expense tracking interface</p>
      </Card>
    </div>
  )
}

export function StaffView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Staff Management</h2>
        <p className="text-muted-foreground">Manage staff members and their roles</p>
      </div>
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Staff management interface</p>
      </Card>
    </div>
  )
}

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Reports</h2>
        <p className="text-muted-foreground">View business analytics and reports</p>
      </div>
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Reports and analytics interface</p>
      </Card>
    </div>
  )
}
