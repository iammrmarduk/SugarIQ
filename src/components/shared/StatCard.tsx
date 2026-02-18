import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  iconColor?: string
  description?: string
  trend?: { value: number; positive: boolean }
  className?: string
  animate?: boolean
}

export function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor = 'text-cane-400',
  description,
  trend,
  className,
  animate = true,
}: StatCardProps) {
  const displayValue = useAnimatedCounter(value, 1500, animate)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-5',
        'transition-all duration-300 hover:border-cane-500/30 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cane-500/5 hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
          </p>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div className={cn('rounded-lg bg-slate-700/50 p-2.5', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.positive ? 'text-green-400' : 'text-red-400',
            )}
          >
            {trend.positive ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-xs text-slate-500">vs last season</span>
        </div>
      )}
      {/* Subtle gradient overlay */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cane-500/5 blur-2xl" />
    </div>
  )
}
