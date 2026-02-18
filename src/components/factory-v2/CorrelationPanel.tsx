import { useMemo, useState, memo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { correlationMatrix } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

// ── Types ─────────────────────────────────────────────────────────────

interface CorrelationPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
  precomputedMatrix?: number[][] | null
  statsLoading?: boolean
}

interface HoverInfo {
  rowLabel: string
  colLabel: string
  value: number
  x: number
  y: number
}

// ── Metric definitions for the 8×8 matrix ─────────────────────────────

const METRICS: { key: keyof R7106ExtendedRecord; short: string; full: string }[] = [
  { key: 'caneRvPct',      short: 'RV%',     full: 'Cane RV %' },
  { key: 'canePurity',     short: 'Purity',  full: 'Cane Purity' },
  { key: 'polExtraction',  short: 'Extr',    full: 'Pol Extraction' },
  { key: 'crushRate',      short: 'Crush',   full: 'Crush Rate' },
  { key: 'timeEfficiency', short: 'TimeEff', full: 'Time Efficiency' },
  { key: 'mechStopPct',    short: 'MechSt',  full: 'Mechanical Stop %' },
  { key: 'caneFibrePct',   short: 'Fibre',   full: 'Cane Fibre %' },
  { key: 'weeklyRain',     short: 'Rain',    full: 'Weekly Rainfall' },
]

const METRIC_KEYS = METRICS.map(m => m.key)

// ── Color helpers ─────────────────────────────────────────────────────

/** Map correlation value [-1, 1] to a background color.
 *  Negative: blue (59,130,246) → white (255,255,255)
 *  Positive: white (255,255,255) → red (239,68,68)
 *  Diagonal (exactly 1.0 self-correlation) gets a neutral gray. */
function correlationColor(value: number, isDiagonal: boolean): string {
  if (isDiagonal) return 'rgb(100,116,139)' // slate-500

  const abs = Math.min(Math.abs(value), 1)

  if (value < 0) {
    // blue → white as value goes from -1 → 0
    const t = abs // 0 = white, 1 = full blue
    const r = Math.round(255 - (255 - 59) * t)
    const g = Math.round(255 - (255 - 130) * t)
    const b = Math.round(255 - (255 - 246) * t)
    return `rgb(${r},${g},${b})`
  }

  // white → red as value goes from 0 → 1
  const t = abs
  const r = Math.round(255 - (255 - 239) * t)
  const g = Math.round(255 - (255 - 68) * t)
  const b = Math.round(255 - (255 - 68) * t)
  return `rgb(${r},${g},${b})`
}

/** Pick white or dark text depending on background luminance. */
function textColor(value: number, isDiagonal: boolean): string {
  if (isDiagonal) return 'rgba(255,255,255,0.9)'
  // Strong correlations (|r| > 0.45) get dark backgrounds → white text
  return Math.abs(value) > 0.45 ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.9)'
}

// ── Component ─────────────────────────────────────────────────────────

const CELL_SIZE = 50

export const CorrelationPanel = memo(function CorrelationPanel({ data, selectedMills, precomputedMatrix, statsLoading }: CorrelationPanelProps) {
  const [hover, setHover] = useState<HoverInfo | null>(null)

  // Use precomputed matrix from worker if available, otherwise compute locally
  const localMatrix = useMemo(() => {
    if (precomputedMatrix !== undefined) return precomputedMatrix
    const filtered =
      selectedMills.length > 0
        ? data.filter(r => selectedMills.includes(r.mill))
        : data

    if (filtered.length === 0) return null
    return correlationMatrix(filtered, METRIC_KEYS)
  }, [data, selectedMills, precomputedMatrix])

  const matrix = localMatrix

  const handleCellHover = (
    e: React.MouseEvent,
    row: number,
    col: number,
    value: number,
  ) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const container = (e.currentTarget as HTMLElement).closest('[data-corr-root]')
    const containerRect = container?.getBoundingClientRect() ?? rect
    setHover({
      rowLabel: METRICS[row].full,
      colLabel: METRICS[col].full,
      value,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 4,
    })
  }

  return (
    <ChartCard
      title="Correlation Matrix"
      subtitle="Pearson correlation between key metrics"
    >
      {statsLoading && (
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-cane-400" />
          Computing correlations...
        </div>
      )}
      {!matrix ? (
        <div className="flex h-32 items-center justify-center text-xs text-slate-500">
          {statsLoading ? 'Computing...' : 'No data for selected mills'}
        </div>
      ) : (
        <div className="relative" data-corr-root>
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col">
              {/* Column header row */}
              <div className="flex" style={{ paddingLeft: CELL_SIZE }}>
                {METRICS.map((m, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex items-end justify-center text-center font-medium text-slate-400"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      fontSize: 10,
                      lineHeight: '12px',
                      padding: 2,
                    }}
                  >
                    {m.short}
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {METRICS.map((rowMetric, rowIdx) => (
                <div key={rowIdx} className="flex">
                  {/* Row label */}
                  <div
                    className="flex items-center justify-end pr-2 font-medium text-slate-400"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      fontSize: 10,
                      lineHeight: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {rowMetric.short}
                  </div>

                  {/* Cells */}
                  {METRICS.map((_colMetric, colIdx) => {
                    const value = matrix[rowIdx][colIdx]
                    const isDiag = rowIdx === colIdx

                    return (
                      <div
                        key={colIdx}
                        className={cn(
                          'flex items-center justify-center cursor-default',
                          'border border-slate-700/30',
                          'transition-all duration-100',
                          !isDiag && 'hover:ring-1 hover:ring-white/50 hover:z-10',
                        )}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          backgroundColor: correlationColor(value, isDiag),
                          fontSize: 10,
                          fontWeight: 600,
                          color: textColor(value, isDiag),
                        }}
                        onMouseEnter={(e) => handleCellHover(e, rowIdx, colIdx, value)}
                        onMouseLeave={() => setHover(null)}
                      >
                        {value.toFixed(2)}
                      </div>
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
              <div className="text-[10px] font-semibold text-white">
                {hover.rowLabel} vs {hover.colLabel}
              </div>
              <div className="mt-1 text-xs font-bold text-white">
                r = {hover.value.toFixed(4)}
              </div>
            </div>
          )}

          {/* Color legend */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[10px] text-slate-500">-1.0</span>
            <div
              className="h-3 flex-1 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, rgb(59,130,246), rgb(255,255,255) 50%, rgb(239,68,68))',
                maxWidth: 240,
              }}
            />
            <span className="text-[10px] text-slate-500">+1.0</span>
          </div>
        </div>
      )}
    </ChartCard>
  )
})
