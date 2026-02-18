import { useState, memo } from 'react'
import type { R7106ExtendedRecord, DataChecksum } from '../../lib/r7106-extended'
import { MILL_NAMES } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'
import { CheckCircle2, AlertTriangle, Search } from 'lucide-react'

interface DataValidationPanelProps {
  data: R7106ExtendedRecord[]
  checksum: DataChecksum
}

// ── Field grouping for spot-check display ────────────────────────────

interface FieldEntry {
  label: string
  key: keyof R7106ExtendedRecord
}

interface FieldSection {
  section: string
  fields: FieldEntry[]
}

const FIELD_SECTIONS: FieldSection[] = [
  {
    section: 'Identification',
    fields: [
      { label: 'Mill', key: 'mill' },
      { label: 'Mill Name', key: 'millName' },
      { label: 'Week', key: 'week' },
      { label: 'Tandem', key: 'tandem' },
    ],
  },
  {
    section: 'Cane',
    fields: [
      { label: 'Cane Tons', key: 'caneTons' },
      { label: 'Pol Tons', key: 'canePolTons' },
      { label: 'Pol %', key: 'canePolPct' },
      { label: 'Brix Tons', key: 'caneBrixTons' },
      { label: 'Brix %', key: 'caneBrixPct' },
      { label: 'Non-Pol Tons', key: 'caneNonPolTons' },
      { label: 'Non-Pol %', key: 'caneNonPolPct' },
      { label: 'Fibre Tons', key: 'caneFibreTons' },
      { label: 'Fibre %', key: 'caneFibrePct' },
      { label: 'Moisture Tons', key: 'caneMoistureTons' },
      { label: 'Moisture %', key: 'caneMoisturePct' },
      { label: 'RV Tons', key: 'caneRvTons' },
      { label: 'RV %', key: 'caneRvPct' },
      { label: 'Sucrose Tons', key: 'caneSucroseTons' },
      { label: 'Sucrose %', key: 'caneSucrosePct' },
      { label: 'Purity', key: 'canePurity' },
      { label: 'Suc Purity', key: 'caneSucPurity' },
    ],
  },
  {
    section: 'Mixed Juice',
    fields: [
      { label: 'MJ Tons', key: 'mjTons' },
      { label: 'MJ Tons %', key: 'mjTonsPct' },
      { label: 'Pol Tons', key: 'mjPolTons' },
      { label: 'Pol %', key: 'mjPolPct' },
      { label: 'Sucrose Tons', key: 'mjSucroseTons' },
      { label: 'Sucrose %', key: 'mjSucrosePct' },
      { label: 'Brix Tons', key: 'mjBrixTons' },
      { label: 'Brix %', key: 'mjBrixPct' },
      { label: 'Non-Pol Tons', key: 'mjNonPolTons' },
      { label: 'Non-Pol %', key: 'mjNonPolPct' },
      { label: 'Non-Suc Tons', key: 'mjNonSucTons' },
      { label: 'Non-Suc %', key: 'mjNonSucPct' },
      { label: 'Ins Solids Tons', key: 'mjInsSolidsTons' },
      { label: 'Ins Solids %', key: 'mjInsSolidsPct' },
      { label: 'Pol Purity', key: 'mjPolPurity' },
      { label: 'Suc Purity', key: 'mjSucPurity' },
      { label: 'Suc/Pol Ratio', key: 'mjSucPolRatio' },
      { label: 'NonSuc/NonPol Ratio', key: 'mjNonSucNonPolRatio' },
    ],
  },
  {
    section: 'Bagasse',
    fields: [
      { label: 'Bag Tons', key: 'bagTons' },
      { label: 'Bag Tons %', key: 'bagTonsPct' },
      { label: 'Pol Tons', key: 'bagPolTons' },
      { label: 'Pol %', key: 'bagPolPct' },
      { label: 'Sucrose Tons', key: 'bagSucroseTons' },
      { label: 'Sucrose %', key: 'bagSucrosePct' },
      { label: 'Brix Tons', key: 'bagBrixTons' },
      { label: 'Brix %', key: 'bagBrixPct' },
      { label: 'Non-Pol Tons', key: 'bagNonPolTons' },
      { label: 'Non-Pol %', key: 'bagNonPolPct' },
      { label: 'Non-Suc Tons', key: 'bagNonSucTons' },
      { label: 'Non-Suc %', key: 'bagNonSucPct' },
      { label: 'Fibre Tons', key: 'bagFibreTons' },
      { label: 'Fibre %', key: 'bagFibrePct' },
      { label: 'Moisture Tons', key: 'bagMoistureTons' },
      { label: 'Moisture %', key: 'bagMoisturePct' },
      { label: 'Pol Purity', key: 'bagPolPurity' },
      { label: 'Suc Purity', key: 'bagSucPurity' },
      { label: 'Suc/Pol Ratio', key: 'bagSucPolRatio' },
    ],
  },
  {
    section: 'Clarified Mud',
    fields: [
      { label: 'Mud Tons', key: 'mudTons' },
      { label: 'Mud Tons %', key: 'mudTonsPct' },
      { label: 'Pol Tons', key: 'mudPolTons' },
      { label: 'Pol %', key: 'mudPolPct' },
      { label: 'Sucrose Tons', key: 'mudSucroseTons' },
      { label: 'Sucrose %', key: 'mudSucrosePct' },
      { label: 'Brix Tons', key: 'mudBrixTons' },
      { label: 'Brix %', key: 'mudBrixPct' },
      { label: 'Non-Pol Tons', key: 'mudNonPolTons' },
      { label: 'Non-Pol %', key: 'mudNonPolPct' },
      { label: 'Non-Suc Tons', key: 'mudNonSucTons' },
      { label: 'Non-Suc %', key: 'mudNonSucPct' },
      { label: 'Ins Solids Tons', key: 'mudInsSolidsTons' },
      { label: 'Ins Solids %', key: 'mudInsSolidsPct' },
      { label: 'Pol Purity', key: 'mudPolPurity' },
      { label: 'Suc Purity', key: 'mudSucPurity' },
      { label: 'Suc/Pol Ratio', key: 'mudSucPolRatio' },
    ],
  },
  {
    section: 'Imbibition',
    fields: [
      { label: 'Mass Tons', key: 'imbMassTons' },
      { label: 'Mass %', key: 'imbMassPct' },
      { label: 'Pol Tons', key: 'imbPolTons' },
      { label: 'Pol %', key: 'imbPolPct' },
      { label: 'Brix Tons', key: 'imbBrixTons' },
      { label: 'Brix %', key: 'imbBrixPct' },
    ],
  },
  {
    section: 'DAC / Factors',
    fields: [
      { label: 'DAC Cane Tons', key: 'dacCaneTons' },
      { label: 'Pol Tons', key: 'dacPolTons' },
      { label: 'Pol %', key: 'dacPolPct' },
      { label: 'Brix Tons', key: 'dacBrixTons' },
      { label: 'Brix %', key: 'dacBrixPct' },
      { label: 'Non-Pol Tons', key: 'dacNonPolTons' },
      { label: 'Non-Pol %', key: 'dacNonPolPct' },
      { label: 'Fibre Tons', key: 'dacFibreTons' },
      { label: 'Fibre %', key: 'dacFibrePct' },
      { label: 'Moisture Tons', key: 'dacMoistureTons' },
      { label: 'Moisture %', key: 'dacMoisturePct' },
      { label: 'Factor Pol', key: 'dacFactorPol' },
      { label: 'Factor Brix', key: 'dacFactorBrix' },
      { label: 'Factor Non-Pol', key: 'dacFactorNonPol' },
      { label: 'Factor Fibre', key: 'dacFactorFibre' },
      { label: 'Factor Moisture', key: 'dacFactorMoisture' },
      { label: 'Purity', key: 'dacPurity' },
      { label: 'Suc Purity', key: 'dacSucPurity' },
    ],
  },
  {
    section: 'Time Account',
    fields: [
      { label: 'Time Efficiency', key: 'timeEfficiency' },
      { label: 'Milling Hours', key: 'millingHours' },
      { label: 'Milling %', key: 'millingHoursPct' },
      { label: 'Mech Stop Hours', key: 'mechStopHours' },
      { label: 'Mech Stop %', key: 'mechStopPct' },
      { label: 'No Cane Hours', key: 'noCaneHours' },
      { label: 'No Cane %', key: 'noCanePct' },
      { label: 'Op Stop Hours', key: 'opStopHours' },
      { label: 'Op Stop %', key: 'opStopPct' },
      { label: 'Scheduled Hours', key: 'scheduledHours' },
      { label: 'Scheduled %', key: 'scheduledPct' },
      { label: 'Foreign Matter Hours', key: 'foreignMatterHours' },
      { label: 'Foreign Matter %', key: 'foreignMatterPct' },
      { label: 'Engineering Hours', key: 'engineeringHours' },
      { label: 'Engineering %', key: 'engineeringPct' },
      { label: 'Force Majeure Hours', key: 'forceMajeureHours' },
      { label: 'Force Majeure %', key: 'forceMajeurePct' },
      { label: 'Depit Plant Hours', key: 'depitPlantHours' },
      { label: 'Depit Plant %', key: 'depitPlantPct' },
    ],
  },
  {
    section: 'Factor Diffs',
    fields: [
      { label: 'Brix-Pol', key: 'diffBrixPol' },
      { label: 'MJ-MB', key: 'diffMjMb' },
      { label: 'MB-DAC', key: 'diffMbDac' },
      { label: 'MJ-DAC Unadj', key: 'diffMjDacUnadj' },
      { label: 'MJ-DAC Adj Imb+Mud', key: 'diffMjDacAdjImbMud' },
      { label: 'MJ-DAC Adj Imb', key: 'diffMjDacAdjImb' },
      { label: 'MJ-DAC Adj Mud', key: 'diffMjDacAdjMud' },
    ],
  },
  {
    section: 'Performance',
    fields: [
      { label: 'Pol Extraction', key: 'polExtraction' },
      { label: 'Sucrose Extraction', key: 'sucroseExtraction' },
      { label: 'RV/Pol %', key: 'rvPolPct' },
      { label: 'Crush Rate', key: 'crushRate' },
      { label: 'Fibre Crush Rate', key: 'fibreCrushRate' },
      { label: 'Imb % Fibre', key: 'imbPercentFibre' },
      { label: 'Pol % Fibre Bag', key: 'polPercentFibreBag' },
      { label: 'Closing Stock', key: 'closingStock' },
      { label: 'Weekly Rain', key: 'weeklyRain' },
      { label: 'YTD Rain', key: 'ytdRain' },
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  return n.toLocaleString('en-ZA')
}

function formatValue(val: unknown): string {
  if (val === undefined || val === null) return '—'
  if (typeof val === 'string') return val
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return val.toLocaleString('en-ZA')
    return val.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  }
  return String(val)
}

function isZeroOrMissing(val: unknown): boolean {
  if (val === undefined || val === null || val === '') return true
  if (typeof val === 'number' && val === 0) return true
  return false
}

// ── Checksum stat row ────────────────────────────────────────────────

function ChecksumRow({ label, value, ok = true }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs text-slate-200">{value}</span>
        {ok ? (
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-amber-400" />
        )}
      </div>
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────

export const DataValidationPanel = memo(function DataValidationPanel({ data, checksum }: DataValidationPanelProps) {
  const [spotMill, setSpotMill] = useState<number>(checksum.millCodes[0] ?? 0)
  const [spotWeek, setSpotWeek] = useState<number>(checksum.weekMin || 1)
  const [spotRecord, setSpotRecord] = useState<R7106ExtendedRecord | null>(null)
  const [spotNotFound, setSpotNotFound] = useState(false)

  const handleSpotCheck = () => {
    const found = data.find(r => r.mill === spotMill && r.week === spotWeek) ?? null
    setSpotRecord(found)
    setSpotNotFound(!found)
  }

  return (
    <ChartCard
      title="Data Validation"
      subtitle="Checksum verification & spot checks"
    >
      <div className="space-y-5">
        {/* ── Checksum Summary ────────────────────────────────── */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Checksums
          </h4>
          <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
            <ChecksumRow
              label="Total rows"
              value={fmtNum(checksum.totalRows)}
              ok={checksum.totalRows > 0}
            />
            <ChecksumRow
              label="Total mills"
              value={fmtNum(checksum.totalMills)}
              ok={checksum.totalMills > 0}
            />
            <ChecksumRow
              label="Week range"
              value={`${checksum.weekMin} — ${checksum.weekMax}`}
              ok={checksum.weekMin > 0 && checksum.weekMax >= checksum.weekMin}
            />
            <ChecksumRow
              label="Cane tons"
              value={fmtNum(checksum.totalCaneTons)}
              ok={checksum.totalCaneTons > 0}
            />
            <ChecksumRow
              label="MJ tons"
              value={fmtNum(checksum.totalMjTons)}
              ok={checksum.totalMjTons > 0}
            />
            <ChecksumRow
              label="Bagasse tons"
              value={fmtNum(checksum.totalBagTons)}
              ok={checksum.totalBagTons > 0}
            />
            <ChecksumRow
              label="Mud tons"
              value={fmtNum(checksum.totalMudTons)}
              ok={checksum.totalMudTons > 0}
            />
          </div>

          {/* Per-mill row counts */}
          <div className="mt-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Rows per mill
            </span>
            <div className="mt-1 grid grid-cols-3 gap-x-4 gap-y-0.5 sm:grid-cols-4 lg:grid-cols-6">
              {checksum.millCodes.map(code => (
                <div key={code} className="flex items-center justify-between gap-1">
                  <span className="truncate text-[10px] text-slate-400">
                    {MILL_NAMES[code] ?? `Mill ${code}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-300">
                      {checksum.millRowCounts[code] ?? 0}
                    </span>
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="border-t border-slate-700/50" />

        {/* ── Spot Check ──────────────────────────────────────── */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Spot Check
          </h4>

          <div className="flex flex-wrap items-end gap-3">
            {/* Mill dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-slate-500">Mill</label>
              <select
                value={spotMill}
                onChange={e => setSpotMill(Number(e.target.value))}
                className={cn(
                  'h-8 rounded-md border border-slate-600/50 bg-slate-700/50 px-2',
                  'text-xs text-slate-200 outline-none',
                  'focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30',
                )}
              >
                {checksum.millCodes.map(code => (
                  <option key={code} value={code}>
                    {code} — {MILL_NAMES[code] ?? `Mill ${code}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Week input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-slate-500">Week</label>
              <input
                type="number"
                value={spotWeek}
                onChange={e => setSpotWeek(Number(e.target.value))}
                min={checksum.weekMin}
                max={checksum.weekMax}
                className={cn(
                  'h-8 w-20 rounded-md border border-slate-600/50 bg-slate-700/50 px-2',
                  'text-xs text-slate-200 outline-none',
                  'focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30',
                  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                )}
              />
            </div>

            {/* Check button */}
            <button
              onClick={handleSpotCheck}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-md px-3',
                'bg-blue-600/80 text-xs font-medium text-white',
                'hover:bg-blue-500/80 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
              )}
            >
              <Search className="h-3 w-3" />
              Check
            </button>
          </div>

          {/* Not found message */}
          {spotNotFound && !spotRecord && (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-700/40 bg-amber-900/20 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
              <span className="text-xs text-amber-300">
                No record found for mill {spotMill} week {spotWeek}
              </span>
            </div>
          )}

          {/* Spot check result table */}
          {spotRecord && (
            <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-slate-700/50">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-slate-800">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Field Name
                    </th>
                    <th className="px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FIELD_SECTIONS.map(section => (
                    <>
                      {/* Section header row */}
                      <tr key={`section-${section.section}`}>
                        <td
                          colSpan={2}
                          className="bg-slate-700/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                        >
                          {section.section}
                        </td>
                      </tr>

                      {/* Field rows */}
                      {section.fields.map(field => {
                        const val = spotRecord[field.key]
                        const zeroish = isZeroOrMissing(val)

                        return (
                          <tr
                            key={field.key}
                            className={cn(
                              'border-t border-slate-700/30',
                              zeroish ? 'bg-amber-900/10' : 'hover:bg-slate-700/20',
                            )}
                          >
                            <td className="px-3 py-1 text-xs text-slate-300">
                              <div className="flex items-center gap-1.5">
                                {zeroish && (
                                  <AlertTriangle className="h-2.5 w-2.5 flex-shrink-0 text-amber-400" />
                                )}
                                {field.label}
                              </div>
                            </td>
                            <td
                              className={cn(
                                'px-3 py-1 text-right font-mono text-xs',
                                zeroish ? 'text-amber-300' : 'text-slate-200',
                              )}
                            >
                              {formatValue(val)}
                            </td>
                          </tr>
                        )
                      })}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  )
})
