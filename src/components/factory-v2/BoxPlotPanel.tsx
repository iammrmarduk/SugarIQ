import { useState, useMemo, memo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { boxPlotStats, type BoxPlotStats } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { MetricSelector } from './MetricSelector'

interface BoxPlotPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

interface MillBoxData {
  mill: number
  name: string
  color: string
  stats: BoxPlotStats
  values: number[]
}

// SVG layout constants
const MARGIN = { top: 20, right: 20, bottom: 40, left: 55 }
const SVG_HEIGHT = 250
const MIN_SVG_WIDTH = 400

export const BoxPlotPanel = memo(function BoxPlotPanel({ data, selectedMills }: BoxPlotPanelProps) {
  const [metric, setMetric] = useState<keyof R7106ExtendedRecord>('caneRvPct')
  const [hoveredMill, setHoveredMill] = useState<number | null>(null)

  // Compute box plot stats per mill for the selected metric
  const millData = useMemo<MillBoxData[]>(() => {
    return selectedMills
      .map((mill) => {
        const values = data
          .filter((d) => d.mill === mill)
          .map((d) => d[metric] as number)
          .filter((v) => typeof v === 'number' && v !== 0 && !isNaN(v))

        if (values.length < 2) return null

        return {
          mill,
          name: MILL_NAMES[mill] || `Mill ${mill}`,
          color: MILL_COLORS[mill] || '#94a3b8',
          stats: boxPlotStats(values),
          values,
        }
      })
      .filter((d): d is MillBoxData => d !== null)
  }, [data, selectedMills, metric])

  // Compute global Y range across all mills
  const { yMin, yMax } = useMemo(() => {
    if (millData.length === 0) return { yMin: 0, yMax: 100 }
    let min = Infinity
    let max = -Infinity
    for (const md of millData) {
      // Include outliers in range
      const allVals = [md.stats.min, md.stats.max, ...md.stats.outliers]
      for (const v of allVals) {
        if (v < min) min = v
        if (v > max) max = v
      }
    }
    // Add ~5% padding
    const range = max - min || 1
    return { yMin: min - range * 0.05, yMax: max + range * 0.05 }
  }, [millData])

  // Compute SVG dimensions
  const plotWidth = Math.max(MIN_SVG_WIDTH, millData.length * 80 + MARGIN.left + MARGIN.right)
  const innerWidth = plotWidth - MARGIN.left - MARGIN.right
  const innerHeight = SVG_HEIGHT - MARGIN.top - MARGIN.bottom

  // Scale helpers
  const yScale = (v: number) => {
    const ratio = (v - yMin) / (yMax - yMin || 1)
    return MARGIN.top + innerHeight * (1 - ratio)
  }

  const boxWidth = Math.min(40, Math.max(20, innerWidth / millData.length - 16))

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const count = 5
    const ticks: number[] = []
    const step = (yMax - yMin) / count
    for (let i = 0; i <= count; i++) {
      ticks.push(yMin + step * i)
    }
    return ticks
  }, [yMin, yMax])

  // Format numbers for display
  const fmt = (v: number) => {
    if (Math.abs(v) >= 1000) return v.toFixed(0)
    if (Math.abs(v) >= 10) return v.toFixed(1)
    return v.toFixed(2)
  }

  return (
    <ChartCard
      title="Distributions — Box Plot"
      action={
        <MetricSelector
          value={metric}
          onChange={setMetric}
          label="Metric"
        />
      }
    >
      {millData.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center text-sm text-slate-500">
          No data — select mills with at least 2 data points
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${plotWidth} ${SVG_HEIGHT}`}
            className="w-full"
            style={{ minWidth: MIN_SVG_WIDTH, height: SVG_HEIGHT }}
          >
            {/* Y-axis grid lines and labels */}
            {yTicks.map((tick, i) => {
              const y = yScale(tick)
              return (
                <g key={i}>
                  <line
                    x1={MARGIN.left}
                    y1={y}
                    x2={plotWidth - MARGIN.right}
                    y2={y}
                    stroke="#334155"
                    strokeWidth={0.5}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={MARGIN.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#94a3b8"
                    fontSize={10}
                  >
                    {fmt(tick)}
                  </text>
                </g>
              )
            })}

            {/* Y-axis line */}
            <line
              x1={MARGIN.left}
              y1={MARGIN.top}
              x2={MARGIN.left}
              y2={SVG_HEIGHT - MARGIN.bottom}
              stroke="#475569"
              strokeWidth={1}
            />

            {/* Box plots */}
            {millData.map((md, i) => {
              const cx =
                MARGIN.left + (innerWidth / millData.length) * (i + 0.5)
              const halfBox = boxWidth / 2

              const q1y = yScale(md.stats.q1)
              const q3y = yScale(md.stats.q3)
              const medY = yScale(md.stats.median)

              // Whisker bounds: extend to the most extreme non-outlier values
              // If no outliers, whiskers extend to min/max
              const wLow =
                md.stats.outliers.length > 0
                  ? md.values
                      .filter((v) => v >= md.stats.lowerFence)
                      .reduce((a, b) => Math.min(a, b), md.stats.q1)
                  : md.stats.min
              const wHigh =
                md.stats.outliers.length > 0
                  ? md.values
                      .filter((v) => v <= md.stats.upperFence)
                      .reduce((a, b) => Math.max(a, b), md.stats.q3)
                  : md.stats.max

              const wLowY = yScale(wLow)
              const wHighY = yScale(wHigh)

              const isHovered = hoveredMill === md.mill

              return (
                <g
                  key={md.mill}
                  onMouseEnter={() => setHoveredMill(md.mill)}
                  onMouseLeave={() => setHoveredMill(null)}
                  className="cursor-pointer"
                >
                  {/* Whisker vertical line */}
                  <line
                    x1={cx}
                    y1={wHighY}
                    x2={cx}
                    y2={wLowY}
                    stroke={md.color}
                    strokeWidth={1.5}
                  />

                  {/* Whisker caps (horizontal) */}
                  <line
                    x1={cx - halfBox * 0.4}
                    y1={wHighY}
                    x2={cx + halfBox * 0.4}
                    y2={wHighY}
                    stroke={md.color}
                    strokeWidth={1.5}
                  />
                  <line
                    x1={cx - halfBox * 0.4}
                    y1={wLowY}
                    x2={cx + halfBox * 0.4}
                    y2={wLowY}
                    stroke={md.color}
                    strokeWidth={1.5}
                  />

                  {/* Box (Q1 to Q3) */}
                  <rect
                    x={cx - halfBox}
                    y={q3y}
                    width={boxWidth}
                    height={Math.max(q1y - q3y, 1)}
                    fill={md.color}
                    fillOpacity={isHovered ? 0.5 : 0.3}
                    stroke={md.color}
                    strokeWidth={isHovered ? 2 : 1.5}
                    rx={2}
                  />

                  {/* Median line (thicker) */}
                  <line
                    x1={cx - halfBox}
                    y1={medY}
                    x2={cx + halfBox}
                    y2={medY}
                    stroke={md.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />

                  {/* Outlier dots */}
                  {md.stats.outliers.map((val, oi) => (
                    <circle
                      key={oi}
                      cx={cx}
                      cy={yScale(val)}
                      r={3}
                      fill={md.color}
                      fillOpacity={0.6}
                      stroke={md.color}
                      strokeWidth={1}
                    />
                  ))}

                  {/* Mill name label */}
                  <text
                    x={cx}
                    y={SVG_HEIGHT - MARGIN.bottom + 16}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize={10}
                    fontWeight={isHovered ? 600 : 400}
                  >
                    {md.name}
                  </text>

                  {/* Sample count below name */}
                  <text
                    x={cx}
                    y={SVG_HEIGHT - MARGIN.bottom + 28}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={8}
                  >
                    n={md.values.length}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredMill !== null && (() => {
            const md = millData.find((m) => m.mill === hoveredMill)
            if (!md) return null
            return (
              <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-slate-700/80 bg-slate-900/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
                <div
                  className="mb-1.5 font-semibold"
                  style={{ color: md.color }}
                >
                  {md.name}
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-slate-300">
                  <span className="text-slate-500">Max</span>
                  <span className="text-right font-mono">{fmt(md.stats.max)}</span>
                  <span className="text-slate-500">Q3</span>
                  <span className="text-right font-mono">{fmt(md.stats.q3)}</span>
                  <span className="text-slate-500">Median</span>
                  <span className="text-right font-mono">{fmt(md.stats.median)}</span>
                  <span className="text-slate-500">Q1</span>
                  <span className="text-right font-mono">{fmt(md.stats.q1)}</span>
                  <span className="text-slate-500">Min</span>
                  <span className="text-right font-mono">{fmt(md.stats.min)}</span>
                  <span className="text-slate-500">IQR</span>
                  <span className="text-right font-mono">{fmt(md.stats.iqr)}</span>
                  {md.stats.outliers.length > 0 && (
                    <>
                      <span className="text-slate-500">Outliers</span>
                      <span className="text-right font-mono">{md.stats.outliers.length}</span>
                    </>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </ChartCard>
  )
})
