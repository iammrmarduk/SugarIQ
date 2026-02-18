import { useState, useMemo, memo } from 'react'
import type { R7106ExtendedRecord } from '../../lib/r7106-extended'
import { MILL_NAMES } from '../../lib/r7106-data'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'

// ── Types ──────────────────────────────────────────────────────────────

type ViewMode = 'tons' | 'pol' | 'sucrose'

interface FlowData {
  cane: number
  mixedJuice: number
  bagasse: number
  mud: number
}

interface MassBalancePanelProps {
  data: R7106ExtendedRecord[]
  selectedMills: number[]
}

// ── View mode button labels ────────────────────────────────────────────

const VIEW_LABELS: { key: ViewMode; label: string }[] = [
  { key: 'tons', label: 'Tons' },
  { key: 'pol', label: 'Pol' },
  { key: 'sucrose', label: 'Sucrose' },
]

// ── Color palette ──────────────────────────────────────────────────────

const COLORS = {
  cane:       { fill: '#22c55e', stroke: '#16a34a', bg: 'rgba(34,197,94,0.25)' },
  mixedJuice: { fill: '#3b82f6', stroke: '#2563eb', bg: 'rgba(59,130,246,0.25)' },
  bagasse:    { fill: '#f59e0b', stroke: '#d97706', bg: 'rgba(245,158,11,0.25)' },
  mud:        { fill: '#f97316', stroke: '#ea580c', bg: 'rgba(249,115,22,0.25)' },
} as const

// ── Helpers ────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

function fmtTons(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toFixed(0)
}

function pct(part: number, total: number): string {
  if (total === 0) return '0.0%'
  return `${((part / total) * 100).toFixed(1)}%`
}

// ── SVG Sankey path (cubic bezier) ─────────────────────────────────────

function sankeyPath(
  x0: number, y0: number, h0: number,
  x1: number, y1: number, h1: number,
): string {
  const mx = (x0 + x1) / 2
  return [
    `M ${x0},${y0}`,
    `C ${mx},${y0} ${mx},${y1} ${x1},${y1}`,
    `L ${x1},${y1 + h1}`,
    `C ${mx},${y1 + h1} ${mx},${y0 + h0} ${x0},${y0 + h0}`,
    'Z',
  ].join(' ')
}

// ── Component ──────────────────────────────────────────────────────────

