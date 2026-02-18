import { memo, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { MultiLineChart } from './MultiLineChart'
import { BarComparisonChart } from './BarComparisonChart'

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

interface EfficiencyPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

export const EfficiencyPanel = memo(function EfficiencyPanel({ data, selectedMills }: EfficiencyPanelProps) {
  const filtered = useMemo(
    () => data.filter(d => selectedMills.includes(d.mill)),
    [data, selectedMills],
  )

  const stackedData = useMemo(() => {
    const mills = [...new Set(filtered.map(d => d.mill))].sort((a, b) => a - b)
    return mills.map(mill => {
      const rows = filtered.filter(d => d.mill === mill)
      const avg = (key: keyof R7106ExtendedRecord) => {
        const vals = rows.map(r => r[key] as number).filter(v => v > 0)
        return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
      }
      return {
        name: MILL_NAMES[mill] || `Mill ${mill}`,
        mill,
        color: MILL_COLORS[mill] || '#94a3b8',
        millingHrs: +(100 - avg('mechStopPct') - avg('noCanePct')).toFixed(1),
        mechStop: +avg('mechStopPct').toFixed(1),
        noCaneStop: +avg('noCanePct').toFixed(1),
      }
    })
  }, [filtered])

  if (filtered.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Time Efficiency" subtitle="Overall time efficiency percentage">
          <MultiLineChart
            data={filtered}
            dataKeys={['timeEfficiency']}
            selectedMills={selectedMills}
            yAxisLabel="Efficiency %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Crush Rate Over Season" subtitle="Cane tonnes per hour">
          <MultiLineChart
            data={filtered}
            dataKeys={['crushRate']}
            selectedMills={selectedMills}
            yAxisLabel="Crush Rate (t/hr)"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Stop Hours Breakdown" subtitle="Mech vs no-cane stop percentages by mill">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#cbd5e1' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="millingHrs" name="Milling Hrs %" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="mechStop" name="Mech Stop %" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="noCaneStop" name="No Cane Stop %" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Crush Rate Comparison" subtitle="Average crush rate by mill">
          <BarComparisonChart
            data={filtered}
            metric="crushRate"
            selectedMills={selectedMills}
            label="Crush Rate"
            suffix=" t/hr"
          />
        </ChartCard>
      </div>
    </div>
  )
})
