import { useState, useMemo, useCallback, useRef } from 'react'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ReferenceLine,
} from 'recharts'
import {
  Cpu, Flame, Droplets, Zap, Diamond, FlaskConical,
  Beaker, TrendingDown, ArrowRight, Upload, TestTubes,
  RotateCcw, Info, Lightbulb, ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { cn } from '../../lib/utils'
import {
  boilingHouseSliders,
  calculateBoilingHouse,
  processStages,
  calculateSucroseLoss,
  rvSliders,
  calculateRVPrediction,
  energySliders,
  calculateEnergyBalance,
  calculateOptimizationLevers,
  calculateOptimizedComparison,
  calculateEnergyFlowDiagram,
  crystalSliders,
  calculateCrystalGrowth,
  parseCSVData,
  analyseUploadedData,
  molassesSliders,
  calculateMolassesExhaustion,
} from '../../lib/demo-data'
import { ctsSampleData } from '../../lib/data'
import type { SliderConfig, ParsedSample } from '../../lib/demo-data'

// ===== SHARED TOOLTIP STYLE =====
const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
}

// ===== DEMO CONFIG =====
const demos = [
  { id: 'data', label: 'Data Analyser', icon: Upload, color: 'teal' },
  { id: 'rv', label: 'RV Prediction', icon: FlaskConical, color: 'green' },
  { id: 'boiler', label: 'Boiling House', icon: Flame, color: 'blue' },
  { id: 'losses', label: 'Sucrose Losses', icon: Droplets, color: 'red' },
  { id: 'energy', label: 'Energy Balance', icon: Zap, color: 'orange' },
  { id: 'crystal', label: 'Crystal Growth', icon: Diamond, color: 'purple' },
  { id: 'molasses', label: 'Molasses Exhaustion', icon: TestTubes, color: 'amber' },
] as const

type DemoId = (typeof demos)[number]['id']

