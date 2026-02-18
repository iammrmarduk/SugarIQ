import { useState, useMemo, memo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

// ── Constants ─────────────────────────────────────────────────────────

type SubView = 'comparison' | 'trends'

interface FactorDef {
  key: keyof R7106ExtendedRecord
  label: string
  color: string
}

const DAC_FACTORS: FactorDef[] = [
  { key: 'dacFactorPol', label: 'Pol', color: '#3b82f6' },
  { key: 'dacFactorBrix', label: 'Brix', color: '#22c55e' },
  { key: 'dacFactorNonPol', label: 'Non-Pol', color: '#f59e0b' },
  { key: 'dacFactorFibre', label: 'Fibre', color: '#ef4444' },
  { key: 'dacFactorMoisture', label: 'Moisture', color: '#8b5cf6' },
]

const DARK_TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

// ── Props ─────────────────────────────────────────────────────────────

interface FactorAnalysisPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Component ─────────────────────────────────────────────────────────

export const FactorAnalysisPanel = memo(function FactorAnalysisPanel({ data, selectedMills }: FactorAnalysisPanelProps) {
  const [view, setView] = useState<SubView>('comparison')
  const [trendMill, setTrendMill] = useState<number | null>(null)

  // Resolve the active mill for trends — default to first selected
  const activeTrendMill = trendMill ?? (selectedMills.length > 0 ? selectedMills[0] : null)

  // ── Factor Comparison data: average factor values per mill ──────────

  const comparisonData = useMemo(() => {
    if (data.length === 0 || selectedMills.length === 0) return []

    return selectedMills.map((mill) => {
      const records = data.filter((r) => r.mill === mill)
      if (records.length === 0) return null

      const point: Record<string, string | number> = {
        mill: MILL_NAMES[mill] || `Mill ${mill}`,
      }

      for (const factor of DAC_FACTORS) {
        const sum = records.reduce((s, r) => s + (r[factor.key] as number), 0)
        point[factor.key] = Math.round((sum / records.length) * 1000) / 1000
      }

      return point
    }).filter(Boolean) as Record<string, string | number>[]
  }, [data, selectedMills])

  // ── Factor Trends data: weekly factor values for a single mill ─────

  const trendData = useMemo(() => {
    if (data.length === 0 || activeTrendMill === null) return []

    const records = data
      .filter((r) => r.mill === activeTrendMill)
      .sort((a, b) => a.week - b.week)

    return records.map((r) => {
      const point: Record<string, string | number> = {
        week: `Wk ${r.week}`,
      }
      for (const factor of DAC_FACTORS) {
        point[factor.key] = Math.round((r[factor.key] as number) * 1000) / 1000
      }
      return point
    })
  }, [data, activeTrendMill])

  // ── View toggle buttons ────────────────────────────────────────────

  const viewToggle = (
    <div className="flex gap-1 rounded-lg bg-slate-700/50 p-0.5">
      <button
        onClick={() => setView('comparison')}
        className={cn(
          'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
          view === 'comparison'
            ? 'bg-slate-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200',
        )}
      >
        Factor Comparison
      </button>
      <button
        onClick={() => setView('trends')}
        className={cn(
          'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
          view === 'trends'
            ? 'bg-slate-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200',
        )}
      >
        Factor Trends
      </button>
    </div>
  )

  // ── Mill selector dropdown for trends view ─────────────────────────

  const millSelector = view === 'trends' && selectedMills.length > 0 && (
    <select
      value={activeTrendMill ?? ''}
      onChange={(e) => setTrendMill(Number(e.target.value))}
      className="ml-2 rounded-md border border-slate-600 bg-slate-700 px-2 py-1 text-[11px] text-slate-200 outline-none focus:border-slate-500"
    >
      {selectedMills.map((mill) => (
        <option key={mill} value={mill}>
          {MILL_NAMES[mill] || `Mill ${mill}`}
        </option>
      ))}
    </select>
  )

  // ── Render ─────────────────────────────────────────────────────────

  const isEmpty =
    (view === 'comparison' && comparisonData.length === 0) ||
    (view === 'trends' && trendData.length === 0)

  return (
    <ChartCard
      title="DAC Factor Analysis"
      action={
        <div className="flex items-center gap-2">
          {millSelector}
          {viewToggle}
        </div>
      }
    >
      {isEmpty ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data available for selected mills
        </div>
      ) : view === 'comparison' ? (
        /* ── Factor Comparison: grouped bar chart ───────────────── */
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={comparisonData}
            margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="mill"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <Tooltip contentStyle={DARK_TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            {DAC_FACTORS.map((factor) => (
              <Bar
                key={factor.key}
                dataKey={factor.key}
                name={factor.label}
                fill={factor.color}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        /* ── Factor Trends: line chart per factor ──────────────── */
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={trendData}
            margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
          >
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
            />
            <Tooltip contentStyle={DARK_TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            {DAC_FACTORS.map((factor) => (
              <Line
                key={factor.key}
                type="monotone"
                dataKey={factor.key}
                name={factor.label}
                stroke={factor.color}
                strokeWidth={2}
                dot={{ r: 3, fill: factor.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
})
