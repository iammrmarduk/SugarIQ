import { memo, useMemo, useState, useCallback } from 'react'
import {
  AlertTriangle, CheckCircle2, TrendingDown, TrendingUp,
  Search, ChevronDown, ChevronUp, Zap, Eye, Droplets, Clock,
  Filter,
} from 'lucide-react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

// ── Insight categories ───────────────────────────────────────────────

export type InsightCategory = 'positive' | 'concern' | 'anomaly' | 'trend' | 'comparison'

export interface Insight {
  text: string
  category: InsightCategory
  priority: number // lower = more important (shown first)
}

const CATEGORY_CONFIG: Record<InsightCategory, {
  label: string
  icon: typeof AlertTriangle
  border: string
  bg: string
  iconColor: string
  badgeColor: string
}> = {
  positive: {
    label: 'Positive',
    icon: CheckCircle2,
    border: 'border-green-800/30',
    bg: 'bg-green-950/20',
    iconColor: 'text-green-400',
    badgeColor: 'bg-green-500/20 text-green-400',
  },
  concern: {
    label: 'Concern',
    icon: AlertTriangle,
    border: 'border-amber-800/30',
    bg: 'bg-amber-950/20',
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  anomaly: {
    label: 'Anomaly',
    icon: Zap,
    border: 'border-red-800/30',
    bg: 'bg-red-950/20',
    iconColor: 'text-red-400',
    badgeColor: 'bg-red-500/20 text-red-400',
  },
  trend: {
    label: 'Trend',
    icon: TrendingDown,
    border: 'border-blue-800/30',
    bg: 'bg-blue-950/20',
    iconColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  comparison: {
    label: 'Comparison',
    icon: Eye,
    border: 'border-slate-700/30',
    bg: 'bg-slate-800/30',
    iconColor: 'text-slate-400',
    badgeColor: 'bg-slate-500/20 text-slate-400',
  },
}

// ── Insight generation engine ────────────────────────────────────────

function generateInsights(data: R7106ExtendedRecord[], selectedMills: number[]): Insight[] {
  if (data.length === 0) return []

  const insights: Insight[] = []
  const filtered = data.filter(d => selectedMills.includes(d.mill))
  if (filtered.length === 0) return [{ text: 'No data for selected mills', category: 'comparison', priority: 99 }]

  const byMill = new Map<number, R7106ExtendedRecord[]>()
  for (const r of filtered) {
    const arr = byMill.get(r.mill) || []
    arr.push(r)
    byMill.set(r.mill, arr)
  }

  const millAvg = (mill: number, key: keyof R7106ExtendedRecord) => {
    const rows = byMill.get(mill) || []
    const vals = rows.map(r => r[key] as number).filter(v => v > 0)
    return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
  }

  const fleetAvg = (key: keyof R7106ExtendedRecord) => {
    const vals = filtered.map(r => r[key] as number).filter(v => v > 0)
    return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
  }

  // ── COMPARISONS: Best/worst across mills ──

  const avgRV = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.caneRvPct, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgRV.length >= 2) {
    const best = avgRV[0]
    const worst = avgRV[avgRV.length - 1]
    insights.push({
      text: `${best.name} leads RV at ${best.val.toFixed(1)}%, while ${worst.name} trails at ${worst.val.toFixed(1)}% — a ${(best.val - worst.val).toFixed(1)}pp gap`,
      category: 'comparison', priority: 10,
    })
  }

  const avgExtraction = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.polExtraction, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgExtraction.length >= 2 && avgExtraction[0].val > 0) {
    const best = avgExtraction[0]
    const worst = avgExtraction[avgExtraction.length - 1]
    insights.push({
      text: `Best pol extraction: ${best.name} at ${best.val.toFixed(1)}% — worst: ${worst.name} at ${worst.val.toFixed(1)}%`,
      category: 'comparison', priority: 12,
    })
  }

  // Crush rate comparison
  const avgCrushByMill = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.crushRate, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgCrushByMill.length >= 2 && avgCrushByMill[0].val > 0) {
    insights.push({
      text: `Highest throughput: ${avgCrushByMill[0].name} at ${avgCrushByMill[0].val.toFixed(0)} t/hr — lowest: ${avgCrushByMill[avgCrushByMill.length - 1].name} at ${avgCrushByMill[avgCrushByMill.length - 1].val.toFixed(0)} t/hr`,
      category: 'comparison', priority: 14,
    })
  }

  // Purity comparison
  const avgPurity = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.canePurity, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgPurity.length >= 2 && avgPurity[0].val > 0) {
    insights.push({
      text: `Highest cane purity: ${avgPurity[0].name} at ${avgPurity[0].val.toFixed(1)} — lowest: ${avgPurity[avgPurity.length - 1].name} at ${avgPurity[avgPurity.length - 1].val.toFixed(1)}`,
      category: 'comparison', priority: 16,
    })
  }

  // Time efficiency comparison
  const avgTimeEff = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.timeEfficiency, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgTimeEff.length >= 2 && avgTimeEff[0].val > 0) {
    insights.push({
      text: `Best time efficiency: ${avgTimeEff[0].name} at ${avgTimeEff[0].val.toFixed(1)}% — worst: ${avgTimeEff[avgTimeEff.length - 1].name} at ${avgTimeEff[avgTimeEff.length - 1].val.toFixed(1)}%`,
      category: 'comparison', priority: 18,
    })
  }

  // Sucrose extraction comparison
  const avgSucExtr = [...byMill.entries()].map(([mill, rows]) => ({
    mill, name: MILL_NAMES[mill] || `Mill ${mill}`,
    val: rows.reduce((s, r) => s + r.sucroseExtraction, 0) / rows.length,
  })).sort((a, b) => b.val - a.val)

  if (avgSucExtr.length >= 2 && avgSucExtr[0].val > 0) {
    insights.push({
      text: `Sucrose extraction leader: ${avgSucExtr[0].name} at ${avgSucExtr[0].val.toFixed(1)}% vs ${avgSucExtr[avgSucExtr.length - 1].name} at ${avgSucExtr[avgSucExtr.length - 1].val.toFixed(1)}%`,
      category: 'comparison', priority: 20,
    })
  }

  // ── POSITIVES: Outstanding performance ──

  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`
    const polExtr = rows.reduce((s, r) => s + r.polExtraction, 0) / rows.length
    if (polExtr > 96.5) {
      insights.push({
        text: `${name} achieved exceptional pol extraction of ${polExtr.toFixed(1)}% — above 96.5% benchmark`,
        category: 'positive', priority: 5,
      })
    }

    const timeEff = rows.reduce((s, r) => s + r.timeEfficiency, 0) / rows.length
    if (timeEff > 90) {
      insights.push({
        text: `${name} maintained strong time efficiency at ${timeEff.toFixed(1)}% — well above 90% threshold`,
        category: 'positive', priority: 6,
      })
    }

    const crush = rows.reduce((s, r) => s + r.crushRate, 0) / rows.length
    const fleetCrush = fleetAvg('crushRate')
    if (crush > fleetCrush * 1.2 && crush > 0) {
      insights.push({
        text: `${name}'s crush rate (${crush.toFixed(0)} t/hr) is ${((crush / fleetCrush - 1) * 100).toFixed(0)}% above fleet average`,
        category: 'positive', priority: 8,
      })
    }
  }

  // Best week fleet-wide
  const weekTotals = new Map<number, { cane: number; count: number }>()
  for (const r of filtered) {
    const wt = weekTotals.get(r.week) || { cane: 0, count: 0 }
    wt.cane += r.caneTons
    wt.count++
    weekTotals.set(r.week, wt)
  }
  if (weekTotals.size > 4) {
    const bestWeek = [...weekTotals.entries()].sort((a, b) => b[1].cane - a[1].cane)[0]
    insights.push({
      text: `Peak production in week ${bestWeek[0]}: ${bestWeek[1].cane.toLocaleString(undefined, { maximumFractionDigits: 0 })}t total cane crushed`,
      category: 'positive', priority: 15,
    })
  }

  // ── CONCERNS: Below-par performance ──

  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`

    // Low extraction
    const polExtr = rows.reduce((s, r) => s + r.polExtraction, 0) / rows.length
    const fleetExtr = fleetAvg('polExtraction')
    if (polExtr > 0 && polExtr < fleetExtr * 0.97 && fleetExtr > 0) {
      insights.push({
        text: `${name}'s pol extraction (${polExtr.toFixed(1)}%) is below the fleet average (${fleetExtr.toFixed(1)}%) — review extraction efficiency`,
        category: 'concern', priority: 7,
      })
    }

    // High mechanical stop
    const mechStop = rows.reduce((s, r) => s + r.mechStopPct, 0) / rows.length
    const fleetMech = fleetAvg('mechStopPct')
    if (mechStop > fleetMech * 1.8 && mechStop > 2) {
      insights.push({
        text: `${name}'s mechanical stops (${mechStop.toFixed(1)}%) are ${(mechStop / fleetMech).toFixed(1)}x the fleet average (${fleetMech.toFixed(1)}%) — maintenance review needed`,
        category: 'concern', priority: 3,
      })
    }

    // High no-cane stop
    const noCane = rows.reduce((s, r) => s + r.noCanePct, 0) / rows.length
    const fleetNoCane = fleetAvg('noCanePct')
    if (noCane > fleetNoCane * 1.5 && noCane > 3) {
      insights.push({
        text: `${name}'s no-cane stop time (${noCane.toFixed(1)}%) significantly exceeds fleet average (${fleetNoCane.toFixed(1)}%) — supply chain review recommended`,
        category: 'concern', priority: 4,
      })
    }

    // Low crush rate
    const crush = rows.reduce((s, r) => s + r.crushRate, 0) / rows.length
    const fleetCrush = fleetAvg('crushRate')
    if (crush > 0 && crush < fleetCrush * 0.8 && fleetCrush > 0) {
      insights.push({
        text: `${name}'s crush rate (${crush.toFixed(0)} t/hr) is ${((1 - crush / fleetCrush) * 100).toFixed(0)}% below fleet average — investigate bottleneck`,
        category: 'concern', priority: 6,
      })
    }

    // Low time efficiency
    const timeEff = rows.reduce((s, r) => s + r.timeEfficiency, 0) / rows.length
    if (timeEff > 0 && timeEff < 75) {
      insights.push({
        text: `${name}'s time efficiency (${timeEff.toFixed(1)}%) is below 75% — significant production time being lost`,
        category: 'concern', priority: 5,
      })
    }

    // High bagasse pol (sugar loss in bagasse)
    const bagPol = rows.reduce((s, r) => s + r.bagPolPct, 0) / rows.length
    const fleetBagPol = fleetAvg('bagPolPct')
    if (bagPol > fleetBagPol * 1.3 && bagPol > 1.5) {
      insights.push({
        text: `${name}'s bagasse pol (${bagPol.toFixed(2)}%) is higher than fleet average (${fleetBagPol.toFixed(2)}%) — potential sugar loss in bagasse`,
        category: 'concern', priority: 9,
      })
    }
  }

  // ── TRENDS: Seasonal patterns ──

  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`
    const sorted = [...rows].sort((a, b) => a.week - b.week)
    if (sorted.length < 4) continue

    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2))

    // RV trend
    const rvFirst = firstHalf.reduce((s, r) => s + r.caneRvPct, 0) / firstHalf.length
    const rvSecond = secondHalf.reduce((s, r) => s + r.caneRvPct, 0) / secondHalf.length
    if (rvFirst > 0 && rvSecond > 0 && rvFirst - rvSecond > 1.0) {
      insights.push({
        text: `${name}'s RV declined from ${rvFirst.toFixed(1)}% (early season) to ${rvSecond.toFixed(1)}% (late season) — investigate cause`,
        category: 'trend', priority: 2,
      })
    } else if (rvFirst > 0 && rvSecond > 0 && rvSecond - rvFirst > 0.8) {
      insights.push({
        text: `${name}'s RV improved from ${rvFirst.toFixed(1)}% (early) to ${rvSecond.toFixed(1)}% (late season) — positive maturity trend`,
        category: 'positive', priority: 11,
      })
    }

    // Purity trend
    const purFirst = firstHalf.reduce((s, r) => s + r.canePurity, 0) / firstHalf.length
    const purSecond = secondHalf.reduce((s, r) => s + r.canePurity, 0) / secondHalf.length
    if (purFirst > 0 && purSecond > 0 && purFirst - purSecond > 2) {
      insights.push({
        text: `${name}'s cane purity dropped from ${purFirst.toFixed(1)} to ${purSecond.toFixed(1)} through the season — deterioration in cane quality`,
        category: 'trend', priority: 13,
      })
    }

    // Crush rate trend
    const crushFirst = firstHalf.reduce((s, r) => s + r.crushRate, 0) / firstHalf.length
    const crushSecond = secondHalf.reduce((s, r) => s + r.crushRate, 0) / secondHalf.length
    if (crushFirst > 0 && crushSecond > 0 && (crushFirst - crushSecond) / crushFirst > 0.15) {
      insights.push({
        text: `${name}'s crush rate fell from ${crushFirst.toFixed(0)} t/hr to ${crushSecond.toFixed(0)} t/hr — ${((1 - crushSecond / crushFirst) * 100).toFixed(0)}% decline through the season`,
        category: 'trend', priority: 12,
      })
    }

    // Fibre trend (rising fibre = aging cane)
    const fibFirst = firstHalf.reduce((s, r) => s + r.caneFibrePct, 0) / firstHalf.length
    const fibSecond = secondHalf.reduce((s, r) => s + r.caneFibrePct, 0) / secondHalf.length
    if (fibFirst > 0 && fibSecond > 0 && fibSecond - fibFirst > 1.0) {
      insights.push({
        text: `${name}'s cane fibre rose from ${fibFirst.toFixed(1)}% to ${fibSecond.toFixed(1)}% — may indicate aging or carry-over cane`,
        category: 'trend', priority: 17,
      })
    }
  }

  // ── ANOMALIES: Outlier detection ──

  // Rain impact weeks
  const weekData = new Map<number, { rain: number; crush: number; count: number }>()
  for (const r of filtered) {
    const wd = weekData.get(r.week) || { rain: 0, crush: 0, count: 0 }
    wd.rain += r.weeklyRain
    wd.crush += r.crushRate
    wd.count++
    weekData.set(r.week, wd)
  }
  const overallAvgCrush = fleetAvg('crushRate')
  for (const [week, wd] of weekData) {
    const avgRain = wd.rain / wd.count
    const avgCrush = wd.crush / wd.count
    if (avgRain > 30 && avgCrush > 0 && avgCrush < overallAvgCrush * 0.85) {
      insights.push({
        text: `Week ${week}: heavy rainfall (${avgRain.toFixed(0)}mm avg) correlated with crush rate drop — ${avgCrush.toFixed(0)} t/hr vs ${overallAvgCrush.toFixed(0)} t/hr normal`,
        category: 'anomaly', priority: 8,
      })
    }
  }

  // Sudden week-to-week extraction drops per mill
  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`
    const sorted = [...rows].sort((a, b) => a.week - b.week)
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const curr = sorted[i]
      if (prev.polExtraction > 0 && curr.polExtraction > 0 && prev.polExtraction - curr.polExtraction > 2) {
        insights.push({
          text: `${name} week ${curr.week}: pol extraction dropped ${(prev.polExtraction - curr.polExtraction).toFixed(1)}pp from previous week (${prev.polExtraction.toFixed(1)}% → ${curr.polExtraction.toFixed(1)}%)`,
          category: 'anomaly', priority: 6,
        })
      }
    }
  }

  // Sudden crush rate spikes or drops
  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`
    const sorted = [...rows].sort((a, b) => a.week - b.week)
    const avgCrush = millAvg(mill, 'crushRate')
    for (const r of sorted) {
      if (avgCrush > 0 && r.crushRate > 0 && r.crushRate < avgCrush * 0.5) {
        insights.push({
          text: `${name} week ${r.week}: crush rate of ${r.crushRate.toFixed(0)} t/hr was ${((1 - r.crushRate / avgCrush) * 100).toFixed(0)}% below its own average — potential unplanned stoppage`,
          category: 'anomaly', priority: 4,
        })
      }
    }
  }

  // Unusually high operational stops
  for (const [mill, rows] of byMill) {
    const name = MILL_NAMES[mill] || `Mill ${mill}`
    const avgOp = rows.reduce((s, r) => s + r.opStopPct, 0) / rows.length
    const fleetOp = fleetAvg('opStopPct')
    if (avgOp > fleetOp * 2 && avgOp > 3) {
      insights.push({
        text: `${name}'s operational stops (${avgOp.toFixed(1)}%) are ${(avgOp / fleetOp).toFixed(1)}x the fleet average — process review warranted`,
        category: 'anomaly', priority: 7,
      })
    }
  }

  // Week with anomalous fleet-wide low RV
  const weekRV = new Map<number, { rv: number; count: number }>()
  for (const r of filtered) {
    const wr = weekRV.get(r.week) || { rv: 0, count: 0 }
    wr.rv += r.caneRvPct
    wr.count++
    weekRV.set(r.week, wr)
  }
  const fleetRV = fleetAvg('caneRvPct')
  for (const [week, wr] of weekRV) {
    const weekAvgRV = wr.rv / wr.count
    if (fleetRV > 0 && weekAvgRV > 0 && weekAvgRV < fleetRV * 0.85) {
      insights.push({
        text: `Week ${week}: fleet-wide RV of ${weekAvgRV.toFixed(1)}% was ${((1 - weekAvgRV / fleetRV) * 100).toFixed(0)}% below season average (${fleetRV.toFixed(1)}%)`,
        category: 'anomaly', priority: 9,
      })
    }
  }

  // Sort by priority
  insights.sort((a, b) => a.priority - b.priority)

  return insights
}

