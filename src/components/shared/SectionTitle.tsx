import { Download } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SectionTitleProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  iconColor?: string
  className?: string
  onExport?: () => void
}

export function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'text-cane-400',
  className,
  onExport,
}: SectionTitleProps) {
  return (
    <div className={cn('mb-6 flex items-center gap-3', className)}>
      <div className={cn('rounded-lg bg-slate-800 p-2', iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cane-500/50 hover:bg-slate-700 hover:text-cane-300"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      )}
    </div>
  )
}
