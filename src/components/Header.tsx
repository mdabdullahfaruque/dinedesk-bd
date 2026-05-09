import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Buildings, User } from '@phosphor-icons/react'
import { Branch } from '@/lib/types'

interface HeaderProps {
  branches: Branch[]
  selectedBranchId: string | null
  onBranchChange: (branchId: string | null) => void
}

export function Header({ branches, selectedBranchId, onBranchChange }: HeaderProps) {
  const selectedBranch = selectedBranchId ? branches.find(b => b.id === selectedBranchId) : null

  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Buildings className="text-primary" size={24} weight="duotone" />
          <div>
            <p className="text-xs text-muted-foreground">Branch Filter</p>
            <Select
              value={selectedBranchId || 'all'}
              onValueChange={(value) => onBranchChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className="h-8 w-[200px] border-0 focus:ring-0 px-0 font-semibold text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
          <User size={16} weight="fill" className="text-primary" />
          <span className="text-sm font-medium">Owner</span>
        </div>
      </div>
    </div>
  )
}
