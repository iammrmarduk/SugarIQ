import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function ChartCard({ title, subtitle, children, className, action }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700/50 bg-slate-800/50 p-5',
        'transition-all duration-300 hover:border-slate-600/50',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
