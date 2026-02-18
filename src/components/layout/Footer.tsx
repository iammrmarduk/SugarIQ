export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Built by</span>
          <span className="font-medium text-slate-400">VillageIO Pty Ltd</span>
          <span>for</span>
          <span className="font-medium text-slate-400">
            South African Sugar Association
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Data: SASA, SA Canegrowers, USDA, ITAC, Open-Meteo</span>
          <span className="text-slate-600">|</span>
          <span>Confidential — Demo Only</span>
        </div>
      </div>
    </footer>
  )
}
