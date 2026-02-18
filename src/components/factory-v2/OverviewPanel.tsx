import { memo, useMemo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { ChartCard } from '../shared/ChartCard'
import { MultiLineChart } from './MultiLineChart'
import { BarComparisonChart } from './BarComparisonChart'

interface OverviewPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

export const OverviewPanel = memo(function OverviewPanel({ data, selectedMills }: OverviewPanelProps) {
  const filtered = useMemo(
    () => data.filter(d => selectedMills.includes(d.mill)),
    [data, selectedMills],
  )

  if (filtered.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="RV % Trend" subtitle="Recoverable Value percentage over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['caneRvPct']}
            selectedMills={selectedMills}
            yAxisLabel="RV %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Purity Trend" subtitle="Cane purity over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['canePurity']}
            selectedMills={selectedMills}
            yAxisLabel="Purity"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Crush Rate Trend" subtitle="Cane tonnes per hour over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['crushRate']}
            selectedMills={selectedMills}
            yAxisLabel="Crush Rate (t/hr)"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Pol Extraction Comparison" subtitle="Average pol extraction by mill">
          <BarComparisonChart
            data={filtered}
            metric="polExtraction"
            selectedMills={selectedMills}
            label="Pol Extraction"
            suffix="%"
          />
        </ChartCard>
      </div>
    </div>
  )
})
