import { useState, useMemo, useCallback, useRef, useEffect, useTransition } from 'react'
import {
  BarChart3, Upload, Filter, TrendingUp, Loader2, Database,
  Layers, Clock, Droplets, Zap, HardDrive, Trash2, ChevronDown, RotateCcw,
} from 'lucide-react'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'
import { MILL_NAMES, MILL_COLORS } from '../../lib/r7106-data'
import {
  type R7106ExtendedRecord,
  type DataChecksum,
  parseR7106XLSX,
  parseR7106CSV,
  computeChecksum,
} from '../../lib/r7106-extended'
import {
  saveDataset,
  loadLatestDataset,
  loadDataset,
  listDatasets,
  clearAllDatasets,
  type StoredDataset,
} from '../../lib/idb-store'
import { useStatsWorker } from '../../hooks/useStatsWorker'

// Panels
import { PanelToolbar, PANELS } from '../factory-v2/PanelToolbar'
import { HeatmapPanel } from '../factory-v2/HeatmapPanel'
import { RadarPanel } from '../factory-v2/RadarPanel'
import { ScatterPanel } from '../factory-v2/ScatterPanel'
import { BoxPlotPanel } from '../factory-v2/BoxPlotPanel'
import { AnomalyPanel } from '../factory-v2/AnomalyPanel'
import { SeasonTrendPanel } from '../factory-v2/SeasonTrendPanel'
import { MassBalancePanel } from '../factory-v2/MassBalancePanel'
import { FactorAnalysisPanel } from '../factory-v2/FactorAnalysisPanel'
import { TimeBreakdownPanel } from '../factory-v2/TimeBreakdownPanel'
import { PurityDiffsPanel } from '../factory-v2/PurityDiffsPanel'
import { CorrelationPanel } from '../factory-v2/CorrelationPanel'
import { HistogramPanel } from '../factory-v2/HistogramPanel'
import { DataValidationPanel } from '../factory-v2/DataValidationPanel'
import { OverviewPanel } from '../factory-v2/OverviewPanel'
import { CaneAnalysisPanel } from '../factory-v2/CaneAnalysisPanel'
import { JuiceExtractionPanel } from '../factory-v2/JuiceExtractionPanel'
import { EfficiencyPanel } from '../factory-v2/EfficiencyPanel'
import { MillComparePanel } from '../factory-v2/MillComparePanel'
import { InsightsPanel } from '../factory-v2/InsightsPanel'

// ── Metric configs for worker ────────────────────────────────────────

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

const CORRELATION_KEYS: (keyof R7106ExtendedRecord)[] = [
  'caneRvPct', 'canePurity', 'polExtraction', 'crushRate',
  'timeEfficiency', 'mechStopPct', 'caneFibrePct', 'weeklyRain',
]

// ── LocalStorage key ───────────────────────────────────────────────────

const LS_PANELS_KEY = 'factory-v2-active-panels'

function loadPanelState(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_PANELS_KEY)
    if (raw) {
      const arr = JSON.parse(raw) as string[]
      return new Set(arr)
    }
  } catch { /* ignore */ }
  return new Set(PANELS.filter((p) => p.defaultOn).map((p) => p.id))
}

function savePanelState(ids: Set<string>) {
  try {
    localStorage.setItem(LS_PANELS_KEY, JSON.stringify([...ids]))
  } catch { /* ignore */ }
}

// ── Mill codes ─────────────────────────────────────────────────────────

const ALL_MILL_CODES = [61, 62, 65, 66, 70, 71, 72, 73, 75, 77, 79, 80]

// ── Component ──────────────────────────────────────────────────────────

