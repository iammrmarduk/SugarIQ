import { useMemo, memo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { normalizeToRange } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'

// ── Axis definitions ───────────────────────────────────────────────────

interface AxisDef {
  axis: string
  key: keyof R7106ExtendedRecord
  invert: boolean
}

const AXES: AxisDef[] = [
  { axis: 'RV%', key: 'caneRvPct', invert: false },
  { axis: 'Extraction', key: 'polExtraction', invert: false },
  { axis: 'Crush Rate', key: 'crushRate', invert: false },
  { axis: 'Time Eff', key: 'timeEfficiency', invert: false },
  { axis: 'Purity', key: 'canePurity', invert: false },
  { axis: 'Fibre', key: 'caneFibrePct', invert: true },
  { axis: 'Mech Stops', key: 'mechStopPct', invert: true },
  { axis: 'Juice Purity', key: 'mjPolPurity', invert: false },
]

// ── Props ──────────────────────────────────────────────────────────────

interface RadarPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── Component ──────────────────────────────────────────────────────────

export const RadarPanel = memo(function RadarPanel({ data, selectedMills }: RadarPanelProps) {
  const mills = selectedMills.slice(0, 4)

  const radarData = useMemo(() => {
    if (data.length === 0 || mills.length === 0) return []

    // Group records by mill and compute averages for each axis key
    const millAverages = new Map<number, Record<string, number>>()

    for (const mill of mills) {
      const records = data.filter((r) => r.mill === mill)
      if (records.length === 0) continue

      const avgs: Record<string, number> = {}
      for (const ax of AXES) {
        const sum = records.reduce((s, r) => s + (r[ax.key] as number), 0)
        avgs[ax.key] = sum / records.length
      }
      millAverages.set(mill, avgs)
    }

    if (millAverages.size === 0) return []

    // Compute min/max across all mills for each axis
    const minMax = new Map<string, { min: number; max: number }>()
    for (const ax of AXES) {
      let min = Infinity
      let max = -Infinity
      for (const avgs of millAverages.values()) {
        const v = avgs[ax.key]
        if (v < min) min = v
        if (v > max) max = v
      }
      minMax.set(ax.key, { min, max })
    }

    // Build the radar chart data array
    return AXES.map((ax) => {
      const point: Record<string, string | number> = {
        axis: ax.axis,
        fullMark: 100,
      }

      for (const mill of mills) {
        const avgs = millAverages.get(mill)
        if (!avgs) continue
        const { min, max } = minMax.get(ax.key)!
        point[`mill_${mill}`] = Math.round(
          normalizeToRange(avgs[ax.key], min, max, ax.invert) * 10,
        ) / 10
      }

      return point
    })
  }, [data, mills])

  const activeMills = mills.filter((m) =>
    radarData.length > 0 && `mill_${m}` in radarData[0],
  )

  const subtitle =
    activeMills.length > 0
      ? `Comparing ${activeMills.map((m) => MILL_NAMES[m] || `Mill ${m}`).join(', ')}`
      : 'Select mills to compare'

  return (
    <ChartCard title="Mill Profile — Radar" subtitle={subtitle}>
      {radarData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data available for selected mills
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
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
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
            />
            {activeMills.map((mill) => (
              <Radar
                key={mill}
                name={MILL_NAMES[mill] || `Mill ${mill}`}
                dataKey={`mill_${mill}`}
                stroke={MILL_COLORS[mill] || '#94a3b8'}
                fill={MILL_COLORS[mill] || '#94a3b8'}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
})
