import { Rocket, CheckCircle2, Clock, Target, Users, DollarSign } from 'lucide-react'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { roadmapPhases, industryStats } from '../../lib/data'
import { cn } from '../../lib/utils'

export function Roadmap() {
  return (
    <AnimatedPanel>
      <SectionTitle
        icon={Rocket}
        title="AI Adoption Roadmap"
        subtitle="Three-phase strategy for AI-driven transformation of the SA sugar industry"
        iconColor="text-purple-400"
      />

      {/* Impact Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StaggerChild index={0}>
          <StatCard
            title="Industry Revenue"
            value={24}
            prefix="R"
            suffix="B"
            icon={DollarSign}
            iconColor="text-cane-400"
            description="Annual revenue to protect & grow"
          />
        </StaggerChild>
        <StaggerChild index={1}>
          <StatCard
            title="Total Livelihoods"
            value={industryStats.totalLivelihoods}
            icon={Users}
            iconColor="text-blue-400"
            description="People depending on the industry"
          />
        </StaggerChild>
        <StaggerChild index={2}>
          <StatCard
            title="AI Value Creation"
            value={1.2}
            prefix="R"
            suffix="B+"
            icon={Target}
            iconColor="text-green-400"
            description="Projected annual value by Phase 3"
          />
        </StaggerChild>
        <StaggerChild index={3}>
          <StatCard
            title="Yield Improvement"
            value={15}
            suffix="%"
            icon={Rocket}
            iconColor="text-purple-400"
            description="Target by end of roadmap"
          />
        </StaggerChild>
      </div>

      {/* Roadmap Phases */}
      <div className="space-y-6">
        {roadmapPhases.map((phase, phaseIndex) => (
          <StaggerChild key={phase.phase} index={phaseIndex + 4}>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
              {/* Phase Header */}
              <div
                className="flex items-center justify-between border-b border-slate-700/50 px-5 py-4"
                style={{
                  borderLeft: `4px solid ${phase.color}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${phase.color}20` }}
                  >
                    {phaseIndex === 0 ? (
                      <Clock className="h-5 w-5" style={{ color: phase.color }} />
                    ) : phaseIndex === 1 ? (
                      <Target className="h-5 w-5" style={{ color: phase.color }} />
                    ) : (
                      <Rocket className="h-5 w-5" style={{ color: phase.color }} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{phase.phase}</h3>
                    <p className="text-xs text-slate-400">{phase.timeline}</p>
                  </div>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${phase.color}15`,
                    color: phase.color,
                    border: `1px solid ${phase.color}30`,
                  }}
                >
                  {phase.timeline}
                </div>
              </div>

              {/* Phase Items */}
              <div className="p-5">
                <div className="space-y-2.5">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          phaseIndex === 0 ? 'text-green-400' : 'text-slate-600',
                        )}
                      />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Impact bar */}
                <div
                  className="mt-4 rounded-lg p-3"
                  style={{ backgroundColor: `${phase.color}10` }}
                >
                  <p className="text-xs font-medium" style={{ color: phase.color }}>
                    Estimated Impact: {phase.impact}
                  </p>
                </div>
              </div>
            </div>
          </StaggerChild>
        ))}
      </div>

      {/* CTA */}
      <StaggerChild index={7}>
        <div className="mt-8 rounded-xl border border-cane-500/30 bg-gradient-to-r from-cane-950/50 to-slate-900 p-6 text-center">
          <h3 className="text-lg font-bold text-white">
            Ready to Transform South Africa's Sugar Industry?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
            SugarIQ combines real-time data intelligence, AI-driven advisory, and predictive analytics
            to protect and grow the R{(industryStats.annualRevenue / 1e9).toFixed(0)}B sugar industry.
            From import threat monitoring to precision agriculture for {industryStats.smallScaleGrowers.toLocaleString()} small-scale growers,
            this platform is designed to secure the livelihoods of {(industryStats.totalLivelihoods / 1e6).toFixed(0)} million South Africans.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="rounded-lg bg-cane-500 px-5 py-2 text-sm font-semibold text-slate-900">
              Let's Build This Together
            </div>
            <div className="text-sm text-slate-500">
              Powered by VillageIO
            </div>
          </div>
        </div>
      </StaggerChild>
    </AnimatedPanel>
  )
}
