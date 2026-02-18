import { useState, useMemo, memo } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { METRIC_MAP } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { movingAverage } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { MetricSelector } from './MetricSelector'

// ── Props ──────────────────────────────────────────────────────────────

interface SeasonTrendPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Moving Average Window Options ──────────────────────────────────────

const MA_WINDOWS = [3, 5, 7] as const

// ── Component ──────────────────────────────────────────────────────────

export const SeasonTrendPanel = memo(function SeasonTrendPanel({ data, selectedMills }: SeasonTrendPanelProps) {
  const [metric, setMetric] = useState<keyof R7106ExtendedRecord>('caneRvPct')
  const [maWindow, setMaWindow] = useState<number>(5)

  const mills = selectedMills.slice(0, 4)

  const chartData = useMemo(() => {
    if (data.length === 0 || mills.length === 0) return []

    // Filter data to selected mills
    const filtered = data.filter((r) => mills.includes(r.mill))

    // Collect all unique weeks across selected mills, sorted
    const weekSet = new Set<number>()
    for (const r of filtered) {
      weekSet.add(r.week)
    }
    const weeks = [...weekSet].sort((a, b) => a - b)

    // Group records by mill
    const byMill = new Map<number, Map<number, number>>()
    for (const mill of mills) {
      const weekMap = new Map<number, number>()
      for (const r of filtered) {
        if (r.mill === mill) {
          weekMap.set(r.week, r[metric] as number)
        }
      }
      byMill.set(mill, weekMap)
    }

    // Compute moving averages per mill
    const maByMill = new Map<number, (number | null)[]>()
    for (const mill of mills) {
      const weekMap = byMill.get(mill)!
      const rawValues = weeks.map((w) => weekMap.get(w) ?? 0)
      maByMill.set(mill, movingAverage(rawValues, maWindow))
    }

    // Build chart rows: one per week, with raw_<mill> and ma_<mill> columns
    return weeks.map((week, idx) => {
      const row: Record<string, number | string | null> = { week: `W${week}` }

      for (const mill of mills) {
        const weekMap = byMill.get(mill)!
        const rawVal = weekMap.get(week)
        row[`raw_${mill}`] = rawVal !== undefined ? rawVal : null
        row[`ma_${mill}`] = maByMill.get(mill)![idx]
      }

      return row
    })
  }, [data, mills, metric, maWindow])

  const metricDef = METRIC_MAP.get(metric)
  const unit = metricDef?.unit ?? ''

  return (
    <ChartCard
      title="Season Trend"
      subtitle="Moving average trend lines"
      action={
        <div className="flex items-center gap-3">
          <MetricSelector
            value={metric}
            onChange={setMetric}
            label="Metric"
          />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">MA:</span>
            {MA_WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setMaWindow(w)}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  maWindow === w
                    ? 'bg-cane-500/20 text-cane-400 ring-1 ring-cane-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {w}w
              </button>
            ))}
          </div>
        </div>
      }
    >
      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data available for selected mills
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{
                value: unit,
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#64748b', fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />

            {mills.map((mill) => {
              const color = MILL_COLORS[mill] || '#94a3b8'
              const name = MILL_NAMES[mill] || `Mill ${mill}`

              return [
                <Line
                  key={`raw_${mill}`}
                  type="monotone"
                  dataKey={`raw_${mill}`}
                  name={`${name} (raw)`}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  dot={false}
                  connectNulls
                  legendType="none"
                />,
                <Line
                  key={`ma_${mill}`}
                  type="monotone"
                  dataKey={`ma_${mill}`}
                  name={`${name} (${maWindow}w MA)`}
                  stroke={color}
                  strokeWidth={2.5}
                  strokeOpacity={1}
                  dot={false}
                  connectNulls
                />,
              ]
            })}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
})
