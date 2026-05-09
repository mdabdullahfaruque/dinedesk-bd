import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/helpers'
import { ArrowUp, ArrowDown, Icon } from '@phosphor-icons/react'

interface MetricCardProps {
  title: string
  value: string | number
  prefix?: string
  trend?: string
  trendUp?: boolean
  icon?: Icon
  onClick?: () => void
}

export function MetricCard({ title, value, prefix, trend, trendUp, icon: IconComponent, onClick }: MetricCardProps) {
  const displayValue = typeof value === 'number' && prefix === '৳' ? formatCurrency(value) : value
  
  return (
    <Card 
      className={`p-4 sm:p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide mb-1 sm:mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-foreground tabular-nums truncate">{displayValue}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-1 sm:mt-2 text-xs sm:text-sm ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trendUp ? <ArrowUp size={14} weight="bold" className="sm:w-4 sm:h-4" /> : <ArrowDown size={14} weight="bold" className="sm:w-4 sm:h-4" />}
              <span className="font-medium">{trend}</span>
            </div>
          )}
        </div>
        {IconComponent && (
          <div className="text-primary opacity-20 flex-shrink-0">
            <IconComponent size={32} weight="duotone" className="sm:w-10 sm:h-10" />
          </div>
        )}
      </div>
    </Card>
  )
}
