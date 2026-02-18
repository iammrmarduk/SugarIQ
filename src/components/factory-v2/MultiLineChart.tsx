import { memo, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
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

interface MultiLineChartProps {
  data: R7106ExtendedRecord[]
  dataKeys: (keyof R7106ExtendedRecord)[]
  selectedMills: number[]
  title?: string
  yAxisLabel?: string
  yDomain?: [number | string, number | string]
  height?: number
}

export const MultiLineChart = memo(function MultiLineChart({
  data,
  dataKeys,
  selectedMills,
  yAxisLabel = '',
  yDomain,
  height = 300,
}: MultiLineChartProps) {
  const chartData = useMemo(() => {
    const filtered = data.filter(d => selectedMills.includes(d.mill))
    const weeks = [...new Set(filtered.map(d => d.week))].sort((a, b) => a - b)
    const mills = [...new Set(filtered.map(d => d.mill))].sort((a, b) => a - b)

    return weeks.map(week => {
      const row: Record<string, number> = { week }
      for (const mill of mills) {
        const rec = filtered.find(d => d.week === week && d.mill === mill)
        if (rec) {
          for (const key of dataKeys) {
            row[`${String(key)}_${mill}`] = rec[key] as number
          }
        }
      }
      return row
    })
  }, [data, selectedMills, dataKeys])

  const activeMills = useMemo(
    () => [...new Set(data.filter(d => selectedMills.includes(d.mill)).map(d => d.mill))].sort((a, b) => a - b),
    [data, selectedMills],
  )

  // Use first dataKey for line prefixes
  const prefix = String(dataKeys[0])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="week"
          stroke="#64748b"
          fontSize={11}
          label={{ value: 'Week', position: 'insideBottom', offset: -2, style: { fill: '#64748b', fontSize: 10 } }}
        />
        <YAxis
          stroke="#64748b"
          fontSize={11}
          domain={yDomain}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 10 } } : undefined}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#cbd5e1' }} />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {activeMills.map(mill => (
          <Line
            key={mill}
            type="monotone"
            dataKey={`${prefix}_${mill}`}
            name={MILL_NAMES[mill] || `Mill ${mill}`}
            stroke={MILL_COLORS[mill] || '#94a3b8'}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
})
