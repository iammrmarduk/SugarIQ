import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'ZAR'): string {
  if (currency === 'ZAR') {
    if (value >= 1_000_000_000) return `R${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `R${(value / 1_000_000).toFixed(0)}M`
    if (value >= 1_000) return `R${(value / 1_000).toFixed(0)}K`
    return `R${value.toFixed(0)}`
  }
  return `$${value.toLocaleString()}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

export function formatTonnes(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M tonnes`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K tonnes`
  return `${value.toLocaleString()} tonnes`
}

export function getTimeString(): string {
  return new Date().toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Africa/Johannesburg',
  })
}

export function getDateString(): string {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Johannesburg',
  })
}

export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'critical': return 'text-red-400 bg-red-950 border-red-800'
    case 'high': return 'text-orange-400 bg-orange-950 border-orange-800'
    case 'moderate': return 'text-yellow-400 bg-yellow-950 border-yellow-800'
    case 'low': return 'text-green-400 bg-green-950 border-green-800'
    default: return 'text-slate-400 bg-slate-800 border-slate-700'
  }
}

export function getRiskDotColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'moderate': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-slate-500'
  }
}
