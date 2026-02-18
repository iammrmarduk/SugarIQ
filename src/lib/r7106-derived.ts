// Derived statistics computed from R7106 sample data
// Used across panels: MillOps, CTS Lab, Sugar Map, Precision Ag, Import Intel

import { r7106SampleData, MILL_NAMES, type R7106Record } from './r7106-data'

// ══════════════════════════════════════════════════════════════════════
// Mappings
// ══════════════════════════════════════════════════════════════════════

export const MILL_CODE_TO_ID: Record<number, string> = {
  61: 'pongola', 62: 'umfolozi', 65: 'felixton', 66: 'amatikulu',
  70: 'komati', 71: 'gledhow', 72: 'malelane', 73: 'maidstone',
  75: 'eston', 77: 'sezela', 79: 'dalton', 80: 'noodsberg',
}

// Mills with CTS labs (excludes UCL/Dalton which shares with Noodsberg)
const CTS_MILL_CODES = [61, 62, 65, 66, 70, 71, 72, 73, 75, 77, 80]

// Grower names per mill for CTS sample display
const GROWER_NAMES: Record<number, string[]> = {
  77: ['Naidoo Bros', 'Joubert & Co'],
  73: ['Van der Merwe', 'Ndlovu Trust'],
  65: ['Dlamini Holdings', 'Reddy Plantations'],
  66: ['Sithole Family', 'Cele Small-scale'],
  75: ['Patel & Sons', 'Du Plessis Farms'],
  80: ['Zulu Cane Co-op', 'Shabalala Group'],
  70: ['Maharaj Farms', 'De Villiers Farm'],
  72: ['Ngcobo & Partners', 'Moodley Agri'],
  61: ['Botha Estate', 'Thompson Estate'],
  71: ['Mkhize Growers', 'Khumalo Farmers'],
  62: ['Singh Agricultural', 'Govender Trust'],
  79: ['UCL Members', 'Midlands Co-op'],
}

// ══════════════════════════════════════════════════════════════════════
// Mill Stats
// ══════════════════════════════════════════════════════════════════════

export interface MillStats {
  millCode: number
  millId: string
  millName: string
  avgRV: number
  avgPol: number
  avgBrix: number
  avgFibre: number
  avgPurity: number
  avgPolExtraction: number
  avgSucroseExtraction: number
  avgCrushRate: number
  avgTimeEfficiency: number
  avgMechStop: number
  avgNoCaneStop: number
  avgOpStop: number
  totalCaneTons: number
  weekCount: number
  records: R7106Record[]
}

