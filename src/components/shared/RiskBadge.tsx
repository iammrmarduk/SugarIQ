import { cn, getRiskColor, getRiskDotColor } from '../../lib/utils'

interface RiskBadgeProps {
  level: 'critical' | 'high' | 'moderate' | 'low'
  className?: string
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        getRiskColor(level),
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', getRiskDotColor(level))} />
      {level}
    </span>
  )
}
