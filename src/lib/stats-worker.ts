// stats-worker.ts — Web Worker for expensive Factory V2 computations
// Runs anomaly detection and correlation matrix off the main thread.

import { detectAnomalies, correlationMatrix } from './r7106-stats'
import type { R7106ExtendedRecord } from './r7106-extended'
import type { Anomaly } from './r7106-stats'

// ── Message types ─────────────────────────────────────────────────────

export interface WorkerRequest {
  id: number
  type: 'anomalies' | 'correlation' | 'both'
  data: R7106ExtendedRecord[]
  anomalyMetrics?: { key: keyof R7106ExtendedRecord; label: string }[]
  correlationKeys?: (keyof R7106ExtendedRecord)[]
}

export interface WorkerResponse {
  id: number
  anomalies?: Anomaly[]
  correlationMatrix?: number[][]
  error?: string
}

// ── Worker entry ──────────────────────────────────────────────────────

const ctx = self as unknown as Worker

ctx.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, type, data, anomalyMetrics, correlationKeys } = e.data
  const response: WorkerResponse = { id }

  try {
    if ((type === 'anomalies' || type === 'both') && anomalyMetrics) {
      response.anomalies = detectAnomalies(data, anomalyMetrics)
    }

    if ((type === 'correlation' || type === 'both') && correlationKeys) {
      response.correlationMatrix = correlationMatrix(data, correlationKeys)
    }
  } catch (err) {
    response.error = err instanceof Error ? err.message : 'Worker computation failed'
  }

  ctx.postMessage(response)
}