function positiveAvg(records: R7106Record[], key: keyof R7106Record): number {
  const vals = records.map(r => Number(r[key])).filter(v => v > 0)
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function computeMillStats(): MillStats[] {
  const codes = [...new Set(r7106SampleData.map(r => r.mill))].sort((a, b) => a - b)
  return codes.map(code => {
    const records = r7106SampleData.filter(r => r.mill === code)
    return {
      millCode: code,
      millId: MILL_CODE_TO_ID[code] || `mill-${code}`,
      millName: MILL_NAMES[code] || `Mill ${code}`,
      avgRV: positiveAvg(records, 'rvPercent'),
      avgPol: positiveAvg(records, 'polPercent'),
      avgBrix: positiveAvg(records, 'brixPercent'),
      avgFibre: positiveAvg(records, 'fibrePercent'),
      avgPurity: positiveAvg(records, 'purityPercent'),
      avgPolExtraction: positiveAvg(records, 'polExtraction'),
      avgSucroseExtraction: positiveAvg(records, 'sucroseExtraction'),
      avgCrushRate: positiveAvg(records, 'crushRate'),
      avgTimeEfficiency: positiveAvg(records, 'timeEfficiency'),
      avgMechStop: positiveAvg(records, 'mechStopPercent'),
      avgNoCaneStop: positiveAvg(records, 'noCaneStopPercent'),
      avgOpStop: positiveAvg(records, 'opStopPercent'),
      totalCaneTons: records.reduce((sum, r) => sum + r.caneTons, 0),
      weekCount: records.length,
      records,
    }
  })
}

export const millStatsList = computeMillStats()

export const millStatsById: Record<string, MillStats> = Object.fromEntries(
  millStatsList.map(ms => [ms.millId, ms])
)

// ══════════════════════════════════════════════════════════════════════
// CTS Sample Data — derived from actual R7106 weekly records
// ══════════════════════════════════════════════════════════════════════

function generateFlagReason(r: R7106Record): string | null {
  const reasons: string[] = []
  if (r.rvPercent > 0 && r.rvPercent < 11)
    reasons.push(`Low RV ${r.rvPercent.toFixed(2)} — below expected range (11.0+); investigate cane freshness or delivery delay`)
  if (r.fibrePercent > 15)
    reasons.push(`High fibre ${r.fibrePercent.toFixed(1)}% — ${((r.fibrePercent - 14) / 0.8).toFixed(1)}\u03C3 above seasonal mean; check cane age or variety`)
  if (r.purityPercent > 0 && r.purityPercent < 84)
    reasons.push(`Low purity ${r.purityPercent.toFixed(1)}% vs lab average; possible juice degradation`)
  return reasons.length > 0 ? reasons.join('; ') : null
}

function generateCTSSamples() {
  const samples: {
    id: string; grower: string; lab: string
    brix: number; pol: number; fibre: number; rv: number; purity: number
    status: 'normal' | 'flagged'; flagReason: string | null
  }[] = []

  let sampleNum = 401

  for (const code of CTS_MILL_CODES) {
    const records = r7106SampleData.filter(r => r.mill === code)
    if (records.length === 0) continue
    const picks = records.slice(-2) // most recent weeks
    const growers = GROWER_NAMES[code] || [`Grower A`, `Grower B`]

    for (let i = 0; i < picks.length && i < growers.length; i++) {
      const r = picks[i]
      const flagReason = generateFlagReason(r)
      samples.push({
        id: `S-0${sampleNum++}`,
        grower: growers[i],
        lab: `CTS ${MILL_NAMES[code]}`,
        brix: Math.round(r.brixPercent * 10) / 10,
        pol: Math.round(r.polPercent * 10) / 10,
        fibre: Math.round(r.fibrePercent * 10) / 10,
        rv: Math.round(r.rvPercent * 100) / 100,
        purity: Math.round(r.purityPercent * 100) / 100,
        status: flagReason ? 'flagged' : 'normal',
        flagReason,
      })
    }
  }

  return samples
}

export const derivedCTSSamples = generateCTSSamples()

// ══════════════════════════════════════════════════════════════════════
// CTS Weekly RV — actual weekly averages across all mills
// ══════════════════════════════════════════════════════════════════════

function computeWeeklyRV() {
  const weekMap = new Map<number, { rvSum: number; count: number }>()
  for (const r of r7106SampleData) {
    if (r.rvPercent <= 0) continue
    const entry = weekMap.get(r.week) || { rvSum: 0, count: 0 }
    entry.rvSum += r.rvPercent
    entry.count++
    weekMap.set(r.week, entry)
  }
  return [...weekMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([week, { rvSum, count }]) => ({
      week: `Wk ${week}`,
      avgRV: Math.round((rvSum / count) * 100) / 100,
      samples: count * 28, // ~28 individual samples per mill-week aggregate
    }))
}

export const derivedWeeklyRV = computeWeeklyRV()

// ══════════════════════════════════════════════════════════════════════
// CTS Lab Stats — per-lab performance summary
// ══════════════════════════════════════════════════════════════════════

function computeCTSLabStats() {
  return millStatsList
    .filter(ms => CTS_MILL_CODES.includes(ms.millCode))
    .map(ms => {
      const rvValues = ms.records.map(r => r.rvPercent).filter(v => v > 0)
      const rvMean = ms.avgRV
      const rvStd = rvValues.length > 1
        ? Math.sqrt(rvValues.reduce((sum, v) => sum + (v - rvMean) ** 2, 0) / (rvValues.length - 1))
        : 0
      const anomalyCount = rvValues.filter(v => Math.abs(v - rvMean) > 2 * rvStd).length
      const anomalyRate = rvValues.length > 0
        ? Math.round((anomalyCount / rvValues.length) * 1000) / 10
        : 0

      const qualityScore = Math.min(99, Math.round(
        (Math.min(ms.avgPolExtraction, 100) / 100) * 40 +
        (Math.min(ms.avgPurity, 100) / 100) * 30 +
        (Math.min(ms.avgTimeEfficiency, 100) / 100) * 30
      ))

      const avgWeeklyCane = ms.totalCaneTons / Math.max(ms.weekCount, 1)
      const samplesDaily = Math.max(50, Math.round(avgWeeklyCane / 7 / 150))

      return {
        lab: `CTS ${ms.millName}`,
        samplesDaily,
        avgRV: Math.round(ms.avgRV * 100) / 100,
        anomalyRate: Math.max(anomalyRate, 0.8),
        qualityScore,
      }
    })
}

export const derivedCTSLabStats = computeCTSLabStats()

// ══════════════════════════════════════════════════════════════════════
// CTS AI Insights — data-driven observations
// ══════════════════════════════════════════════════════════════════════

function generateCTSInsights(): string[] {
  const insights: string[] = []
  const weeklyRV = derivedWeeklyRV
  const labStats = derivedCTSLabStats

  // RV trend over last 4 weeks
  if (weeklyRV.length >= 4) {
    const recent = weeklyRV.slice(-4)
    const delta = recent[recent.length - 1].avgRV - recent[0].avgRV
    const pct = Math.abs(delta / recent[0].avgRV * 100).toFixed(1)
    insights.push(
      delta < 0
        ? `RV trending down ${pct}% over last 4 weeks — seasonal decline, but worth monitoring`
        : `RV improved ${pct}% over last 4 weeks — positive quality trend`
    )
  }

  // Highest anomaly rate lab
  const avgAnomaly = labStats.reduce((s, l) => s + l.anomalyRate, 0) / labStats.length
  const sortedByAnomaly = [...labStats].sort((a, b) => b.anomalyRate - a.anomalyRate)
  if (sortedByAnomaly[0] && sortedByAnomaly[0].anomalyRate > avgAnomaly * 1.2) {
    const worst = sortedByAnomaly[0]
    insights.push(
      `${worst.lab} anomaly rate (${worst.anomalyRate.toFixed(1)}%) is ${(worst.anomalyRate / avgAnomaly).toFixed(1)}x the network average — investigate instrument calibration`
    )
  }

  // Lowest RV lab
  const sortedByRV = [...labStats].sort((a, b) => a.avgRV - b.avgRV)
  insights.push(
    `${sortedByRV[0].lab} has the lowest average RV (${sortedByRV[0].avgRV.toFixed(2)}) — review regional cane supply quality and delivery logistics`
  )

  // Best performer
  const best = sortedByRV[sortedByRV.length - 1]
  insights.push(
    `${best.lab} leads the network with highest average RV (${best.avgRV.toFixed(2)}) — benchmark cane variety and harvest practices for fleet improvement`
  )

  return insights
}

export const derivedCTSInsights = generateCTSInsights()

// ══════════════════════════════════════════════════════════════════════
// Maintenance Alerts — data-driven from R7106 patterns
// ══════════════════════════════════════════════════════════════════════

function generateMaintenanceAlerts() {
  const alerts: {
    mill: string; severity: 'high' | 'moderate' | 'low'
    message: string; component: string; daysUntil: number
  }[] = []

  const fleetAvg = {
    mechStop: millStatsList.reduce((s, m) => s + m.avgMechStop, 0) / millStatsList.length,
    noCaneStop: millStatsList.reduce((s, m) => s + m.avgNoCaneStop, 0) / millStatsList.length,
    crushRate: millStatsList.reduce((s, m) => s + m.avgCrushRate, 0) / millStatsList.length,
    extraction: millStatsList.reduce((s, m) => s + m.avgPolExtraction, 0) / millStatsList.length,
  }

  for (const ms of millStatsList) {
    // High mechanical stops
    if (ms.avgMechStop > 0 && ms.avgMechStop > fleetAvg.mechStop * 1.5) {
      const ratio = (ms.avgMechStop / fleetAvg.mechStop).toFixed(1)
      alerts.push({
        mill: ms.millName,
        severity: ms.avgMechStop > fleetAvg.mechStop * 2 ? 'high' : 'moderate',
        message: `Mechanical stops averaging ${ms.avgMechStop.toFixed(1)}% — ${ratio}x fleet average (${fleetAvg.mechStop.toFixed(1)}%). Predictive maintenance review recommended.`,
        component: 'Mechanical systems',
        daysUntil: ms.avgMechStop > fleetAvg.mechStop * 2 ? 3 : 14,
      })
    }

    // High no-cane stops
    if (ms.avgNoCaneStop > 0 && ms.avgNoCaneStop > fleetAvg.noCaneStop * 1.8) {
      alerts.push({
        mill: ms.millName,
        severity: 'moderate',
        message: `No-cane stops at ${ms.avgNoCaneStop.toFixed(1)}% — supply chain disruption pattern detected. Review transport logistics and grower delivery scheduling.`,
        component: 'Cane supply logistics',
        daysUntil: 7,
      })
    }

    // Low extraction vs fleet
    if (ms.avgPolExtraction > 0 && ms.avgPolExtraction < fleetAvg.extraction * 0.98) {
      alerts.push({
        mill: ms.millName,
        severity: 'low',
        message: `Pol extraction (${ms.avgPolExtraction.toFixed(1)}%) is below fleet average (${fleetAvg.extraction.toFixed(1)}%). Review diffuser/milling train settings.`,
        component: 'Extraction plant',
        daysUntil: 21,
      })
    }

    // Recent crush rate decline
    if (ms.records.length >= 6) {
      const recent = ms.records.slice(-3)
      const earlier = ms.records.slice(-6, -3)
      const recentCrush = recent.reduce((s, r) => s + r.crushRate, 0) / recent.length
      const earlierCrush = earlier.reduce((s, r) => s + r.crushRate, 0) / earlier.length
      if (earlierCrush > 0 && recentCrush > 0 && recentCrush < earlierCrush * 0.85) {
        alerts.push({
          mill: ms.millName,
          severity: 'high',
          message: `Crush rate dropped ${((1 - recentCrush / earlierCrush) * 100).toFixed(0)}% in recent weeks (${recentCrush.toFixed(0)} vs ${earlierCrush.toFixed(0)} TCH). Investigate roller wear or cane preparation issues.`,
          component: 'Crushing train',
          daysUntil: 5,
        })
      }
    }
  }

  return alerts.sort((a, b) => {
    const order = { high: 0, moderate: 1, low: 2 }
    return order[a.severity] - order[b.severity] || a.daysUntil - b.daysUntil
  })
}

export const derivedMaintenanceAlerts = generateMaintenanceAlerts()

// ══════════════════════════════════════════════════════════════════════
// Season Totals — industry-level aggregates
// ══════════════════════════════════════════════════════════════════════

function computeSeasonTotals() {
  const totalCane = r7106SampleData.reduce((sum, r) => sum + r.caneTons, 0)
  const withRV = r7106SampleData.filter(r => r.rvPercent > 0)
  const avgRV = withRV.length > 0
    ? withRV.reduce((s, r) => s + r.rvPercent, 0) / withRV.length : 0
  const withExtraction = r7106SampleData.filter(r => r.polExtraction > 0)
  const avgExtraction = withExtraction.length > 0
    ? withExtraction.reduce((s, r) => s + r.polExtraction, 0) / withExtraction.length : 0
  const withCrush = r7106SampleData.filter(r => r.crushRate > 0)
  const avgCrushRate = withCrush.length > 0
    ? withCrush.reduce((s, r) => s + r.crushRate, 0) / withCrush.length : 0

  return {
    totalCaneCrushed: totalCane,
    estimatedSugarProduced: totalCane * avgRV / 100,
    avgRV,
    avgExtraction,
    avgCrushRate,
  }
}

export const seasonTotals = computeSeasonTotals()
