import { useState, useMemo, memo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { METRIC_DEFS, METRIC_MAP } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { MetricSelector } from './MetricSelector'
import { cn } from '../../lib/utils'

interface HeatmapPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Color interpolation ──────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

const COLOR_LOW = hexToRgb('#3b82f6')   // blue
const COLOR_MID = hexToRgb('#22c55e')   // green
const COLOR_HIGH = hexToRgb('#ef4444')  // red

function getColor(value: number, min: number, max: number): string {
  if (max === min) return rgbToHex(...COLOR_MID)
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))

  if (t <= 0.5) {
    // blue → green
    const s = t * 2
    return rgbToHex(
      lerp(COLOR_LOW[0], COLOR_MID[0], s),
      lerp(COLOR_LOW[1], COLOR_MID[1], s),
      lerp(COLOR_LOW[2], COLOR_MID[2], s),
    )
  }
  // green → red
  const s = (t - 0.5) * 2
  return rgbToHex(
    lerp(COLOR_MID[0], COLOR_HIGH[0], s),
    lerp(COLOR_MID[1], COLOR_HIGH[1], s),
    lerp(COLOR_MID[2], COLOR_HIGH[2], s),
  )
}

// ── Component ────────────────────────────────────────────────────────

interface HoverInfo {
  millName: string
  week: number
  value: number
  unit: string
  x: number
  y: number
}

export const HeatmapPanel = memo(function HeatmapPanel({ data, selectedMills }: HeatmapPanelProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof R7106ExtendedRecord>('caneRvPct')
  const [hover, setHover] = useState<HoverInfo | null>(null)

  const metricDef = METRIC_MAP.get(selectedMetric)
  const unit = metricDef?.unit ?? ''

  // Compute grid structure: filtered mills, sorted weeks, value lookup, min/max
  const gridData = useMemo(() => {
    const filtered = selectedMills.length > 0
      ? data.filter(r => selectedMills.includes(r.mill))
      : data

    // Unique sorted mills and weeks
    const millSet = new Set<number>()
    const weekSet = new Set<number>()
    for (const r of filtered) {
      millSet.add(r.mill)
      weekSet.add(r.week)
    }
    const mills = [...millSet].sort((a, b) => a - b)
    const weeks = [...weekSet].sort((a, b) => a - b)

    // Build value lookup: mill → week → value
    const lookup = new Map<string, number>()
    let min = Infinity
    let max = -Infinity

    for (const r of filtered) {
      const val = r[selectedMetric] as number
      if (typeof val !== 'number' || isNaN(val)) continue
      const key = `${r.mill}-${r.week}`
      lookup.set(key, val)
      if (val < min) min = val
      if (val > max) max = val
    }

    if (min === Infinity) { min = 0; max = 0 }

    return { mills, weeks, lookup, min, max }
  }, [data, selectedMills, selectedMetric])

  const { mills, weeks, lookup, min, max } = gridData

  const handleCellHover = (
    e: React.MouseEvent,
    mill: number,
    week: number,
    value: number | undefined,
  ) => {
    if (value === undefined) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const container = (e.currentTarget as HTMLElement).closest('[data-heatmap-root]')
    const containerRect = container?.getBoundingClientRect() ?? rect
    setHover({
      millName: MILL_NAMES[mill] ?? `Mill ${mill}`,
      week,
      value,
      unit,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 4,
    })
  }

  // Number of gradient stops for legend bar
  const legendStops = 5
  const legendValues = useMemo(() => {
    const vals: number[] = []
    for (let i = 0; i <= legendStops; i++) {
      vals.push(min + ((max - min) * i) / legendStops)
    }
    return vals
  }, [min, max])

  return (
    <ChartCard
      title="Heatmap"
      subtitle={metricDef ? `${metricDef.label} — Week × Mill` : 'Week × Mill'}
      action={
        <MetricSelector
          value={selectedMetric}
          onChange={setSelectedMetric}
          label="Metric"
        />
      }
    >
      {mills.length === 0 || weeks.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs text-slate-500">
          No data for selected mills
        </div>
      ) : (
        <div className="relative" data-heatmap-root>
          {/* Grid container with horizontal scroll */}
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-px">
              {/* Week header row */}
              <div className="flex items-end gap-px" style={{ paddingLeft: 80 }}>
                {weeks.map(w => (
                  <div
                    key={w}
                    className="flex items-center justify-center text-[9px] font-medium text-slate-500"
                    style={{ width: 18, height: 20 }}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Mill rows */}
              {mills.map(mill => (
                <div key={mill} className="flex items-center gap-px">
                  {/* Mill label */}
                  <div
                    className="flex items-center gap-1.5 truncate text-[10px] font-medium text-slate-300"
                    style={{ width: 80, flexShrink: 0 }}
                    title={MILL_NAMES[mill] ?? `Mill ${mill}`}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: MILL_COLORS[mill] ?? '#64748b' }}
                    />
                    <span className="truncate">{MILL_NAMES[mill] ?? `Mill ${mill}`}</span>
                  </div>

                  {/* Cells */}
                  {weeks.map(week => {
                    const key = `${mill}-${week}`
                    const value = lookup.get(key)
                    const hasValue = value !== undefined

                    return (
                      <div
                        key={key}
                        className={cn(
                          'rounded-[2px] transition-all duration-100 cursor-default',
                          hasValue
                            ? 'hover:ring-1 hover:ring-white/40 hover:scale-110 hover:z-10'
                            : 'bg-slate-800/30',
                        )}
                        style={{
                          width: 18,
                          height: 24,
                          backgroundColor: hasValue ? getColor(value, min, max) : undefined,
                          opacity: hasValue ? 0.85 : 0.3,
                        }}
                        onMouseEnter={(e) => handleCellHover(e, mill, week, value)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {hover && (
            <div
              className="pointer-events-none absolute z-50 rounded-lg border border-slate-600/80 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-sm"
              style={{
                left: hover.x,
                top: hover.y,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="text-[10px] font-semibold text-white">{hover.millName}</div>
              <div className="mt-0.5 text-[10px] text-slate-400">
                Week {hover.week}
              </div>
              <div className="mt-1 text-xs font-bold text-white">
                {hover.value.toFixed(2)}{hover.unit ? ` ${hover.unit}` : ''}
              </div>
            </div>
          )}

          {/* Color legend */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[10px] text-slate-500">Low</span>
            <div
              className="h-3 flex-1 rounded-full"
              style={{
                background: `linear-gradient(to right, #3b82f6, #22c55e 50%, #ef4444)`,
                maxWidth: 200,
              }}
            />
            <span className="text-[10px] text-slate-500">High</span>
            <div className="ml-2 flex gap-3">
              <span className="text-[10px] text-slate-500">
                {min.toFixed(1)}{unit ? ` ${unit}` : ''}
              </span>
              <span className="text-[10px] text-slate-500">—</span>
              <span className="text-[10px] text-slate-500">
                {max.toFixed(1)}{unit ? ` ${unit}` : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  )
})
