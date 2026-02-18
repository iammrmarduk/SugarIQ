import { memo, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

interface BarComparisonChartProps {
  data: R7106ExtendedRecord[]
  metric: keyof R7106ExtendedRecord
  selectedMills: number[]
  label?: string
  suffix?: string
  height?: number
}

export const BarComparisonChart = memo(function BarComparisonChart({
  data,
  metric,
  selectedMills,
  label = '',
  suffix = '',
  height = 300,
}: BarComparisonChartProps) {
  const chartData = useMemo(() => {
    const filtered = data.filter(d => selectedMills.includes(d.mill))
    const mills = [...new Set(filtered.map(d => d.mill))].sort((a, b) => a - b)

    return mills.map(mill => {
      const rows = filtered.filter(d => d.mill === mill)
      const vals = rows.map(r => r[metric] as number).filter(v => v > 0)
      const avg = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
      return {
        mill,
        name: MILL_NAMES[mill] || `Mill ${mill}`,
        color: MILL_COLORS[mill] || '#94a3b8',
        value: +avg.toFixed(2),
      }
    })
  }, [data, selectedMills, metric])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={60} />
        <YAxis
          stroke="#64748b"
          fontSize={11}
          label={label ? { value: label, angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 10 } } : undefined}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: '#f8fafc' }}
          itemStyle={{ color: '#cbd5e1' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: number) => [`${value}${suffix}`, label]) as any}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map(entry => (
            <Cell key={entry.mill} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
})
