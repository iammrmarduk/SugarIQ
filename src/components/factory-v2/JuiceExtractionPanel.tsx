import { memo, useMemo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { ChartCard } from '../shared/ChartCard'
import { MultiLineChart } from './MultiLineChart'

interface JuiceExtractionPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

export const JuiceExtractionPanel = memo(function JuiceExtractionPanel({ data, selectedMills }: JuiceExtractionPanelProps) {
  const filtered = useMemo(
    () => data.filter(d => selectedMills.includes(d.mill)),
    [data, selectedMills],
  )

  if (filtered.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Mixed Juice Purity" subtitle="MJ pol purity over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['mjPolPurity']}
            selectedMills={selectedMills}
            yAxisLabel="MJ Purity"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="Pol Extraction" subtitle="Pol extraction percentage over season">
          <MultiLineChart
            data={filtered}
            dataKeys={['polExtraction']}
            selectedMills={selectedMills}
            yAxisLabel="Extraction %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Sucrose Extraction" subtitle="Sucrose extraction percentage">
          <MultiLineChart
            data={filtered}
            dataKeys={['sucroseExtraction']}
            selectedMills={selectedMills}
            yAxisLabel="Extraction %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
        <ChartCard title="RV/Pol Ratio" subtitle="RV as percentage of pol in cane">
          <MultiLineChart
            data={filtered}
            dataKeys={['rvPolPct']}
            selectedMills={selectedMills}
            yAxisLabel="RV/Pol %"
            yDomain={['auto', 'auto']}
          />
        </ChartCard>
      </div>
    </div>
  )
})
