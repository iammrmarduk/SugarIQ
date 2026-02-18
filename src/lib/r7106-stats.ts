// r7106-stats.ts — Statistical utilities for Factory V2 dashboard
import type { R7106ExtendedRecord } from './r7106-extended'
import { MILL_NAMES } from './r7106-data'

// ── Normalize to Range ─────────────────────────────────────────────────

/**
 * Normalize a value to [0, 100] based on min/max.
 * If `invert` is true, higher raw values → lower normalized values.
 */
export function normalizeToRange(
  value: number,
  min: number,
  max: number,
  invert: boolean = false,
): number {
  if (max === min) return 50
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const normalized = ratio * 100
  return invert ? 100 - normalized : normalized
}

// ── Linear Regression ──────────────────────────────────────────────────

export interface RegressionResult {
  slope: number
  intercept: number
  r2: number
}

export function linearRegression(xs: number[], ys: number[]): RegressionResult {
  const n = xs.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  let sumX = 0
  let sumY = 0
  let sumXX = 0
  let sumXY = 0
  let sumYY = 0

  for (let i = 0; i < n; i++) {
    sumX += xs[i]
    sumY += ys[i]
    sumXX += xs[i] * xs[i]
    sumXY += xs[i] * ys[i]
    sumYY += ys[i] * ys[i]
  }

  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 }

  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  // R² = correlation coefficient squared
  const yMean = sumY / n
  let ssTot = 0
  let ssRes = 0
  for (let i = 0; i < n; i++) {
    const predicted = slope * xs[i] + intercept
    ssTot += (ys[i] - yMean) ** 2
    ssRes += (ys[i] - predicted) ** 2
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot

  return { slope, intercept, r2 }
}

// ── Moving Average ─────────────────────────────────────────────────────

/**
 * Compute centered moving average.
 * Returns null for positions where the full window isn't available.
 */
export function movingAverage(
  values: number[],
  window: number,
): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null)
  const half = Math.floor(window / 2)

  for (let i = half; i < values.length - half; i++) {
    let sum = 0
    for (let j = i - half; j <= i + half; j++) {
      sum += values[j]
    }
    result[i] = sum / window
  }

  return result
}

// ── Box Plot Statistics ────────────────────────────────────────────────

export interface BoxPlotStats {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  iqr: number
  lowerFence: number
  upperFence: number
  outliers: number[]
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo)
}

export function boxPlotStats(values: number[]): BoxPlotStats {
  const sorted = [...values].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const median = quantile(sorted, 0.5)
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  const lowerFence = q1 - 1.5 * iqr
  const upperFence = q3 + 1.5 * iqr

  const outliers = sorted.filter((v) => v < lowerFence || v > upperFence)

  return { min, q1, median, q3, max, iqr, lowerFence, upperFence, outliers }
}

// ── Anomaly Detection ──────────────────────────────────────────────────

export interface Anomaly {
  mill: number
  millName: string
  week: number
  metric: string
  metricLabel: string
  value: number
  zScore: number
  severity: 'warning' | 'critical'
  method: 'z-score' | 'iqr'
}

/**
 * Detect outliers using both Z-score (global) and IQR (per-mill) methods.
 */
