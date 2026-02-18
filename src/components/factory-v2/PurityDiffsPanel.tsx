import { useMemo, memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'

interface PurityDiffsPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// Waterfall step colors
const COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  total: '#3b82f6',
  hidden: 'transparent',
}

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

interface WaterfallStep {
  name: string
  value: number        // actual value
  hidden: number       // invisible base for waterfall effect
  display: number      // visible bar height (absolute)
  isLoss: boolean
  isTotal: boolean
}

export const PurityDiffsPanel = memo(function PurityDiffsPanel({ data, selectedMills }: PurityDiffsPanelProps) {
  const chartData = useMemo<WaterfallStep[]>(() => {
    const filtered = selectedMills.length > 0
      ? data.filter((r) => selectedMills.includes(r.mill))
      : data

    if (filtered.length === 0) return []

    // Compute averages
    const avg = (key: keyof R7106ExtendedRecord) => {
      const vals = filtered.map((r) => r[key] as number).filter((v) => v !== 0)
      return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    }

    const mjPurity = avg('mjPolPurity')
    const bagPurity = avg('bagPolPurity')
    const mudPurity = avg('mudPolPurity')
    const dacPurity = avg('dacPurity')

    // Compute losses
    const bagLoss = bagPurity > 0 ? -(mjPurity - bagPurity) * 0.3 : 0  // weighted estimate
    const mudLoss = mudPurity > 0 ? -(mjPurity - mudPurity) * 0.05 : 0 // weighted estimate
    const otherLoss = dacPurity - mjPurity - bagLoss - mudLoss

    // Build waterfall steps
    const steps: WaterfallStep[] = []
    let running = mjPurity

    steps.push({
      name: 'MJ Purity',
      value: mjPurity,
      hidden: 0,
      display: mjPurity,
      isLoss: false,
      isTotal: true,
    })

    // Bagasse loss
    steps.push({
      name: 'Bagasse Loss',
      value: bagLoss,
      hidden: running + bagLoss,
      display: Math.abs(bagLoss),
      isLoss: bagLoss < 0,
      isTotal: false,
    })
    running += bagLoss

    // Mud loss
    steps.push({
      name: 'Mud Loss',
      value: mudLoss,
      hidden: running + mudLoss,
      display: Math.abs(mudLoss),
      isLoss: mudLoss < 0,
      isTotal: false,
    })
    running += mudLoss

    // Other / adjustment
    steps.push({
      name: 'Other Adj.',
      value: otherLoss,
      hidden: otherLoss < 0 ? running + otherLoss : running,
      display: Math.abs(otherLoss),
      isLoss: otherLoss < 0,
      isTotal: false,
    })
    running += otherLoss

    // DAC Purity (final)
    steps.push({
      name: 'DAC Purity',
      value: dacPurity,
      hidden: 0,
      display: dacPurity,
      isLoss: false,
      isTotal: true,
    })

    return steps
  }, [data, selectedMills])

  const subtitle = selectedMills.length > 0
    ? `Purity flow: ${selectedMills.map((m) => MILL_NAMES[m] || `Mill ${m}`).join(', ')}`
    : 'Purity flow: All mills'

  return (
    <ChartCard
      title="Purity Waterfall"
      subtitle={subtitle}
    >
      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data available for selected mills
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: number, name: string) => {
                if (name === 'hidden') return [null, null]
                return [value.toFixed(2), 'Value']
              }) as any}
            />
            <ReferenceLine y={0} stroke="#64748b" />

            {/* Hidden base bar for waterfall effect */}
            <Bar dataKey="hidden" stackId="waterfall" fill="transparent" isAnimationActive={false} />

            {/* Visible bar */}
            <Bar dataKey="display" stackId="waterfall" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {chartData.map((step, idx) => (
                <Cell
                  key={idx}
                  fill={step.isTotal ? COLORS.total : step.isLoss ? COLORS.negative : COLORS.positive}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded" style={{ backgroundColor: COLORS.total }} />
          Total
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded" style={{ backgroundColor: COLORS.negative }} />
          Loss
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded" style={{ backgroundColor: COLORS.positive }} />
          Gain
        </span>
      </div>
    </ChartCard>
  )
})
