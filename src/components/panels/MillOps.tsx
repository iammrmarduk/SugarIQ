import { Factory, AlertTriangle, Zap, Wrench, Building2, Clock, XCircle, CheckCircle, Users, Landmark } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { ChartCard } from '../shared/ChartCard'
import { RiskBadge } from '../shared/RiskBadge'
import { industryStats, millCompanies, maintenanceAlerts, cogenData, tongaatHulettCrisis } from '../../lib/data'
import { mills } from '../../lib/mill-coordinates'
import { millStatsList, derivedMaintenanceAlerts, seasonTotals } from '../../lib/r7106-derived'
import { cn } from '../../lib/utils'

const statusColors = {
  operating: 'text-green-400 bg-green-950 border-green-800',
  closed: 'text-red-400 bg-red-950 border-red-800',
  suspended: 'text-orange-400 bg-orange-950 border-orange-800',
}

export function MillOps() {
  const operatingMills = mills.filter((m) => m.status === 'operating')
  const avgEfficiency = millStatsList.length > 0
    ? millStatsList.reduce((sum, m) => sum + m.avgSucroseExtraction, 0) / millStatsList.length
    : operatingMills.reduce((sum, m) => sum + m.efficiency, 0) / operatingMills.length
  const totalCogen = cogenData.mills.reduce((sum, m) => sum + m.current, 0)
  const allAlerts = [...derivedMaintenanceAlerts, ...maintenanceAlerts]
  const efficiencyData = millStatsList
    .filter(ms => ms.avgSucroseExtraction > 0)
    .map(ms => ({
      name: ms.millName,
      efficiency: Math.round(ms.avgSucroseExtraction * 10) / 10,
    }))
    .sort((a, b) => b.efficiency - a.efficiency)

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={Factory}
        title="Mill Operations & Supply Chain"
        subtitle="Real-time monitoring of 12 operating sugar mills across South Africa"
        iconColor="text-blue-400"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={0}>
          <StatCard
            title="Operating Mills"
            value={industryStats.activeMills}
            suffix={` of ${industryStats.totalMills}`}
            icon={Factory}
            iconColor="text-blue-400"
          />
        </StaggerChild>
        <StaggerChild index={1}>
          <StatCard
            title="Avg Efficiency"
            value={Math.round(avgEfficiency * 10) / 10}
            suffix="%"
            icon={Zap}
            iconColor="text-cane-400"
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="Avg Crush Rate"
            value={Math.round(seasonTotals.avgCrushRate)}
            suffix=" TCH"
            icon={Zap}
            iconColor="text-yellow-400"
            description={`${(seasonTotals.totalCaneCrushed / 1e6).toFixed(1)}M tonnes this season`}
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="Maintenance Alerts"
            value={allAlerts.length}
            suffix=" active"
            icon={Wrench}
            iconColor="text-orange-400"
            description={`${derivedMaintenanceAlerts.filter(a => a.severity === 'high').length} data-driven`}
          />
        </StaggerChild>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mill Companies */}
        <StaggerChild index={4}>
          <ChartCard title="Mill Ownership & Status" subtitle="14 mills across 6 companies">
            <div className="space-y-3">
              {millCompanies.map((company) => (
                <div
                  key={company.company}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-semibold text-white">{company.company}</span>
                    </div>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium border',
                      company.status === 'Liquidation Filed'
                        ? 'text-red-400 bg-red-950 border-red-800 animate-pulse'
                        : company.status === 'Business Rescue'
                        ? 'text-orange-400 bg-orange-950 border-orange-800'
                        : 'text-slate-400 bg-slate-800 border-slate-700',
                    )}>
                      {company.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {company.mills.map((mill) => {
                      const isClosed = mill.includes('*')
                      return (
                        <span
                          key={mill}
                          className={cn(
                            'rounded-md px-2 py-0.5 text-[11px] font-medium',
                            isClosed
                              ? 'bg-red-950/50 text-red-400'
                              : 'bg-slate-700/50 text-slate-300',
                          )}
                        >
                          {mill}
                        </span>
                      )
                    })}
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">{company.notes}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </StaggerChild>

        {/* Maintenance Alerts */}
        <StaggerChild index={5}>
          <ChartCard title="Predictive Maintenance Alerts" subtitle="AI-driven alerts from R7106 factory statistics + planned maintenance">
            <div className="max-h-[420px] space-y-3 overflow-y-auto">
              {allAlerts.map((alert, i) => (
                <div
                  key={`${alert.mill}-${alert.component}-${i}`}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          alert.severity === 'high' ? 'text-orange-400' :
                          alert.severity === 'moderate' ? 'text-yellow-400' : 'text-green-400',
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{alert.mill}</p>
                        <p className="text-xs text-slate-400">{alert.component}</p>
                      </div>
                    </div>
                    <RiskBadge level={alert.severity as 'high' | 'moderate' | 'low'} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{alert.message}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Action required in {alert.daysUntil} days
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </StaggerChild>

        {/* Mill Efficiency */}
        <StaggerChild index={6}>
          <ChartCard
            title="Mill Sucrose Extraction"
            subtitle="Average sucrose extraction efficiency from R7106 data (%)"
          >
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={efficiencyData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  domain={[
                    Math.floor(Math.min(...efficiencyData.map(d => d.efficiency))) - 1,
                    Math.ceil(Math.max(...efficiencyData.map(d => d.efficiency))) + 1,
                  ]}
                  stroke="#64748b"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  width={90}
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
                  formatter={(value) => [`${value}%`, 'Sucrose Extraction']}
                />
                <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                  {efficiencyData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.efficiency >= 93 ? '#22c55e' :
                        d.efficiency >= 91 ? '#f59e0b' : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </StaggerChild>

        {/* Co-generation */}
        <StaggerChild index={7}>
          <ChartCard
            title="Bagasse Co-generation"
            subtitle={`Current: ${totalCogen} MW | Potential: ${cogenData.potentialOutput} MW`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cogenData.mills}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} angle={-45} textAnchor="end" height={60} />
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
                <Bar dataKey="current" name="Current (MW)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="potential" name="Potential (MW)" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 rounded-lg bg-cane-500/10 p-3">
              <p className="text-xs text-cane-300">
                <Zap className="mr-1 inline h-3 w-3" />
                Unlocking {cogenData.potentialOutput} MW of bagasse co-generation capacity could provide
                clean energy to the national grid, reducing Eskom dependence while creating a new
                revenue stream worth an estimated R2.1B/year.
              </p>
            </div>
          </ChartCard>
        </StaggerChild>
      </div>

      {/* Tongaat Hulett Crisis Section */}
      <StaggerChild index={8}>
        <div className="mt-6 rounded-xl border border-red-800/50 bg-red-950/20 p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-red-500/20 p-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-red-300">Tongaat Hulett — Provisional Liquidation</h3>
                  <span className="rounded-full border border-red-600 bg-red-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                    Breaking
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-red-400/70">134-year-old company | Filed {tongaatHulettCrisis.statusDate}</p>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-3 text-center">
              <Users className="mx-auto mb-1 h-4 w-4 text-red-400" />
              <div className="text-lg font-bold text-red-300">200K+</div>
              <div className="text-[10px] text-red-400/60">Jobs at Risk</div>
            </div>
            <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-3 text-center">
              <Users className="mx-auto mb-1 h-4 w-4 text-orange-400" />
              <div className="text-lg font-bold text-orange-300">{tongaatHulettCrisis.impact.contractedGrowers.toLocaleString()}</div>
              <div className="text-[10px] text-red-400/60">Growers (60% of all SSGs)</div>
            </div>
            <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-3 text-center">
              <Landmark className="mx-auto mb-1 h-4 w-4 text-red-400" />
              <div className="text-lg font-bold text-red-300">R900M</div>
              <div className="text-[10px] text-red-400/60">Unpaid SASA Levies</div>
            </div>
            <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-3 text-center">
              <Factory className="mx-auto mb-1 h-4 w-4 text-orange-400" />
              <div className="text-lg font-bold text-orange-300">27%</div>
              <div className="text-[10px] text-red-400/60">Of SA Sugar Production</div>
            </div>
            <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-3 text-center">
              <AlertTriangle className="mx-auto mb-1 h-4 w-4 text-red-400" />
              <div className="text-lg font-bold text-red-300">R846M</div>
              <div className="text-[10px] text-red-400/60">Season Revenue at Risk</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-4 rounded-lg border border-slate-700/30 bg-slate-900/50 p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Crisis Timeline</h4>
            <div className="relative space-y-3">
              {tongaatHulettCrisis.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-2.5 w-2.5 rounded-full mt-1',
                      item.type === 'crisis' ? 'bg-red-500' :
                      item.type === 'scandal' ? 'bg-orange-500' : 'bg-green-500',
                    )} />
                    {i < tongaatHulettCrisis.timeline.length - 1 && (
                      <div className="mt-1 h-5 w-px bg-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <span className="mr-2 text-[11px] font-semibold text-slate-300">{item.date}</span>
                    <span className="text-[11px] text-slate-400">{item.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rescue Plan Conditions */}
          <div className="mb-4 rounded-lg border border-slate-700/30 bg-slate-900/50 p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Failed Rescue Plan Conditions</h4>
            <div className="space-y-2">
              {tongaatHulettCrisis.rescuePlanConditions.map((condition, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md bg-slate-800/50 px-3 py-2">
                  <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-slate-200">{condition.label}</span>
                    <span className="mx-2 text-xs text-red-400 font-bold">{condition.amount}</span>
                    <span className="text-[11px] text-slate-500">— {condition.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mill Performance Turnaround (the irony) */}
          <div className="mb-4 rounded-lg border border-green-800/30 bg-green-950/20 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Operational Turnaround (R1.45B IDC rehabilitation)
            </h4>
            <p className="mb-3 text-[11px] text-green-300/70">
              Despite the corporate collapse, all 3 mills now rank <span className="font-bold text-green-300">top-3 nationally</span> for sugar recovery — a testament to the R1.45B rehabilitation programme.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-slate-900/50 p-2.5">
                <div className="text-[11px] font-semibold text-slate-200">Maidstone</div>
                <div className="mt-1 text-[10px] text-slate-400">Lost time: <span className="text-red-400 line-through">33.5%</span> → <span className="font-bold text-green-400">12.4%</span></div>
                <div className="text-[10px] text-slate-400">Sucrose extraction: <span className="font-bold text-green-400">&gt;95%</span></div>
              </div>
              <div className="rounded-md bg-slate-900/50 p-2.5">
                <div className="text-[11px] font-semibold text-slate-200">Felixton</div>
                <div className="mt-1 text-[10px] text-slate-400">Lost time: <span className="text-red-400 line-through">27.1%</span> → <span className="font-bold text-green-400">12.9%</span></div>
                <div className="text-[10px] text-slate-400">BHR improved <span className="font-bold text-green-400">+7 points</span></div>
              </div>
              <div className="rounded-md bg-slate-900/50 p-2.5">
                <div className="text-[11px] font-semibold text-slate-200">Amatikulu</div>
                <div className="mt-1 text-[10px] text-slate-400">BHR improved <span className="font-bold text-green-400">+5 points</span></div>
                <div className="text-[10px] text-slate-400">Highest extraction <span className="font-bold text-green-400">in 5 years</span></div>
              </div>
            </div>
          </div>

          {/* Key messages */}
          <div className="space-y-2">
            <div className="rounded-lg border border-orange-800/30 bg-orange-950/20 px-3 py-2">
              <p className="text-xs text-orange-300/90">
                <span className="font-semibold">SA Canegrowers:</span> "{tongaatHulettCrisis.canegrowersWarning}"
              </p>
            </div>
            <div className="rounded-lg border border-blue-800/30 bg-blue-950/20 px-3 py-2">
              <p className="text-xs text-blue-300/90">
                <span className="font-semibold">Government:</span> {tongaatHulettCrisis.governmentIntervention}
              </p>
            </div>
            <div className="rounded-lg border border-red-800/30 bg-red-950/20 px-3 py-2">
              <p className="text-xs text-red-300/90">
                <span className="font-semibold">At Stake:</span> Over 1M tonnes of cane expected this season, R845.7M in grower revenue — if mills stop, cane rots in the fields
              </p>
            </div>
          </div>
        </div>
      </StaggerChild>
    </AnimatedPanel>
  )
}
