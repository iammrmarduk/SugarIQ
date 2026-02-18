// useStatsWorker.ts — Hook to offload heavy stats to a Web Worker

import { useState, useEffect, useRef } from 'react'
import type { R7106ExtendedRecord } from '../lib/r7106-extended'
import type { Anomaly } from '../lib/r7106-stats'
import type { WorkerRequest, WorkerResponse } from '../lib/stats-worker'

interface StatsWorkerResult {
  anomalies: Anomaly[]
  correlationMatrix: number[][] | null
  loading: boolean
}

interface StatsWorkerParams {
  /** Already-filtered data (by mills + weeks) from the dashboard */
  data: R7106ExtendedRecord[]
  selectedMills: number[]
  anomalyMetrics: { key: keyof R7106ExtendedRecord; label: string }[]
  correlationKeys: (keyof R7106ExtendedRecord)[]
}

export function useStatsWorker({
  data,
  selectedMills,
  anomalyMetrics,
  correlationKeys,
}: StatsWorkerParams): StatsWorkerResult {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [matrix, setMatrix] = useState<number[][] | null>(null)
  const [loading, setLoading] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const requestIdRef = useRef(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Create worker on mount
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../lib/stats-worker.ts', import.meta.url),
      { type: 'module' },
    )

    workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const { id, anomalies: a, correlationMatrix: m, error } = e.data
      // Only accept the most recent response
      if (id === requestIdRef.current) {
        if (error) {
          console.warn('[stats-worker]', error)
        }
        if (a) setAnomalies(a)
        if (m) setMatrix(m)
        setLoading(false)
      }
    }

    workerRef.current.onerror = () => {
      setLoading(false)
    }

    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Post to worker when inputs change (debounced 100ms)
  // `data` is already filtered by mills + weeks from the parent dashboard,
  // so we send it directly — no additional filtering needed.
  useEffect(() => {
    if (!workerRef.current || data.length === 0) {
      setAnomalies([])
      setMatrix(null)
      setLoading(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    setLoading(true)

    debounceRef.current = setTimeout(() => {
      const id = ++requestIdRef.current

      const request: WorkerRequest = {
        id,
        type: 'both',
        data,
        anomalyMetrics,
        correlationKeys,
      }

      workerRef.current?.postMessage(request)
    }, 100)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [data, selectedMills, anomalyMetrics, correlationKeys])

  return { anomalies, correlationMatrix: matrix, loading }
}
