import { useMemo, useState, memo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_COLORS } from '../../lib/r7106-data'
import { detectAnomalies, type Anomaly } from '../../lib/r7106-stats'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

// ── Metric keys to scan ────────────────────────────────────────────────

const ANOMALY_METRICS: { key: keyof R7106ExtendedRecord; label: string }[] = [
  { key: 'caneRvPct', label: 'RV %' },
  { key: 'canePurity', label: 'Purity' },
  { key: 'canePolPct', label: 'Pol %' },
  { key: 'caneFibrePct', label: 'Fibre %' },
  { key: 'mjPolPurity', label: 'MJ Purity' },
  { key: 'polExtraction', label: 'Pol Extraction' },
  { key: 'sucroseExtraction', label: 'Suc Extraction' },
  { key: 'crushRate', label: 'Crush Rate' },
  { key: 'fibreCrushRate', label: 'Fibre Crush' },
  { key: 'timeEfficiency', label: 'Time Eff' },
  { key: 'mechStopPct', label: 'Mech Stop %' },
  { key: 'noCanePct', label: 'No Cane %' },
  { key: 'bagPolPct', label: 'Bag Pol %' },
  { key: 'weeklyRain', label: 'Rainfall' },
  { key: 'rvPolPct', label: 'RV/Pol' },
]

// ── Sortable column keys ───────────────────────────────────────────────

type SortKey = 'severity' | 'millName' | 'week' | 'metricLabel' | 'value' | 'zScore' | 'method'

const COLUMNS: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'severity', label: 'Severity' },
  { key: 'millName', label: 'Mill' },
  { key: 'week', label: 'Week', align: 'right' },
  { key: 'metricLabel', label: 'Metric' },
  { key: 'value', label: 'Value', align: 'right' },
  { key: 'zScore', label: 'Z-Score', align: 'right' },
  { key: 'method', label: 'Method' },
]

const PAGE_SIZE = 50

// ── Props ──────────────────────────────────────────────────────────────

interface AnomalyPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
  precomputedAnomalies?: Anomaly[]
  statsLoading?: boolean
}

// ── Component ──────────────────────────────────────────────────────────

export const AnomalyPanel = memo(function AnomalyPanel({ data, selectedMills, precomputedAnomalies, statsLoading }: AnomalyPanelProps) {
  const [sortKey, setSortKey] = useState<SortKey>('severity')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Filter data to selected mills (only needed if no precomputed data)
  const filtered = useMemo(
    () =>
      selectedMills.length > 0
        ? data.filter((r) => selectedMills.includes(r.mill))
        : data,
    [data, selectedMills],
  )

  // Use precomputed anomalies from worker if available, otherwise compute locally
  const anomalies = useMemo(
    () => precomputedAnomalies ?? detectAnomalies(filtered, ANOMALY_METRICS),
    [precomputedAnomalies, filtered],
  )

  // Sort anomalies
  const sorted = useMemo(() => {
    const arr = [...anomalies]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'severity':
          cmp = severityRank(a.severity) - severityRank(b.severity)
          break
        case 'millName':
          cmp = a.millName.localeCompare(b.millName)
          break
        case 'week':
          cmp = a.week - b.week
          break
        case 'metricLabel':
          cmp = a.metricLabel.localeCompare(b.metricLabel)
          break
        case 'value':
          cmp = a.value - b.value
          break
        case 'zScore':
          cmp = Math.abs(a.zScore) - Math.abs(b.zScore)
          break
        case 'method':
          cmp = a.method.localeCompare(b.method)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [anomalies, sortKey, sortDir])

  // Summary counts
  const totalCount = anomalies.length
  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length
  const warningCount = anomalies.filter((a) => a.severity === 'warning').length
  const zScoreCount = anomalies.filter((a) => a.method === 'z-score').length
  const iqrCount = anomalies.filter((a) => a.method === 'iqr').length

  // Visible rows
  const visibleRows = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleShowMore() {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, sorted.length))
  }

  return (
    <ChartCard
      title="Anomaly Detection"
      subtitle="Z-score & IQR outlier detection"
    >
      {statsLoading && (
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-cane-400" />
          Computing anomalies...
        </div>
      )}
      {/* Summary bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-slate-700/60 px-3 py-1 text-xs font-medium text-slate-200">
          {totalCount} anomalies
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-950/60 px-3 py-1 text-xs font-medium text-red-400">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          {criticalCount} critical
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-950/60 px-3 py-1 text-xs font-medium text-amber-400">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          {warningCount} warning
        </span>
        <span className="rounded-md bg-slate-700/40 px-3 py-1 text-xs text-slate-400">
          Z-score: {zScoreCount}
        </span>
        <span className="rounded-md bg-slate-700/40 px-3 py-1 text-xs text-slate-400">
          IQR: {iqrCount}
        </span>
      </div>

      {/* Table */}
      {anomalies.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          No anomalies detected in selected data
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/60">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      'cursor-pointer select-none whitespace-nowrap px-3 py-2 font-medium text-slate-400 transition-colors hover:text-slate-200',
                      col.align === 'right' && 'text-right',
                    )}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-1 text-slate-500">
                        {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((a, idx) => (
                <tr
                  key={`${a.mill}-${a.week}-${a.metric}-${a.method}-${idx}`}
                  className={cn(
                    'border-b border-slate-700/30 transition-colors',
                    a.severity === 'critical'
                      ? 'bg-red-950/20 hover:bg-red-950/30'
                      : 'bg-amber-950/10 hover:bg-amber-950/20',
                  )}
                >
                  {/* Severity */}
                  <td className="px-3 py-2">
                    <SeverityIcon severity={a.severity} />
                  </td>
                  {/* Mill */}
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: MILL_COLORS[a.mill] || '#94a3b8',
                        }}
                      />
                      <span className="text-slate-200">{a.millName}</span>
                    </span>
                  </td>
                  {/* Week */}
                  <td className="px-3 py-2 text-right text-slate-300">
                    {a.week}
                  </td>
                  {/* Metric */}
                  <td className="px-3 py-2 text-slate-300">
                    {a.metricLabel}
                  </td>
                  {/* Value */}
                  <td className="px-3 py-2 text-right font-mono text-slate-200">
                    {a.value.toFixed(2)}
                  </td>
                  {/* Z-Score */}
                  <td
                    className={cn(
                      'px-3 py-2 text-right font-mono',
                      Math.abs(a.zScore) > 3.5
                        ? 'text-red-400'
                        : Math.abs(a.zScore) > 2.5
                          ? 'text-amber-400'
                          : 'text-slate-400',
                    )}
                  >
                    {a.zScore >= 0 ? '+' : ''}
                    {a.zScore.toFixed(2)}
                  </td>
                  {/* Method */}
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        'inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                        a.method === 'z-score'
                          ? 'bg-sky-950/60 text-sky-400'
                          : 'bg-violet-950/60 text-violet-400',
                      )}
                    >
                      {a.method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show more button */}
          {hasMore && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={handleShowMore}
                className="rounded-md border border-slate-600 bg-slate-700/50 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-700 hover:text-white"
              >
                Show more ({sorted.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </ChartCard>
  )
})

// ── Helpers ────────────────────────────────────────────────────────────

function severityRank(severity: Anomaly['severity']): number {
  return severity === 'critical' ? 0 : 1
}

function SeverityIcon({ severity }: { severity: Anomaly['severity'] }) {
  if (severity === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 text-red-400" title="Critical">
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-400" title="Warning">
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  )
}
