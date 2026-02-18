import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import {
  BarChart3, Upload, Filter, TrendingUp, TrendingDown,
  Zap, Droplets, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Loader2, Database, HardDrive,
} from 'lucide-react'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'
import {
  type R7106Record,
  r7106SampleData,
  MILL_NAMES,
  MILL_COLORS,
  parseR7106CSV as parseR7106CSVLegacy,
} from '../../lib/r7106-data'
import {
  parseR7106XLSX,
  parseR7106CSV as parseR7106CSVExtended,
  computeChecksum,
} from '../../lib/r7106-extended'
import { extendedToV1, v1ToExtended } from '../../lib/r7106-adapter'
import {
  saveDataset,
  loadLatestDataset,
  loadDataset,
  listDatasets,
  type StoredDataset,
} from '../../lib/idb-store'

type ViewTab = 'overview' | 'cane' | 'juice' | 'efficiency' | 'compare'

const VIEW_TABS: { id: ViewTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'cane', label: 'Cane Analysis' },
  { id: 'juice', label: 'Juice & Extraction' },
  { id: 'efficiency', label: 'Efficiency' },
  { id: 'compare', label: 'Mill Compare' },
]

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

const ALL_MILL_CODES = [61, 62, 65, 66, 70, 71, 72, 73, 75, 77, 79, 80]

// ─── Insight Generation ──────────────────────────────────────────────

function generateInsights(data: R7106Record[], selectedMills: number[]): string[] {
  if (data.length === 0) return []

  const insights: string[] = []
  const filtered = data.filter(d => selectedMills.includes(d.mill))
  if (filtered.length === 0) return ['No data for selected mills']

  // Group by mill
  const byMill = new Map<number, R7106Record[]>()
  for (const r of filtered) {
    const arr = byMill.get(r.mill) || []
    arr.push(r)
    byMill.set(r.mill, arr)
  }

  // Average RV by mill
  const avgRV = [...byMill.entries()].map(([mill, rows]) => ({
    mill,
    name: MILL_NAMES[mill] || `Mill ${mill}`,
    avgRV: rows.reduce((s, r) => s + r.rvPercent, 0) / rows.length,
  })).sort((a, b) => b.avgRV - a.avgRV)

  if (avgRV.length >= 2) {
    const best = avgRV[0]
    const worst = avgRV[avgRV.length - 1]
    insights.push(
      `${best.name} has the highest average RV at ${best.avgRV.toFixed(1)}%, while ${worst.name} trails at ${worst.avgRV.toFixed(1)}%`
    )
  }

  // Extraction comparison
  const avgExtraction = [...byMill.entries()].map(([mill, rows]) => ({
    mill,
    name: MILL_NAMES[mill] || `Mill ${mill}`,
    avgExtraction: rows.reduce((s, r) => s + r.polExtraction, 0) / rows.length,
  })).sort((a, b) => b.avgExtraction - a.avgExtraction)

  if (avgExtraction.length >= 2) {
    const best = avgExtraction[0]
    const worst = avgExtraction[avgExtraction.length - 1]
    if (best.avgExtraction > 0 && worst.avgExtraction > 0) {
      insights.push(
        `Best pol extraction: ${best.name} at ${best.avgExtraction.toFixed(1)}% — worst: ${worst.name} at ${worst.avgExtraction.toFixed(1)}%`
      )
    }
  }

  // Trend detection — find declining RV for any mill
  for (const [mill, rows] of byMill) {
    const sorted = [...rows].sort((a, b) => a.week - b.week)
    if (sorted.length < 4) continue

    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2))
    const avgFirst = firstHalf.reduce((s, r) => s + r.rvPercent, 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((s, r) => s + r.rvPercent, 0) / secondHalf.length

    if (avgFirst > 0 && avgSecond > 0 && avgFirst - avgSecond > 1.0) {
      insights.push(
        `${MILL_NAMES[mill]}'s RV declined from ${avgFirst.toFixed(1)}% (early season) to ${avgSecond.toFixed(1)}% (late season) — investigate`
      )
    }
  }

  // Mechanical stop hours outlier
  const avgMech = [...byMill.entries()].map(([mill, rows]) => ({
    mill,
    name: MILL_NAMES[mill] || `Mill ${mill}`,
    avgMech: rows.reduce((s, r) => s + r.mechStopPercent, 0) / rows.length,
  }))
  const fleetAvgMech = avgMech.reduce((s, m) => s + m.avgMech, 0) / avgMech.length
  for (const m of avgMech) {
    if (m.avgMech > fleetAvgMech * 1.8 && m.avgMech > 2) {
      insights.push(
        `${m.name}'s mechanical stop hours (${m.avgMech.toFixed(1)}%) are ${(m.avgMech / fleetAvgMech).toFixed(1)}x the fleet average (${fleetAvgMech.toFixed(1)}%)`
      )
    }
  }

  // Rain impact — weeks with high rain and low crush rate
  const weekData = new Map<number, { rain: number; crush: number; count: number }>()
  for (const r of filtered) {
    const wd = weekData.get(r.week) || { rain: 0, crush: 0, count: 0 }
    wd.rain += r.weeklyRain
    wd.crush += r.crushRate
    wd.count++
    weekData.set(r.week, wd)
  }
  for (const [week, wd] of weekData) {
    const avgRain = wd.rain / wd.count
    const avgCrush = wd.crush / wd.count
    if (avgRain > 30 && avgCrush > 0) {
      const overallAvgCrush = filtered.reduce((s, r) => s + r.crushRate, 0) / filtered.length
      if (avgCrush < overallAvgCrush * 0.85) {
        insights.push(
          `Week ${week}: heavy rain (${avgRain.toFixed(0)}mm avg) caused crush rate dips — ${avgCrush.toFixed(0)} t/hr vs ${overallAvgCrush.toFixed(0)} t/hr average`
        )
      }
    }
  }

  // Crush rate comparison
  const avgCrushByMill = [...byMill.entries()].map(([mill, rows]) => ({
    mill,
    name: MILL_NAMES[mill] || `Mill ${mill}`,
    avgCrush: rows.reduce((s, r) => s + r.crushRate, 0) / rows.length,
  })).sort((a, b) => b.avgCrush - a.avgCrush)

  if (avgCrushByMill.length >= 2 && avgCrushByMill[0].avgCrush > 0) {
    insights.push(
      `Highest throughput: ${avgCrushByMill[0].name} at ${avgCrushByMill[0].avgCrush.toFixed(0)} t/hr crush rate`
    )
  }

  return insights.slice(0, 6)
}

