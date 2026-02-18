import { Sprout, Droplets, Thermometer, CloudRain, Leaf } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { RiskBadge } from '../shared/RiskBadge'
import { industryStats, yieldHistory, regionalHealth } from '../../lib/data'
import { seasonTotals } from '../../lib/r7106-derived'
import type { WeatherData } from '../../lib/api'

interface PrecisionAgProps {
  weather: WeatherData[]
}

const healthColors: Record<string, string> = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#ef4444',
}

export function PrecisionAg({ weather }: PrecisionAgProps) {
  return (
    <AnimatedPanel>
      <SectionTitle
        icon={Sprout}
        title="Precision Agriculture & Yield Intelligence"
        subtitle="Data-driven insights for optimizing sugarcane production across South Africa"
        iconColor="text-green-400"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={0}>
          <StatCard
            title="Cane Crushed (2025/26)"
            value={Math.round(seasonTotals.totalCaneCrushed / 1e4) / 100}
            suffix="M t"
            icon={Sprout}
            iconColor="text-green-400"
            trend={{ value: 3, positive: true }}
          />
        </StaggerChild>
        <StaggerChild index={1}>
          <StatCard
            title="Sugar Produced (est)"
            value={Math.round(seasonTotals.estimatedSugarProduced / 1e4) / 100}
            suffix="M t"
            icon={Leaf}
            iconColor="text-green-400"
            description={`Avg RV: ${seasonTotals.avgRV.toFixed(2)}`}
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="Area Under Cane"
            value={industryStats.areaUnderCane}
            suffix=" ha"
            icon={Sprout}
            iconColor="text-emerald-400"
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="Avg Yield"
            value={industryStats.avgYieldPerHa}
            suffix=" t/ha"
            icon={Droplets}
            iconColor="text-blue-400"
            description={`${industryStats.irrigatedPct}% irrigated, ${100 - industryStats.irrigatedPct}% rain-fed`}
          />
        </StaggerChild>
      </div>

      {/* Weather Cards */}
      {weather.length > 0 && (
        <StaggerChild index={4}>
          <div className="mb-6 grid grid-cols-3 gap-4">
            {weather.map((w) => (
              <div
                key={w.location}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">{w.location}</p>
                    <p className="text-2xl font-bold text-white">{w.temp.toFixed(0)}°C</p>
                  </div>
                  <div className="text-right">
                    <CloudRain className="mb-1 ml-auto h-5 w-5 text-blue-400" />
                    <p className="text-xs text-slate-400">{w.description}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" /> {w.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> Rain: {w.rainfall}mm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </StaggerChild>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Yield History Chart */}
        <StaggerChild index={5}>
          <ChartCard
            title="Historical Yield Trends"
            subtitle="Cane crushed and sugar produced by season (millions of tonnes)"
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={yieldHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="season" stroke="#64748b" fontSize={10} />
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
                <Line
                  type="monotone"
                  dataKey="cane"
                  name="Cane (M tonnes)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="sugar"
                  name="Sugar (M tonnes)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Regional Health */}
        <StaggerChild index={6}>
          <ChartCard
            title="Regional Health Assessment"
            subtitle="Crop health score by growing region"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionalHealth} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="region"
                  stroke="#64748b"
                  fontSize={10}
                  width={120}
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
                  formatter={(value) => [`${value}%`, 'Health Score']}
                />
                <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                  {regionalHealth.map((entry, i) => (
                    <Cell key={i} fill={healthColors[entry.risk] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Regional Detail Table */}
        <StaggerChild index={7} className="lg:col-span-2">
          <ChartCard title="Regional Detail" subtitle="Detailed assessment by growing region">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs text-slate-400">
                    <th className="pb-2 pr-4">Region</th>
                    <th className="pb-2 pr-4">District</th>
                    <th className="pb-2 pr-4">Health</th>
                    <th className="pb-2 pr-4">Risk</th>
                    <th className="pb-2 pr-4">Rainfall</th>
                    <th className="pb-2 pr-4">Avg Temp</th>
                    <th className="pb-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {regionalHealth.map((r) => (
                    <tr
                      key={r.region}
                      className="border-b border-slate-800 text-xs"
                    >
                      <td className="py-2.5 pr-4 font-medium text-white">{r.region}</td>
                      <td className="py-2.5 pr-4 text-slate-400">{r.district}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${r.health}%`,
                                backgroundColor: healthColors[r.risk],
                              }}
                            />
                          </div>
                          <span className="text-slate-300">{r.health}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <RiskBadge level={r.risk as 'low' | 'moderate' | 'high'} />
                      </td>
                      <td className="py-2.5 pr-4 text-slate-400">{r.rainfall}mm</td>
                      <td className="py-2.5 pr-4 text-slate-400">{r.temp}°C</td>
                      <td className="py-2.5 text-slate-500">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* AI Insight */}
      <StaggerChild index={8}>
        <div className="mt-6 rounded-xl border border-green-800/50 bg-green-950/20 p-4">
          <div className="flex items-start gap-3">
            <Sprout className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
            <div>
              <p className="font-semibold text-green-300">AI Insight: Irrigation Optimization</p>
              <p className="mt-1 text-sm text-green-400/80">
                With only {industryStats.irrigatedPct}% of production under irrigation, expanding smart irrigation
                to drought-stressed regions like Zululand (health score: 69%) could increase yields by
                8-15%. AI-driven scheduling based on soil moisture sensors and weather forecasts
                could reduce water consumption by 20% while improving yields across 118,000 irrigated hectares.
              </p>
            </div>
          </div>
        </div>
      </StaggerChild>
    </AnimatedPanel>
  )
}
