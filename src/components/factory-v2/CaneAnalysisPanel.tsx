import { memo, useMemo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { ChartCard } from '../shared/ChartCard'
import { MultiLineChart } from './MultiLineChart'
import { BarComparisonChart } from './BarComparisonChart'

interface CaneAnalysisPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

export const CaneAnalysisPanel = memo(function CaneAnalysisPanel({ data, selectedMills }: CaneAnalysisPanelProps) {
  const filtered = useMemo(
    () => data.filter(d => selectedMills.includes(d.mill)),
    [data, selectedMills],
  )

  if (filtered.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pol %" subtitle="Cane pol percentage over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['canePolPct']}
            selectedMills={selectedMills}
            yAxisLabel="Pol %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Brix %" subtitle="Cane brix percentage over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['caneBrixPct']}
            selectedMills={selectedMills}
            yAxisLabel="Brix %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Fibre %" subtitle="Cane fibre percentage">
          <MultiLineChart
            data={filtered}
            dataKeys={['caneFibrePct']}
            selectedMills={selectedMills}
            yAxisLabel="Fibre %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Cane Tonnage Comparison" subtitle="Average cane tonnage by mill">
          <BarComparisonChart
            data={filtered}
            metric="caneTons"
            selectedMills={selectedMills}
            label="Cane (t)"
            suffix=" t"
          />
        </ChartCard>
      </div>
    </div>
  )
})
