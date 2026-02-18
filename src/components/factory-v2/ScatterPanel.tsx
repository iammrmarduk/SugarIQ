import { useState, useMemo, memo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import { type R7106ExtendedRecord, METRIC_MAP } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { linearRegression } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { MetricSelector } from './MetricSelector'

// ── Preset scatter pairs ─────────────────────────────────────────────

interface ScatterPreset {
  label: string
  xKey: keyof R7106ExtendedRecord
  yKey: keyof R7106ExtendedRecord
}

const SCATTER_PRESETS: ScatterPreset[] = [
  { label: 'Rain vs Crush Rate', xKey: 'weeklyRain', yKey: 'crushRate' },
  { label: 'Fibre vs Extraction', xKey: 'caneFibrePct', yKey: 'polExtraction' },
  { label: 'RV vs Suc Extraction', xKey: 'caneRvPct', yKey: 'sucroseExtraction' },
  { label: 'Crush Rate vs Time Efficiency', xKey: 'crushRate', yKey: 'timeEfficiency' },
  { label: 'Purity vs RV', xKey: 'canePurity', yKey: 'caneRvPct' },
]

// ── Props ────────────────────────────────────────────────────────────

interface ScatterPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Tooltip style ────────────────────────────────────────────────────

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

// ── Component ────────────────────────────────────────────────────────

export const ScatterPanel = memo(function ScatterPanel({ data, selectedMills }: ScatterPanelProps) {
  const [presetIdx, setPresetIdx] = useState(0)
  const [customMode, setCustomMode] = useState(false)
  const [customX, setCustomX] = useState<keyof R7106ExtendedRecord>('weeklyRain')
  const [customY, setCustomY] = useState<keyof R7106ExtendedRecord>('crushRate')

  const xKey = customMode ? customX : SCATTER_PRESETS[presetIdx].xKey
  const yKey = customMode ? customY : SCATTER_PRESETS[presetIdx].yKey

  const xMeta = METRIC_MAP.get(xKey)
  const yMeta = METRIC_MAP.get(yKey)

  const xLabel = xMeta?.shortLabel ?? String(xKey)
  const yLabel = yMeta?.shortLabel ?? String(yKey)
  const xUnit = xMeta?.unit ?? ''
  const yUnit = yMeta?.unit ?? ''

  // Filter data to selected mills
  const filtered = useMemo(
    () => data.filter((d) => selectedMills.includes(d.mill)),
    [data, selectedMills],
  )

  // Build scatter points with mill metadata
  const points = useMemo(() => {
    return filtered
      .map((d) => ({
        x: d[xKey] as number,
        y: d[yKey] as number,
        mill: d.mill,
        millName: d.millName,
        week: d.week,
      }))
      .filter((p) => typeof p.x === 'number' && typeof p.y === 'number' && p.x !== 0 && p.y !== 0)
  }, [filtered, xKey, yKey])

  // Linear regression
  const regression = useMemo(() => {
    if (points.length < 2) return null
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    return linearRegression(xs, ys)
  }, [points])

  // Compute two endpoints for the regression line segment
  const regressionSegment = useMemo(() => {
    if (!regression || points.length < 2) return null
    const xs = points.map((p) => p.x)
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    return {
      x1: xMin,
      y1: regression.slope * xMin + regression.intercept,
      x2: xMax,
      y2: regression.slope * xMax + regression.intercept,
    }
  }, [regression, points])

  const r2Display = regression ? regression.r2.toFixed(3) : '—'
  const subtitle = `${xLabel} vs ${yLabel}  |  R² = ${r2Display}`

  // ── Preset / Custom controls ─────────────────────────────────────

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={customMode ? 'custom' : String(presetIdx)}
        onChange={(e) => {
          if (e.target.value === 'custom') {
            setCustomMode(true)
          } else {
            setCustomMode(false)
            setPresetIdx(Number(e.target.value))
          }
        }}
        className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:border-cane-500/50 focus:outline-none"
      >
        {SCATTER_PRESETS.map((p, i) => (
          <option key={i} value={String(i)}>
            {p.label}
          </option>
        ))}
        <option value="custom">Custom...</option>
      </select>

      {customMode && (
        <>
          <MetricSelector label="X" value={customX} onChange={setCustomX} />
          <MetricSelector label="Y" value={customY} onChange={setCustomY} />
        </>
      )}
    </div>
  )

  return (
    <ChartCard title="Scatter — Correlations" subtitle={subtitle} action={controls}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              unit={xUnit ? ` ${xUnit}` : ''}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              stroke="#475569"
              label={{
                value: `${xLabel}${xUnit ? ` (${xUnit})` : ''}`,
                position: 'insideBottom',
                offset: -10,
                style: { fill: '#94a3b8', fontSize: 11 },
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              unit={yUnit ? ` ${yUnit}` : ''}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              stroke="#475569"
              label={{
                value: `${yLabel}${yUnit ? ` (${yUnit})` : ''}`,
                angle: -90,
                position: 'insideLeft',
                offset: 5,
                style: { fill: '#94a3b8', fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null
                const pt = payload[0]?.payload as (typeof points)[number] | undefined
                if (!pt) return null
                return (
                  <div style={TOOLTIP_STYLE} className="px-3 py-2">
                    <p className="font-semibold" style={{ color: MILL_COLORS[pt.mill] || '#f8fafc' }}>
                      {pt.millName}
                    </p>
                    <p className="text-slate-300">Week {pt.week}</p>
                    <p>
                      {xLabel}: {pt.x.toFixed(2)}
                      {xUnit ? ` ${xUnit}` : ''}
                    </p>
                    <p>
                      {yLabel}: {pt.y.toFixed(2)}
                      {yUnit ? ` ${yUnit}` : ''}
                    </p>
                  </div>
                )
              }}
            />

            {/* Regression line as a reference line segment */}
            {regressionSegment && (
              <ReferenceLine
                segment={[
                  { x: regressionSegment.x1, y: regressionSegment.y1 },
                  { x: regressionSegment.x2, y: regressionSegment.y2 },
                ]}
                stroke="#facc15"
                strokeWidth={2}
                strokeDasharray="6 3"
                ifOverflow="extendDomain"
              />
            )}

            <Scatter data={points} isAnimationActive={false}>
              {points.map((pt, idx) => (
                <Cell
                  key={idx}
                  fill={MILL_COLORS[pt.mill] || '#64748b'}
                  fillOpacity={0.75}
                  r={4}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Mill colour legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {selectedMills.map((mill) => (
          <span key={mill} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: MILL_COLORS[mill] || '#64748b' }}
            />
            {MILL_NAMES[mill] || `Mill ${mill}`}
          </span>
        ))}
      </div>
    </ChartCard>
  )
})