// ── Component ────────────────────────────────────────────────────────

interface InsightsPanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

const INITIAL_SHOW = 4
const PAGE_SIZE = 10

const ALL_CATEGORIES: InsightCategory[] = ['positive', 'concern', 'anomaly', 'trend', 'comparison']

export const InsightsPanel = memo(function InsightsPanel({ data, selectedMills }: InsightsPanelProps) {
  const allInsights = useMemo(() => generateInsights(data, selectedMills), [data, selectedMills])
  const [expanded, setExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<InsightCategory>>(new Set(ALL_CATEGORIES))
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFilter = useCallback((cat: InsightCategory) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(cat)) {
        // Don't allow deselecting all
        if (next.size > 1) next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }, [])

  const filteredInsights = useMemo(() => {
    let results = allInsights.filter(i => activeFilters.has(i.category))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(i => i.text.toLowerCase().includes(q))
    }
    return results
  }, [allInsights, activeFilters, searchQuery])

  const visibleInsights = expanded ? filteredInsights.slice(0, PAGE_SIZE * 5) : filteredInsights.slice(0, INITIAL_SHOW)
  const hasMore = filteredInsights.length > visibleInsights.length
  const hiddenCount = filteredInsights.length - visibleInsights.length

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<InsightCategory, number> = { positive: 0, concern: 0, anomaly: 0, trend: 0, comparison: 0 }
    for (const i of allInsights) counts[i.category]++
    return counts
  }, [allInsights])

  if (allInsights.length === 0) return null

  return (
    <ChartCard
      title="AI Insights"
      subtitle={`${filteredInsights.length} insight${filteredInsights.length !== 1 ? 's' : ''} from ${data.length} records`}
    >
      <div className="space-y-3">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          {ALL_CATEGORIES.map(cat => {
            const config = CATEGORY_CONFIG[cat]
            const count = categoryCounts[cat]
            const active = activeFilters.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleFilter(cat)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
                  active
                    ? cn(config.badgeColor, 'ring-1 ring-current/20')
                    : 'bg-slate-800/50 text-slate-600 hover:text-slate-400',
                )}
              >
                <config.icon className="h-3 w-3" />
                {config.label}
                <span className="ml-0.5 text-[10px] opacity-70">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:border-cane-500/50 focus:outline-none"
          />
        </div>

        {/* Insight list */}
        <div className={cn('space-y-2', expanded && 'max-h-[500px] overflow-y-auto pr-1')}>
          {visibleInsights.map((insight, i) => {
            const config = CATEGORY_CONFIG[insight.category]
            const Icon = config.icon
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2 rounded-lg border px-3 py-2',
                  config.border, config.bg,
                )}
              >
                <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', config.iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-300">{insight.text}</p>
                </div>
                <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium', config.badgeColor)}>
                  {config.label}
                </span>
              </div>
            )
          })}

          {filteredInsights.length === 0 && (
            <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4 text-center">
              <p className="text-xs text-slate-500">No insights match the current filters</p>
            </div>
          )}
        </div>

        {/* Expand / collapse */}
        {(filteredInsights.length > INITIAL_SHOW) && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/30 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-200"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                More Insights ({hasMore ? hiddenCount : filteredInsights.length - INITIAL_SHOW} more)
              </>
            )}
          </button>
        )}
      </div>
    </ChartCard>
  )
})
