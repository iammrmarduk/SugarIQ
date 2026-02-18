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
import { MILL_NAMES } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'

// ── Category definitions ────────────────────────────────────────────

interface TimeCategory {
  key: keyof R7106ExtendedRecord
  label: string
  color: string
}

const TIME_CATEGORIES: TimeCategory[] = [
  { key: 'millingHoursPct', label: 'Milling', color: '#22c55e' },
  { key: 'mechStopPct', label: 'Mech Stop', color: '#ef4444' },
  { key: 'noCanePct', label: 'No Cane', color: '#f59e0b' },
  { key: 'opStopPct', label: 'Op Stop', color: '#f97316' },
  { key: 'scheduledPct', label: 'Scheduled', color: '#3b82f6' },
  { key: 'foreignMatterPct', label: 'Foreign Matter', color: '#8b5cf6' },
  { key: 'engineeringPct', label: 'Engineering', color: '#06b6d4' },
  { key: 'forceMajeurePct', label: 'Force Majeure', color: '#ec4899' },
  { key: 'depitPlantPct', label: 'Depit Plant', color: '#14b8a6' },
]

// ── Tooltip style ───────────────────────────────────────────────────

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

// ── Props ───────────────────────────────────────────────────────────

interface TimeBreakdownPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Helpers ─────────────────────────────────────────────────────────

type ViewMode = 'byMill' | 'earlyVsLate'

function avg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

// ── Component ───────────────────────────────────────────────────────

export const TimeBreakdownPanel = memo(function TimeBreakdownPanel({ data, selectedMills }: TimeBreakdownPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('byMill')

  // Filter to selected mills
  const filtered = useMemo(
    () =>
      selectedMills.length > 0
        ? data.filter((r) => selectedMills.includes(r.mill))
        : data,
    [data, selectedMills],
  )

  // "By Mill" chart data — average across all weeks per mill
  const byMillData = useMemo(() => {
    const millMap = new Map<number, R7106ExtendedRecord[]>()
    for (const r of filtered) {
      const existing = millMap.get(r.mill)
      if (existing) {
        existing.push(r)
      } else {
        millMap.set(r.mill, [r])
      }
    }

    const mills = [...millMap.keys()].sort((a, b) => a - b)

    return mills.map((mill) => {
      const records = millMap.get(mill)!
      const row: Record<string, string | number> = {
        name: MILL_NAMES[mill] ?? `Mill ${mill}`,
      }
      for (const cat of TIME_CATEGORIES) {
        row[cat.key] = Number(avg(records.map((r) => r[cat.key] as number)).toFixed(2))
      }
      return row
    })
  }, [filtered])

  // "Early vs Late" chart data — first half vs second half of weeks, per mill
  const earlyVsLateData = useMemo(() => {
    // Determine the week midpoint across all filtered data
    const weeks = [...new Set(filtered.map((r) => r.week))].sort((a, b) => a - b)
    if (weeks.length === 0) return []
    const midIdx = Math.ceil(weeks.length / 2)
    const earlyWeeks = new Set(weeks.slice(0, midIdx))
    const lateWeeks = new Set(weeks.slice(midIdx))

    const millMap = new Map<number, { early: R7106ExtendedRecord[]; late: R7106ExtendedRecord[] }>()
    for (const r of filtered) {
      if (!millMap.has(r.mill)) {
        millMap.set(r.mill, { early: [], late: [] })
      }
      const bucket = millMap.get(r.mill)!
      if (earlyWeeks.has(r.week)) {
        bucket.early.push(r)
      } else if (lateWeeks.has(r.week)) {
        bucket.late.push(r)
      }
    }

    const mills = [...millMap.keys()].sort((a, b) => a - b)
    const rows: Record<string, string | number>[] = []

    for (const mill of mills) {
      const { early, late } = millMap.get(mill)!
      const millName = MILL_NAMES[mill] ?? `Mill ${mill}`

      const earlyRow: Record<string, string | number> = {
        name: `${millName} (Early)`,
      }
      const lateRow: Record<string, string | number> = {
        name: `${millName} (Late)`,
      }

      for (const cat of TIME_CATEGORIES) {
        earlyRow[cat.key] = Number(avg(early.map((r) => r[cat.key] as number)).toFixed(2))
        lateRow[cat.key] = Number(avg(late.map((r) => r[cat.key] as number)).toFixed(2))
      }

      rows.push(earlyRow, lateRow)
    }

    return rows
  }, [filtered])

  const chartData = viewMode === 'byMill' ? byMillData : earlyVsLateData

  // ── Mode toggle control ─────────────────────────────────────────

  const controls = (
    <div className="flex items-center rounded-lg border border-slate-700/50 bg-slate-900/50 p-0.5">
      <button
        onClick={() => setViewMode('byMill')}
        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          viewMode === 'byMill'
            ? 'bg-slate-700 text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        By Mill
      </button>
      <button
        onClick={() => setViewMode('earlyVsLate')}
        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          viewMode === 'earlyVsLate'
            ? 'bg-slate-700 text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        Early vs Late
      </button>
    </div>
  )

  return (
    <ChartCard
      title="Time Account Breakdown"
      subtitle="Full 9-category stop hours analysis"
      action={controls}
    >
      {chartData.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-xs text-slate-500">
          No data for selected mills
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                stroke="#475569"
                interval={0}
                angle={viewMode === 'earlyVsLate' ? -35 : 0}
                textAnchor={viewMode === 'earlyVsLate' ? 'end' : 'middle'}
                height={viewMode === 'earlyVsLate' ? 60 : 40}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                stroke="#475569"
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                label={{
                  value: '% of Total Time',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                  style: { fill: '#94a3b8', fontSize: 11 },
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: number, name: string) => {
                  const cat = TIME_CATEGORIES.find((c) => c.key === name)
                  return [`${value.toFixed(2)}%`, cat?.label ?? name]
                }) as any}
                labelStyle={{ color: '#f8fafc', fontWeight: 600, marginBottom: 4 }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                formatter={(value: string) => {
                  const cat = TIME_CATEGORIES.find((c) => c.key === value)
                  return cat?.label ?? value
                }}
              />
              {TIME_CATEGORIES.map((cat) => (
                <Bar
                  key={cat.key}
                  dataKey={cat.key}
                  stackId="time"
                  fill={cat.color}
                  name={cat.key}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  )
})
