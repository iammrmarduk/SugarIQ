import { useState, useMemo, useCallback, useRef } from 'react'
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter,
} from 'recharts'
import {
  Upload, FlaskConical, AlertTriangle, Building2,
  Lightbulb, Filter, Database,
} from 'lucide-react'
import { StaggerChild } from '../shared/AnimatedPanel'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'
import { parseCSVData, analyseUploadedData } from '../../lib/demo-data'
import type { ParsedSample } from '../../lib/demo-data'
import { ctsSampleData, growerPaymentConfig } from '../../lib/data'

// ===== LAB-TO-AREA MAPPING =====
const labAreaMap: Record<string, string> = {
  'CTS Sezela': 'KZN South',
  'CTS Eston': 'KZN South',
  'CTS Noodsberg': 'KZN South',
  'CTS Maidstone': 'KZN North Coast',
  'CTS Gledhow': 'KZN North Coast',
  'CTS Felixton': 'Zululand',
  'CTS Amatikulu': 'Zululand',
  'CTS Umfolozi': 'Zululand',
  'CTS Komati': 'Mpumalanga',
  'CTS Malelane': 'Mpumalanga',
  'CTS Pongola': 'Mpumalanga',
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

// ===== HELPER FUNCTIONS =====
function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

// ===== COMPONENT =====
export function CTSDataIngestion() {
  const [data, setData] = useState<ParsedSample[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [csvText, setCsvText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter state
  const [filterArea, setFilterArea] = useState<string>('')
  const [filterLab, setFilterLab] = useState<string>('')
  const [filterTestingType, setFilterTestingType] = useState<string>('')

  // Derive unique filter options from uploaded data
  const filterOptions = useMemo(() => {
    const areas = unique(data.map(d => d.area).filter((a): a is string => !!a))
    const labs = unique(data.map(d => d.lab).filter((l): l is string => !!l))
    const testingTypes = unique(data.map(d => d.testingType).filter((t): t is string => !!t))
    return { areas, labs, testingTypes }
  }, [data])

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter(d => {
      if (filterArea && d.area !== filterArea) return false
      if (filterLab && d.lab !== filterLab) return false
      if (filterTestingType && d.testingType !== filterTestingType) return false
      return true
    })
  }, [data, filterArea, filterLab, filterTestingType])

  // Run analysis on filtered data
  const analysis = useMemo(
    () => filteredData.length > 0 ? analyseUploadedData(filteredData) : null,
    [filteredData],
  )

  // Unique labs in filtered data
  const labCount = useMemo(
    () => unique(filteredData.map(d => d.lab).filter(Boolean)).length,
    [filteredData],
  )

  // RV by Lab chart data
  const rvByLabData = useMemo(() => {
    if (filteredData.length === 0) return []
    const labGroups: Record<string, number[]> = {}
    filteredData.forEach(d => {
      const lab = d.lab || 'Unknown'
      if (!labGroups[lab]) labGroups[lab] = []
      // Use predicted RV from analysis if available, otherwise use rv field
      if (d.rv !== undefined) {
        labGroups[lab].push(d.rv)
      } else {
        // Predict via formula: RV = 0.91 * Pol * (100-Fibre)/100 - 0.42 * (Brix-Pol)
        const pred = 0.91 * d.pol * (100 - d.fibre) / 100 - 0.42 * (d.brix - d.pol)
        labGroups[lab].push(pred)
      }
    })
    return Object.entries(labGroups)
      .map(([lab, rvs]) => ({
        lab: lab.replace('CTS ', ''),
        fullLab: lab,
        meanRV: Math.round(mean(rvs) * 100) / 100,
        count: rvs.length,
      }))
      .sort((a, b) => b.meanRV - a.meanRV)
  }, [filteredData])

  // RV by Area chart data
  const rvByAreaData = useMemo(() => {
    if (filteredData.length === 0) return []
    const areaGroups: Record<string, number[]> = {}
    filteredData.forEach(d => {
      const area = d.area || 'Unknown'
      if (!areaGroups[area]) areaGroups[area] = []
      if (d.rv !== undefined) {
        areaGroups[area].push(d.rv)
      } else {
        const pred = 0.91 * d.pol * (100 - d.fibre) / 100 - 0.42 * (d.brix - d.pol)
        areaGroups[area].push(pred)
      }
    })
    return Object.entries(areaGroups)
      .map(([area, rvs]) => ({
        area,
        meanRV: Math.round(mean(rvs) * 100) / 100,
        count: rvs.length,
      }))
      .sort((a, b) => b.meanRV - a.meanRV)
  }, [filteredData])

  // Anomaly timeline data (only if date present)
  const anomalyTimelineData = useMemo(() => {
    if (!analysis || analysis.anomalyCount === 0) return []
    const hasDate = filteredData.some(d => d.date)
    if (!hasDate) return []
    return analysis.anomalies
      .map(idx => {
        const d = filteredData[idx]
        if (!d?.date) return null
        const pred = analysis.predictions[idx]
        return {
          date: d.date,
          rv: pred?.predicted ?? d.rv ?? 0,
          id: d.id,
          lab: d.lab || 'Unknown',
        }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
  }, [analysis, filteredData])

  // Lab-specific and area comparison insights
  const extraInsights = useMemo(() => {
    const insights: string[] = []
    if (rvByLabData.length >= 2) {
      const highest = rvByLabData[0]
      const lowest = rvByLabData[rvByLabData.length - 1]
      insights.push(
        `Highest mean RV by lab: ${highest.fullLab} (${highest.meanRV}) — Lowest: ${lowest.fullLab} (${lowest.meanRV}), a spread of ${(highest.meanRV - lowest.meanRV).toFixed(2)} RV units`,
      )
    }
    if (rvByAreaData.length >= 2) {
      const highest = rvByAreaData[0]
      const lowest = rvByAreaData[rvByAreaData.length - 1]
      insights.push(
        `Area comparison: ${highest.area} leads with mean RV ${highest.meanRV} (${highest.count} samples) vs ${lowest.area} at ${lowest.meanRV} (${lowest.count} samples)`,
      )
    }
    if (rvByLabData.length > 0) {
      const totalSamples = rvByLabData.reduce((s, l) => s + l.count, 0)
      const avgPerLab = Math.round(totalSamples / rvByLabData.length)
      insights.push(
        `${rvByLabData.length} labs represented with an average of ${avgPerLab} samples per lab — RV price: R${growerPaymentConfig.pricePerRVUnit.toLocaleString()}/unit`,
      )
    }
    return insights
  }, [rvByLabData, rvByAreaData])

  // ===== EVENT HANDLERS =====
  const handleParse = useCallback((text: string) => {
    const result = parseCSVData(text)
    setData(result.data)
    setWarnings(result.warnings)
    // Reset filters on new data
    setFilterArea('')
    setFilterLab('')
    setFilterTestingType('')
  }, [])

  const handleLoadSample = useCallback(() => {
    const samples: ParsedSample[] = ctsSampleData.map(s => ({
      id: s.id,
      brix: s.brix,
      pol: s.pol,
      fibre: s.fibre,
      rv: s.rv,
      lab: s.lab,
      grower: s.grower,
      area: labAreaMap[s.lab] || 'Unknown',
    }))
    setData(samples)
    setWarnings([])
    setFilterArea('')
    setFilterLab('')
    setFilterTestingType('')
    setCsvText('')
  }, [])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setCsvText(text)
        handleParse(text)
      }
      reader.readAsText(file)
    }
  }, [handleParse])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setCsvText(text)
        handleParse(text)
      }
      reader.readAsText(file)
    }
  }, [handleParse])

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <StaggerChild index={0}>
        <ChartCard title="CTS Data Ingestion" subtitle="Upload CSV with brix, pol, fibre columns — optional: rv, lab, grower, date, area, testing_type">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Drop zone */}
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-600/50 bg-slate-900/30 p-6 transition-colors hover:border-amber-500/50 cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-slate-500" />
              <p className="text-xs text-slate-400 text-center">
                Drag & drop CSV or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Paste area */}
            <div className="space-y-2">
              <textarea
                className="w-full h-24 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
                placeholder={'id,lab,grower,brix,pol,fibre,rv,area\nS-0501,CTS Sezela,Naidoo Bros,21.4,18.2,13.8,12.91,KZN South'}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleParse(csvText)}
                  className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  Parse CSV
                </button>
                <button
                  onClick={handleLoadSample}
                  className="rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/80"
                >
                  <Database className="mr-1 inline h-3 w-3" />
                  Load Sample Data (20 CTS samples)
                </button>
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

      {data.length > 0 && (
        <>
          {/* Filter Bar */}
          <StaggerChild index={1}>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Filter:</span>

              {filterOptions.areas.length > 0 && (
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">All Areas</option>
                  {filterOptions.areas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              )}

              {filterOptions.labs.length > 0 && (
                <select
                  value={filterLab}
                  onChange={(e) => setFilterLab(e.target.value)}
                  className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">All Labs</option>
                  {filterOptions.labs.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              )}

              {filterOptions.testingTypes.length > 0 && (
                <select
                  value={filterTestingType}
                  onChange={(e) => setFilterTestingType(e.target.value)}
                  className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">All Types</option>
                  {filterOptions.testingTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}

              {(filterArea || filterLab || filterTestingType) && (
                <button
                  onClick={() => { setFilterArea(''); setFilterLab(''); setFilterTestingType('') }}
                  className="rounded-lg bg-slate-700/50 px-2 py-1 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-700/80 hover:text-slate-200"
                >
                  Clear Filters
                </button>
              )}

              <span className="ml-auto text-[11px] text-slate-500">
                Showing {filteredData.length} of {data.length} samples
              </span>
            </div>
          </StaggerChild>

          {/* Summary Stats */}
          {analysis && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StaggerChild index={2}>
                <StatCard
                  title="Samples"
                  value={analysis.sampleCount}
                  icon={Upload}
                  iconColor="text-amber-400"
                  description="Ingested rows"
                />
              </StaggerChild>
              <StaggerChild index={3}>
                <StatCard
                  title="Mean RV"
                  value={analysis.meanRV}
                  icon={FlaskConical}
                  iconColor="text-green-400"
                  description="Predicted average"
                />
              </StaggerChild>
              <StaggerChild index={4}>
                <StatCard
                  title="Anomalies"
                  value={analysis.anomalyCount}
                  icon={AlertTriangle}
                  iconColor="text-amber-400"
                  description=">2 sigma from mean"
                />
              </StaggerChild>
              <StaggerChild index={5}>
                <StatCard
                  title="Labs Represented"
                  value={labCount}
                  icon={Building2}
                  iconColor="text-blue-400"
                  description="Unique CTS labs"
                />
              </StaggerChild>
            </div>
          )}

          {/* Data Table */}
          {analysis && (
            <StaggerChild index={6}>
              <ChartCard
                title="Sample Data Table"
                subtitle={`${filteredData.length} samples — ${analysis.anomalyCount} anomalies highlighted`}
              >
                <div className="max-h-[420px] overflow-auto rounded-lg border border-slate-700/50">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-800 text-slate-400">
                      <tr>
                        <th className="px-3 py-2 font-medium">ID</th>
                        {filteredData.some(d => d.lab) && <th className="px-3 py-2 font-medium">Lab</th>}
                        {filteredData.some(d => d.grower) && <th className="px-3 py-2 font-medium">Grower</th>}
                        {filteredData.some(d => d.area) && <th className="px-3 py-2 font-medium">Area</th>}
                        <th className="px-3 py-2 font-medium text-right">Brix</th>
                        <th className="px-3 py-2 font-medium text-right">Pol</th>
                        <th className="px-3 py-2 font-medium text-right">Fibre</th>
                        <th className="px-3 py-2 font-medium text-right">RV (pred)</th>
                        {filteredData.some(d => d.date) && <th className="px-3 py-2 font-medium">Date</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((sample, i) => {
                        const isAnomaly = analysis.anomalies.includes(i)
                        const pred = analysis.predictions[i]
                        return (
                          <tr
                            key={sample.id}
                            className={cn(
                              'border-t border-slate-700/30 transition-colors',
                              isAnomaly
                                ? 'border-l-2 border-l-amber-500 bg-amber-950/20'
                                : i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40',
                            )}
                          >
                            <td className="px-3 py-2 font-mono text-slate-300">{sample.id}</td>
                            {filteredData.some(d => d.lab) && (
                              <td className="px-3 py-2 text-slate-400">{sample.lab?.replace('CTS ', '') || '-'}</td>
                            )}
                            {filteredData.some(d => d.grower) && (
                              <td className="px-3 py-2 text-slate-300">{sample.grower || '-'}</td>
                            )}
                            {filteredData.some(d => d.area) && (
                              <td className="px-3 py-2 text-slate-400">{sample.area || '-'}</td>
                            )}
                            <td className="px-3 py-2 text-right text-slate-300">{sample.brix}</td>
                            <td className="px-3 py-2 text-right text-slate-300">{sample.pol}</td>
                            <td className={cn(
                              'px-3 py-2 text-right',
                              sample.fibre > 15 ? 'text-amber-400 font-medium' : 'text-slate-300',
                            )}>
                              {sample.fibre}
                            </td>
                            <td className={cn(
                              'px-3 py-2 text-right font-medium font-mono',
                              (pred?.predicted ?? 0) < 11 ? 'text-red-400' : 'text-green-400',
                            )}>
                              {pred?.predicted ?? '-'}
                            </td>
                            {filteredData.some(d => d.date) && (
                              <td className="px-3 py-2 text-slate-400">{sample.date || '-'}</td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="inline-block h-3 w-1 rounded bg-amber-500" />
                  Amber-highlighted rows are anomalies (&gt;2 sigma from mean)
                </div>
              </ChartCard>
            </StaggerChild>
          )}

          {/* Comparison Charts */}
          {analysis && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* RV by Lab - horizontal bar */}
              {rvByLabData.length > 0 && (
                <StaggerChild index={7}>
                  <ChartCard
                    title="RV by Lab"
                    subtitle={`Mean RV across ${rvByLabData.length} labs`}
                  >
                    <ResponsiveContainer width="100%" height={Math.max(200, rvByLabData.length * 36)}>
                      <BarChart data={rvByLabData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          type="number"
                          domain={['auto', 'auto']}
                          stroke="#64748b"
                          fontSize={11}
                        />
                        <YAxis
                          type="category"
                          dataKey="lab"
                          stroke="#64748b"
                          fontSize={10}
                          width={90}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          labelStyle={{ color: '#f8fafc' }}
                          itemStyle={{ color: '#cbd5e1' }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={((value: number, _name: string, props: { payload: { count: number } }) => [
                            `${value.toFixed(2)} (${props.payload.count} samples)`,
                            'Mean RV',
                          ]) as any}
                        />
                        <Bar dataKey="meanRV" radius={[0, 4, 4, 0]}>
                          {rvByLabData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={
                                entry.meanRV >= 13 ? '#22c55e' :
                                entry.meanRV >= 12 ? '#f59e0b' : '#ef4444'
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </StaggerChild>
              )}

              {/* RV by Area - grouped bar */}
              {rvByAreaData.length > 0 && (
                <StaggerChild index={8}>
                  <ChartCard
                    title="RV by Area"
                    subtitle={`Mean RV across ${rvByAreaData.length} supply areas`}
                  >
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={rvByAreaData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="area"
                          stroke="#64748b"
                          fontSize={10}
                          angle={-20}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          labelStyle={{ color: '#f8fafc' }}
                          itemStyle={{ color: '#cbd5e1' }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={((value: number, _name: string, props: { payload: { count: number } }) => [
                            `${value.toFixed(2)} (${props.payload.count} samples)`,
                            'Mean RV',
                          ]) as any}
                        />
                        <Bar dataKey="meanRV" radius={[4, 4, 0, 0]}>
                          {rvByAreaData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={
                                entry.meanRV >= 13 ? '#22c55e' :
                                entry.meanRV >= 12 ? '#3b82f6' : '#f59e0b'
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </StaggerChild>
              )}

              {/* Brix/Pol/Fibre distributions */}
              {analysis.distributions.map((dist, idx) => (
                <StaggerChild key={dist.field} index={9 + idx}>
                  <ChartCard
                    title={`${dist.field} Distribution`}
                    subtitle="Histogram (8 bins)"
                  >
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={dist.bins}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="bin" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar
                          dataKey="count"
                          radius={[4, 4, 0, 0]}
                          fill={
                            dist.field === 'Brix' ? '#3b82f6' :
                            dist.field === 'Pol' ? '#22c55e' :
                            dist.field === 'Fibre' ? '#f59e0b' : '#22c55e'
                          }
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </StaggerChild>
              ))}

              {/* Anomaly timeline */}
              {anomalyTimelineData.length > 0 && (
                <StaggerChild index={13}>
                  <ChartCard
                    title="Anomaly Timeline"
                    subtitle={`${anomalyTimelineData.length} anomalies plotted by date`}
                  >
                    <ResponsiveContainer width="100%" height={240}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          fontSize={10}
                          angle={-30}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          dataKey="rv"
                          stroke="#64748b"
                          fontSize={11}
                          name="RV"
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          labelStyle={{ color: '#f8fafc' }}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={((value: number, name: string) => [
                            name === 'rv' ? value.toFixed(2) : value,
                            name === 'rv' ? 'RV' : name,
                          ]) as any}
                        />
                        <Scatter
                          data={anomalyTimelineData}
                          fill="#ef4444"
                          name="Anomaly"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </StaggerChild>
              )}
            </div>
          )}

          {/* AI Insights */}
          {analysis && (
            <StaggerChild index={14}>
              <ChartCard
                title="AI Insights"
                subtitle="Automated analysis from ingested CTS data"
              >
                <div className="space-y-2">
                  {analysis.insights.map((insight, i) => (
                    <div
                      key={`analysis-${i}`}
                      className="flex items-start gap-2 rounded-lg bg-slate-900/50 px-3 py-2"
                    >
                      <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
                      <p className="text-xs text-slate-300">{insight}</p>
                    </div>
                  ))}
                  {extraInsights.map((insight, i) => (
                    <div
                      key={`extra-${i}`}
                      className="flex items-start gap-2 rounded-lg border border-blue-800/30 bg-blue-950/10 px-3 py-2"
                    >
                      <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-400" />
                      <p className="text-xs text-slate-300">{insight}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-amber-500/10 p-3">
                  <p className="text-xs text-amber-300">
                    <Lightbulb className="mr-1 inline h-3 w-3" />
                    Insights are generated automatically by comparing your uploaded data against
                    the CTS benchmark dataset. Lab and area comparisons highlight regional
                    performance differences.
                  </p>
                </div>
              </ChartCard>
            </StaggerChild>
          )}
        </>
      )}
    </div>
  )
}
