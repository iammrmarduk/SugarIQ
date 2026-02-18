import { useState, useMemo } from 'react'
import { FlaskConical, TestTubes, AlertTriangle, Activity, Building2, Lightbulb, TrendingDown, BarChart3, Upload, DollarSign, Calculator, Users } from 'lucide-react'
import {
  BarChart, Bar, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import {
  ctsSampleData, ctsWeeklyRV, ctsRecoveryByShift,
  ctsLabStats, ctsAIInsights, growerPaymentConfig,
} from '../../lib/data'
import { cn } from '../../lib/utils'
import { CTSDataIngestion } from './CTSDataIngestion'

const insightIcons = [TrendingDown, AlertTriangle, Activity, BarChart3]
const insightColors = [
  'text-amber-400 border-amber-800/50 bg-amber-950/20',
  'text-red-400 border-red-800/50 bg-red-950/20',
  'text-blue-400 border-blue-800/50 bg-blue-950/20',
  'text-purple-400 border-purple-800/50 bg-purple-950/20',
]

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

type SubTab = 'samples' | 'rv' | 'upload'

const subTabs: { id: SubTab; label: string; icon: typeof FlaskConical }[] = [
  { id: 'samples', label: 'Sample Analysis', icon: TestTubes },
  { id: 'rv', label: 'RV & Payments', icon: DollarSign },
  { id: 'upload', label: 'Upload Data', icon: Upload },
]

// ===== RV & PAYMENTS TAB =====
function RVPaymentsTab() {
  const [rvValue, setRvValue] = useState(12.5)
  const [tonnes, setTonnes] = useState(180)
  const [pricePerUnit, setPricePerUnit] = useState(growerPaymentConfig.pricePerRVUnit)

  const payment = useMemo(() => rvValue * tonnes * pricePerUnit / 100, [rvValue, tonnes, pricePerUnit])

  // Error impact calculation
  const rvError = 0.1
  const errorPerGrower = rvError * tonnes * pricePerUnit / 100
  const errorTotal = errorPerGrower * growerPaymentConfig.totalGrowers

  // Grower comparison from sample data
  const growerPairs = useMemo(() => {
    const growers = ctsSampleData.slice(0, 6)
    const pairs: { a: typeof growers[0]; b: typeof growers[0] }[] = []
    for (let i = 0; i < growers.length - 1; i += 2) {
      pairs.push({ a: growers[i], b: growers[i + 1] })
    }
    return pairs
  }, [])

  return (
    <div className="space-y-6">
      {/* RV Formula Visual */}
      <StaggerChild index={0}>
        <ChartCard title="The RV Formula" subtitle="How Recoverable Value is calculated from lab measurements">
          <div className="rounded-xl bg-slate-900/60 p-6 text-center">
            <p className="mb-2 text-xs text-slate-500 uppercase tracking-wider">SASA Direct Analysis Formula</p>
            <div className="text-lg font-mono font-bold leading-relaxed sm:text-xl">
              <span className="text-slate-200">RV = </span>
              <span className="text-green-400">0.91</span>
              <span className="text-slate-400"> × </span>
              <span className="text-green-400">Pol</span>
              <span className="text-slate-400"> × </span>
              <span className="text-slate-200">(100 − </span>
              <span className="text-amber-400">Fibre</span>
              <span className="text-slate-200">)</span>
              <span className="text-slate-400">/100</span>
              <span className="text-slate-200"> − </span>
              <span className="text-blue-400">0.42</span>
              <span className="text-slate-400"> × </span>
              <span className="text-slate-200">(</span>
              <span className="text-blue-400">Brix</span>
              <span className="text-slate-200"> − </span>
              <span className="text-green-400">Pol</span>
              <span className="text-slate-200">)</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-[11px]">
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-400">Pol = sucrose content</span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-400">Fibre = cane fibre %</span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-400">Brix = dissolved solids</span>
            </div>
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Payment Calculator */}
      <StaggerChild index={1}>
        <ChartCard title="Payment Calculator" subtitle="See how RV translates to grower payments">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">RV Value</span>
                  <span className="font-mono font-medium text-green-400">{rvValue.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={16}
                  step={0.1}
                  value={rvValue}
                  onChange={(e) => setRvValue(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Tonnes Delivered</span>
                  <span className="font-mono font-medium text-blue-400">{tonnes}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={tonnes}
                  onChange={(e) => setTonnes(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Price per RV Unit (ZAR)</span>
                  <span className="font-mono font-medium text-amber-400">R{pricePerUnit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={7000}
                  step={50}
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900/60 p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Estimated Grower Payment</p>
              <p className="mt-2 font-mono text-3xl font-bold text-green-400">
                R{Math.round(payment).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                for {tonnes} tonnes at RV {rvValue.toFixed(1)}
              </p>
            </div>
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Error Impact */}
      <StaggerChild index={2}>
        <ChartCard title="Error Impact" subtitle="How a small RV error cascades across the industry">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-800/30 bg-amber-950/10 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">RV Error</p>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-400">0.1 RV</p>
              <p className="mt-1 text-xs text-slate-400">Measurement variance</p>
            </div>
            <div className="rounded-xl border border-red-800/30 bg-red-950/10 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Per Grower Impact</p>
              <p className="mt-1 font-mono text-2xl font-bold text-red-400">
                R{Math.round(errorPerGrower).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">at {tonnes}t average delivery</p>
            </div>
            <div className="rounded-xl border border-red-800/30 bg-red-950/10 p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Industry-Wide</p>
              <p className="mt-1 font-mono text-2xl font-bold text-red-400">
                R{(errorTotal / 1_000_000).toFixed(1)}M
              </p>
              <p className="mt-1 text-xs text-slate-400">across {growerPaymentConfig.totalGrowers.toLocaleString()} growers</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-amber-500/10 p-3">
            <p className="text-xs text-amber-300">
              <AlertTriangle className="mr-1 inline h-3 w-3" />
              A 0.1 RV error seems small, but multiplied across {growerPaymentConfig.totalGrowers.toLocaleString()} growers
              it becomes R{(errorTotal / 1_000_000).toFixed(1)}M in payment discrepancies. This is why
              AI-powered anomaly detection at the lab level is critical.
            </p>
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Grower Comparison */}
      <StaggerChild index={3}>
        <ChartCard title="Grower Comparison" subtitle="Side-by-side analysis from sample data">
          <div className="space-y-4">
            {growerPairs.map((pair, pi) => {
              const payA = pair.a.rv * tonnes * pricePerUnit / 100
              const payB = pair.b.rv * tonnes * pricePerUnit / 100
              return (
                <div key={pi} className="grid grid-cols-2 gap-3">
                  {[pair.a, pair.b].map((g, gi) => {
                    const pay = gi === 0 ? payA : payB
                    return (
                      <div
                        key={g.id}
                        className={cn(
                          'rounded-lg border p-3',
                          g.status === 'flagged'
                            ? 'border-amber-700/40 bg-amber-950/15'
                            : 'border-slate-700/50 bg-slate-800/30',
                        )}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300">{g.grower}</span>
                          <span className="font-mono text-slate-500">{g.id}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px]">
                          <div>
                            <p className="text-slate-500">Brix</p>
                            <p className="font-mono font-medium text-slate-300">{g.brix}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Pol</p>
                            <p className="font-mono font-medium text-slate-300">{g.pol}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Fibre</p>
                            <p className={cn('font-mono font-medium', g.fibre > 15 ? 'text-amber-400' : 'text-slate-300')}>{g.fibre}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">RV</p>
                            <p className={cn('font-mono font-medium', g.rv < 11 ? 'text-red-400' : 'text-green-400')}>{g.rv}</p>
                          </div>
                        </div>
                        <div className="mt-2 rounded bg-slate-900/50 px-2 py-1 text-center">
                          <span className="text-[10px] text-slate-500">Payment: </span>
                          <span className="font-mono text-xs font-medium text-green-400">R{Math.round(pay).toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </ChartCard>
      </StaggerChild>
    </div>
  )
}

// ===== SAMPLE ANALYSIS TAB (original content) =====
function SampleAnalysisTab() {
  const totalSamples = ctsLabStats.reduce((sum, l) => sum + l.samplesDaily, 0)
  const flaggedCount = ctsSampleData.filter((s) => s.status === 'flagged').length
  const avgRV = ctsLabStats.reduce((sum, l) => sum + l.avgRV, 0) / ctsLabStats.length
  const labsOnline = ctsLabStats.length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={0}>
          <StatCard
            title="Daily Samples"
            value={totalSamples}
            icon={TestTubes}
            iconColor="text-blue-400"
          />
        </StaggerChild>
        <StaggerChild index={1}>
          <StatCard
            title="AI Flags"
            value={flaggedCount}
            suffix=" anomalies"
            icon={AlertTriangle}
            iconColor="text-amber-400"
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="Avg RV"
            value={Math.round(avgRV * 100) / 100}
            icon={Activity}
            iconColor="text-green-400"
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="Labs Online"
            value={labsOnline}
            suffix="/11"
            icon={Building2}
            iconColor="text-cane-400"
          />
        </StaggerChild>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sample Data Table */}
        <StaggerChild index={4}>
          <ChartCard
            title="Sample Analysis"
            subtitle={`${ctsSampleData.length} samples — ${flaggedCount} AI-flagged anomalies`}
          >
            <div className="max-h-[420px] overflow-auto rounded-lg border border-slate-700/50">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-800 text-slate-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">ID</th>
                    <th className="px-3 py-2 font-medium">Grower</th>
                    <th className="px-3 py-2 font-medium">Lab</th>
                    <th className="px-3 py-2 font-medium text-right">Brix</th>
                    <th className="px-3 py-2 font-medium text-right">Pol</th>
                    <th className="px-3 py-2 font-medium text-right">Fibre</th>
                    <th className="px-3 py-2 font-medium text-right">RV</th>
                    <th className="px-3 py-2 font-medium text-right">Purity</th>
                  </tr>
                </thead>
                <tbody>
                  {ctsSampleData.map((sample, i) => (
                    <tr
                      key={sample.id}
                      className={cn(
                        'border-t border-slate-700/30 transition-colors',
                        sample.status === 'flagged'
                          ? 'border-l-2 border-l-amber-500 bg-amber-950/20'
                          : i % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40',
                      )}
                      title={sample.flagReason ?? undefined}
                    >
                      <td className="px-3 py-2 font-mono text-slate-300">{sample.id}</td>
                      <td className="px-3 py-2 text-slate-300">{sample.grower}</td>
                      <td className="px-3 py-2 text-slate-400">{sample.lab.replace('CTS ', '')}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{sample.brix}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{sample.pol}</td>
                      <td className={cn('px-3 py-2 text-right', sample.fibre > 15 ? 'text-amber-400 font-medium' : 'text-slate-300')}>
                        {sample.fibre}
                      </td>
                      <td className={cn('px-3 py-2 text-right font-medium', sample.rv < 11 ? 'text-red-400' : 'text-slate-200')}>
                        {sample.rv}
                      </td>
                      <td className={cn('px-3 py-2 text-right', sample.purity < 84 ? 'text-amber-400' : 'text-slate-300')}>
                        {sample.purity}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-block h-3 w-1 rounded bg-amber-500" />
              Gold-highlighted rows are AI-flagged — hover for details
            </div>
          </ChartCard>
        </StaggerChild>

        {/* AI Insights Panel */}
        <StaggerChild index={5}>
          <ChartCard title="AI Insights" subtitle="Automated analysis from CTS network data">
            <div className="space-y-3">
              {ctsAIInsights.map((insight, i) => {
                const Icon = insightIcons[i]
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3',
                      insightColors[i],
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-200">{insight}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 rounded-lg bg-cane-500/10 p-3">
              <p className="text-xs text-cane-300">
                <Lightbulb className="mr-1 inline h-3 w-3" />
                These insights are generated automatically by analysing patterns across all 11 CTS
                labs. Each finding includes a recommended action for your team.
              </p>
            </div>
          </ChartCard>
        </StaggerChild>

        {/* RV Trend Chart */}
        <StaggerChild index={6}>
          <ChartCard
            title="RV Trend — 12 Week Season View"
            subtitle="Average recoverable value showing seasonal decline"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ctsWeeklyRV}>
                <defs>
                  <linearGradient id="rvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis domain={[12.4, 13.6]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                  formatter={(value) => [`${value}`, 'Avg RV']}
                />
                <Area
                  type="monotone"
                  dataKey="avgRV"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#rvGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Recovery by Shift */}
        <StaggerChild index={7}>
          <ChartCard
            title="Recovery Rate by Shift"
            subtitle="Mon AM consistently underperforms — startup procedure issue?"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ctsRecoveryByShift}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={9} angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[89, 96]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                  formatter={(value) => [`${value}%`, 'Recovery']}
                />
                <Bar dataKey="recovery" radius={[4, 4, 0, 0]}>
                  {ctsRecoveryByShift.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.recovery >= 94 ? '#22c55e' :
                        entry.recovery >= 92 ? '#f59e0b' : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* Lab Performance Comparison — Full Width */}
      <StaggerChild index={8}>
        <ChartCard
          title="Lab Performance Comparison"
          subtitle="Average RV by CTS lab — all 11 facilities"
        >
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={ctsLabStats.map((l) => ({
                name: l.lab.replace('CTS ', ''),
                avgRV: l.avgRV,
                anomalyRate: l.anomalyRate,
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" domain={[11, 14]} stroke="#64748b" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                width={90}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#f8fafc' }}
                itemStyle={{ color: '#cbd5e1' }}
                formatter={(value, name) => [
                  name === 'avgRV' ? Number(value).toFixed(2) : `${value}%`,
                  name === 'avgRV' ? 'Avg RV' : 'Anomaly Rate',
                ]}
              />
              <Bar dataKey="avgRV" name="avgRV" radius={[0, 4, 4, 0]}>
                {ctsLabStats.map((l, i) => (
                  <Cell
                    key={i}
                    fill={
                      l.avgRV >= 13 ? '#22c55e' :
                      l.avgRV >= 12.5 ? '#f59e0b' : '#ef4444'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </StaggerChild>
    </div>
  )
}

// ===== MAIN PANEL =====
export function CTSLab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('samples')

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={FlaskConical}
        title="CTS Lab Analysis"
        subtitle="AI-powered quality monitoring across 11 labs"
        iconColor="text-amber-400"
      />

      {/* Sub-tab selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeSubTab === 'samples' && <SampleAnalysisTab />}
      {activeSubTab === 'rv' && <RVPaymentsTab />}
      {activeSubTab === 'upload' && <CTSDataIngestion />}
    </AnimatedPanel>
  )
}
