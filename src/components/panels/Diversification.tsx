import { useState } from 'react'
import { createPortal } from 'react-dom'
import { TrendingUp, Fuel, Zap, FlaskConical, Leaf, Target, X, ChevronRight, Globe, Lightbulb, AlertTriangle, Users, DollarSign, Clock, Sparkles } from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { diversificationTargets, revenueMix, opportunityMatrix, diversificationDetails } from '../../lib/data'
import { cn } from '../../lib/utils'

const COLORS_CURRENT = ['#f59e0b', '#d97706', '#92400e', '#22c55e', '#64748b']
const COLORS_TARGET = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4']

// Map revenue mix names to detail keys
const revenueToDetailKey: Record<string, string> = {
  'Sugar Products': '',
  'Biofuels (SAF + Ethanol)': 'saf',
  'Co-generation': 'cogeneration',
  'Biochemicals': 'biochemicals',
  'Carbon Credits': 'carbon',
}

const investmentToDetailKey: Record<string, string> = {
  saf: 'saf',
  bioethanol: 'bioethanol',
  cogeneration: 'cogeneration',
  biochemicals: 'biochemicals',
}

const sectorIcons: Record<string, typeof Fuel> = {
  saf: Fuel,
  bioethanol: FlaskConical,
  cogeneration: Zap,
  biochemicals: Leaf,
  carbon: Globe,
}

const sectorNames: Record<string, string> = {
  saf: 'Sustainable Aviation Fuel',
  bioethanol: 'Bioethanol',
  cogeneration: 'Co-generation',
  biochemicals: 'Biochemicals',
  carbon: 'Carbon Credits',
}

