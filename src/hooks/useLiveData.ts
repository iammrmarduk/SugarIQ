import { useState, useEffect, useCallback } from 'react'
import { fetchExchangeRate, fetchWeather, detectOllamaModels, pickBestModel } from '../lib/api'
import type { WeatherData } from '../lib/api'

export interface LiveDataState {
  zarUsd: number | null
  weather: WeatherData[]
  ollamaModel: string | null
  ollamaOnline: boolean
  lastUpdated: Date | null
  loading: boolean
}

export function useLiveData() {
  const [state, setState] = useState<LiveDataState>({
    zarUsd: null,
    weather: [],
    ollamaModel: null,
    ollamaOnline: false,
    lastUpdated: null,
    loading: true,
  })

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))

    const [rate, weather, models] = await Promise.all([
      fetchExchangeRate(),
      fetchWeather(),
      detectOllamaModels(),
    ])

    const bestModel = pickBestModel(models)

    setState({
      zarUsd: rate,
      weather,
      ollamaModel: bestModel,
      ollamaOnline: models.length > 0,
      lastUpdated: new Date(),
      loading: false,
    })
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5 * 60 * 1000) // refresh every 5 min
    return () => clearInterval(interval)
  }, [refresh])

  return { ...state, refresh }
}
