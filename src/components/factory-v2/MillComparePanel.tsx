import { memo, useMemo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

interface MillComparePanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

interface MillSummary {
  mill: number
  name: string
  color: string
  totalCane: number
  rvPct: number
  polPct: number
  brixPct: number
  fibrePct: number
  purity: number
  polExtraction: number
  sucroseExtraction: number
  crushRate: number
  timeEfficiency: number
  mechStopPct: number
  noCanePct: number
}

export const MillComparePanel = memo(function MillComparePanel({ data, selectedMills }: MillComparePanelProps) {
  const compareMills = useMemo((): MillSummary[] => {
    const filtered = data.filter(d => selectedMills.includes(d.mill))
    const mills = [...new Set(filtered.map(d => d.mill))].sort((a, b) => a - b)

    return mills.map(mill => {
      const rows = filtered.filter(d => d.mill === mill)
      const avg = (key: keyof R7106ExtendedRecord) => {
        const vals = rows.map(r => r[key] as number).filter(v => v > 0)
        return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
      }
      return {
        mill,
        name: MILL_NAMES[mill] || `Mill ${mill}`,
        color: MILL_COLORS[mill] || '#94a3b8',
        totalCane: Math.round(rows.reduce((s, r) => s + r.caneTons, 0)),
        rvPct: +avg('caneRvPct').toFixed(2),
        polPct: +avg('canePolPct').toFixed(2),
        brixPct: +avg('caneBrixPct').toFixed(2),
        fibrePct: +avg('caneFibrePct').toFixed(2),
        purity: +avg('canePurity').toFixed(1),
        polExtraction: +avg('polExtraction').toFixed(1),
        sucroseExtraction: +avg('sucroseExtraction').toFixed(1),
        crushRate: Math.round(avg('crushRate')),
        timeEfficiency: +avg('timeEfficiency').toFixed(1),
        mechStopPct: +avg('mechStopPct').toFixed(1),
        noCanePct: +avg('noCanePct').toFixed(1),
      }
    })
  }, [data, selectedMills])

  if (compareMills.length === 0) {
    return (
      <ChartCard title="Mill Comparison" subtitle="Side-by-side metrics across mills">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 text-center">
          <p className="text-sm text-slate-400">Select at least one mill to compare</p>
        </div>
      </ChartCard>
    )
  }

  const metrics: { label: string; key: keyof MillSummary; suffix: string; higher: 'good' | 'bad' | 'neutral' }[] = [
    { label: 'Total Cane (t)', key: 'totalCane', suffix: '', higher: 'neutral' },
    { label: 'Avg RV %', key: 'rvPct', suffix: '%', higher: 'good' },
    { label: 'Avg Pol %', key: 'polPct', suffix: '%', higher: 'good' },
    { label: 'Avg Brix %', key: 'brixPct', suffix: '%', higher: 'neutral' },
    { label: 'Avg Fibre %', key: 'fibrePct', suffix: '%', higher: 'neutral' },
    { label: 'Avg Purity', key: 'purity', suffix: '', higher: 'good' },
    { label: 'Pol Extraction', key: 'polExtraction', suffix: '%', higher: 'good' },
    { label: 'Suc Extraction', key: 'sucroseExtraction', suffix: '%', higher: 'good' },
    { label: 'Crush Rate', key: 'crushRate', suffix: ' t/hr', higher: 'good' },
    { label: 'Time Efficiency', key: 'timeEfficiency', suffix: '%', higher: 'good' },
    { label: 'Mech Stop %', key: 'mechStopPct', suffix: '%', higher: 'bad' },
    { label: 'No Cane Stop %', key: 'noCanePct', suffix: '%', higher: 'bad' },
  ]

  return (
    <ChartCard title="Mill Comparison" subtitle="Side-by-side metrics across mills">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Metric</th>
              {compareMills.map(m => (
                <th key={m.mill} className="px-3 py-2 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, i) => {
              const values = compareMills.map(m => m[metric.key] as number)
              const max = Math.max(...values)
              const min = Math.min(...values)
              return (
                <tr key={metric.key} className={cn('border-t border-slate-700/30', i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40')}>
                  <td className="px-3 py-2 font-medium text-slate-300">{metric.label}</td>
                  {compareMills.map(m => {
                    const val = m[metric.key] as number
                    const isBest = metric.higher === 'good' ? val === max : metric.higher === 'bad' ? val === min : false
                    const isWorst = metric.higher === 'good' ? val === min : metric.higher === 'bad' ? val === max : false
                    return (
                      <td key={m.mill} className={cn('px-3 py-2 font-mono text-slate-200', isBest && 'text-green-400', isWorst && compareMills.length > 1 && 'text-red-400')}>
                        {typeof val === 'number' ? val.toLocaleString() : val}{metric.suffix}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
})
