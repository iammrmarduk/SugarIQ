import { BookOpen, ExternalLink, Shield, Sprout, Factory, TrendingUp, FlaskConical, AlertTriangle } from 'lucide-react'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Source {
  title: string
  url?: string
  detail: string
}

interface SourceCategory {
  category: string
  icon: LucideIcon
  iconColor: string
  borderColor: string
  sources: Source[]
}

const sourceCategories: SourceCategory[] = [
  {
    category: 'Industry Overview & Statistics',
    icon: Sprout,
    iconColor: 'text-cane-400',
    borderColor: 'border-cane-500/30',
    sources: [
      {
        title: 'South African Sugar Association (SASA)',
        url: 'https://sasa.org.za',
        detail: 'Primary source for industry statistics: R24B annual direct income, 26,740 growers (25,653 small-scale), 12 operating mills, 65,000 direct jobs, 1 million livelihoods, 348,000 hectares under cane. Annual industry reports and Sugar Master Plan data.',
      },
      {
        title: 'SASA Sugar Industry Statistics (2024/25)',
        url: 'https://sasa.org.za/facts-and-figures/',
        detail: 'Season data: ~16.47M tonnes cane crushed, ~2.09M tonnes sugar produced. Irrigated area ~22% of total (accounting for ~35% of production).',
      },
      {
        title: 'South African Sugar Research Institute (SASRI)',
        url: 'https://sasri.org.za',
        detail: 'Yield data, regional health assessments, varietal information, precision agriculture research. Average yield ~56 tonnes/hectare nationally.',
      },
      {
        title: 'Sugarcane Value Chain Master Plan (DTIC)',
        url: 'https://www.thedtic.gov.za',
        detail: 'Phase 1 (Nov 2020-Mar 2023): Stabilisation — domestic sales restored to 1.55M tonnes. Phase 2 (from 2024): Growth and diversification. Block exemptions drafted May 2025.',
      },
    ],
  },
  {
    category: 'Import Crisis & Trade Data',
    icon: Shield,
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    sources: [
      {
        title: 'SARS Customs Data / SA Canegrowers Analysis (2025)',
        url: 'https://sacanegrowers.co.za/2025/11/04/south-african-sugarcane-growers-warn-of-industry-crisis-as-sugar-imports-surge-400/',
        detail: 'Import volumes: 153,344 tonnes Jan-Sep 2025, surging 400%+ vs historical averages. 149,099 tonnes Jan-Aug alone. Source countries: Brazil (~48%), Thailand, Guatemala, India.',
      },
      {
        title: 'ITAC (International Trade Administration Commission)',
        url: 'https://www.itac.org.za',
        detail: 'Reference price: US$680/tonne. SASA requested increase to US$905/tonne. BevSA counter-proposal: US$552-650/tonne.',
      },
      {
        title: 'SASA Import Impact Assessment (2025)',
        detail: 'Documented industry losses of R760M+ (Jan-Aug 2025). Full-year projection exceeds R1 billion. Health Promotion Levy (sugar tax) cost to industry: R1.2B annually.',
      },
      {
        title: 'National Treasury — Health Promotion Levy',
        url: 'https://www.treasury.gov.za',
        detail: 'HPL rate of 2.21c per gram of sugar exceeding 4g/100ml. Introduced April 2018. Industry impact data from SASA submissions to National Treasury.',
      },
    ],
  },
  {
    category: 'Mill Operations & Companies',
    icon: Factory,
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    sources: [
      {
        title: 'Illovo Sugar Africa',
        url: 'https://www.illovosugarafrica.com',
        detail: 'Subsidiary of Associated British Foods (ABF). Delisted from JSE June 2016. Operates Sezela, Eston, Noodsberg. Umzimkulu permanently closed 2021. Largest sugar producer in Africa. Holds 30% stake in Gledhow Sugar.',
      },
      {
        title: 'RCL Foods — Integrated Annual Report',
        url: 'https://www.rclfoods.com',
        detail: 'Listed on JSE. Operates Komati, Malelane, Pongola mills in Mpumalanga. Largest individual mills by capacity. Selati brand.',
      },
      {
        title: 'Tongaat Hulett — Business Rescue Proceedings',
        detail: 'Status as of 12 February 2026: Provisional liquidation filed at KZN High Court. R900M in unpaid SASA levies. See "Tongaat Hulett Crisis" section for detailed timeline and sources.',
      },
      {
        title: 'SASA Cogeneration Potential Study',
        detail: 'Current output: ~120 MW across all mills. Potential: 700 MW with high-pressure boiler upgrades. IRP 2019 includes biomass in distributed generation/cogeneration allocations.',
      },
    ],
  },
  {
    category: 'Tongaat Hulett Crisis',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    sources: [
      {
        title: 'KZN High Court — Provisional Liquidation Filing (12 Feb 2026)',
        detail: 'Business rescue practitioners Luke Sobey and Peter van den Steen filed for provisional liquidation after sale agreements with Vision Group lapsed on 7 Feb 2026.',
      },
      {
        title: 'Daily Maverick — "Bittersweet end for Tongaat Hulett"',
        url: 'https://www.dailymaverick.co.za/article/2026-02-12-bittersweet-end-for-tongaat-hulett-as-rescuers-throw-in-the-towel/',
        detail: 'Primary reporting on liquidation filing, R12B shareholder value destroyed, Vision R11.7B demand letter, and sale agreement lapse.',
      },
      {
        title: 'JSE SENS & PwC Forensic Investigation',
        url: 'https://www.jse.co.za',
        detail: 'Accounting fraud revealed 2018: profits overstated by 239%, assets by 34%. Company entered voluntary business rescue 27 October 2022 with R1.5B working capital shortfall.',
      },
      {
        title: 'Supreme Court of Appeal — ZASCA 190 (15 Dec 2025)',
        url: 'https://www.saflii.org/za/cases/ZASCA/2025/190.html',
        detail: 'SCA ruled SASA levies are statutory obligations under the Sugar Act — cannot be suspended during business rescue. R900M in levies remain outstanding.',
      },
      {
        title: 'IOL / Business Live — Mill Performance Reporting',
        url: 'https://iol.co.za/business-report/companies/2025-08-19-strong-operational-gains-made-at-tongaat-hulett-mid-season/',
        detail: 'R1.45B IDC-funded rehabilitation: Maidstone lost time 33.5% → 12.4%, Felixton lost time 27.1% → 12.9%, all 3 mills now rank top-3 nationally for sugar recovery.',
      },
      {
        title: 'SA Canegrowers Association / SAFDA',
        url: 'https://sacanegrowers.co.za',
        detail: '15,446 growers in Tongaat catchment (60% of all small-scale growers). ~200,000 livelihoods at risk. 1M+ tonnes cane expected this season, R845.7M in grower revenue at stake. Accounts for ~25% of SA sugar production.',
      },
      {
        title: 'DTIC Ministerial Intervention',
        detail: 'Minister Parks Tau intervening directly. Government recognises critical importance of continued mill operations for KZN North Coast and Zululand regions.',
      },
    ],
  },
  {
    category: 'Diversification & Biofuels',
    icon: TrendingUp,
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    sources: [
      {
        title: 'SASA — Bold Diversification Plans',
        url: 'https://sasa.org.za/sa-sugar-industry-unveils-bold-diversification-plans-amid-crippling-sugar-tax-crisis/',
        detail: 'Bioethanol: 125M litres/year potential (R2B+ investment, 21,000 jobs). Cogeneration: 700 MW potential to national grid (26,500 jobs). Total industry diversification targets.',
      },
      {
        title: 'SA Canegrowers / RSB — SAF Feasibility Study (May 2021)',
        url: 'https://sacanegrowers.co.za/sugar-high-sa-canegrowers-could-produce-433-million-litres-of-aviation-fuel-a-year/',
        detail: 'SAF potential: 433M litres/year (theoretical max from 50% cane diversion via ATJ pathway). SASA near-term target: 110M litres, expandable to 375M litres.',
      },
      {
        title: 'IATA — SAF Roadmap',
        url: 'https://www.iata.org/en/programs/environment/sustainable-aviation-fuels/',
        detail: 'Global SAF demand projected at 449 billion litres by 2050. EU mandates 6% SAF blending by 2030. Airlines committed to SAF procurement targets.',
      },
      {
        title: 'Brazil — Ethanol Mandate (MAPA/ANP)',
        url: 'https://ethanolproducer.com/articles/brazil-to-boost-biofuel-mandates-to-e30-b15',
        detail: 'Brazil raised mandatory ethanol blending to E30 (30%) in 2025 under "Fuel of the Future" program. ProÁlcool programme supports ~3.6M jobs, 370+ distilleries.',
      },
      {
        title: 'UNICA (Brazil) — Bagasse Cogeneration',
        url: 'https://unica.com.br/en/the-sector/bioelectricity/',
        detail: 'Brazil has 12,410 MW installed bagasse cogeneration capacity across 422 plants, generating over 21,000 GWh annually. Mauritius derives ~13% of national electricity from bagasse.',
      },
      {
        title: 'Braskem — Bio-polyethylene Expansion',
        url: 'https://www.braskem.com.br/usa/news-detail/braskem-expands-its-biopolymer-production-by-30-following-an-investment-of-us-87-million',
        detail: '260,000 tonnes/year of "I\'m green" bio-PE from sugarcane ethanol at Triunfo (30% expansion completed June 2023, US$87M investment). Sold to Unilever, P&G, Johnson & Johnson.',
      },
      {
        title: 'National Treasury / PKF SA — Carbon Tax',
        url: 'https://www.pkf.co.za/news/2025/carbon-tax-compliance-what-to-consider-in-2025-and-beyond/',
        detail: 'SA carbon tax: R236/tonne CO₂e (2025 rate, up from R190 in 2024). Trajectory: R308 (2026), R462 (2030). EU ETS: €60-80/tonne. VCM: ~US$723M in 2023.',
      },
      {
        title: 'SA IRP 2019 — Integrated Resource Plan',
        url: 'https://www.energy.gov.za/IRP/2019/IRP-2019.pdf',
        detail: 'Allocates 500 MW/year from 2023 for combined DG/cogeneration/biomass/landfill category. Bagasse identified as most-ready biomass source.',
      },
      {
        title: 'Raízen (Shell/Cosan JV) — Cellulosic Ethanol',
        url: 'https://ri.raizen.com.br/en/e2g/',
        detail: 'Bonfim Bioenergy Park: 82M litres/year cellulosic ethanol — world\'s largest. Total E2G capacity: 114M litres/year. Expanding into SAF via ATJ pathway.',
      },
    ],
  },
  {
    category: 'CTS Lab Operations',
    icon: FlaskConical,
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    sources: [
      {
        title: 'SASA — Cane Testing Service (CTS)',
        url: 'https://sasa.org.za/cane-testing-service/',
        detail: 'Operates 11 laboratories (9 KZN, 2 Mpumalanga) co-located at each operating mill. Uses Direct Analysis of Cane (DAC) method. Determines Recoverable Value (RV) — basis for grower-miller payments.',
      },
      {
        title: 'CTS Managers Conference — SASA',
        detail: 'Annual conference for 16 CTS managers and their teams. Covers lab operations, quality assurance, instrument calibration, and industry standards.',
      },
      {
        title: 'SASA Laboratory Methods — RV Determination',
        detail: 'Sample analysis parameters: Brix (19-23%), Pol (16-19%), Fibre (12-16%), RV (10-14). Purity ratios typically 83-86%. Anomaly detection thresholds based on seasonal means and standard deviations.',
      },
    ],
  },
]

