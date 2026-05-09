import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Buildings, User, List } from '@phosphor-icons/react'
import { Branch, Settings } from '@/lib/types'
import { useTranslation } from '@/lib/translations'

interface HeaderProps {
  branches: Branch[]
  selectedBranchId: string | null
  onBranchChange: (branchId: string | null) => void
  settings: Settings
  onMobileMenuToggle: () => void
}

export function Header({ branches, selectedBranchId, onBranchChange, settings, onMobileMenuToggle }: HeaderProps) {
  const t = useTranslation(settings.language)
  const selectedBranch = selectedBranchId ? branches.find(b => b.id === selectedBranchId) : null

  return (
    <div className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden text-foreground hover:text-primary p-2 -ml-2"
        >
          <List size={24} />
        </button>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Buildings className="text-primary hidden sm:block flex-shrink-0" size={24} weight="duotone" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground hidden sm:block">{t.branchFilter}</p>
            <Select
              value={selectedBranchId || 'all'}
              onValueChange={(value) => onBranchChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className="h-8 w-full sm:w-[200px] border-0 focus:ring-0 px-0 font-semibold text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allBranches}</SelectItem>
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
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-secondary">
          <User size={16} weight="fill" className="text-primary" />
          <span className="text-sm font-medium hidden sm:inline">{t.owner}</span>
        </div>
      </div>
    </div>
  )
}