// ─── Component ───────────────────────────────────────────────────────

export function FactoryDashboard() {
  const [data, setData] = useState<R7106Record[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [selectedMills, setSelectedMills] = useState<number[]>([])
  const [weekRange, setWeekRange] = useState<[number, number]>([2, 43])
  const [activeView, setActiveView] = useState<ViewTab>('overview')
  const [csvText, setCsvText] = useState('')
  const [tableExpanded, setTableExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedDatasets, setSavedDatasets] = useState<Pick<StoredDataset, 'id' | 'fileName' | 'uploadedAt'>[]>([])
  const [showDatasets, setShowDatasets] = useState(false)
  const [dataSource, setDataSource] = useState<'none' | 'upload' | 'cache' | 'sample'>('none')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── IDB: auto-load latest dataset on mount ──
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const latest = await loadLatestDataset()
        if (cancelled || !latest) return
        const v1Records = extendedToV1(latest.records)
        setData(v1Records)
        setDataSource('cache')
        const mills = [...new Set(v1Records.map(d => d.mill))].sort((a, b) => a - b)
        setSelectedMills(mills.slice(0, 4))
        if (v1Records.length > 0) {
          const weeks = v1Records.map(d => d.week)
          setWeekRange([Math.min(...weeks), Math.max(...weeks)])
        }
      } catch { /* IndexedDB unavailable */ }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Refresh saved datasets list
  const refreshDatasetList = useCallback(async () => {
    try {
      const list = await listDatasets()
      setSavedDatasets(list)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    refreshDatasetList()
  }, [refreshDatasetList])

  // Filtered data based on selected mills and week range
  const filteredData = useMemo(() => {
    return data.filter(d =>
      selectedMills.includes(d.mill) &&
      d.week >= weekRange[0] &&
      d.week <= weekRange[1]
    )
  }, [data, selectedMills, weekRange])

  // Available mills in the dataset
  const availableMills = useMemo(() => {
    return [...new Set(data.map(d => d.mill))].sort((a, b) => a - b)
  }, [data])

  // Week bounds in data
  const weekBounds = useMemo(() => {
    if (data.length === 0) return { min: 2, max: 43 }
    const weeks = data.map(d => d.week)
    return { min: Math.min(...weeks), max: Math.max(...weeks) }
  }, [data])

  // Summary stats
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null
    const totalCane = filteredData.reduce((s, r) => s + r.caneTons, 0)
    const avgRV = filteredData.reduce((s, r) => s + r.rvPercent, 0) / filteredData.length
    const avgExtraction = filteredData.filter(r => r.polExtraction > 0).reduce((s, r, _, a) => s + r.polExtraction / a.length, 0)
    const avgCrush = filteredData.filter(r => r.crushRate > 0).reduce((s, r, _, a) => s + r.crushRate / a.length, 0)
    return { totalCane: Math.round(totalCane), avgRV: +avgRV.toFixed(2), avgExtraction: +avgExtraction.toFixed(1), avgCrush: Math.round(avgCrush) }
  }, [filteredData])

  // Insights
  const insights = useMemo(() => generateInsights(data, selectedMills), [data, selectedMills])

  // Chart data: metric over weeks, one line per mill
  const weeklyByMill = useMemo(() => {
    const weeks = [...new Set(filteredData.map(d => d.week))].sort((a, b) => a - b)
    const mills = [...new Set(filteredData.map(d => d.mill))].sort((a, b) => a - b)

    return weeks.map(week => {
      const row: Record<string, number> = { week }
      for (const mill of mills) {
        const records = filteredData.filter(d => d.week === week && d.mill === mill)
        if (records.length > 0) {
          const r = records[0]
          row[`rv_${mill}`] = r.rvPercent
          row[`pol_${mill}`] = r.polPercent
          row[`brix_${mill}`] = r.brixPercent
          row[`fibre_${mill}`] = r.fibrePercent
          row[`moisture_${mill}`] = r.moisturePercent
          row[`sucrose_${mill}`] = r.sucrosePercent
          row[`purity_${mill}`] = r.purityPercent
          row[`cane_${mill}`] = r.caneTons
          row[`mjPurity_${mill}`] = r.mjPurity
          row[`polExtraction_${mill}`] = r.polExtraction
          row[`sucroseExtraction_${mill}`] = r.sucroseExtraction
          row[`rvPol_${mill}`] = r.rvPolPercent
          row[`crushRate_${mill}`] = r.crushRate
          row[`timeEff_${mill}`] = r.timeEfficiency
          row[`millingHrs_${mill}`] = r.millingHoursPercent
          row[`mechStop_${mill}`] = r.mechStopPercent
          row[`noCaneStop_${mill}`] = r.noCaneStopPercent
          row[`opStop_${mill}`] = r.opStopPercent
          row[`rain_${mill}`] = r.weeklyRain
        }
      }
      return row
    })
  }, [filteredData])

  // Mill comparison data (avg across all weeks for each mill)
  const millComparison = useMemo(() => {
    const mills = [...new Set(filteredData.map(d => d.mill))].sort((a, b) => a - b)
    return mills.map(mill => {
      const rows = filteredData.filter(d => d.mill === mill)
      const avg = (key: keyof R7106Record) => {
        const vals = rows.map(r => r[key] as number).filter(v => v > 0)
        return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
      }
      return {
        mill,
        name: MILL_NAMES[mill] || `Mill ${mill}`,
        color: MILL_COLORS[mill] || '#94a3b8',
        rvPercent: +avg('rvPercent').toFixed(2),
        polPercent: +avg('polPercent').toFixed(2),
        brixPercent: +avg('brixPercent').toFixed(2),
        fibrePercent: +avg('fibrePercent').toFixed(2),
        purityPercent: +avg('purityPercent').toFixed(1),
        polExtraction: +avg('polExtraction').toFixed(1),
        sucroseExtraction: +avg('sucroseExtraction').toFixed(1),
        crushRate: Math.round(avg('crushRate')),
        timeEfficiency: +avg('timeEfficiency').toFixed(1),
        mechStopPercent: +avg('mechStopPercent').toFixed(1),
        noCaneStopPercent: +avg('noCaneStopPercent').toFixed(1),
        totalCane: Math.round(rows.reduce((s, r) => s + r.caneTons, 0)),
      }
    })
  }, [filteredData])

  // Active selected mills for lines
  const activeMills = useMemo(() =>
    [...new Set(filteredData.map(d => d.mill))].sort((a, b) => a - b),
    [filteredData]
  )

  // ── Helpers ──

  const applyV1Data = useCallback((records: R7106Record[], ws: string[], source: 'upload' | 'cache' | 'sample') => {
    setData(records)
    setWarnings(ws)
    setDataSource(source)
    if (records.length > 0) {
      const mills = [...new Set(records.map(d => d.mill))].sort((a, b) => a - b)
      setSelectedMills(mills.slice(0, 4))
      const weeks = records.map(d => d.week)
      setWeekRange([Math.min(...weeks), Math.max(...weeks)])
    }
  }, [])

  // ── Handlers ──

  const handleLoadSample = useCallback(() => {
    setLoading(true)
    setTimeout(async () => {
      applyV1Data(r7106SampleData, [], 'sample')
      // Also persist sample data to IDB so V2 can read it
      try {
        const extended = v1ToExtended(r7106SampleData)
        const cs = computeChecksum(extended)
        await saveDataset('2025-season-sample.csv', extended, cs, 'v1')
        refreshDatasetList()
      } catch { /* ignore */ }
      setLoading(false)
    }, 100)
  }, [applyV1Data, refreshDatasetList])

  const handleParseCsvText = useCallback((text: string) => {
    const result = parseR7106CSVLegacy(text)
    applyV1Data(result.data, result.warnings, 'upload')
    // Persist to IDB
    if (result.data.length > 0) {
      const extended = v1ToExtended(result.data)
      const cs = computeChecksum(extended)
      saveDataset('pasted-csv.csv', extended, cs, 'v1').then(() => refreshDatasetList()).catch(() => {})
    }
  }, [applyV1Data, refreshDatasetList])

  const handleFileUpload = useCallback(async (file: File) => {
    setLoading(true)
    setWarnings([])
    try {
      const ext = file.name.split('.').pop()?.toLowerCase()

      if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer()
        const result = parseR7106XLSX(buffer)
        const v1Records = extendedToV1(result.records)
        applyV1Data(v1Records, result.warnings, 'upload')
        // Already in extended format, save directly
        try {
          await saveDataset(file.name, result.records, result.checksum, 'v1')
          refreshDatasetList()
        } catch { /* ignore */ }
      } else {
        // CSV — try extended parser first, fall back to legacy
        const text = await file.text()
        const extResult = parseR7106CSVExtended(text)
        if (extResult.records.length > 0) {
          const v1Records = extendedToV1(extResult.records)
          applyV1Data(v1Records, extResult.warnings, 'upload')
          try {
            await saveDataset(file.name, extResult.records, extResult.checksum, 'v1')
            refreshDatasetList()
          } catch { /* ignore */ }
        } else {
          // Fall back to legacy parser
          const legacyResult = parseR7106CSVLegacy(text)
          applyV1Data(legacyResult.data, legacyResult.warnings, 'upload')
          if (legacyResult.data.length > 0) {
            const extended = v1ToExtended(legacyResult.data)
            const cs = computeChecksum(extended)
            try {
              await saveDataset(file.name, extended, cs, 'v1')
              refreshDatasetList()
            } catch { /* ignore */ }
          }
        }
      }
    } catch (err) {
      setWarnings([`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setLoading(false)
    }
  }, [applyV1Data, refreshDatasetList])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleFileUpload])

  const handleLoadSavedDataset = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const ds = await loadDataset(id)
      if (ds) {
        const v1Records = extendedToV1(ds.records)
        applyV1Data(v1Records, [], 'cache')
      }
    } catch {
      setWarnings(['Failed to load saved dataset'])
    } finally {
      setLoading(false)
      setShowDatasets(false)
    }
  }, [applyV1Data])

  const toggleMill = (mill: number) => {
    setSelectedMills(prev =>
      prev.includes(mill) ? prev.filter(m => m !== mill) : [...prev, mill]
    )
  }

  const selectAllMills = () => setSelectedMills([...availableMills])
  const clearMills = () => setSelectedMills([])

  // ── Render helpers ──

  function renderMultiLineChart(
    metricPrefix: string,
    label: string,
    yDomain?: [number | string, number | string],
    height = 300,
  ) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={weeklyByMill}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="week" stroke="#64748b" fontSize={11} label={{ value: 'Week', position: 'insideBottom', offset: -2, style: { fill: '#64748b', fontSize: 10 } }} />
          <YAxis stroke="#64748b" fontSize={11} domain={yDomain} label={{ value: label, angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 10 } }} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#cbd5e1' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {activeMills.map(mill => (
            <Line
              key={mill}
              type="monotone"
              dataKey={`${metricPrefix}_${mill}`}
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
  }

  function renderBarComparison(dataKey: string, label: string, suffix = '') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={millComparison}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={60} />
          <YAxis stroke="#64748b" fontSize={11} label={{ value: label, angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 10 } }} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#cbd5e1' }} // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: number) => [`${value}${suffix}`, label]) as any} />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {millComparison.map((entry) => (
              <Cell key={entry.mill} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // ── View renderers ──

  function renderOverview() {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cane Tonnage by Week" subtitle="Weekly cane crushed per mill">
            {renderMultiLineChart('cane', 'Tonnes')}
          </ChartCard>
          <ChartCard title="RV % Trend" subtitle="Recoverable Value percentage over season">
            {renderMultiLineChart('rv', 'RV %', ['auto', 'auto'])}
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Pol Extraction Comparison" subtitle="Average pol extraction by mill">
            {renderBarComparison('polExtraction', 'Pol Extraction', '%')}
          </ChartCard>
          <ChartCard title="Crush Rate Comparison" subtitle="Average cane crush rate (t/hr)">
            {renderBarComparison('crushRate', 'Crush Rate', ' t/hr')}
          </ChartCard>
        </div>
      </div>
    )
  }

  function renderCane() {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Pol %" subtitle="Cane pol percentage over season">
            {renderMultiLineChart('pol', 'Pol %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="Brix %" subtitle="Cane brix percentage over season">
            {renderMultiLineChart('brix', 'Brix %', ['auto', 'auto'])}
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Fibre %" subtitle="Cane fibre percentage">
            {renderMultiLineChart('fibre', 'Fibre %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="Purity %" subtitle="Cane purity percentage">
            {renderMultiLineChart('purity', 'Purity %', ['auto', 'auto'])}
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="RV %" subtitle="Recoverable value percentage">
            {renderMultiLineChart('rv', 'RV %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="Sucrose %" subtitle="Cane sucrose percentage">
            {renderMultiLineChart('sucrose', 'Sucrose %', ['auto', 'auto'])}
          </ChartCard>
        </div>
      </div>
    )
  }

  function renderJuice() {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Mixed Juice Purity" subtitle="MJ pol purity over season">
            {renderMultiLineChart('mjPurity', 'MJ Purity %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="Pol Extraction" subtitle="Pol extraction percentage">
            {renderMultiLineChart('polExtraction', 'Extraction %', ['auto', 'auto'])}
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Sucrose Extraction" subtitle="Sucrose extraction percentage">
            {renderMultiLineChart('sucroseExtraction', 'Extraction %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="RV/Pol Ratio" subtitle="RV as percentage of pol in cane">
            {renderMultiLineChart('rvPol', 'RV/Pol %', ['auto', 'auto'])}
          </ChartCard>
        </div>
      </div>
    )
  }

  function renderEfficiency() {
    // Build stacked bar data for time breakdown
    const stackedData = millComparison.map(m => ({
      name: m.name,
      mill: m.mill,
      millingHrs: +(100 - m.mechStopPercent - m.noCaneStopPercent).toFixed(1),
      mechStop: m.mechStopPercent,
      noCaneStop: m.noCaneStopPercent,
    }))

    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Time Efficiency" subtitle="Overall time efficiency percentage">
            {renderMultiLineChart('timeEff', 'Efficiency %', ['auto', 'auto'])}
          </ChartCard>
          <ChartCard title="Crush Rate Over Season" subtitle="Cane tonnes per hour">
            {renderMultiLineChart('crushRate', 'Crush Rate (t/hr)', ['auto', 'auto'])}
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
          <ChartCard title="Rainfall vs Crush Rate" subtitle="Impact of weekly rain on throughput">
            {renderMultiLineChart('rain', 'Rain (mm)', ['auto', 'auto'])}
          </ChartCard>
        </div>
      </div>
    )
  }

  function renderCompare() {
    // Show side-by-side stat cards for selected mills (up to 4)
    const compareMills = millComparison.slice(0, 4)

    if (compareMills.length === 0) {
      return (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-8 text-center">
          <p className="text-sm text-slate-400">Select at least one mill to compare</p>
        </div>
      )
    }

    const metrics: { label: string; key: keyof typeof compareMills[0]; suffix: string; higher: 'good' | 'bad' | 'neutral' }[] = [
      { label: 'Total Cane (t)', key: 'totalCane', suffix: '', higher: 'neutral' },
      { label: 'Avg RV %', key: 'rvPercent', suffix: '%', higher: 'good' },
      { label: 'Avg Pol %', key: 'polPercent', suffix: '%', higher: 'good' },
      { label: 'Avg Brix %', key: 'brixPercent', suffix: '%', higher: 'neutral' },
      { label: 'Avg Fibre %', key: 'fibrePercent', suffix: '%', higher: 'neutral' },
      { label: 'Avg Purity %', key: 'purityPercent', suffix: '%', higher: 'good' },
      { label: 'Pol Extraction', key: 'polExtraction', suffix: '%', higher: 'good' },
      { label: 'Suc Extraction', key: 'sucroseExtraction', suffix: '%', higher: 'good' },
      { label: 'Crush Rate', key: 'crushRate', suffix: ' t/hr', higher: 'good' },
      { label: 'Time Efficiency', key: 'timeEfficiency', suffix: '%', higher: 'good' },
      { label: 'Mech Stop %', key: 'mechStopPercent', suffix: '%', higher: 'bad' },
      { label: 'No Cane Stop %', key: 'noCaneStopPercent', suffix: '%', higher: 'bad' },
    ]

    return (
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
    )
  }

  // ── Main render ──

  return (
    <AnimatedPanel>
      <div className="space-y-6">
        {/* Header */}
        <StaggerChild index={0}>
          <SectionTitle
            icon={BarChart3}
            title="Factory Performance"
            subtitle="R7106 Factory Statistics — 2025 Season"
          />
        </StaggerChild>

        {/* Upload / Load */}
        {data.length === 0 && (
          <StaggerChild index={1}>
            <ChartCard title="Load R7106 Data" subtitle="Upload XLSX/CSV or use the built-in 2025 season dataset">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Drop zone */}
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-600/50 bg-slate-900/30 p-6 transition-colors hover:border-cane-500/50 cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-slate-500" />
                  <p className="text-xs text-slate-400 text-center">
                    Drag & drop R7106 XLSX or CSV
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Supports SASA R7106 format (XLSX & CSV)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.txt"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>

                {/* Paste + Load Sample + Saved Datasets */}
                <div className="space-y-2">
                  <textarea
                    className="h-24 w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus:border-cane-500/50 focus:outline-none"
                    placeholder="Paste R7106 CSV data here..."
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleParseCsvText(csvText)}
                      disabled={!csvText.trim()}
                      className="rounded-lg bg-cane-500/20 px-3 py-1.5 text-xs font-medium text-cane-400 transition-colors hover:bg-cane-500/30 disabled:opacity-40"
                    >
                      Parse CSV
                    </button>
                    <button
                      onClick={handleLoadSample}
                      disabled={loading}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/80"
                    >
                      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                      Load 2025 Season Data
                    </button>
                    {/* Saved datasets dropdown */}
                    {savedDatasets.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setShowDatasets(p => !p)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
                        >
                          <HardDrive className="h-3 w-3" />
                          Saved ({savedDatasets.length})
                          <ChevronDown className={cn('h-3 w-3 transition-transform', showDatasets && 'rotate-180')} />
                        </button>
                        {showDatasets && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-xl">
                            {savedDatasets.map(ds => (
                              <button
                                key={ds.id}
                                onClick={() => ds.id != null && handleLoadSavedDataset(ds.id)}
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                              >
                                <Database className="h-3 w-3 shrink-0 text-slate-500" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium text-slate-200">{ds.fileName}</div>
                                  <div className="text-[10px] text-slate-500">
                                    {new Date(ds.uploadedAt).toLocaleDateString()} {new Date(ds.uploadedAt).toLocaleTimeString()}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="mt-3 rounded-lg border border-amber-800/30 bg-amber-950/20 px-3 py-2">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-[11px] text-amber-400">{w}</p>
                  ))}
                </div>
              )}
            </ChartCard>
          </StaggerChild>
        )}

        {/* Data loaded — show dashboard */}
        {data.length > 0 && (
          <>
            {/* Filters */}
            <StaggerChild index={1}>
              <div className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                {/* Data source + dataset selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-md bg-emerald-950/50 px-3 py-1.5 text-xs font-medium text-emerald-400">
                    <Database className="h-3.5 w-3.5" />
                    {data.length} records
                  </span>
                  {dataSource === 'cache' && (
                    <span className="flex items-center gap-1.5 rounded-md bg-sky-950/50 px-2.5 py-1.5 text-[11px] text-sky-400">
                      <HardDrive className="h-3 w-3" />
                      From cache
                    </span>
                  )}
                  {savedDatasets.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowDatasets(p => !p)}
                        className="flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-slate-800/80 px-2.5 py-1.5 text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      >
                        <HardDrive className="h-3 w-3" />
                        Saved ({savedDatasets.length})
                        <ChevronDown className={cn('h-3 w-3 transition-transform', showDatasets && 'rotate-180')} />
                      </button>
                      {showDatasets && (
                        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-xl">
                          {savedDatasets.map(ds => (
                            <button
                              key={ds.id}
                              onClick={() => ds.id != null && handleLoadSavedDataset(ds.id)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                            >
                              <Database className="h-3 w-3 shrink-0 text-slate-500" />
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium text-slate-200">{ds.fileName}</div>
                                <div className="text-[10px] text-slate-500">
                                  {new Date(ds.uploadedAt).toLocaleDateString()} {new Date(ds.uploadedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Mill multi-select */}
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Mills:</span>
                  {availableMills.map(mill => {
                    const selected = selectedMills.includes(mill)
                    return (
                      <button
                        key={mill}
                        onClick={() => toggleMill(mill)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
                          selected
                            ? 'text-white shadow-sm'
                            : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300',
                        )}
                        style={selected ? { backgroundColor: MILL_COLORS[mill] || '#64748b' } : undefined}
                      >
                        {MILL_NAMES[mill] || mill}
                      </button>
                    )
                  })}
                  <div className="ml-1 flex gap-1">
                    <button onClick={selectAllMills} className="rounded px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-slate-300">
                      All
                    </button>
                    <button onClick={clearMills} className="rounded px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-slate-300">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Week range + View tabs */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Weeks:</span>
                    <input
                      type="number"
                      min={weekBounds.min}
                      max={weekRange[1]}
                      value={weekRange[0]}
                      onChange={(e) => setWeekRange([+e.target.value, weekRange[1]])}
                      className="w-14 rounded border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:border-cane-500/50 focus:outline-none"
                    />
                    <span className="text-xs text-slate-600">to</span>
                    <input
                      type="number"
                      min={weekRange[0]}
                      max={weekBounds.max}
                      value={weekRange[1]}
                      onChange={(e) => setWeekRange([weekRange[0], +e.target.value])}
                      className="w-14 rounded border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:border-cane-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="mx-2 h-4 w-px bg-slate-700" />

                  <div className="flex gap-1">
                    {VIEW_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                          activeView === tab.id
                            ? 'bg-cane-500/20 text-cane-400'
                            : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300',
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="ml-auto text-[11px] text-slate-500">
                    {filteredData.length} of {data.length} records
                  </span>
                </div>
              </div>
            </StaggerChild>

            {/* Stat Cards */}
            {stats && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StaggerChild index={2}>
                  <StatCard
                    title="Total Cane"
                    value={stats.totalCane}
                    suffix=" t"
                    icon={TrendingUp}
                    iconColor="text-green-400"
                    description={`${selectedMills.length} mills, weeks ${weekRange[0]}–${weekRange[1]}`}
                  />
                </StaggerChild>
                <StaggerChild index={3}>
                  <StatCard
                    title="Avg RV"
                    value={stats.avgRV}
                    suffix="%"
                    icon={Zap}
                    iconColor="text-amber-400"
                    description="Recoverable value"
                  />
                </StaggerChild>
                <StaggerChild index={4}>
                  <StatCard
                    title="Avg Extraction"
                    value={stats.avgExtraction}
                    suffix="%"
                    icon={Filter}
                    iconColor="text-blue-400"
                    description="Pol extraction"
                  />
                </StaggerChild>
                <StaggerChild index={5}>
                  <StatCard
                    title="Avg Crush Rate"
                    value={stats.avgCrush}
                    suffix=" t/hr"
                    icon={BarChart3}
                    iconColor="text-purple-400"
                    description="Cane crush per hour"
                  />
                </StaggerChild>
              </div>
            )}

            {/* Charts — view-dependent */}
            <StaggerChild index={6}>
              {activeView === 'overview' && renderOverview()}
              {activeView === 'cane' && renderCane()}
              {activeView === 'juice' && renderJuice()}
              {activeView === 'efficiency' && renderEfficiency()}
              {activeView === 'compare' && renderCompare()}
            </StaggerChild>

            {/* AI Insights */}
            {insights.length > 0 && (
              <StaggerChild index={7}>
                <ChartCard title="AI Insights" subtitle="Auto-generated observations from the filtered data">
                  <div className="space-y-2">
                    {insights.map((insight, i) => {
                      const isWarning = insight.includes('declined') || insight.includes('investigate') || insight.includes('stop hours')
                      const isPositive = insight.includes('highest') || insight.includes('Best') || insight.includes('throughput')
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex items-start gap-2 rounded-lg border px-3 py-2',
                            isWarning ? 'border-amber-800/30 bg-amber-950/20' :
                            isPositive ? 'border-green-800/30 bg-green-950/20' :
                            'border-slate-700/30 bg-slate-800/30',
                          )}
                        >
                          {isWarning ? (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                          ) : isPositive ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                          ) : (
                            <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                          )}
                          <p className="text-xs text-slate-300">{insight}</p>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>
              </StaggerChild>
            )}

            {/* Data Table */}
            <StaggerChild index={8}>
              <ChartCard
                title="Data Table"
                subtitle={`${filteredData.length} records`}
                action={
                  <button
                    onClick={() => setTableExpanded(!tableExpanded)}
                    className="flex items-center gap-1 rounded-lg bg-slate-700/50 px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                  >
                    {tableExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {tableExpanded ? 'Collapse' : 'Expand'}
                  </button>
                }
              >
                <div className={cn('overflow-auto rounded-lg border border-slate-700/50', tableExpanded ? 'max-h-[600px]' : 'max-h-[320px]')}>
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-800 text-slate-400">
                      <tr>
                        <th className="px-2 py-2 font-medium">Mill</th>
                        <th className="px-2 py-2 font-medium">Wk</th>
                        <th className="px-2 py-2 font-medium">Cane (t)</th>
                        <th className="px-2 py-2 font-medium">Pol%</th>
                        <th className="px-2 py-2 font-medium">Brix%</th>
                        <th className="px-2 py-2 font-medium">Fibre%</th>
                        <th className="px-2 py-2 font-medium">RV%</th>
                        <th className="px-2 py-2 font-medium">Purity%</th>
                        <th className="px-2 py-2 font-medium">Extr%</th>
                        <th className="px-2 py-2 font-medium">Crush</th>
                        <th className="px-2 py-2 font-medium">T-Eff%</th>
                        <th className="px-2 py-2 font-medium">Rain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((r, i) => (
                        <tr
                          key={`${r.mill}-${r.week}-${r.tandem}`}
                          className={cn(
                            'border-t border-slate-700/30 transition-colors',
                            i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40',
                          )}
                        >
                          <td className="whitespace-nowrap px-2 py-1.5">
                            <span className="inline-flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MILL_COLORS[r.mill] || '#64748b' }} />
                              <span className="text-slate-300">{r.millName}</span>
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-slate-400">{r.week}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.caneTons.toLocaleString()}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.polPercent}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.brixPercent}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.fibrePercent}</td>
                          <td className={cn('px-2 py-1.5 font-mono', r.rvPercent < 10 ? 'text-red-400' : r.rvPercent > 12 ? 'text-green-400' : 'text-slate-300')}>
                            {r.rvPercent}
                          </td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.purityPercent}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.polExtraction}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.crushRate}</td>
                          <td className="px-2 py-1.5 font-mono text-slate-300">{r.timeEfficiency}</td>
                          <td className={cn('px-2 py-1.5 font-mono', r.weeklyRain > 30 ? 'text-blue-400' : 'text-slate-400')}>
                            {r.weeklyRain > 0 ? `${r.weeklyRain}mm` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </StaggerChild>

            {/* Reset data button */}
            <StaggerChild index={9}>
              <div className="flex justify-center">
                <button
                  onClick={() => { setData([]); setWarnings([]); setSelectedMills([]); setCsvText('') }}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-xs text-slate-500 transition-colors hover:border-red-800/50 hover:bg-red-950/20 hover:text-red-400"
                >
                  Clear Data & Upload New
                </button>
              </div>
            </StaggerChild>
          </>
        )}
      </div>
    </AnimatedPanel>
  )
}