export const MassBalancePanel = memo(function MassBalancePanel({ data, selectedMills }: MassBalancePanelProps) {
  const [view, setView] = useState<ViewMode>('tons')

  // Filter data to selected mills
  const filtered = useMemo(() => {
    if (selectedMills.length === 0) return data
    return data.filter((r) => selectedMills.includes(r.mill))
  }, [data, selectedMills])

  // Compute flow values for the current view mode
  const flow = useMemo<FlowData>(() => {
    if (filtered.length === 0) return { cane: 0, mixedJuice: 0, bagasse: 0, mud: 0 }

    switch (view) {
      case 'tons':
        return {
          cane: avg(filtered.map((r) => r.caneTons)),
          mixedJuice: avg(filtered.map((r) => r.mjTons)),
          bagasse: avg(filtered.map((r) => r.bagTons)),
          mud: avg(filtered.map((r) => r.mudTons)),
        }
      case 'pol':
        return {
          cane: avg(filtered.map((r) => r.canePolTons)),
          mixedJuice: avg(filtered.map((r) => r.mjPolTons)),
          bagasse: avg(filtered.map((r) => r.bagPolTons)),
          mud: avg(filtered.map((r) => r.mudPolTons)),
        }
      case 'sucrose':
        return {
          cane: avg(filtered.map((r) => r.caneSucroseTons)),
          mixedJuice: avg(filtered.map((r) => r.mjSucroseTons)),
          bagasse: avg(filtered.map((r) => r.bagSucroseTons)),
          mud: avg(filtered.map((r) => r.mudSucroseTons)),
        }
    }
  }, [filtered, view])

  // Compute percentages
  const total = flow.mixedJuice + flow.bagasse + flow.mud
  const mjPct = total > 0 ? (flow.mixedJuice / total) * 100 : 0
  const bagPct = total > 0 ? (flow.bagasse / total) * 100 : 0
  const mudPct = total > 0 ? (flow.mud / total) * 100 : 0

  // Mills subtitle
  const millsLabel =
    selectedMills.length > 0
      ? selectedMills.map((m) => MILL_NAMES[m] || `Mill ${m}`).join(', ')
      : 'All mills'

  const unitLabel = view === 'tons' ? 'tonnes' : view === 'pol' ? 'pol tonnes' : 'sucrose tonnes'

  // ── SVG Layout Constants ───────────────────────────────────────────

  const svgW = 700
  const svgH = 300
  const pad = 20
  const barW = 60
  const gapY = 6   // gap between right-side stacked bars

  // Left bar (Cane)
  const leftX = pad
  const leftY = pad
  const leftH = svgH - 2 * pad

  // Right bars — stacked proportionally
  const rightX = svgW - pad - barW
  const rightAreaH = svgH - 2 * pad - 2 * gapY // total drawable for 3 bars

  const mjH  = total > 0 ? (flow.mixedJuice / total) * rightAreaH : rightAreaH / 3
  const bagH = total > 0 ? (flow.bagasse / total) * rightAreaH : rightAreaH / 3
  const mudH = total > 0 ? (flow.mud / total) * rightAreaH : rightAreaH / 3

  const mjY  = pad
  const bagY = mjY + mjH + gapY
  const mudY = bagY + bagH + gapY

  // Flow path coordinates (connect right edge of left bar to left edge of right bars)
  const pathX0 = leftX + barW
  const pathX1 = rightX

  // Each flow path maps a portion of the left bar to the corresponding right bar
  // Proportional allocation of left bar height
  const mjShareH  = total > 0 ? (flow.mixedJuice / total) * leftH : leftH / 3
  const bagShareH = total > 0 ? (flow.bagasse / total) * leftH : leftH / 3
  const mudShareH = total > 0 ? (flow.mud / total) * leftH : leftH / 3

  const mjLeftY  = leftY
  const bagLeftY = mjLeftY + mjShareH
  const mudLeftY = bagLeftY + bagShareH

  return (
    <ChartCard
      title="Mass Balance \u2014 Sankey"
      subtitle={`Material flow: Cane \u2192 Juice + Bagasse + Mud \u00B7 ${millsLabel}`}
      action={
        <div className="flex gap-1">
          {VIEW_LABELS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                view === v.key
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      }
    >
      {filtered.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No data available for selected mills
        </div>
      ) : (
        <>
          {/* ── SVG Sankey Diagram ──────────────────────────────── */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="mx-auto w-full max-w-[700px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradient for flow paths */}
                <linearGradient id="mb-grad-mj" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.cane.fill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.mixedJuice.fill} stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="mb-grad-bag" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.cane.fill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.bagasse.fill} stopOpacity={0.35} />
                </linearGradient>
                <linearGradient id="mb-grad-mud" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.cane.fill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.mud.fill} stopOpacity={0.35} />
                </linearGradient>
              </defs>

              {/* ── Flow paths (behind bars) ──────────────────── */}
              <path
                d={sankeyPath(pathX0, mjLeftY, mjShareH, pathX1, mjY, mjH)}
                fill="url(#mb-grad-mj)"
                stroke={COLORS.mixedJuice.fill}
                strokeOpacity={0.3}
                strokeWidth={0.5}
              />
              <path
                d={sankeyPath(pathX0, bagLeftY, bagShareH, pathX1, bagY, bagH)}
                fill="url(#mb-grad-bag)"
                stroke={COLORS.bagasse.fill}
                strokeOpacity={0.3}
                strokeWidth={0.5}
              />
              <path
                d={sankeyPath(pathX0, mudLeftY, mudShareH, pathX1, mudY, mudH)}
                fill="url(#mb-grad-mud)"
                stroke={COLORS.mud.fill}
                strokeOpacity={0.3}
                strokeWidth={0.5}
              />

              {/* ── Left bar: Cane ────────────────────────────── */}
              <rect
                x={leftX}
                y={leftY}
                width={barW}
                height={leftH}
                rx={4}
                fill={COLORS.cane.bg}
                stroke={COLORS.cane.stroke}
                strokeWidth={1.5}
              />
              {/* Cane label */}
              <text
                x={leftX + barW / 2}
                y={leftY + leftH / 2 - 10}
                textAnchor="middle"
                fill={COLORS.cane.fill}
                fontSize={13}
                fontWeight={600}
              >
                Cane
              </text>
              <text
                x={leftX + barW / 2}
                y={leftY + leftH / 2 + 8}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize={11}
              >
                {fmtTons(flow.cane)}
              </text>
              <text
                x={leftX + barW / 2}
                y={leftY + leftH / 2 + 22}
                textAnchor="middle"
                fill="#64748b"
                fontSize={9}
              >
                {unitLabel}
              </text>

              {/* ── Right bars ────────────────────────────────── */}

              {/* Mixed Juice */}
              <rect
                x={rightX}
                y={mjY}
                width={barW}
                height={Math.max(mjH, 2)}
                rx={3}
                fill={COLORS.mixedJuice.bg}
                stroke={COLORS.mixedJuice.stroke}
                strokeWidth={1.5}
              />
              {mjH > 24 && (
                <>
                  <text
                    x={rightX + barW / 2}
                    y={mjY + mjH / 2 - 4}
                    textAnchor="middle"
                    fill={COLORS.mixedJuice.fill}
                    fontSize={11}
                    fontWeight={600}
                  >
                    Mixed Juice
                  </text>
                  <text
                    x={rightX + barW / 2}
                    y={mjY + mjH / 2 + 10}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize={10}
                  >
                    {fmtTons(flow.mixedJuice)}
                  </text>
                </>
              )}
              {/* Right-side percentage label */}
              <text
                x={rightX + barW + 8}
                y={mjY + mjH / 2 + 4}
                fill={COLORS.mixedJuice.fill}
                fontSize={10}
                fontWeight={500}
              >
                {mjPct.toFixed(1)}%
              </text>

              {/* Bagasse */}
              <rect
                x={rightX}
                y={bagY}
                width={barW}
                height={Math.max(bagH, 2)}
                rx={3}
                fill={COLORS.bagasse.bg}
                stroke={COLORS.bagasse.stroke}
                strokeWidth={1.5}
              />
              {bagH > 24 && (
                <>
                  <text
                    x={rightX + barW / 2}
                    y={bagY + bagH / 2 - 4}
                    textAnchor="middle"
                    fill={COLORS.bagasse.fill}
                    fontSize={11}
                    fontWeight={600}
                  >
                    Bagasse
                  </text>
                  <text
                    x={rightX + barW / 2}
                    y={bagY + bagH / 2 + 10}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize={10}
                  >
                    {fmtTons(flow.bagasse)}
                  </text>
                </>
              )}
              <text
                x={rightX + barW + 8}
                y={bagY + bagH / 2 + 4}
                fill={COLORS.bagasse.fill}
                fontSize={10}
                fontWeight={500}
              >
                {bagPct.toFixed(1)}%
              </text>

              {/* Clarified Mud */}
              <rect
                x={rightX}
                y={mudY}
                width={barW}
                height={Math.max(mudH, 2)}
                rx={3}
                fill={COLORS.mud.bg}
                stroke={COLORS.mud.stroke}
                strokeWidth={1.5}
              />
              {mudH > 24 && (
                <>
                  <text
                    x={rightX + barW / 2}
                    y={mudY + mudH / 2 - 4}
                    textAnchor="middle"
                    fill={COLORS.mud.fill}
                    fontSize={11}
                    fontWeight={600}
                  >
                    Clar. Mud
                  </text>
                  <text
                    x={rightX + barW / 2}
                    y={mudY + mudH / 2 + 10}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize={10}
                  >
                    {fmtTons(flow.mud)}
                  </text>
                </>
              )}
              <text
                x={rightX + barW + 8}
                y={mudY + mudH / 2 + 4}
                fill={COLORS.mud.fill}
                fontSize={10}
                fontWeight={500}
              >
                {mudPct.toFixed(1)}%
              </text>
            </svg>
          </div>

          {/* ── Percentage breakdown table ─────────────────────── */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <BreakdownCard
              label="Cane (input)"
              value={fmtTons(flow.cane)}
              percentage="100%"
              color={COLORS.cane.fill}
            />
            <BreakdownCard
              label="Mixed Juice"
              value={fmtTons(flow.mixedJuice)}
              percentage={pct(flow.mixedJuice, total)}
              color={COLORS.mixedJuice.fill}
            />
            <BreakdownCard
              label="Bagasse"
              value={fmtTons(flow.bagasse)}
              percentage={pct(flow.bagasse, total)}
              color={COLORS.bagasse.fill}
            />
            <BreakdownCard
              label="Clarified Mud"
              value={fmtTons(flow.mud)}
              percentage={pct(flow.mud, total)}
              color={COLORS.mud.fill}
            />
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-500">
            Averages across {filtered.length} records
            {selectedMills.length > 0 &&
              ` from ${selectedMills.length} mill${selectedMills.length > 1 ? 's' : ''}`}
            {' \u00B7 '}
            View: {view === 'tons' ? 'Mass (tonnes)' : view === 'pol' ? 'Pol (tonnes)' : 'Sucrose (tonnes)'}
          </p>
        </>
      )}
    </ChartCard>
  )
})

// ── Breakdown card sub-component ───────────────────────────────────────

function BreakdownCard({
  label,
  value,
  percentage,
  color,
}: {
  label: string
  value: string
  percentage: string
  color: string
}) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[11px] font-medium text-slate-300">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      <p className="text-[10px] text-slate-400">{percentage}</p>
    </div>
  )
}
