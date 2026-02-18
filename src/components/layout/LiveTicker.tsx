import { DollarSign, Cloud, TrendingUp, Droplets } from 'lucide-react'
import type { WeatherData } from '../../lib/api'

interface LiveTickerProps {
  zarUsd: number | null
  weather: WeatherData[]
}

export function LiveTicker({ zarUsd, weather }: LiveTickerProps) {
  const items = [
    {
      icon: DollarSign,
      label: 'ZAR/USD',
      value: zarUsd ? `R${zarUsd.toFixed(2)}` : 'Loading...',
      color: 'text-green-400',
    },
    {
      icon: TrendingUp,
      label: 'ICE #11 Raw Sugar',
      value: 'US¢18.73/lb',
      color: 'text-cane-400',
    },
    ...weather.map((w) => ({
      icon: w.rainfall > 0 ? Droplets : Cloud,
      label: w.location,
      value: `${w.temp.toFixed(0)}°C ${w.description}${w.rainfall > 0 ? ` (${w.rainfall}mm)` : ''}`,
      color: w.rainfall > 0 ? 'text-blue-400' : 'text-sky-400',
    })),
    {
      icon: TrendingUp,
      label: 'SA Local Sugar',
      value: 'R12,850/t',
      color: 'text-cane-400',
    },
    {
      icon: DollarSign,
      label: 'ITAC Ref Price',
      value: 'US$680/t',
      color: 'text-amber-400',
    },
  ]

  return (
    <div className="overflow-hidden border-b border-slate-800 bg-slate-900/30">
      <div className="animate-ticker flex whitespace-nowrap py-1.5">
        {/* Duplicate for seamless scroll */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="mx-6 flex items-center gap-2">
            <item.icon className={`h-3 w-3 ${item.color}`} />
            <span className="text-[11px] text-slate-500">{item.label}:</span>
            <span className={`text-[11px] font-medium ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