export function FactoryDashboardV2() {
  const [data, setData] = useState<R7106ExtendedRecord[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [checksum, setChecksum] = useState<DataChecksum | null>(null)
  const [selectedMills, setSelectedMills] = useState<number[]>([])
  const [weekRange, setWeekRange] = useState<[number, number]>([1, 51])
  const [draftWeekRange, setDraftWeekRange] = useState<[number, number]>([1, 51])
  const [loading, setLoading] = useState(false)
  const [activePanels, setActivePanels] = useState<Set<string>>(loadPanelState)
  const [dataSource, setDataSource] = useState<'none' | 'upload' | 'cache'>('none')
  const [savedDatasets, setSavedDatasets] = useState<Pick<StoredDataset, 'id' | 'fileName' | 'uploadedAt'>[]>([])
  const [showDatasets, setShowDatasets] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const weekDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPending, startTransition] = useTransition()

  // ── IndexedDB: auto-load latest dataset on mount ───────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const latest = await loadLatestDataset()
        if (cancelled || !latest) return
        setData(latest.records)
        setChecksum(latest.checksum)
        setDataSource('cache')

        const mills = [...new Set(latest.records.map((r) => r.mill))].sort((a, b) => a - b)
        setSelectedMills(mills)
        if (latest.records.length > 0) {
          const weeks = latest.records.map((r) => r.week)
          const range: [number, number] = [Math.min(...weeks), Math.max(...weeks)]
          setWeekRange(range)
          setDraftWeekRange(range)
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

  // Debounced week range update
  const updateWeekRange = useCallback((next: [number, number]) => {
    setDraftWeekRange(next)
    if (weekDebounceRef.current) clearTimeout(weekDebounceRef.current)
    weekDebounceRef.current = setTimeout(() => {
      startTransition(() => {
        setWeekRange(next)
      })
    }, 200)
  }, [])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (weekDebounceRef.current) clearTimeout(weekDebounceRef.current)
    }
  }, [])

  // Persist panel state
  useEffect(() => {
    savePanelState(activePanels)
  }, [activePanels])

  // ── Filtered data ────────────────────────────────────────────────

  const filteredData = useMemo(
    () =>
      data.filter(
        (d) =>
          (selectedMills.length === 0 || selectedMills.includes(d.mill)) &&
          d.week >= weekRange[0] &&
          d.week <= weekRange[1],
      ),
    [data, selectedMills, weekRange],
  )

  const availableMills = useMemo(
    () => [...new Set(data.map((d) => d.mill))].sort((a, b) => a - b),
    [data],
  )

  const weekBounds = useMemo(() => {
    if (data.length === 0) return { min: 1, max: 51 }
    const weeks = data.map((d) => d.week)
    return { min: Math.min(...weeks), max: Math.max(...weeks) }
  }, [data])

  // ── Worker-computed stats ────────────────────────────────────────
  const {
    anomalies: workerAnomalies,
    correlationMatrix: workerCorrMatrix,
    loading: statsLoading,
  } = useStatsWorker({
    data: filteredData,
    selectedMills,
    anomalyMetrics: ANOMALY_METRICS,
    correlationKeys: CORRELATION_KEYS,
  })

  // ── Summary stats ────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null

    const totalCane = filteredData.reduce((s, r) => s + r.caneTons, 0)
    const avgRV = filteredData.reduce((s, r) => s + r.caneRvPct, 0) / filteredData.length
    const avgExtraction = filteredData.reduce((s, r) => s + r.polExtraction, 0) / filteredData.length
    const avgCrush = filteredData.reduce((s, r) => s + r.crushRate, 0) / filteredData.length
    const avgTimeEff = filteredData.reduce((s, r) => s + r.timeEfficiency, 0) / filteredData.length
    const avgPurity = filteredData.reduce((s, r) => s + r.canePurity, 0) / filteredData.length

    return { totalCane, avgRV, avgExtraction, avgCrush, avgTimeEff, avgPurity }
  }, [filteredData])

  // ── File upload handler ──────────────────────────────────────────

  // Helper to apply parsed result to state
  const applyDataset = useCallback((
    records: R7106ExtendedRecord[],
    cs: DataChecksum,
    ws: string[],
    source: 'upload' | 'cache',
  ) => {
    setData(records)
    setWarnings(ws)
    setChecksum(cs)
    setDataSource(source)

    const mills = [...new Set(records.map((r) => r.mill))].sort((a, b) => a - b)
    setSelectedMills(mills)
    if (records.length > 0) {
      const weeks = records.map((r) => r.week)
      const range: [number, number] = [Math.min(...weeks), Math.max(...weeks)]
      setWeekRange(range)
      setDraftWeekRange(range)
    }
  }, [])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setWarnings([])

    try {
      const ext = file.name.split('.').pop()?.toLowerCase()
      let result: { records: R7106ExtendedRecord[]; warnings: string[]; checksum: DataChecksum } | null = null

      if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer()
        result = parseR7106XLSX(buffer)
      } else if (ext === 'csv') {
        const text = await file.text()
        result = parseR7106CSV(text)
      } else {
        setWarnings(['Unsupported file format. Please upload .xlsx or .csv'])
      }

      if (result) {
        applyDataset(result.records, result.checksum, result.warnings, 'upload')

        // Persist to IndexedDB
        try {
          await saveDataset(file.name, result.records, result.checksum)
          refreshDatasetList()
        } catch { /* IDB save failed silently */ }
      }
    } catch (err) {
      setWarnings([`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`])
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [applyDataset, refreshDatasetList])

  // Load a specific saved dataset
  const handleLoadSavedDataset = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const ds = await loadDataset(id)
      if (ds) {
        applyDataset(ds.records, ds.checksum, [], 'cache')
      }
    } catch {
      setWarnings(['Failed to load saved dataset'])
    } finally {
      setLoading(false)
      setShowDatasets(false)
    }
  }, [applyDataset])

  // Clear all saved data
  const handleClearSavedData = useCallback(async () => {
    try {
      await clearAllDatasets()
      setSavedDatasets([])
    } catch { /* ignore */ }
  }, [])

  // ── Reset (clear in-memory state, keep IDB) ─────────────────────
  const handleReset = useCallback(() => {
    setData([])
    setWarnings([])
    setChecksum(null)
    setSelectedMills([])
    setWeekRange([1, 51])
    setDraftWeekRange([1, 51])
    setDataSource('none')
  }, [])

  // ── Panel toggle handlers ────────────────────────────────────────

  const handleToggle = useCallback((id: string) => {
    setActivePanels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handlePreset = useCallback((ids: Set<string>) => {
    setActivePanels(ids)
  }, [])

  // ── Mill toggle ─────────────────────────────────────────────────

  const toggleMill = useCallback((mill: number) => {
    startTransition(() => {
      setSelectedMills((prev) =>
        prev.includes(mill) ? prev.filter((m) => m !== mill) : [...prev, mill],
      )
    })
  }, [])

  const selectAllMills = useCallback(() => {
    startTransition(() => setSelectedMills(availableMills))
  }, [availableMills])

  const clearMills = useCallback(() => {
    startTransition(() => setSelectedMills([]))
  }, [])

  // ── Render helper: is panel active ──────────────────────────────

  const isPanelOn = (id: string) => activePanels.has(id) && data.length > 0

  // ── UI ──────────────────────────────────────────────────────────

  return (
    <AnimatedPanel>
      <div className="space-y-6">
        <SectionTitle
          icon={BarChart3}
          title="Factory V2 — Enhanced Dashboard"
          subtitle="Full 134-column R7106 analysis with XLSX support"
        />

        {/* ── Upload & Filters ──────────────────────────────────── */}
        <StaggerChild index={0}>
          <ChartCard title="Data Source" subtitle="Upload R7106 XLSX or CSV">
            <div className="space-y-4">
              {/* File upload area */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="v2-file-upload"
                />
                <label
                  htmlFor="v2-file-upload"
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5',
                    'bg-cane-600/80 text-sm font-medium text-white',
                    'transition-colors hover:bg-cane-500/80',
                    loading && 'pointer-events-none opacity-50',
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {loading ? 'Parsing...' : 'Upload XLSX / CSV'}
                </label>

                {data.length > 0 && (
                  <span className="flex items-center gap-1.5 rounded-md bg-emerald-950/50 px-3 py-1.5 text-xs font-medium text-emerald-400">
                    <Database className="h-3.5 w-3.5" />
                    {data.length} records loaded
                  </span>
                )}

                {/* Data source indicator */}
                {dataSource === 'cache' && (
                  <span className="flex items-center gap-1.5 rounded-md bg-sky-950/50 px-3 py-1.5 text-xs font-medium text-sky-400">
                    <HardDrive className="h-3.5 w-3.5" />
                    Loaded from cache
                  </span>
                )}

                {/* Reset button */}
                {data.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-red-800/50 hover:bg-red-950/20 hover:text-red-400"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}

                {/* Saved datasets dropdown */}
                {savedDatasets.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDatasets((p) => !p)}
                      className="flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
                    >
                      <HardDrive className="h-3 w-3" />
                      Saved ({savedDatasets.length})
                      <ChevronDown className={cn('h-3 w-3 transition-transform', showDatasets && 'rotate-180')} />
                    </button>
                    {showDatasets && (
                      <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-xl">
                        {savedDatasets.map((ds) => (
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
                        <div className="mt-1 border-t border-slate-700/50 pt-1">
                          <button
                            onClick={handleClearSavedData}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-950/30"
                          >
                            <Trash2 className="h-3 w-3" />
                            Clear all saved data
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="space-y-1">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-xs text-amber-400/80">
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Filters (only show when data is loaded) */}
              {data.length > 0 && (
                <div className="space-y-3 border-t border-slate-700/50 pt-3">
                  {/* Mill selection */}
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-400">Mills</span>
                      <button
                        onClick={selectAllMills}
                        className="text-[10px] text-cane-400 hover:text-cane-300"
                      >
                        All
                      </button>
                      <button
                        onClick={clearMills}
                        className="text-[10px] text-slate-500 hover:text-slate-300"
                      >
                        None
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {availableMills.map((mill) => {
                        const isSelected = selectedMills.includes(mill)
                        return (
                          <button
                            key={mill}
                            onClick={() => toggleMill(mill)}
                            className={cn(
                              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                              isSelected
                                ? 'bg-slate-700 text-white ring-1 ring-slate-600'
                                : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50 hover:text-slate-300',
                            )}
                          >
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: MILL_COLORS[mill] ?? '#64748b' }}
                            />
                            {MILL_NAMES[mill] ?? `Mill ${mill}`}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Week range */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-400">Weeks</span>
                    <input
                      type="range"
                      min={weekBounds.min}
                      max={weekBounds.max}
                      value={draftWeekRange[0]}
                      onChange={(e) =>
                        updateWeekRange([
                          Math.min(Number(e.target.value), draftWeekRange[1]),
                          draftWeekRange[1],
                        ])
                      }
                      className="h-1.5 flex-1 appearance-none rounded-full bg-slate-700 accent-cane-500"
                    />
                    <span className="min-w-[3rem] text-center text-xs font-mono text-slate-300">
                      {draftWeekRange[0]}
                    </span>
                    <span className="text-xs text-slate-500">—</span>
                    <span className="min-w-[3rem] text-center text-xs font-mono text-slate-300">
                      {draftWeekRange[1]}
                    </span>
                    <input
                      type="range"
                      min={weekBounds.min}
                      max={weekBounds.max}
                      value={draftWeekRange[1]}
                      onChange={(e) =>
                        updateWeekRange([
                          draftWeekRange[0],
                          Math.max(Number(e.target.value), draftWeekRange[0]),
                        ])
                      }
                      className="h-1.5 flex-1 appearance-none rounded-full bg-slate-700 accent-cane-500"
                    />
                    {isPending && (
                      <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </ChartCard>
        </StaggerChild>

        {/* ── Stat Cards ────────────────────────────────────────── */}
        {stats && (
          <StaggerChild index={1}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard
                title="Cane Crushed"
                value={Math.round(stats.totalCane)}
                suffix=" t"
                icon={Layers}
                iconColor="text-green-400"
                description={`${filteredData.length} records`}
              />
              <StatCard
                title="Avg RV%"
                value={Number(stats.avgRV.toFixed(2))}
                suffix="%"
                icon={TrendingUp}
                iconColor="text-cane-400"
              />
              <StatCard
                title="Pol Extraction"
                value={Number(stats.avgExtraction.toFixed(2))}
                suffix="%"
                icon={Zap}
                iconColor="text-blue-400"
              />
              <StatCard
                title="Crush Rate"
                value={Math.round(stats.avgCrush)}
                suffix=" t/hr"
                icon={BarChart3}
                iconColor="text-purple-400"
              />
              <StatCard
                title="Time Efficiency"
                value={Number(stats.avgTimeEff.toFixed(1))}
                suffix="%"
                icon={Clock}
                iconColor="text-amber-400"
              />
              <StatCard
                title="Avg Purity"
                value={Number(stats.avgPurity.toFixed(1))}
                icon={Droplets}
                iconColor="text-cyan-400"
              />
            </div>
          </StaggerChild>
        )}

        {/* ── Panel Toolbar ─────────────────────────────────────── */}
        {data.length > 0 && (
          <StaggerChild index={2}>
            <ChartCard title="Visualization Panels" subtitle="Toggle panels on/off">
              <PanelToolbar
                activeIds={activePanels}
                onToggle={handleToggle}
                onPreset={handlePreset}
              />
            </ChartCard>
          </StaggerChild>
        )}

        {/* ── Panels ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* V1-style: Overview */}
          {isPanelOn('overview') && (
            <StaggerChild index={3}>
              <OverviewPanel data={filteredData} selectedMills={selectedMills} />
            </StaggerChild>
          )}

          {/* V1-style: Cane Analysis */}
          {isPanelOn('cane') && (
            <CaneAnalysisPanel data={filteredData} selectedMills={selectedMills} />
          )}

          {/* V1-style: Juice & Extraction */}
          {isPanelOn('juice') && (
            <JuiceExtractionPanel data={filteredData} selectedMills={selectedMills} />
          )}

          {/* V1-style: Efficiency */}
          {isPanelOn('efficiency') && (
            <EfficiencyPanel data={filteredData} selectedMills={selectedMills} />
          )}

          {/* V1-style: Mill Compare */}
          {isPanelOn('millcompare') && (
            <MillComparePanel data={filteredData} selectedMills={selectedMills} />
          )}

          {/* V1-style: AI Insights */}
          {isPanelOn('insights') && (
            <InsightsPanel data={filteredData} selectedMills={selectedMills} />
          )}

          {/* Heatmap (full width) */}
          {isPanelOn('heatmap') && (
            <StaggerChild index={4}>
              <HeatmapPanel data={filteredData} selectedMills={selectedMills} />
            </StaggerChild>
          )}

          {/* Radar + Scatter side by side */}
          {(isPanelOn('radar') || isPanelOn('scatter')) && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {isPanelOn('radar') && (
                <StaggerChild index={5}>
                  <RadarPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
              {isPanelOn('scatter') && (
                <StaggerChild index={6}>
                  <ScatterPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
            </div>
          )}

          {/* Box Plot + Season Trend */}
          {(isPanelOn('boxplot') || isPanelOn('seasontrend')) && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {isPanelOn('boxplot') && (
                <StaggerChild index={7}>
                  <BoxPlotPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
              {isPanelOn('seasontrend') && (
                <StaggerChild index={8}>
                  <SeasonTrendPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
            </div>
          )}

          {/* Anomalies (full width) */}
          {isPanelOn('anomaly') && (
            <StaggerChild index={9}>
              <AnomalyPanel data={filteredData} selectedMills={selectedMills} precomputedAnomalies={workerAnomalies} statsLoading={statsLoading} />
            </StaggerChild>
          )}

          {/* Mass Balance + DAC Factors */}
          {(isPanelOn('massbalance') || isPanelOn('factors')) && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {isPanelOn('massbalance') && (
                <StaggerChild index={10}>
                  <MassBalancePanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
              {isPanelOn('factors') && (
                <StaggerChild index={11}>
                  <FactorAnalysisPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
            </div>
          )}

          {/* Time Account (full width) */}
          {isPanelOn('timeaccount') && (
            <StaggerChild index={12}>
              <TimeBreakdownPanel data={filteredData} selectedMills={selectedMills} />
            </StaggerChild>
          )}

          {/* Purity Diffs + Correlation Matrix */}
          {(isPanelOn('puritydiffs') || isPanelOn('corrmatrix')) && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {isPanelOn('puritydiffs') && (
                <StaggerChild index={13}>
                  <PurityDiffsPanel data={filteredData} selectedMills={selectedMills} />
                </StaggerChild>
              )}
              {isPanelOn('corrmatrix') && (
                <StaggerChild index={14}>
                  <CorrelationPanel data={filteredData} selectedMills={selectedMills} precomputedMatrix={workerCorrMatrix} statsLoading={statsLoading} />
                </StaggerChild>
              )}
            </div>
          )}

          {/* Histogram (full width) */}
          {isPanelOn('histogram') && (
            <StaggerChild index={15}>
              <HistogramPanel data={filteredData} selectedMills={selectedMills} />
            </StaggerChild>
          )}

          {/* Data Validation (always shown when data loaded) */}
          {data.length > 0 && checksum && (
            <StaggerChild index={16}>
              <DataValidationPanel
                data={data}
                checksum={checksum}
              />
            </StaggerChild>
          )}
        </div>
      </div>
    </AnimatedPanel>
  )
}
