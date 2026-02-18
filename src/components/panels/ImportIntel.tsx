import { ShieldAlert, AlertTriangle, TrendingUp, Ship, DollarSign, Scale } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { RiskBadge } from '../shared/RiskBadge'
import { importData, industryStats } from '../../lib/data'

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#6b7280']

export function ImportIntel() {
  return (
    <AnimatedPanel>
      <SectionTitle
        icon={ShieldAlert}
        title="Import Threat Intelligence"
        subtitle="Real-time monitoring of sugar imports threatening local production"
        iconColor="text-red-400"
      />

      {/* Alert Banner */}
      <StaggerChild index={0}>
        <div className="mb-6 rounded-xl border border-red-800/50 bg-red-950/30 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="font-semibold text-red-300">
                CRITICAL: Sugar import surge threatens industry viability
              </p>
              <p className="mt-1 text-sm text-red-400/80">
                Imports have surged over {importData.importSurge}% in 2025, with {importData.totalImports2025.toLocaleString()} tonnes
                imported Jan-Sep alone. Documented losses exceed R{(importData.estimatedLosses / 1e6).toFixed(0)}M (Jan-Aug), with full-year losses expected to surpass R1 billion.
                SASA has requested ITAC increase the reference price from US${importData.itacReferencePrice}/t to US${importData.sasaRequestedPrice}/t.
              </p>
            </div>
            <RiskBadge level="critical" />
          </div>
        </div>
      </StaggerChild>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={1}>
          <StatCard
            title="Total Imports (Jan-Sep)"
            value={importData.totalImports2025}
            suffix=" t"
            icon={Ship}
            iconColor="text-red-400"
            trend={{ value: importData.importSurge, positive: false }}
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="Estimated Losses"
            value={760}
            prefix="R"
            suffix="M+"
            icon={DollarSign}
            iconColor="text-red-400"
            description="Jan-Aug 2025, full-year likely >R1B"
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="HPL Cost to Industry"
            value={1.2}
            prefix="R"
            suffix="B"
            icon={Scale}
            iconColor="text-orange-400"
            description="Health Promotion Levy impact"
          />
        </StaggerChild>
        <StaggerChild index={4}>
          <StatCard
            title="Jobs at Risk"
            value={industryStats.directJobs}
            icon={TrendingUp}
            iconColor="text-orange-400"
            description="Direct employment threatened"
          />
        </StaggerChild>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StaggerChild index={5}>
          <ChartCard
            title="Monthly Import Volumes"
            subtitle="2025 vs 2024 comparison — tonnes"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={importData.monthlyImports}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
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
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="tonnes" name="2025" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="year2024" name="2024" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={6}>
          <ChartCard
            title="Import Sources"
            subtitle="Origin countries by volume"
          >
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={260}>
                <PieChart>
                  <Pie
                    data={importData.sourceCountries}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    dataKey="pct"
                    nameKey="country"
                    stroke="#0f172a"
                    strokeWidth={2}
                  >
                    {importData.sourceCountries.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
              <div className="space-y-2">
                {importData.sourceCountries.map((src, i) => (
                  <div key={src.country} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-xs text-slate-300">
                      {src.country}: {src.pct}% ({src.tonnes.toLocaleString()}t)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </StaggerChild>

        <StaggerChild index={7} className="lg:col-span-2">
          <ChartCard
            title="Sugar Price Comparison"
            subtitle="Local vs international prices — ZAR per tonne"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={importData.priceComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  width={110}
                />
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
                  formatter={(value) => [`R${Number(value).toLocaleString()}/t`, 'Price']}
                />
                <Bar
                  dataKey="price"
                  radius={[0, 4, 4, 0]}
                >
                  {importData.priceComparison.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? '#22c55e' : i === 1 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              SA local price is {Math.round(((importData.priceComparison[0].price / importData.priceComparison[4].price) - 1) * 100)}% above
              subsidized Indian exports, making SA producers uncompetitive without tariff protection.
            </p>
          </ChartCard>
        </StaggerChild>
      </div>
    </AnimatedPanel>
  )
}
