import { useState, useMemo, memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { computeHistogram } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { MetricSelector } from './MetricSelector'

interface HistogramPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

const BIN_OPTIONS = [8, 12, 16] as const

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

export const HistogramPanel = memo(function HistogramPanel({ data, selectedMills }: HistogramPanelProps) {
  const [metric, setMetric] = useState<keyof R7106ExtendedRecord>('caneRvPct')
  const [binCount, setBinCount] = useState<number>(12)

  const bins = useMemo(
    () => computeHistogram(data, metric, binCount, selectedMills),
    [data, metric, binCount, selectedMills],
  )

  // Get unique mills present in the data
  const mills = useMemo(() => {
    const millSet = new Set<number>()
    const filtered = selectedMills.length > 0
      ? data.filter((r) => selectedMills.includes(r.mill))
      : data
    for (const r of filtered) millSet.add(r.mill)
    return [...millSet].sort((a, b) => a - b)
  }, [data, selectedMills])

  // Transform histogram bins for recharts stacked bar
  const chartData = useMemo(() => {
    return bins.map((bin) => {
      const row: Record<string, number | string> = {
        label: bin.label,
        range: `${bin.binStart.toFixed(1)} — ${bin.binEnd.toFixed(1)}`,
      }
      for (const mill of mills) {
        row[`mill_${mill}`] = bin.counts[mill] ?? 0
      }
      return row
    })
  }, [bins, mills])

  return (
    <ChartCard
      title="Histogram"
      subtitle="Frequency distribution by mill"
      action={
        <div className="flex items-center gap-3">
          <MetricSelector value={metric} onChange={setMetric} label="Metric" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">Bins:</span>
            {BIN_OPTIONS.map((b) => (
              <button
                key={b}
                onClick={() => setBinCount(b)}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  binCount === b
                    ? 'bg-cane-500/20 text-cane-400 ring-1 ring-cane-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data for selected mills
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#94a3b8', fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(_, payload) => {
                const range = payload?.[0]?.payload?.range
                return range ? `Range: ${range}` : ''
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: number, name: string) => {
                const millCode = Number(name.replace('mill_', ''))
                const millName = MILL_NAMES[millCode] || name
                return [value, millName]
              }) as any}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              formatter={(value: string) => {
                const millCode = Number(value.replace('mill_', ''))
                return MILL_NAMES[millCode] || value
              }}
            />
            {mills.map((mill) => (
              <Bar
                key={`mill_${mill}`}
                dataKey={`mill_${mill}`}
                stackId="hist"
                fill={MILL_COLORS[mill] || '#94a3b8'}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
})