export function detectAnomalies(
  data: R7106ExtendedRecord[],
  metrics: { key: keyof R7106ExtendedRecord; label: string }[],
): Anomaly[] {
  const anomalies: Anomaly[] = []

  for (const metric of metrics) {
    const values = data.map((r) => r[metric.key] as number).filter((v) => typeof v === 'number' && v !== 0)
    if (values.length < 5) continue

    // Global Z-score
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
    const std = Math.sqrt(variance)

    if (std > 0) {
      for (const r of data) {
        const val = r[metric.key] as number
        if (typeof val !== 'number' || val === 0) continue

        const z = (val - mean) / std
        if (Math.abs(z) > 2.5) {
          anomalies.push({
            mill: r.mill,
            millName: r.millName || MILL_NAMES[r.mill] || `Mill ${r.mill}`,
            week: r.week,
            metric: metric.key,
            metricLabel: metric.label,
            value: val,
            zScore: z,
            severity: Math.abs(z) > 3.5 ? 'critical' : 'warning',
            method: 'z-score',
          })
        }
      }
    }

    // Per-mill IQR
    const byMill = new Map<number, { values: number[]; records: R7106ExtendedRecord[] }>()
    for (const r of data) {
      const val = r[metric.key] as number
      if (typeof val !== 'number' || val === 0) continue
      const entry = byMill.get(r.mill) ?? { values: [], records: [] }
      entry.values.push(val)
      entry.records.push(r)
      byMill.set(r.mill, entry)
    }

    for (const [mill, { values: millVals, records }] of byMill) {
      if (millVals.length < 4) continue

      const stats = boxPlotStats(millVals)
      const millMean = millVals.reduce((s, v) => s + v, 0) / millVals.length
      const millVar = millVals.reduce((s, v) => s + (v - millMean) ** 2, 0) / millVals.length
      const millStd = Math.sqrt(millVar)

      for (const r of records) {
        const val = r[metric.key] as number
        if (val < stats.lowerFence || val > stats.upperFence) {
          const z = millStd > 0 ? (val - millMean) / millStd : 0

          // Avoid duplicating if already flagged by z-score
          const already = anomalies.some(
            (a) =>
              a.mill === mill &&
              a.week === r.week &&
              a.metric === metric.key &&
              a.method === 'z-score',
          )
          if (already) continue

          anomalies.push({
            mill,
            millName: r.millName || MILL_NAMES[mill] || `Mill ${mill}`,
            week: r.week,
            metric: metric.key,
            metricLabel: metric.label,
            value: val,
            zScore: z,
            severity: Math.abs(z) > 3.5 ? 'critical' : 'warning',
            method: 'iqr',
          })
        }
      }
    }
  }

  // Sort by severity (critical first), then z-score magnitude
  anomalies.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'critical' ? -1 : 1
    return Math.abs(b.zScore) - Math.abs(a.zScore)
  })

  return anomalies
}

// ── Correlation Matrix ─────────────────────────────────────────────────

/**
 * Compute Pearson correlation matrix for the given metric keys.
 * Returns a 2D array where matrix[i][j] is the correlation between key i and key j.
 */
export function correlationMatrix(
  data: R7106ExtendedRecord[],
  keys: (keyof R7106ExtendedRecord)[],
): number[][] {
  const n = keys.length
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))

  // Extract column arrays
  const cols: number[][] = keys.map((key) =>
    data.map((r) => r[key] as number),
  )

  // Compute means
  const means = cols.map((col) => col.reduce((s, v) => s + v, 0) / col.length)

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1
        continue
      }

      let sumXY = 0
      let sumXX = 0
      let sumYY = 0

      for (let k = 0; k < data.length; k++) {
        const dx = cols[i][k] - means[i]
        const dy = cols[j][k] - means[j]
        sumXY += dx * dy
        sumXX += dx * dx
        sumYY += dy * dy
      }

      const denom = Math.sqrt(sumXX * sumYY)
      const r = denom === 0 ? 0 : sumXY / denom

      matrix[i][j] = r
      matrix[j][i] = r
    }
  }

  return matrix
}

// ── Histogram ──────────────────────────────────────────────────────────

export interface HistogramBin {
  binStart: number
  binEnd: number
  label: string
  counts: Record<number, number>  // mill → count
  total: number
}

export function computeHistogram(
  data: R7106ExtendedRecord[],
  key: keyof R7106ExtendedRecord,
  bins: number,
  selectedMills: number[],
): HistogramBin[] {
  const filtered = selectedMills.length > 0
    ? data.filter((r) => selectedMills.includes(r.mill))
    : data

  const values = filtered
    .map((r) => ({ val: r[key] as number, mill: r.mill }))
    .filter((v) => typeof v.val === 'number' && v.val !== 0 && !isNaN(v.val))

  if (values.length === 0) return []

  const allVals = values.map((v) => v.val)
  const min = Math.min(...allVals)
  const max = Math.max(...allVals)
  const range = max - min || 1
  const binWidth = range / bins

  const result: HistogramBin[] = []

  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binWidth
    const binEnd = i === bins - 1 ? max + 0.001 : min + (i + 1) * binWidth

    const counts: Record<number, number> = {}
    let total = 0

    for (const v of values) {
      if (v.val >= binStart && v.val < binEnd) {
        counts[v.mill] = (counts[v.mill] ?? 0) + 1
        total++
      }
    }

    result.push({
      binStart,
      binEnd: i === bins - 1 ? max : binEnd,
      label: `${binStart.toFixed(1)}`,
      counts,
      total,
    })
  }

  return result
}