export function Sources() {
  return (
    <AnimatedPanel>
      <SectionTitle
        icon={BookOpen}
        title="Data Sources & References"
        subtitle="All data in SugarIQ is sourced from official industry bodies, government publications, and verified reporting"
        iconColor="text-slate-400"
      />

      {/* Disclaimer */}
      <StaggerChild index={0}>
        <div className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-300">Data Integrity Note:</span>{' '}
            All statistics, figures, and claims presented in SugarIQ have been cross-referenced against
            publicly available sources from SASA, SASRI, government departments (DTIC, ITAC, National Treasury),
            company filings, and industry publications. Where exact figures vary between sources, the most
            conservative or most recently published figure has been used. Data is current as of February 2026.
          </p>
        </div>
      </StaggerChild>

      {/* Source Categories */}
      <div className="space-y-6">
        {sourceCategories.map((cat, catIndex) => (
          <StaggerChild key={cat.category} index={catIndex + 1}>
            <div className={cn('rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden', cat.borderColor)}>
              {/* Category Header */}
              <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-4">
                <div className={cn('rounded-lg bg-slate-800 p-2', cat.iconColor)}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{cat.category}</h3>
                  <p className="text-xs text-slate-500">{cat.sources.length} sources</p>
                </div>
              </div>

              {/* Sources List */}
              <div className="divide-y divide-slate-700/30">
                {cat.sources.map((source, i) => (
                  <div key={i} className="px-5 py-3.5 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-200">{source.title}</p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-cane-400 hover:text-cane-300 transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{source.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StaggerChild>
        ))}
      </div>

      {/* Footer note */}
      <StaggerChild index={sourceCategories.length + 1}>
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Last verified: February 2026 &middot; SugarIQ Intelligence Platform &middot; Prepared for SASA
          </p>
        </div>
      </StaggerChild>
    </AnimatedPanel>
  )
}
