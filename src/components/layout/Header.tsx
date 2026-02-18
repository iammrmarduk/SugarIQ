import { useState, useEffect } from 'react'
import { Maximize, FileDown, FileCode, Download, Wifi, WifiOff, Brain } from 'lucide-react'
import { getTimeString, getDateString } from '../../lib/utils'

interface HeaderProps {
  ollamaOnline: boolean
  onExportCsv: (() => void) | null
  onExportHtml: () => void
  onExportPdf: () => void
  onFullscreen: () => void
}

export function Header({ ollamaOnline, onExportCsv, onExportHtml, onExportPdf, onFullscreen }: HeaderProps) {
  const [time, setTime] = useState(getTimeString())
  const [date] = useState(getDateString())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeString()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cane-400 to-cane-600 font-bold text-slate-900 text-sm">
              IQ
            </div>
            <span className="text-lg font-bold text-white">
              Sugar<span className="text-cane-400">IQ</span>
            </span>
          </div>
          <span className="rounded-full bg-cane-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cane-400 border border-cane-500/20">
            Live Demo
          </span>
        </div>

        {/* Center: Live indicators */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="h-2 w-2 rounded-full bg-green-500 pulse-glow" />
            <span>Live Data</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {ollamaOnline ? (
              <>
                <Brain className="h-3.5 w-3.5 text-green-400" />
                <span className="text-green-400">AI Online</span>
              </>
            ) : (
              <>
                <Brain className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-500">AI Offline</span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-500">|</div>
          <div className="text-xs text-slate-400">{date}</div>
          <div className="font-mono text-sm font-semibold text-white">{time}</div>
          <span className="text-[10px] text-slate-500">SAST</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cane-500/50 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
          <button
            onClick={onExportHtml}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cane-500/50 hover:text-white"
          >
            <FileCode className="h-3.5 w-3.5" />
            Export HTML
          </button>
          <button
            onClick={onExportPdf}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cane-500/50 hover:text-white"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </button>
          <button
            onClick={onFullscreen}
            className="flex items-center gap-1.5 rounded-lg bg-cane-500 px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-cane-400"
          >
            <Maximize className="h-3.5 w-3.5" />
            Present
          </button>
        </div>
      </div>
    </header>
  )
}