const demoColors: Record<string, { primary: string; accent: string; bg: string; text: string; border: string }> = {
  blue: { primary: '#60a5fa', accent: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500' },
  red: { primary: '#f87171', accent: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500' },
  green: { primary: '#4ade80', accent: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500' },
  orange: { primary: '#fb923c', accent: '#f97316', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500' },
  purple: { primary: '#c084fc', accent: '#a855f7', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500' },
  teal: { primary: '#2dd4bf', accent: '#14b8a6', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500' },
  amber: { primary: '#fbbf24', accent: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500' },
}

// ===== DEMO INFO PANEL CONTENT =====
const demoInfo: Record<DemoId, { what: string; whatSimple: string; equation: string; tryThis: [string, string] }> = {
  data: {
    what: 'Upload your own CTS data (or use the built-in 20-sample dataset) for instant analysis. Get distribution charts, anomaly detection, RV predictions, and automated insights comparing your data against the CTS benchmark.',
    whatSimple: 'Upload lab data and get instant analysis. AI finds outliers, shows trends, and compares your results to benchmarks — all automatically.',
    equation: 'Anomaly flag: |x - mean| > 2 * sigma',
    tryThis: [
      'Click "Load Sample Data" for an instant demo with 20 CTS benchmark samples',
      'Paste your own CSV with brix, pol, fibre columns to see how your data compares',
    ],
  },
  rv: {
    what: 'RV (Recoverable Value) determines what every grower gets paid. This uses the official SASA formula to predict RV from brix, pol, and fibre measurements, with real CTS sample data for comparison.',
    whatSimple: 'See how brix, pol, and fibre measurements determine the RV value — and ultimately what growers get paid. Move the sliders and watch the prediction change.',
    equation: 'RV = 0.91 * Pol * (100 - Fibre)/100 - 0.42 * (Brix - Pol)',
    tryThis: [
      'Use the sensitivity sweep to see which measurement affects RV the most',
      'Compare predicted vs actual for the 20 CTS samples — the accuracy is impressive',
    ],
  },
  boiler: {
    what: 'This simulates a complete 120-minute pan cycle — from concentration through seeding, crystal growth, and tightening. Shows how feed quality affects crystal yield and product grade.',
    whatSimple: 'Simulate how sugar crystals are grown in a vacuum pan. Change the inputs and see how they affect crystal size, yield, and quality.',
    equation: 'SS = Brix_feed / Brix_sat(T, Purity)',
    tryThis: [
      'Drop purity below 80% to see how impurities affect crystal quality',
      'Increase crystal size to 1.0 mm and watch how pan time and yield change',
    ],
  },
  losses: {
    what: 'Every 1% loss in recovery costs the SA sugar industry approximately R240M per season. This traces sucrose through all 6 processing stages, benchmarked against the industry 96.1% recovery target.',
    whatSimple: 'Track where sugar gets lost from field to final product. Each stage loses a little — see which ones matter most and what the total cost is.',
    equation: 'Recovery = Product(1 - loss_i) for i = 1..6 stages',
    tryThis: [
      'Which has more impact — halving extraction loss or halving crystallisation loss?',
      'Push all sliders to maximum and compare total loss against the industry benchmark',
    ],
  },
  energy: {
    what: 'Every sugar mill is a power station in waiting. This models the full energy chain: bagasse to steam to electricity. The key question: how much power can you export to the grid?',
    whatSimple: 'Sugar mills burn bagasse to make steam and electricity. See how much power your mill could export — and what changes make the biggest difference.',
    equation: 'NCV = 19,256 * (1-w) - 2,511 * w  kJ/kg',
    tryThis: [
      'Reduce bagasse moisture by 2% and watch export MW jump — drier bagasse = more power',
      'Check the Optimization Levers table to see which change gives the biggest benefit',
    ],
  },
  crystal: {
    what: 'Crystal size and uniformity determine product grade and market price. This shows how temperature and sugar concentration drive how fast crystals grow, and what happens when conditions aren\'t right.',
    whatSimple: 'See how temperature and sugar concentration affect crystal growth. Get the conditions wrong and you get small, uneven crystals worth less money.',
    equation: 'G = k * (SS-1)^1.5 * exp(-Ea/RT) * f(purity)',
    tryThis: [
      'Push supersaturation above 1.35 to see the "false grain" risk zone',
      'Compare growth at 65°C vs 75°C — temperature makes a big difference',
    ],
  },
  molasses: {
    what: 'Molasses exhaustion is the key performance metric for the sugar house. This shows how sugar purity drops through each crystallisation strike and the cost impact of each percentage point.',
    whatSimple: 'Molasses is what\'s left after extracting as much sugar as possible. See how each crystallisation step extracts more — and when it stops being worth it.',
    equation: 'Recovery = (Purity_feed - Purity_final) / Purity_feed * 100',
    tryThis: [
      'Compare 2-strike vs 3-strike systems — when does the extra step become uneconomical?',
      'Raise impurity levels to see how they reduce how much sugar you can extract',
    ],
  },
}

// ===== DEMO INFO PANEL COMPONENT =====
function DemoInfoPanel({ demoId, color, simplified }: { demoId: DemoId; color: string; simplified: boolean }) {
  const info = demoInfo[demoId]
  const c = demoColors[color]
  return (
    <div className={cn('mb-6 rounded-lg border-l-4 bg-slate-800/40 px-4 py-3', c.border)}>
      <div className="flex items-start gap-2 mb-2">
        <Info className={cn('h-4 w-4 mt-0.5 shrink-0', c.text)} />
        <p className="text-xs text-slate-300 leading-relaxed">{simplified ? info.whatSimple : info.what}</p>
      </div>
      {!simplified && (
        <div className="mb-2 rounded bg-slate-900/60 px-3 py-1.5">
          <code className={cn('text-[11px] font-mono', c.text)}>{info.equation}</code>
        </div>
      )}
      <div className="flex items-start gap-2">
        <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400/70" />
        <div className="space-y-1">
          {info.tryThis.map((tip, i) => (
            <p key={i} className="text-[11px] text-slate-400 leading-relaxed">
              <span className="text-amber-400/70 font-medium">Try:</span> {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== REUSABLE SLIDER COMPONENT (Enhanced) =====
function DemoSlider({
  config,
  value,
  onChange,
  accentColor,
}: {
  config: SliderConfig
  value: number
  onChange: (v: number) => void
  accentColor: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400">{config.label}</label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white">
            {value}{config.unit}
          </span>
          {value !== config.default && (
            <button
              onClick={() => onChange(config.default)}
              className="rounded p-0.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700"
        style={{ accentColor }}
      />
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{config.min}{config.unit}</span>
        <span>{config.max}{config.unit}</span>
      </div>
    </div>
  )
}

// ===== 1. BOILING HOUSE DEMO =====
function BoilingHouseDemo() {
  const sliders = boilingHouseSliders
  const [feedBrix, setFeedBrix] = useState(sliders.feedBrix.default)
  const [feedPurity, setFeedPurity] = useState(sliders.feedPurity.default)
  const [targetCrystalSize, setTargetCrystalSize] = useState(sliders.targetCrystalSize.default)
  const [vacuumPanTemp, setVacuumPanTemp] = useState(sliders.vacuumPanTemp.default)

  const result = useMemo(
    () => calculateBoilingHouse(feedBrix, feedPurity, targetCrystalSize, vacuumPanTemp),
    [feedBrix, feedPurity, targetCrystalSize, vacuumPanTemp],
  )

  const colors = demoColors.blue

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Controls */}
      <StaggerChild index={1}>
        <ChartCard title="Pan Parameters" subtitle={`Reference: ${result.referenceMill} Mill`}>
          <div className="space-y-4">
            <DemoSlider config={sliders.feedBrix} value={feedBrix} onChange={setFeedBrix} accentColor={colors.primary} />
            <DemoSlider config={sliders.feedPurity} value={feedPurity} onChange={setFeedPurity} accentColor={colors.primary} />
            <DemoSlider config={sliders.targetCrystalSize} value={targetCrystalSize} onChange={setTargetCrystalSize} accentColor={colors.primary} />
            <DemoSlider config={sliders.vacuumPanTemp} value={vacuumPanTemp} onChange={setVacuumPanTemp} accentColor={colors.primary} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {result.qualityIndicators.map((q) => (
              <div key={q.label} className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{q.label}</p>
                <p className={cn('text-lg font-bold', q.status === 'good' ? 'text-green-400' : q.status === 'warning' ? 'text-yellow-400' : 'text-red-400')}>
                  {q.value}<span className="text-xs font-normal text-slate-500 ml-1">{q.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Right: Charts */}
      <div className="space-y-6">
        <StaggerChild index={2}>
          <ChartCard title="Supersaturation Profile" subtitle="Pan cycle (120 min)">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={result.supersaturationProfile}>
                <defs>
                  <linearGradient id="ssGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} label={{ value: 'min', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={1.0} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Saturation', position: 'right', fontSize: 9, fill: '#94a3b8' }} />
                <Area type="monotone" dataKey="ss" stroke={colors.primary} fill="url(#ssGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={3}>
          <ChartCard title="Crystal Yield Breakdown" subtitle={`Total yield: ${result.crystalYield}%`}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={result.yieldBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={60} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Yield']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {result.yieldBreakdown.map((_, i) => (
                    <Cell key={i} fill={['#60a5fa', '#818cf8', '#a78bfa'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-900/50 px-3 py-2">
              <span className="text-xs text-slate-400">Massecuite Density</span>
              <span className="text-sm font-semibold text-white">{result.massecuiteDensity} kg/m³</span>
            </div>
            <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-900/50 px-3 py-2">
              <span className="text-xs text-slate-400">Mother Liquor Purity</span>
              <span className="text-sm font-semibold text-white">{result.motherLiquorPurity}%</span>
            </div>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== 2. SUCROSE LOSS DEMO =====
function SucroseLossDemo() {
  const [losses, setLosses] = useState<Record<string, number>>(() =>
    Object.fromEntries(processStages.map(s => [s.id, s.defaultLoss]))
  )

  const result = useMemo(() => calculateSucroseLoss(losses), [losses])
  const colors = demoColors.red

  return (
    <div className="space-y-6">
      {/* Process flow visual */}
      <StaggerChild index={1}>
        <ChartCard title="Process Flow — Adjust Losses Per Stage" subtitle="Slide to simulate different operating conditions">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {processStages.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-1">
                <div className={cn(
                  'rounded-lg border px-3 py-2 text-center min-w-[100px]',
                  losses[stage.id] > stage.defaultLoss * 1.3
                    ? 'border-red-700/50 bg-red-950/30'
                    : 'border-slate-700/50 bg-slate-800/50',
                )}>
                  <p className="text-xs font-medium text-slate-300">{stage.icon} {stage.name}</p>
                  <p className={cn('text-sm font-bold', losses[stage.id] > stage.defaultLoss * 1.3 ? 'text-red-400' : 'text-amber-400')}>
                    {losses[stage.id].toFixed(2)}%
                  </p>
                </div>
                {i < processStages.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {processStages.map((stage) => (
              <div key={stage.id} className="space-y-1">
                <DemoSlider
                  config={{ label: stage.name, min: stage.minLoss, max: stage.maxLoss, step: 0.05, default: stage.defaultLoss, unit: '%' }}
                  value={losses[stage.id]}
                  onChange={(v) => setLosses(prev => ({ ...prev, [stage.id]: v }))}
                  accentColor={colors.primary}
                />
                <p className="text-[10px] text-slate-500">{stage.description}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={2}>
          <StatCard title="Overall Recovery" value={result.overallRecovery} suffix="%" icon={Beaker} iconColor="text-green-400" description="Sucrose retained" />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard title="Total Loss" value={result.totalLoss} suffix="%" icon={TrendingDown} iconColor="text-red-400" description="Cumulative process loss" />
        </StaggerChild>
        <StaggerChild index={4}>
          <StatCard title="Biggest Loss" value={Math.max(...result.lossBreakdown.map(l => l.loss))} suffix="%" icon={Droplets} iconColor="text-amber-400" description={result.lossBreakdown.reduce((a, b) => a.loss > b.loss ? a : b).name} />
        </StaggerChild>
        <StaggerChild index={5}>
          <StatCard title="SASTA Target" value={96.1} suffix="%" icon={FlaskConical} iconColor="text-blue-400" description="Benchmark recovery" />
        </StaggerChild>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Loss breakdown */}
        <StaggerChild index={6}>
          <ChartCard title="Loss Breakdown by Stage" subtitle="Normalized to 100 units sucrose in cane">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={result.lossBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={90} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Loss']} />
                <Bar dataKey="loss" radius={[0, 4, 4, 0]}>
                  {result.lossBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Cumulative sucrose tracking */}
        <StaggerChild index={7}>
          <ChartCard title="Cumulative Sucrose Tracking" subtitle="Sucrose remaining through process">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={result.sucroseTracking}>
                <defs>
                  <linearGradient id="sucGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} domain={[90, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={96.1} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'SASTA 96.1%', position: 'right', fontSize: 9, fill: '#3b82f6' }} />
                <Area type="monotone" dataKey="sucrose" stroke="#4ade80" fill="url(#sucGrad)" strokeWidth={2} name="Sucrose %" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== 3. RV PREDICTION DEMO =====
function RVPredictionDemo() {
  const [brix, setBrix] = useState(rvSliders.brix.default)
  const [pol, setPol] = useState(rvSliders.pol.default)
  const [fibre, setFibre] = useState(rvSliders.fibre.default)
  const [sweepVar, setSweepVar] = useState<'brix' | 'pol' | 'fibre'>('pol')

  const result = useMemo(
    () => calculateRVPrediction(brix, pol, fibre, sweepVar),
    [brix, pol, fibre, sweepVar],
  )

  const colors = demoColors.green

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Controls + Predicted RV */}
      <StaggerChild index={1}>
        <ChartCard title="Cane Quality Inputs" subtitle="SASA RV formula: RV = a·Pol·(100-Fibre)/100 - b·(Brix-Pol)">
          <div className="space-y-4">
            <DemoSlider config={rvSliders.brix} value={brix} onChange={setBrix} accentColor={colors.primary} />
            <DemoSlider config={rvSliders.pol} value={pol} onChange={setPol} accentColor={colors.primary} />
            <DemoSlider config={rvSliders.fibre} value={fibre} onChange={setFibre} accentColor={colors.primary} />
          </div>

          {/* Predicted RV display */}
          <div className="mt-5 rounded-xl border border-green-700/30 bg-green-950/20 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-green-400/70">Predicted Recoverable Value</p>
            <p className="text-4xl font-bold text-green-400 mt-1">{result.predictedRV}</p>
            <p className="text-xs text-slate-400 mt-1">Purity: {result.purity}%</p>
          </div>

          {/* Model stats */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {result.modelStats.map((s) => (
              <div key={s.metric} className="rounded-lg bg-slate-900/50 p-2 text-center">
                <p className="text-[10px] text-slate-500">{s.metric}</p>
                <p className="text-sm font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Right: Charts */}
      <div className="space-y-6">
        <StaggerChild index={2}>
          <ChartCard
            title="Sensitivity Analysis"
            subtitle={`Sweeping ${sweepVar} while others held constant`}
            action={
              <div className="flex gap-1">
                {(['brix', 'pol', 'fibre'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setSweepVar(v)}
                    className={cn(
                      'rounded px-2 py-0.5 text-[10px] font-medium capitalize transition-colors',
                      sweepVar === v
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700/50 text-slate-400 hover:text-slate-200',
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={result.sensitivityData}>
                <defs>
                  <linearGradient id="rvSensGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="variable" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value).toFixed(2), 'RV']} />
                <Area type="monotone" dataKey="rv" stroke={colors.primary} fill="url(#rvSensGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={3}>
          <ChartCard title="Predicted vs Actual (CTS Samples)" subtitle={`${result.comparisonData.length} samples from ctsSampleData`}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={result.comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="id" stroke="#64748b" fontSize={9} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke="#64748b" fontSize={11} domain={[10, 14]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="actualRV" name="Actual RV" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictedRV" name="Predicted RV" fill={colors.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== 4. ENERGY BALANCE DEMO (Enhanced) =====
function EnergyBalanceDemo() {
  const sliders = energySliders
  const [fibrePct, setFibrePct] = useState(sliders.fibrePct.default)
  const [bagasseMoisture, setBagasseMoisture] = useState(sliders.bagasseMoisture.default)
  const [boilerEfficiency, setBoilerEfficiency] = useState(sliders.boilerEfficiency.default)
  const [caneThroughput, setCaneThroughput] = useState(sliders.caneThroughput.default)

  const result = useMemo(
    () => calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput),
    [fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput],
  )

  const levers = useMemo(
    () => calculateOptimizationLevers(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput),
    [fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput],
  )

  const optimized = useMemo(
    () => calculateOptimizedComparison(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput),
    [fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput],
  )

  const flowDiagram = useMemo(
    () => calculateEnergyFlowDiagram(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput),
    [fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput],
  )

  const colors = demoColors.orange

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Controls */}
        <StaggerChild index={1}>
          <ChartCard title="Mill Parameters" subtitle="Bagasse-to-energy conversion">
            <div className="space-y-4">
              <DemoSlider config={sliders.fibrePct} value={fibrePct} onChange={setFibrePct} accentColor={colors.primary} />
              <DemoSlider config={sliders.bagasseMoisture} value={bagasseMoisture} onChange={setBagasseMoisture} accentColor={colors.primary} />
              <DemoSlider config={sliders.boilerEfficiency} value={boilerEfficiency} onChange={setBoilerEfficiency} accentColor={colors.primary} />
              <DemoSlider config={sliders.caneThroughput} value={caneThroughput} onChange={setCaneThroughput} accentColor={colors.primary} />
            </div>

            {/* Energy flow summary */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Bagasse NCV</span>
                <span className="text-sm font-semibold text-orange-400">{result.calorificValue.toLocaleString()} kJ/kg</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Steam: Generated / Demand</span>
                <span className="text-sm font-semibold text-blue-400">{result.steamGenerated} / {result.processSteamDemand} t/hr</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Power: Generated / Demand</span>
                <span className="text-sm font-semibold text-yellow-400">{result.electricityGenerated} / {result.processElectricDemand} MW</span>
              </div>
              <div className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2',
                result.exportPotential > 0 ? 'bg-green-950/20 border border-green-800/30' : 'bg-red-950/20 border border-red-800/30',
              )}>
                <span className="text-xs text-slate-400 flex-1">Export Potential</span>
                <span className={cn('text-lg font-bold', result.exportPotential > 0 ? 'text-green-400' : 'text-red-400')}>
                  {result.exportPotential > 0 ? '+' : ''}{result.exportPotential} MW
                </span>
              </div>
            </div>
          </ChartCard>
        </StaggerChild>

        {/* Right: Charts */}
        <div className="space-y-6">
          <StaggerChild index={2}>
            <ChartCard title="Energy Balance" subtitle="Input vs Output (GJ/hr)">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={result.energyFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
                  <Bar dataKey="input" name="Energy In" fill="#fb923c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="output" name="Energy Out" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </StaggerChild>

          <StaggerChild index={3}>
            <div className="grid grid-cols-2 gap-3">
              {result.summaryStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.unit}</p>
                </div>
              ))}
            </div>
          </StaggerChild>
        </div>
      </div>

      {/* Energy Flow Diagram */}
      <StaggerChild index={4}>
        <ChartCard title="Energy Flow" subtitle="Bagasse to grid — proportional energy blocks">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {flowDiagram.nodes.map((node, i) => {
              const maxVal = Math.max(...flowDiagram.nodes.map(n => n.value))
              const width = Math.max(60, (node.value / maxVal) * 160)
              return (
                <div key={node.label} className="flex items-center gap-1 shrink-0">
                  <div
                    className="rounded-lg border border-slate-700/50 px-2 py-3 text-center transition-all"
                    style={{ width, borderColor: node.color + '40', backgroundColor: node.color + '15' }}
                  >
                    <p className="text-[10px] font-medium text-slate-400 truncate">{node.label}</p>
                    <p className="text-sm font-bold" style={{ color: node.color }}>{node.value}</p>
                    <p className="text-[9px] text-slate-500">GJ/hr</p>
                  </div>
                  {i < flowDiagram.nodes.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </ChartCard>
      </StaggerChild>

      {/* Optimization Levers + Optimized Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StaggerChild index={5}>
          <ChartCard title="Optimization Levers" subtitle="Ranked by export MW impact">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="py-2 text-left font-medium text-slate-400">Parameter</th>
                    <th className="py-2 text-left font-medium text-slate-400">Current</th>
                    <th className="py-2 text-left font-medium text-slate-400">Impact</th>
                    <th className="py-2 text-left font-medium text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {levers.map((l, i) => (
                    <tr key={l.parameter} className={cn('border-b border-slate-800/50', i === 0 && 'bg-orange-500/5')}>
                      <td className="py-2 font-medium text-white">{l.parameter}</td>
                      <td className="py-2 text-slate-400">{l.current}</td>
                      <td className="py-2 text-orange-400 font-mono">{l.impact}</td>
                      <td className="py-2 text-slate-500">{l.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={6}>
          <ChartCard title="Current vs Optimized" subtitle="Moisture 46% + Boiler 75%">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 rounded-lg border border-slate-700/50 bg-slate-900/50 p-4 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Current</p>
                  <p className={cn('text-3xl font-bold mt-1', optimized.currentExport > 0 ? 'text-yellow-400' : 'text-red-400')}>
                    {optimized.currentExport} MW
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <ArrowRight className="h-5 w-5 text-green-400 mx-auto" />
                  <p className="text-[10px] text-green-400 font-bold mt-1">
                    {optimized.deltaPercent > 0 ? '+' : ''}{optimized.deltaPercent}%
                  </p>
                </div>
                <div className="flex-1 rounded-lg border border-green-800/30 bg-green-950/20 p-4 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Optimized</p>
                  <p className="text-3xl font-bold mt-1 text-green-400">
                    {optimized.optimizedExport} MW
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {optimized.optimizedParams.map(p => (
                  <div key={p.label} className="flex items-center justify-between rounded bg-slate-900/30 px-3 py-1.5">
                    <span className="text-[11px] text-slate-400">{p.label}</span>
                    <span className="text-[11px]">
                      <span className="text-slate-500">{p.current}{p.unit}</span>
                      <span className="text-slate-600 mx-1.5">{'->'}</span>
                      <span className="text-green-400 font-medium">{p.optimized}{p.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-slate-700/30 bg-slate-900/30 p-3">
              <p className="text-[10px] text-slate-500">
                SA industry target: 700 MW co-generation capacity. At these parameters,
                a mill running 24/7 during crushing season contributes{' '}
                <span className="font-semibold text-orange-400">
                  {Math.max(0, result.exportPotential).toFixed(1)} MW
                </span>{' '}
                toward that goal — {Math.max(0, result.exportPotential / 700 * 100).toFixed(2)}% of national target per mill.
              </p>
            </div>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== 5. CRYSTAL GROWTH DEMO =====
function CrystalGrowthDemo() {
  const sliders = crystalSliders
  const [supersaturation, setSupersaturation] = useState(sliders.supersaturation.default)
  const [temperature, setTemperature] = useState(sliders.temperature.default)
  const [purity, setPurity] = useState(sliders.purity.default)

  const result = useMemo(
    () => calculateCrystalGrowth(supersaturation, temperature, purity),
    [supersaturation, temperature, purity],
  )

  const colors = demoColors.purple

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Controls + Quality Radar */}
      <div className="space-y-6">
        <StaggerChild index={1}>
          <ChartCard title="Growth Conditions" subtitle="Arrhenius kinetics: G = k·(SS-1)^n·exp(-Ea/RT)">
            <div className="space-y-4">
              <DemoSlider config={sliders.supersaturation} value={supersaturation} onChange={setSupersaturation} accentColor={colors.primary} />
              <DemoSlider config={sliders.temperature} value={temperature} onChange={setTemperature} accentColor={colors.primary} />
              <DemoSlider config={sliders.purity} value={purity} onChange={setPurity} accentColor={colors.primary} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {result.summaryStats.map((s) => (
                <div key={s.label} className="rounded-lg bg-slate-900/50 p-2">
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-600">{s.description}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={2}>
          <ChartCard title="Crystal Quality Metrics" subtitle="Multi-dimensional quality assessment">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={result.qualityMetrics}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar name="Quality" dataKey="value" stroke={colors.primary} fill={colors.primary} fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* Right: Charts */}
      <div className="space-y-6">
        <StaggerChild index={3}>
          <ChartCard title="Crystal Growth Over Time" subtitle="Mean crystal size during 120 min pan cycle">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={result.growthOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} label={{ value: 'min', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} label={{ value: 'μm', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} μm`, 'Crystal Size']} />
                <Line type="monotone" dataKey="size" stroke={colors.primary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={4}>
          <ChartCard title="Crystal Size Distribution" subtitle="Normal distribution at t = 120 min">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={result.sizeDistribution}>
                <defs>
                  <linearGradient id="crystGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="size" stroke="#64748b" fontSize={11} label={{ value: 'μm', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value).toFixed(2), 'Frequency']} />
                <Area type="monotone" dataKey="frequency" stroke={colors.accent} fill="url(#crystGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== 6. DATA ANALYSER DEMO =====
function DataAnalyserDemo() {
  const [data, setData] = useState<ParsedSample[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [csvText, setCsvText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analysis = useMemo(() => data.length > 0 ? analyseUploadedData(data) : null, [data])
  const colors = demoColors.teal

  const handleParse = useCallback((text: string) => {
    const result = parseCSVData(text)
    setData(result.data)
    setWarnings(result.warnings)
  }, [])

  const handleLoadSample = useCallback(() => {
    const csv = 'id,brix,pol,fibre,rv\n' + ctsSampleData.map(s =>
      `${s.id},${s.brix},${s.pol},${s.fibre},${s.rv}`
    ).join('\n')
    setCsvText(csv)
    handleParse(csv)
  }, [handleParse])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setCsvText(text)
        handleParse(text)
      }
      reader.readAsText(file)
    }
  }, [handleParse])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setCsvText(text)
        handleParse(text)
      }
      reader.readAsText(file)
    }
  }, [handleParse])

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <StaggerChild index={1}>
        <ChartCard title="Upload CTS Data" subtitle="CSV with brix, pol, fibre columns (optional: rv for comparison)">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Drop zone */}
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-600/50 bg-slate-900/30 p-6 transition-colors hover:border-teal-500/50 cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-slate-500" />
              <p className="text-xs text-slate-400 text-center">Drag & drop CSV or click to browse</p>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileInput} />
            </div>

            {/* Paste area */}
            <div className="space-y-2">
              <textarea
                className="w-full h-24 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-xs text-slate-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                placeholder={'id,brix,pol,fibre,rv\nS-0501,21.4,18.2,13.8,12.91'}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleParse(csvText)}
                  className="rounded-lg bg-teal-500/20 px-3 py-1.5 text-xs font-medium text-teal-400 transition-colors hover:bg-teal-500/30"
                >
                  Parse CSV
                </button>
                <button
                  onClick={handleLoadSample}
                  className="rounded-lg bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/80"
                >
                  Load Sample Data (20 samples)
                </button>
              </div>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="mt-3 rounded-lg border border-amber-800/30 bg-amber-950/20 px-3 py-2">
              {warnings.map((w, i) => (
                <p key={i} className="text-[11px] text-amber-400">{w}</p>
              ))}
            </div>
          )}
        </ChartCard>
      </StaggerChild>

      {analysis && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StaggerChild index={2}>
              <StatCard title="Samples" value={analysis.sampleCount} icon={Upload} iconColor="text-teal-400" description="Parsed rows" />
            </StaggerChild>
            <StaggerChild index={3}>
              <StatCard title="Mean RV" value={analysis.meanRV} icon={FlaskConical} iconColor="text-green-400" description="Predicted average" />
            </StaggerChild>
            <StaggerChild index={4}>
              <StatCard title="Anomalies" value={analysis.anomalyCount} icon={TrendingDown} iconColor="text-amber-400" description=">2σ from mean" />
            </StaggerChild>
            <StaggerChild index={5}>
              <StatCard title="Model R²" value={analysis.modelR2 !== null ? analysis.modelR2 : 0} icon={Beaker} iconColor="text-blue-400" description={analysis.modelR2 !== null ? 'Predicted vs actual' : 'No actual RV'} />
            </StaggerChild>
          </div>

          {/* Data Table */}
          <StaggerChild index={6}>
            <ChartCard title="Data Table" subtitle={`${data.length} samples — anomalies highlighted`}>
              <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-700/30">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-800">
                    <tr className="border-b border-slate-700/50">
                      <th className="py-2 px-3 text-left font-medium text-slate-400">ID</th>
                      <th className="py-2 px-3 text-right font-medium text-slate-400">Brix</th>
                      <th className="py-2 px-3 text-right font-medium text-slate-400">Pol</th>
                      <th className="py-2 px-3 text-right font-medium text-slate-400">Fibre</th>
                      <th className="py-2 px-3 text-right font-medium text-slate-400">Pred RV</th>
                      {data[0]?.rv !== undefined && <th className="py-2 px-3 text-right font-medium text-slate-400">Actual RV</th>}
                      {data[0]?.rv !== undefined && <th className="py-2 px-3 text-right font-medium text-slate-400">Error</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => {
                      const isAnomaly = analysis.anomalies.includes(i)
                      const pred = analysis.predictions[i]
                      return (
                        <tr key={d.id} className={cn('border-b border-slate-800/50', isAnomaly && 'bg-amber-500/10')}>
                          <td className="py-1.5 px-3 font-medium text-white">{d.id}</td>
                          <td className="py-1.5 px-3 text-right text-slate-300">{d.brix}</td>
                          <td className="py-1.5 px-3 text-right text-slate-300">{d.pol}</td>
                          <td className="py-1.5 px-3 text-right text-slate-300">{d.fibre}</td>
                          <td className="py-1.5 px-3 text-right text-teal-400 font-mono">{pred?.predicted}</td>
                          {d.rv !== undefined && <td className="py-1.5 px-3 text-right text-slate-300">{d.rv}</td>}
                          {d.rv !== undefined && pred?.error !== undefined && (
                            <td className={cn('py-1.5 px-3 text-right font-mono', pred.error > 0.5 ? 'text-amber-400' : 'text-slate-500')}>{pred.error}</td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </StaggerChild>

          {/* Distribution Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {analysis.distributions.map((dist, idx) => (
              <StaggerChild key={dist.field} index={7 + idx}>
                <ChartCard title={`${dist.field} Distribution`} subtitle="Histogram (8 bins)">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dist.bins}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="bin" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill={colors.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </StaggerChild>
            ))}
          </div>

          {/* Predicted vs Actual (if RV present) */}
          {analysis.predictions.some(p => p.actual !== undefined) && (
            <StaggerChild index={11}>
              <ChartCard title="Predicted vs Actual RV" subtitle="Per-sample comparison">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analysis.predictions.filter(p => p.actual !== undefined)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="id" stroke="#64748b" fontSize={9} angle={-30} textAnchor="end" height={45} />
                    <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="actual" name="Actual RV" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="Predicted RV" fill={colors.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </StaggerChild>
          )}

          {/* AI Insights */}
          <StaggerChild index={12}>
            <ChartCard title="AI Insights" subtitle="Automated comparison against CTS benchmark">
              <div className="space-y-2">
                {analysis.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                    <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                    <p className="text-xs text-slate-300">{insight}</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </StaggerChild>
        </>
      )}
    </div>
  )
}

// ===== 7. MOLASSES EXHAUSTION DEMO =====
function MolassesExhaustionDemo() {
  const sliders = molassesSliders
  const [feedPurity, setFeedPurity] = useState(sliders.feedPurity.default)
  const [targetMolassesPurity, setTargetMolassesPurity] = useState(sliders.targetMolassesPurity.default)
  const [nswr, setNswr] = useState(sliders.nswr.default)
  const [caneThroughput, setCaneThroughput] = useState(sliders.caneThroughputMol.default)

  const result = useMemo(
    () => calculateMolassesExhaustion(feedPurity, targetMolassesPurity, nswr, caneThroughput),
    [feedPurity, targetMolassesPurity, nswr, caneThroughput],
  )

  const colors = demoColors.amber

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Controls */}
      <div className="space-y-6">
        <StaggerChild index={1}>
          <ChartCard title="Exhaustion Parameters" subtitle="SJM purity drop model">
            <div className="space-y-4">
              <DemoSlider config={sliders.feedPurity} value={feedPurity} onChange={setFeedPurity} accentColor={colors.primary} />
              <DemoSlider config={sliders.targetMolassesPurity} value={targetMolassesPurity} onChange={setTargetMolassesPurity} accentColor={colors.primary} />
              <DemoSlider config={sliders.nswr} value={nswr} onChange={setNswr} accentColor={colors.primary} />
              <DemoSlider config={sliders.caneThroughputMol} value={caneThroughput} onChange={setCaneThroughput} accentColor={colors.primary} />
            </div>

            {/* Summary stats */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Strikes Used</span>
                <span className="text-sm font-semibold text-amber-400">{result.strikes}-strike system</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Overall Recovery</span>
                <span className="text-sm font-semibold text-green-400">{result.overallRecovery}%</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Molasses Sugar Loss</span>
                <span className="text-sm font-semibold text-red-400">{result.molassesSugarLoss} t/hr</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-red-800/30 bg-red-950/20 px-3 py-2">
                <span className="text-xs text-slate-400 flex-1">Revenue Impact (lost)</span>
                <span className="text-lg font-bold text-red-400">R{result.revenueImpact.toLocaleString()}/hr</span>
              </div>
            </div>
          </ChartCard>
        </StaggerChild>

        {/* Strike comparison */}
        <StaggerChild index={2}>
          <ChartCard title="2-Strike vs 3-Strike Comparison" subtitle="Cost/benefit of additional strike">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="py-2 text-left font-medium text-slate-400">Metric</th>
                    {result.strikeComparison.map(s => (
                      <th key={s.strikes} className="py-2 text-right font-medium text-slate-400">{s.strikes}-Strike</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 text-slate-300">Final Mol. Purity</td>
                    {result.strikeComparison.map(s => (
                      <td key={s.strikes} className="py-2 text-right font-mono text-amber-400">{s.finalPurity}%</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 text-slate-300">Recovery</td>
                    {result.strikeComparison.map(s => (
                      <td key={s.strikes} className="py-2 text-right font-mono text-green-400">{s.recovery}%</td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 text-slate-300">Sugar Loss</td>
                    {result.strikeComparison.map(s => (
                      <td key={s.strikes} className="py-2 text-right font-mono text-red-400">{s.molassesLoss} t/hr</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Revenue Lost</td>
                    {result.strikeComparison.map(s => (
                      <td key={s.strikes} className="py-2 text-right font-mono text-red-400">R{s.revenueImpact.toLocaleString()}/hr</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* Right: Charts */}
      <div className="space-y-6">
        <StaggerChild index={3}>
          <ChartCard title="Purity Waterfall" subtitle="Purity drop through each strike">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={result.purityWaterfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Purity']} />
                <Bar dataKey="purity" radius={[4, 4, 0, 0]}>
                  {result.purityWaterfall.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? '#fbbf24' : i === result.purityWaterfall.length - 1 ? '#ef4444' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={4}>
          <ChartCard title="Recovery vs Target Molasses Purity" subtitle="Lower target = higher recovery but harder to achieve">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={result.recoveryVsPurity}>
                <defs>
                  <linearGradient id="molGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="targetPurity" stroke="#64748b" fontSize={11} label={{ value: 'Target Purity %', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} domain={[40, 70]} label={{ value: 'Recovery %', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Recovery']} />
                <ReferenceLine x={targetMolassesPurity} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Target', position: 'top', fontSize: 9, fill: '#f59e0b' }} />
                <Area type="monotone" dataKey="recovery" stroke={colors.accent} fill="url(#molGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>
      </div>
    </div>
  )
}

// ===== TAB BADGE HOOK =====
function useTabBadges() {
  // These are computed from defaults — will be overridden by actual demo state via prop drilling
  // For simplicity, we compute representative badge values from defaults
  const boilingResult = useMemo(() => calculateBoilingHouse(67, 85, 0.6, 65), [])
  const lossResult = useMemo(() => calculateSucroseLoss(Object.fromEntries(processStages.map(s => [s.id, s.defaultLoss]))), [])
  const rvResult = useMemo(() => calculateRVPrediction(21.4, 18.2, 13.8), [])
  const energyResult = useMemo(() => calculateEnergyBalance(14.5, 48, 68, 200), [])
  const crystalResult = useMemo(() => calculateCrystalGrowth(1.2, 70, 85), [])

  return {
    boiler: `${boilingResult.crystalYield}%`,
    losses: `${lossResult.overallRecovery}%`,
    rv: `${rvResult.predictedRV}`,
    energy: `${energyResult.exportPotential} MW`,
    crystal: `${crystalResult.growthRate} μm/min`,
    data: '',
    molasses: '',
  }
}

// ===== MAIN PANEL =====
export function AIDemos() {
  const [activeDemo, setActiveDemo] = useState<DemoId>('data')
  const [simplified, setSimplified] = useState(false)
  const activeConfig = demos.find(d => d.id === activeDemo)!
  const color = demoColors[activeConfig.color]
  const badges = useTabBadges()

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={Cpu}
        title="AI Demos"
        subtitle="Interactive sugar engineering simulations — try them yourself"
        iconColor="text-cane-400"
      />

      {/* Demo selector with badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {demos.map((demo) => {
          const isActive = activeDemo === demo.id
          const dColor = demoColors[demo.color]
          const badge = badges[demo.id]
          return (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? `${dColor.bg} ${dColor.text} border border-current/20 shadow-lg`
                  : 'text-slate-400 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-200',
              )}
            >
              <demo.icon className="h-4 w-4" />
              <span>{demo.label}</span>
              {badge && (
                <span className={cn(
                  'ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                  isActive ? 'bg-white/10' : 'bg-slate-700/80 text-slate-500',
                )}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
        <button
          onClick={() => setSimplified(!simplified)}
          className={cn(
            'ml-auto rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all',
            simplified
              ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
              : 'bg-slate-800/50 text-slate-500 hover:text-slate-300',
          )}
        >
          {simplified ? 'Simple View' : 'Simplified'}
        </button>
      </div>

      {/* Demo info panel */}
      <DemoInfoPanel demoId={activeDemo} color={activeConfig.color} simplified={simplified} />

      {/* Active demo with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {activeDemo === 'boiler' && <BoilingHouseDemo />}
          {activeDemo === 'losses' && <SucroseLossDemo />}
          {activeDemo === 'rv' && <RVPredictionDemo />}
          {activeDemo === 'energy' && <EnergyBalanceDemo />}
          {activeDemo === 'crystal' && <CrystalGrowthDemo />}
          {activeDemo === 'data' && <DataAnalyserDemo />}
          {activeDemo === 'molasses' && <MolassesExhaustionDemo />}
        </motion.div>
      </AnimatePresence>
    </AnimatedPanel>
  )
}