function DetailModal({ detailKey, onClose }: { detailKey: string; onClose: () => void }) {
  const detail = diversificationDetails[detailKey]
  if (!detail) return null

  const Icon = sectorIcons[detailKey] || Target

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900/95 backdrop-blur px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2" style={{ backgroundColor: `${detail.color}20` }}>
                <Icon className="h-5 w-5" style={{ color: detail.color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{detail.title}</h2>
                <p className="text-sm text-slate-400">{detail.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Key metrics row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
              <DollarSign className="mx-auto mb-1 h-4 w-4" style={{ color: detail.color }} />
              <div className="text-lg font-bold text-white">{detail.annualRevenue}</div>
              <div className="text-[10px] text-slate-400">Annual Revenue Potential</div>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
              <Users className="mx-auto mb-1 h-4 w-4" style={{ color: detail.color }} />
              <div className="text-lg font-bold text-white">
                {detail.jobBreakdown.reduce((s, j) => s + j.count, 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Jobs Created</div>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
              <Clock className="mx-auto mb-1 h-4 w-4" style={{ color: detail.color }} />
              <div className="text-sm font-bold text-white">{detail.timeline}</div>
              <div className="text-[10px] text-slate-400">Timeline</div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Lightbulb className="h-3.5 w-3.5" style={{ color: detail.color }} />
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">{detail.overview}</p>
          </div>

          {/* Global Context */}
          <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              Global Context
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">{detail.globalContext}</p>
          </div>

          {/* SA Opportunity */}
          <div className="rounded-lg border p-4" style={{ borderColor: `${detail.color}30`, backgroundColor: `${detail.color}08` }}>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: detail.color }}>
              <Sparkles className="h-3.5 w-3.5" />
              South Africa Opportunity
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">{detail.saOpportunity}</p>
          </div>

          {/* How to Unlock */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400">
              <Target className="h-3.5 w-3.5" />
              How to Unlock This Opportunity
            </h3>
            <div className="space-y-2">
              {detail.howToUnlock.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-800/30 px-3 py-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `${detail.color}20`, color: detail.color }}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Breakdown + Job Breakdown side by side */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <DollarSign className="h-3.5 w-3.5" />
                Investment Breakdown
              </h3>
              <div className="space-y-2">
                {detail.investmentBreakdown.map((item) => (
                  <div key={item.item} className="flex items-center justify-between rounded-md bg-slate-800/40 px-3 py-2">
                    <span className="text-xs text-slate-300">{item.item}</span>
                    <span className="text-xs font-semibold text-amber-400">{item.amount}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-md border border-amber-800/30 bg-amber-950/20 px-3 py-2">
                  <span className="text-xs font-semibold text-amber-300">Total Investment</span>
                  <span className="text-xs font-bold text-amber-300">
                    R{(detail.investmentBreakdown.reduce((s, i) => {
                      const num = parseFloat(i.amount.replace('R', '').replace('B', ''))
                      return s + num
                    }, 0)).toFixed(1)}B
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                <Users className="h-3.5 w-3.5" />
                Job Creation Breakdown
              </h3>
              <div className="space-y-2">
                {detail.jobBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between rounded-md bg-slate-800/40 px-3 py-2">
                    <span className="text-xs text-slate-300">{item.category}</span>
                    <span className="text-xs font-semibold text-blue-400">{item.count.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-md border border-blue-800/30 bg-blue-950/20 px-3 py-2">
                  <span className="text-xs font-semibold text-blue-300">Total Jobs</span>
                  <span className="text-xs font-bold text-blue-300">
                    {detail.jobBreakdown.reduce((s, j) => s + j.count, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Players + Challenges */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Key Players</h3>
              <div className="flex flex-wrap gap-1.5">
                {detail.keyPlayers.map((p) => (
                  <span key={p} className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-300">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
                <AlertTriangle className="h-3 w-3" />
                Challenges
              </h3>
              <div className="space-y-1.5">
                {detail.challenges.map((c) => (
                  <p key={c} className="text-[11px] text-slate-400">• {c}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Case Study */}
          <div className="rounded-lg border border-green-800/30 bg-green-950/15 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400">
              <Globe className="h-3.5 w-3.5" />
              Case Study — {detail.caseStudy.country}
            </h3>
            <p className="text-sm leading-relaxed text-green-300/80">{detail.caseStudy.detail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Diversification() {
  const [activeDetail, setActiveDetail] = useState<string | null>(null)

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={TrendingUp}
        title="Diversification Intelligence"
        subtitle="Sugar Master Plan 2030 — transforming the industry beyond traditional sugar"
        iconColor="text-purple-400"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={0}>
          <StatCard
            title="SAF Potential"
            value={433}
            suffix="M L/yr"
            icon={Fuel}
            iconColor="text-purple-400"
            description="Sustainable Aviation Fuel"
          />
        </StaggerChild>
        <StaggerChild index={1}>
          <StatCard
            title="Bioethanol Potential"
            value={125}
            suffix="M L/yr"
            icon={FlaskConical}
            iconColor="text-green-400"
            description="21,000 new jobs"
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="Co-gen Potential"
            value={700}
            suffix=" MW"
            icon={Zap}
            iconColor="text-yellow-400"
            description="Feed into national grid"
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="New Jobs Potential"
            value={41500}
            icon={TrendingUp}
            iconColor="text-cane-400"
            description="Across all diversification streams"
          />
        </StaggerChild>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Mix: Current */}
        <StaggerChild index={4}>
          <ChartCard title="Revenue Mix — Current" subtitle="Traditional sugar dominates at 80%">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={revenueMix.current}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  stroke="#0f172a"
                  strokeWidth={2}
                  label={({ name, value }) => `${name ?? ''} ${value}%`}
                >
                  {revenueMix.current.map((_, i) => (
                    <Cell key={i} fill={COLORS_CURRENT[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Revenue Mix: 2030 Target — clickable items */}
        <StaggerChild index={5}>
          <ChartCard title="Revenue Mix — 2030 Target" subtitle="Click any segment to explore the opportunity">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={revenueMix.target2030}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={38}
                  dataKey="value"
                  nameKey="name"
                  stroke="#0f172a"
                  strokeWidth={2}
                >
                  {revenueMix.target2030.map((_, i) => (
                    <Cell key={i} fill={COLORS_TARGET[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {revenueMix.target2030.map((item, i) => {
                const detailKey = revenueToDetailKey[item.name]
                const hasDetail = detailKey && diversificationDetails[detailKey]
                return (
                  <button
                    key={item.name}
                    onClick={() => hasDetail && setActiveDetail(detailKey)}
                    data-detail-key={hasDetail ? detailKey : undefined}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all',
                      hasDetail
                        ? 'border border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60 cursor-pointer'
                        : 'bg-slate-800/20 cursor-default',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS_TARGET[i] }} />
                      <span className="text-xs text-slate-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">{item.value}%</span>
                      {hasDetail && <ChevronRight className="h-3 w-3 text-slate-500" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </ChartCard>
        </StaggerChild>

        {/* Opportunity Radar */}
        <StaggerChild index={6}>
          <ChartCard title="Opportunity Assessment Matrix" subtitle="Feasibility, impact, and readiness scores">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={opportunityMatrix}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#475569"
                  fontSize={10}
                />
                <Radar
                  name="Feasibility"
                  dataKey="feasibility"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Impact"
                  dataKey="impact"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Readiness"
                  dataKey="readiness"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Investment Required — clickable cards */}
        <StaggerChild index={7}>
          <ChartCard title="Investment & Job Creation" subtitle="Click any sector for full breakdown">
            <div className="space-y-3">
              {Object.entries(diversificationTargets).map(([key, data]) => {
                const Icon = sectorIcons[key] || Target
                const detail = diversificationDetails[key]
                return (
                  <button
                    key={key}
                    onClick={() => detail && setActiveDetail(key)}
                    data-detail-key={detail ? key : undefined}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 text-left transition-all hover:border-slate-600 hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: detail?.color || '#f59e0b' }} />
                        <span className="text-sm font-medium text-white">{sectorNames[key]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: detail?.color || '#f59e0b' }}>{data.investment}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500">Current</p>
                        <p className="font-medium text-slate-300">{data.current} {data.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Potential</p>
                        <p className="font-medium text-green-400">{data.potential} {data.unit}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">New Jobs</p>
                        <p className="font-medium" style={{ color: detail?.color || '#f59e0b' }}>{data.jobs.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max((data.current / data.potential) * 100, 2)}%`,
                          background: `linear-gradient(to right, ${detail?.color || '#f59e0b'}, #22c55e)`,
                        }}
                      />
                    </div>
                    {detail && (
                      <p className="mt-2 text-[11px] text-slate-500">
                        {detail.timeline} · Revenue: {detail.annualRevenue}/year
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* Opportunity Deep-Dive Cards — full width */}
      <StaggerChild index={8}>
        <div className="mt-6">
          <ChartCard title="Explore Opportunities" subtitle="Click any card for detailed analysis, global case studies, and implementation roadmap">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(diversificationDetails).map(([key, detail]) => {
                const Icon = sectorIcons[key] || Target
                const totalJobs = detail.jobBreakdown.reduce((s, j) => s + j.count, 0)
                return (
                  <button
                    key={key}
                    onClick={() => setActiveDetail(key)}
                    data-detail-key={key}
                    className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-left transition-all hover:border-slate-600 hover:bg-slate-800/60"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-lg p-1.5" style={{ backgroundColor: `${detail.color}20` }}>
                        <Icon className="h-4 w-4" style={{ color: detail.color }} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">{detail.title}</h4>
                    </div>
                    <p className="mb-3 text-[11px] leading-relaxed text-slate-400 line-clamp-2">{detail.tagline}</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-md bg-slate-900/50 px-2 py-1.5">
                        <div className="text-xs font-bold" style={{ color: detail.color }}>{detail.annualRevenue}</div>
                        <div className="text-[9px] text-slate-500">Revenue/yr</div>
                      </div>
                      <div className="rounded-md bg-slate-900/50 px-2 py-1.5">
                        <div className="text-xs font-bold text-blue-400">{totalJobs.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-500">Jobs</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{detail.timeline}</span>
                      <span className="flex items-center gap-1 font-medium text-slate-400 transition-colors group-hover:text-white">
                        Explore <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </ChartCard>
        </div>
      </StaggerChild>

      {/* Master Plan context */}
      <StaggerChild index={9}>
        <div className="mt-6 rounded-xl border border-purple-800/50 bg-purple-950/20 p-4">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
            <div>
              <p className="font-semibold text-purple-300">Sugar Master Plan 2030</p>
              <p className="mt-1 text-sm text-purple-400/80">
                The Sugar Master Plan is a social compact between government, industry, labour, and growers
                to ensure the long-term sustainability of the R24B sugar industry. Key pillars include import
                protection, demand stimulation, diversification into biofuels and energy, and transformation
                of the grower base with 25,653 small-scale growers supported through the value chain.
                Diversification alone could generate R22-33B in new annual revenue and create 41,500+ new jobs —
                transforming sugar mills from single-product factories into multi-output biorefineries.
              </p>
            </div>
          </div>
        </div>
      </StaggerChild>

      {activeDetail && createPortal(
        <DetailModal
          detailKey={activeDetail}
          onClose={() => setActiveDetail(null)}
        />,
        document.body,
      )}
    </AnimatedPanel>
  )
}
