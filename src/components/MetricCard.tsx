import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/helpers'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

interface MetricCardProps {
  title: string
  value: string | number
  prefix?: string
  trend?: number
  icon?: React.ReactNode
  onClick?: () => void
}

export function MetricCard({ title, value, prefix, trend, icon, onClick }: MetricCardProps) {
  const displayValue = typeof value === 'number' && prefix === '৳' ? formatCurrency(value) : value
  
  return (
    <Card 
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums">{displayValue}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? <ArrowUp size={16} weight="bold" /> : <ArrowDown size={16} weight="bold" />}
              <span className="font-medium">{Math.abs(trend)}%</span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-primary opacity-20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
