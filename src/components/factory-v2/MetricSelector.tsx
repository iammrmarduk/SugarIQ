import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { METRIC_DEFS } from '../../lib/r7106-extended'

interface MetricSelectorProps {
  value: keyof R7106ExtendedRecord
  onChange: (key: keyof R7106ExtendedRecord) => void
  label?: string
}

// Group metrics by section for a cleaner dropdown
const sections = [...new Set(METRIC_DEFS.map((d) => d.section))]

export function MetricSelector({ value, onChange, label }: MetricSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="text-[10px] font-medium text-slate-500">{label}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as keyof R7106ExtendedRecord)}
        className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:border-cane-500/50 focus:outline-none"
      >
        {sections.map((section) => (
          <optgroup key={section} label={section}>
            {METRIC_DEFS.filter((d) => d.section === section).map((d) => (
              <option key={d.key} value={d.key}>
                {d.shortLabel}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
