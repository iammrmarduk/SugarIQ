import { memo } from 'react'
import { cn } from '../../lib/utils'

// ── Panel definitions ──────────────────────────────────────────────────

export interface PanelDef {
  id: string
  label: string
  defaultOn: boolean
}

export const PANELS: PanelDef[] = [
  { id: 'overview',     label: 'Overview',       defaultOn: true },
  { id: 'cane',         label: 'Cane Analysis',  defaultOn: false },
  { id: 'juice',        label: 'Juice & Extr',   defaultOn: false },
  { id: 'efficiency',   label: 'Efficiency',     defaultOn: false },
  { id: 'millcompare',  label: 'Mill Compare',   defaultOn: false },
  { id: 'insights',     label: 'AI Insights',    defaultOn: true },
  { id: 'heatmap',      label: 'Heatmap',        defaultOn: true },
  { id: 'radar',        label: 'Mill Radar',     defaultOn: true },
  { id: 'scatter',      label: 'Scatter',        defaultOn: true },
  { id: 'boxplot',      label: 'Box Plot',       defaultOn: false },
  { id: 'anomaly',      label: 'Anomalies',      defaultOn: false },
  { id: 'seasontrend',  label: 'Season Trend',   defaultOn: true },
  { id: 'massbalance',  label: 'Mass Balance',   defaultOn: false },
  { id: 'factors',      label: 'DAC Factors',    defaultOn: false },
  { id: 'timeaccount',  label: 'Time Account',   defaultOn: false },
  { id: 'puritydiffs',  label: 'Purity Diffs',   defaultOn: false },
  { id: 'corrmatrix',   label: 'Corr Matrix',    defaultOn: false },
  { id: 'histogram',    label: 'Histogram',      defaultOn: false },
]

// ── Presets ─────────────────────────────────────────────────────────────

interface Preset {
  label: string
  ids: Set<string> | 'all' | 'none'
}

const ESSENTIALS = new Set(PANELS.filter((p) => p.defaultOn).map((p) => p.id))
const QUALITY = new Set(['overview', 'cane', 'juice', 'insights', 'heatmap', 'radar', 'boxplot', 'anomaly', 'puritydiffs', 'corrmatrix'])
const EFFICIENCY = new Set(['overview', 'efficiency', 'insights', 'heatmap', 'seasontrend', 'timeaccount', 'scatter', 'factors', 'anomaly'])

const PRESETS: Preset[] = [
  { label: 'All On', ids: 'all' },
  { label: 'All Off', ids: 'none' },
  { label: 'Essentials', ids: ESSENTIALS },
  { label: 'Quality Focus', ids: QUALITY },
  { label: 'Efficiency Focus', ids: EFFICIENCY },
]

// ── Props ───────────────────────────────────────────────────────────────

interface PanelToolbarProps {
  activeIds: Set<string>
  onToggle: (id: string) => void
  onPreset: (ids: Set<string>) => void
}

// ── Component ──────────────────────────────────────────────────────────

export const PanelToolbar = memo(function PanelToolbar({ activeIds, onToggle, onPreset }: PanelToolbarProps) {
  const handlePreset = (preset: Preset) => {
    if (preset.ids === 'all') {
      onPreset(new Set(PANELS.map((p) => p.id)))
    } else if (preset.ids === 'none') {
      onPreset(new Set())
    } else {
      onPreset(preset.ids)
    }
  }

  return (
    <div className="space-y-2">
      {/* Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Presets
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset)}
            className="rounded-md border border-slate-700/50 px-2 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-700/50 hover:text-slate-200"
          >
            {preset.label}
          </button>
        ))}
        <span className="ml-2 text-[10px] text-slate-600">
          {activeIds.size}/{PANELS.length} panels
        </span>
      </div>

      {/* Panel toggle pills */}
      <div className="flex flex-wrap gap-1.5">
        {PANELS.map((panel) => {
          const isActive = activeIds.has(panel.id)
          return (
            <button
              key={panel.id}
              onClick={() => onToggle(panel.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                isActive
                  ? 'bg-cane-500/20 text-cane-400 ring-1 ring-cane-500/30'
                  : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50 hover:text-slate-300',
              )}
            >
              {panel.label}
            </button>
          )
        })}
      </div>
    </div>
  )
})
