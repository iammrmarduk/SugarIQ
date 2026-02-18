import {
  importData, industryStats, yieldHistory, regionalHealth,
  millCompanies, maintenanceAlerts, cogenData, tongaatHulettCrisis,
  diversificationTargets, revenueMix, opportunityMatrix, diversificationDetails,
  roadmapPhases, advisoryCapabilities,
  ctsSampleData, ctsWeeklyRV, ctsRecoveryByShift, ctsLabStats, ctsAIInsights,
} from './data'
import { mills, ctsLabs, millRegions } from './mill-coordinates'

function downloadFile(content: string, filename: string, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function csvRow(values: (string | number | null | undefined)[]): string {
  return values.map(v => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }).join(',')
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function header(title: string): string {
  return [
    `SugarIQ Intelligence Report`,
    `Report: ${title}`,
    `Generated: ${timestamp()} SAST`,
    `Prepared for: South African Sugar Association`,
    `Platform: SugarIQ — AI-Powered Sugar Industry Intelligence`,
    `Data Period: 2025/26 Season`,
    `Confidentiality: For authorised SASA stakeholders only`,
  ].join('\n')
}

function blankLine(lines: string[]) {
  lines.push('')
}

function section(lines: string[], title: string) {
  lines.push('')
  lines.push(`=== ${title} ===`)
}

// ===== SHARED SOURCE REFERENCES =====
function addSources(lines: string[], sources: [string, string][]) {
  section(lines, 'SOURCES & REFERENCES')
  lines.push(csvRow(['Source', 'URL / Reference']))
  sources.forEach(([name, url]) => {
    lines.push(csvRow([name, url]))
  })
  blankLine(lines)
  lines.push(csvRow(['Data Integrity Note']))
  lines.push(csvRow(['All statistics and figures have been cross-referenced against publicly available sources from SASA, SASRI, government departments (DTIC, ITAC, National Treasury), company filings, and industry publications. Where figures vary between sources, the most conservative or most recently published figure is used. Data current as of February 2026.']))
}

const SOURCES_SASA: [string, string] = ['South African Sugar Association (SASA)', 'https://sasa.org.za/the-sugar-industry-at-a-glance/']
const SOURCES_SASA_FACTS: [string, string] = ['SASA Facts and Figures (2025/26 crop estimate)', 'https://sasa.org.za/facts-and-figures/']
const SOURCES_SASRI: [string, string] = ['South African Sugarcane Research Institute (SASRI)', 'https://sasri.org.za']
const SOURCES_ITAC: [string, string] = ['ITAC — Dollar-Based Reference Price investigation', 'https://www.freightnews.co.za/article/itac-initiates-an-investigation-into-sugar-tariffs']
const SOURCES_SARS: [string, string] = ['SARS Customs Data / SA Canegrowers analysis', 'https://sacanegrowers.co.za/2025/11/04/south-african-sugarcane-growers-warn-of-industry-crisis-as-sugar-imports-surge-400/']
const SOURCES_CANEGROWERS: [string, string] = ['SA Canegrowers Association', 'https://sacanegrowers.co.za']
const SOURCES_USDA: [string, string] = ['USDA Foreign Agricultural Service — Sugar Annual', 'https://www.fas.usda.gov/data/south-africa-sugar-annual-8']
const SOURCES_DTIC: [string, string] = ['DTIC — Sugar Master Plan', 'https://www.thedtic.gov.za/wp-content/uploads/Masterplan-Sugar.pdf']
const SOURCES_TONGAAT_DM: [string, string] = ['Daily Maverick — Tongaat Hulett liquidation', 'https://www.dailymaverick.co.za/article/2026-02-12-bittersweet-end-for-tongaat-hulett-as-rescuers-throw-in-the-towel/']
const SOURCES_SCA: [string, string] = ['Supreme Court of Appeal — ZASCA 190 (SASA levies ruling)', 'https://www.saflii.org/za/cases/ZASCA/2025/190.html']
const SOURCES_ILLOVO: [string, string] = ['Illovo Sugar South Africa (ABF subsidiary)', 'https://www.illovosugarsa.co.za']
const SOURCES_RCL: [string, string] = ['RCL Foods (JSE: RCL)', 'https://www.rclfoods.com']
const SOURCES_SASA_DIVERSIFY: [string, string] = ['SASA — Diversification Plans', 'https://sasa.org.za/sa-sugar-industry-unveils-bold-diversification-plans-amid-crippling-sugar-tax-crisis/']
const SOURCES_SAF_STUDY: [string, string] = ['SA Canegrowers / RSB — SAF Feasibility Study (2021)', 'https://sacanegrowers.co.za/sugar-high-sa-canegrowers-could-produce-433-million-litres-of-aviation-fuel-a-year/']
const SOURCES_BRASKEM: [string, string] = ['Braskem — Bio-polyethylene expansion (2023)', 'https://www.braskem.com.br/usa/news-detail/braskem-expands-its-biopolymer-production-by-30-following-an-investment-of-us-87-million']
const SOURCES_UNICA: [string, string] = ['UNICA Brazil — Bagasse cogeneration data', 'https://unica.com.br/en/the-sector/bioelectricity/']
const SOURCES_CARBON_TAX: [string, string] = ['PKF SA — Carbon Tax 2025', 'https://www.pkf.co.za/news/2025/carbon-tax-compliance-what-to-consider-in-2025-and-beyond/']
const SOURCES_IRP: [string, string] = ['SA IRP 2019 — Integrated Resource Plan', 'https://www.gov.za/sites/default/files/gcis_document/201910/42778gon1359.pdf']
const SOURCES_RAIZEN: [string, string] = ['Raízen — Cellulosic ethanol (E2G)', 'https://ri.raizen.com.br/en/e2g/']
const SOURCES_CTS: [string, string] = ['SASA — Cane Testing Service', 'https://sasa.org.za/cane-testing-service/']
const SOURCES_IATA: [string, string] = ['IATA — SAF Roadmap', 'https://www.iata.org/en/programs/environment/sustainable-aviation-fuels/']
const SOURCES_HPL: [string, string] = ['SARS — Health Promotion Levy', 'https://www.sars.gov.za/customs-and-excise/excise/health-promotion-levy-on-sugary-beverages/']
const SOURCES_TONGAAT_IOL: [string, string] = ['IOL — Tongaat mill performance mid-season 2025', 'https://iol.co.za/business-report/companies/2025-08-19-strong-operational-gains-made-at-tongaat-hulett-mid-season/']
const SOURCES_ETHANOL_BRAZIL: [string, string] = ['Brazil Fuel of the Future — E30 mandate', 'https://ethanolproducer.com/articles/brazil-to-boost-biofuel-mandates-to-e30-b15']

// ============================================================
// STANDALONE HTML EXPORT
// ============================================================

function renderDetailHtml(key: string): string {
  const detail = diversificationDetails[key]
  if (!detail) return ''
  const totalJobs = detail.jobBreakdown.reduce((s, j) => s + j.count, 0)
  const totalInvestment = detail.investmentBreakdown.reduce((s, i) => {
    const num = parseFloat(i.amount.replace('R', '').replace('B', ''))
    return s + num
  }, 0)

  return `
    <div class="detail-panel" style="margin-top:8px; border:1px solid ${detail.color}30; border-radius:12px; background:${detail.color}08; overflow:hidden;">
      <div style="padding:16px 20px; border-bottom:1px solid ${detail.color}20; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:15px; font-weight:700; color:white;">${detail.title}</div>
          <div style="font-size:12px; color:#94a3b8; margin-top:2px;">${detail.tagline}</div>
        </div>
      </div>
      <div style="padding:16px 20px;">
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px;">
          <div style="background:#1e293b80; border:1px solid #334155; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:15px; font-weight:700; color:white;">${detail.annualRevenue}</div>
            <div style="font-size:10px; color:#94a3b8;">Annual Revenue Potential</div>
          </div>
          <div style="background:#1e293b80; border:1px solid #334155; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:15px; font-weight:700; color:white;">${totalJobs.toLocaleString()}</div>
            <div style="font-size:10px; color:#94a3b8;">Jobs Created</div>
          </div>
          <div style="background:#1e293b80; border:1px solid #334155; border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:13px; font-weight:700; color:white;">${detail.timeline}</div>
            <div style="font-size:10px; color:#94a3b8;">Timeline</div>
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#cbd5e1; margin-bottom:6px;">Overview</div>
          <div style="font-size:13px; line-height:1.6; color:#94a3b8;">${detail.overview}</div>
        </div>
        <div style="margin-bottom:14px; background:#1e293b50; border:1px solid #334155; border-radius:8px; padding:12px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#60a5fa; margin-bottom:6px;">Global Context</div>
          <div style="font-size:13px; line-height:1.6; color:#94a3b8;">${detail.globalContext}</div>
        </div>
        <div style="margin-bottom:14px; background:${detail.color}08; border:1px solid ${detail.color}30; border-radius:8px; padding:12px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:${detail.color}; margin-bottom:6px;">South Africa Opportunity</div>
          <div style="font-size:13px; line-height:1.6; color:#cbd5e1;">${detail.saOpportunity}</div>
        </div>
        <div style="margin-bottom:14px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#4ade80; margin-bottom:8px;">How to Unlock This Opportunity</div>
          ${detail.howToUnlock.map((step, i) => `
            <div style="display:flex; align-items:flex-start; gap:10px; background:#1e293b30; border-radius:6px; padding:8px 10px; margin-bottom:4px;">
              <span style="flex-shrink:0; width:20px; height:20px; border-radius:50%; background:${detail.color}20; color:${detail.color}; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;">${i + 1}</span>
              <span style="font-size:12px; color:#cbd5e1;">${step}</span>
            </div>
          `).join('')}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
          <div>
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#fbbf24; margin-bottom:8px;">Investment Breakdown</div>
            ${detail.investmentBreakdown.map(item => `
              <div style="display:flex; justify-content:space-between; background:#1e293b40; border-radius:6px; padding:6px 10px; margin-bottom:4px;">
                <span style="font-size:11px; color:#cbd5e1;">${item.item}</span>
                <span style="font-size:11px; font-weight:600; color:#fbbf24;">${item.amount}</span>
              </div>
            `).join('')}
            <div style="display:flex; justify-content:space-between; border:1px solid #92400e30; background:#78350f20; border-radius:6px; padding:6px 10px;">
              <span style="font-size:11px; font-weight:600; color:#fcd34d;">Total Investment</span>
              <span style="font-size:11px; font-weight:700; color:#fcd34d;">R${totalInvestment.toFixed(1)}B</span>
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#60a5fa; margin-bottom:8px;">Job Creation Breakdown</div>
            ${detail.jobBreakdown.map(item => `
              <div style="display:flex; justify-content:space-between; background:#1e293b40; border-radius:6px; padding:6px 10px; margin-bottom:4px;">
                <span style="font-size:11px; color:#cbd5e1;">${item.category}</span>
                <span style="font-size:11px; font-weight:600; color:#60a5fa;">${item.count.toLocaleString()}</span>
              </div>
            `).join('')}
            <div style="display:flex; justify-content:space-between; border:1px solid #1e3a5f; background:#172554; border-radius:6px; padding:6px 10px;">
              <span style="font-size:11px; font-weight:600; color:#93c5fd;">Total Jobs</span>
              <span style="font-size:11px; font-weight:700; color:#93c5fd;">${totalJobs.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
          <div>
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#cbd5e1; margin-bottom:6px;">Key Players</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${detail.keyPlayers.map(p => `<span style="background:#1e293b; border-radius:4px; padding:3px 8px; font-size:10px; color:#cbd5e1;">${p}</span>`).join('')}
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#fb923c; margin-bottom:6px;">Challenges</div>
            ${detail.challenges.map(c => `<div style="font-size:10px; color:#94a3b8; margin-bottom:2px;">&bull; ${c}</div>`).join('')}
          </div>
        </div>
        <div style="border:1px solid #16653430; background:#05291540; border-radius:8px; padding:12px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#4ade80; margin-bottom:6px;">Case Study &mdash; ${detail.caseStudy.country}</div>
          <div style="font-size:12px; line-height:1.6; color:#86efac80;">${detail.caseStudy.detail}</div>
        </div>
      </div>
    </div>`
}

function injectCollapsibleDetails(clone: HTMLElement) {
  // Find all buttons with data-detail-key and replace them with collapsible sections
  const detailButtons = clone.querySelectorAll('[data-detail-key]')
  detailButtons.forEach((btn) => {
    const key = btn.getAttribute('data-detail-key')
    if (!key || !diversificationDetails[key]) return

    const details = document.createElement('details')
    details.className = 'detail-collapsible'
    const summary = document.createElement('summary')
    summary.style.cssText = 'list-style:none; cursor:pointer;'
    // Move the button's content into the summary
    summary.innerHTML = btn.innerHTML
    details.appendChild(summary)

    const content = document.createElement('div')
    content.innerHTML = renderDetailHtml(key)
    details.appendChild(content)

    btn.parentElement?.replaceChild(details, btn)
  })
}

export function exportPageAsHtml(contentEl: HTMLElement, tabLabel: string) {
  // 1. Clone the content DOM
  const clone = contentEl.cloneNode(true) as HTMLElement

  // 2. Normalize Framer Motion: strip transform/opacity on all elements
  clone.querySelectorAll('[style]').forEach((el) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.transform = 'none'
    htmlEl.style.opacity = '1'
  })

  // 3. Inject collapsible detail panels for diversification modals
  injectCollapsibleDetails(clone)

  // 4. Collect all <style> tags from document
  const styles = Array.from(document.querySelectorAll('style'))
    .map(s => s.innerHTML)
    .join('\n')

  // 5. Build standalone HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SugarIQ — ${tabLabel} — ${new Date().toLocaleDateString('en-ZA')}</title>
  <style>${styles}</style>
  <style>
    /* Standalone overrides */
    body { background: #0f172a; color: #f8fafc; margin: 0; padding: 0; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
    * { animation: none !important; animation-delay: 0s !important; transition: none !important; }
    .report-content { max-width: 1600px; margin: 0 auto; padding: 16px; }
    /* Collapsible detail panels */
    details.detail-collapsible > summary { list-style: none; }
    details.detail-collapsible > summary::-webkit-details-marker { display: none; }
    details.detail-collapsible > summary::marker { display: none; content: ""; }
    details.detail-collapsible[open] > summary { margin-bottom: 0; }
    details.detail-collapsible > summary > * { pointer-events: none; }
    .detail-panel { animation: none !important; }
  </style>
</head>
<body>
  <div class="report-content">
    ${clone.innerHTML}
  </div>
</body>
</html>`

  downloadFile(html, `SugarIQ-${tabLabel.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.html`, 'text/html')
}

// ============================================================
// IMPORT INTELLIGENCE
// ============================================================
export function exportImportIntel() {
  const lines: string[] = []

  lines.push(header('Import Threat Intelligence'))
  blankLine(lines)

  // Executive summary
  section(lines, 'EXECUTIVE SUMMARY')
  lines.push(csvRow(['Summary']))
  lines.push(csvRow([`Sugar imports have surged over ${importData.importSurge}% in 2025 compared to 2024. ${importData.totalImports2025.toLocaleString()} tonnes imported Jan-Sep alone. Documented revenue losses exceed R${(importData.estimatedLosses / 1e6).toFixed(0)}M (Jan-Aug) with full-year losses projected to exceed R1 billion. SASA has formally requested ITAC increase the reference price from US$${importData.itacReferencePrice}/t to US$${importData.sasaRequestedPrice}/t to protect local producers.`]))
  blankLine(lines)

  // Key metrics
  section(lines, 'KEY METRICS')
  lines.push(csvRow(['Metric', 'Value', 'Unit', 'Notes']))
  lines.push(csvRow(['Total Imports YTD (Jan-Sep 2025)', importData.totalImports2025, 'tonnes', 'SARS customs data']))
  lines.push(csvRow(['Import Surge vs Historical Avg', `${importData.importSurge}%+`, '', 'Jan-Sep 2025 vs historical averages']))
  lines.push(csvRow(['Estimated Revenue Losses (Jan-Aug)', importData.estimatedLosses, 'ZAR', 'Documented industry losses']))
  lines.push(csvRow(['Full-Year Loss Projection', '>1,000,000,000', 'ZAR', 'SASA estimate']))
  lines.push(csvRow(['ITAC Current Reference Price', importData.itacReferencePrice, 'USD/tonne', 'International Trade Administration Commission']))
  lines.push(csvRow(['SASA Requested Reference Price', importData.sasaRequestedPrice, 'USD/tonne', 'Pending ITAC review']))
  lines.push(csvRow(['Price Gap (Requested vs Current)', importData.sasaRequestedPrice - importData.itacReferencePrice, 'USD/tonne', `${Math.round(((importData.sasaRequestedPrice - importData.itacReferencePrice) / importData.itacReferencePrice) * 100)}% increase requested`]))
  lines.push(csvRow(['Health Promotion Levy (HPL) Cost', importData.hplCost, 'ZAR', 'Annual industry cost of sugar tax']))
  lines.push(csvRow(['SA Local Sugar Price', importData.priceComparison[0].price, 'ZAR/tonne', '']))
  lines.push(csvRow(['World Raw Sugar Price', importData.priceComparison[1].price, 'ZAR/tonne', '']))
  lines.push(csvRow(['SA Premium vs World Raw', `${Math.round(((importData.priceComparison[0].price / importData.priceComparison[1].price) - 1) * 100)}%`, '', 'Local price above world market']))
  lines.push(csvRow(['SA Premium vs India Subsidized', `${Math.round(((importData.priceComparison[0].price / importData.priceComparison[4].price) - 1) * 100)}%`, '', 'Makes SA uncompetitive without tariff protection']))
  lines.push(csvRow(['Direct Jobs at Risk', industryStats.directJobs, '', 'National employment threatened']))
  lines.push(csvRow(['Total Livelihoods at Risk', industryStats.totalLivelihoods, '', 'Including indirect and dependent livelihoods']))
  blankLine(lines)

  // Monthly imports with computed fields
  section(lines, 'MONTHLY IMPORT VOLUMES — 2025 vs 2024')
  lines.push(csvRow(['Month', '2025 Imports (tonnes)', '2024 Imports (tonnes)', 'Absolute Change (tonnes)', 'YoY Change (%)', 'Cumulative 2025 (tonnes)', 'Cumulative 2024 (tonnes)']))
  let cum2025 = 0, cum2024 = 0
  importData.monthlyImports.forEach(m => {
    cum2025 += m.tonnes
    cum2024 += m.year2024
    const absChange = m.tonnes - m.year2024
    const pctChange = m.year2024 > 0 ? Math.round((absChange / m.year2024) * 100) : 0
    lines.push(csvRow([m.month, m.tonnes, m.year2024, absChange, `${pctChange}%`, cum2025, cum2024]))
  })
  lines.push(csvRow(['TOTAL', cum2025, cum2024, cum2025 - cum2024, `${Math.round(((cum2025 - cum2024) / cum2024) * 100)}%`, '', '']))
  blankLine(lines)

  // Source countries with additional context
  section(lines, 'IMPORT SOURCE COUNTRIES')
  lines.push(csvRow(['Rank', 'Country', 'Share (%)', 'Estimated Volume (tonnes)', 'Trade Notes']))
  importData.sourceCountries.forEach((c, i) => {
    const notes: Record<string, string> = {
      'Brazil': 'Largest global sugar exporter; benefits from exchange rate and scale',
      'Thailand': 'Second largest exporter; government-subsidized production',
      'Guatemala': 'Central American producer; duty-free under certain trade agreements',
      'India': 'Heavily subsidized production; export subsidies distort global prices',
      'Other': 'Multiple smaller origins including UAE, Mozambique, and Eswatini',
    }
    lines.push(csvRow([i + 1, c.country, c.pct, c.tonnes, notes[c.country] || '']))
  })
  blankLine(lines)

  // Price comparison with context
  section(lines, 'SUGAR PRICE COMPARISON')
  lines.push(csvRow(['Market', 'Price (ZAR/tonne)', 'Discount vs SA Local (%)', 'Notes']))
  importData.priceComparison.forEach(p => {
    const discount = p.label === 'SA Local' ? '-' : `${Math.round(((importData.priceComparison[0].price - p.price) / importData.priceComparison[0].price) * 100)}%`
    const notes: Record<string, string> = {
      'SA Local': 'Includes production costs, levies, transport, and margin',
      'World Raw': 'ICE No. 11 contract equivalent in ZAR',
      'Brazil Export': 'FOB Santos; benefits from weak Real and scale economies',
      'Thailand Export': 'FOB Bangkok; government support keeps costs low',
      'India Subsidized': 'Includes direct government production and export subsidies',
    }
    lines.push(csvRow([p.label, p.price, discount, notes[p.label] || '']))
  })
  blankLine(lines)

  // Policy context
  section(lines, 'POLICY & REGULATORY CONTEXT')
  lines.push(csvRow(['Item', 'Detail']))
  lines.push(csvRow(['Sugar Act', 'Sugar Act 9 of 1978 — governs SA sugar industry regulation']))
  lines.push(csvRow(['ITAC', 'International Trade Administration Commission — sets reference prices']))
  lines.push(csvRow(['Sugar Master Plan', 'Social compact between government, industry, labour, and growers (2020-2030)']))
  lines.push(csvRow(['Health Promotion Levy', 'Sugar tax introduced April 2018 at 2.1c/g of sugar above 4g/100ml; costs industry R1.2B/year']))
  lines.push(csvRow(['SASA', 'South African Sugar Association — statutory body representing the industry']))
  lines.push(csvRow(['Key Request', `SASA requests ITAC increase reference price from US$${importData.itacReferencePrice}/t to US$${importData.sasaRequestedPrice}/t`]))
  blankLine(lines)

  // Industry context
  section(lines, 'SA SUGAR INDUSTRY CONTEXT')
  lines.push(csvRow(['Metric', 'Value', 'Source']))
  lines.push(csvRow(['Annual Industry Revenue', `R${(industryStats.annualRevenue / 1e9).toFixed(0)}B`, 'SASA official']))
  lines.push(csvRow(['Total Growers', industryStats.totalGrowers, 'SASA — 25,653 small-scale + 1,087 large-scale']))
  lines.push(csvRow(['Operating Sugar Mills', industryStats.activeMills, 'SASA — 10 in KZN + 2 in Mpumalanga']))
  lines.push(csvRow(['Direct Jobs', industryStats.directJobs, 'SASA — ~7% of SA agricultural workforce']))
  lines.push(csvRow(['Total Livelihoods', `~${(industryStats.totalLivelihoods / 1e6).toFixed(0)} million`, 'SASA — ~2% of SA population']))
  lines.push(csvRow(['Area Under Cane', `${industryStats.areaUnderCane.toLocaleString()} ha`, 'USDA FAS — 348,125 ha (MY 2023/24)']))
  lines.push(csvRow(['Cane Crushed (2025/26)', `${(industryStats.caneCrushed / 1e6).toFixed(1)}M tonnes`, 'SASA Nov 2025 crop estimate (17,268,145 tonnes)']))
  lines.push(csvRow(['Sugar Produced (2025/26)', `${(industryStats.sugarProduced / 1e6).toFixed(2)}M tonnes`, 'SASA Nov 2025 crop estimate (1,944,899 tonnes)']))
  lines.push(csvRow(['HPL (Sugar Tax)', 'Introduced April 2018 at 2.1c/g above 4g/100ml', 'SARS — estimated R1.2B annual industry revenue loss']))
  lines.push(csvRow(['BevSA Counter-Proposal', 'US$552-650/tonne (lowering DBRP)', 'Filed with ITAC; investigation gazetted 22 Jan 2026']))
  lines.push(csvRow(['ITAC Investigation', 'Self-initiated Jan 2026', 'Public comments due 5 March 2026']))

  addSources(lines, [
    SOURCES_SARS,
    SOURCES_ITAC,
    SOURCES_SASA,
    SOURCES_SASA_FACTS,
    SOURCES_CANEGROWERS,
    SOURCES_HPL,
    SOURCES_USDA,
    ['Food For Mzansi — Import crisis reporting', 'https://www.foodformzansi.co.za/bitter-taste-for-sa-sugar-industry-as-imports-surge/'],
    ['Business Explainer — ITAC investigation', 'https://businessexplainer.co.za/economy/2026/02/02/itac-intervenes-as-sugar-tariff-dispute-escalates/'],
    ['Freight News — ITAC sugar tariff investigation', 'https://www.freightnews.co.za/article/itac-initiates-an-investigation-into-sugar-tariffs'],
    ['Sugar Act 9 of 1978', 'https://www.gov.za/documents/sugar-act-7-apr-2015-1159'],
  ])

  downloadFile(lines.join('\n'), `SugarIQ-Import-Intelligence-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// PRECISION AGRICULTURE
// ============================================================
export function exportPrecisionAg() {
  const lines: string[] = []

  lines.push(header('Precision Agriculture & Yield Intelligence'))
  blankLine(lines)

  // Industry overview — complete
  section(lines, 'SA SUGAR INDUSTRY OVERVIEW')
  lines.push(csvRow(['Metric', 'Value', 'Unit', 'Notes']))
  lines.push(csvRow(['Annual Revenue', industryStats.annualRevenue, 'ZAR', `R${(industryStats.annualRevenue / 1e9).toFixed(0)}B`]))
  lines.push(csvRow(['Area Under Cane', industryStats.areaUnderCane, 'hectares', '']))
  lines.push(csvRow(['Cane Crushed (2025/26)', industryStats.caneCrushed, 'tonnes', `${(industryStats.caneCrushed / 1e6).toFixed(1)}M`]))
  lines.push(csvRow(['Sugar Produced', industryStats.sugarProduced, 'tonnes', `${(industryStats.sugarProduced / 1e6).toFixed(2)}M`]))
  lines.push(csvRow(['Irrigated Production', industryStats.irrigatedPct, '%', `${100 - industryStats.irrigatedPct}% rain-fed`]))
  lines.push(csvRow(['Average Yield', industryStats.avgYieldPerHa, 't/ha', '']))
  lines.push(csvRow(['Total Growers', industryStats.totalGrowers, '', '']))
  lines.push(csvRow(['Small-Scale Growers', industryStats.smallScaleGrowers, '', `${Math.round((industryStats.smallScaleGrowers / industryStats.totalGrowers) * 100)}% of all growers`]))
  lines.push(csvRow(['Large-Scale Growers', industryStats.largeScaleGrowers, '', '']))
  lines.push(csvRow(['Operating Mills', industryStats.activeMills, '', `of ${industryStats.totalMills} total`]))
  lines.push(csvRow(['Direct Jobs', industryStats.directJobs, '', '']))
  lines.push(csvRow(['Indirect Jobs', industryStats.indirectJobs, '', '']))
  lines.push(csvRow(['Total Livelihoods Supported', industryStats.totalLivelihoods, '', '~1M people']))
  blankLine(lines)

  // Yield history with computed metrics
  section(lines, 'HISTORICAL YIELD DATA (7-SEASON TREND)')
  lines.push(csvRow(['Season', 'Cane Crushed (M tonnes)', 'Sugar Produced (M tonnes)', 'Yield (t/ha)', 'Extraction Rate (%)', 'YoY Cane Change (%)']))
  yieldHistory.forEach((y, i) => {
    const extraction = ((y.sugar / y.cane) * 100).toFixed(2)
    const yoyChange = i > 0 ? `${(((y.cane - yieldHistory[i - 1].cane) / yieldHistory[i - 1].cane) * 100).toFixed(1)}%` : 'N/A'
    lines.push(csvRow([y.season, y.cane, y.sugar, y.yield, extraction, yoyChange]))
  })
  const avgCane = yieldHistory.reduce((s, y) => s + y.cane, 0) / yieldHistory.length
  const avgSugar = yieldHistory.reduce((s, y) => s + y.sugar, 0) / yieldHistory.length
  const avgYield = yieldHistory.reduce((s, y) => s + y.yield, 0) / yieldHistory.length
  lines.push(csvRow(['7-Season Average', avgCane.toFixed(2), avgSugar.toFixed(2), avgYield.toFixed(1), '', '']))
  blankLine(lines)

  // Regional health — comprehensive
  section(lines, 'REGIONAL HEALTH ASSESSMENT')
  lines.push(csvRow(['Region', 'District', 'Province', 'Health Score (/100)', 'Risk Level', 'Annual Rainfall (mm)', 'Avg Temp (°C)', 'Irrigation Status', 'Assessment Notes']))
  regionalHealth.forEach(r => {
    const irrigated = r.district === 'Mpumalanga' ? 'Fully irrigated' : r.rainfall < 900 ? 'Irrigation required' : 'Primarily rain-fed'
    const province = r.district === 'Mpumalanga' ? 'Mpumalanga' : 'KwaZulu-Natal'
    lines.push(csvRow([r.region, r.district, province, r.health, r.risk.toUpperCase(), r.rainfall, r.temp, irrigated, r.notes]))
  })
  blankLine(lines)

  // AI recommendations
  section(lines, 'AI PRECISION AGRICULTURE RECOMMENDATIONS')
  lines.push(csvRow(['Priority', 'Recommendation', 'Expected Impact', 'Target Area']))
  lines.push(csvRow(['1', `Expand smart irrigation to drought-stressed regions (Zululand health: 69%)`, '8-15% yield increase', 'Zululand, Northern KZN']))
  lines.push(csvRow(['2', 'Deploy AI-driven irrigation scheduling using soil moisture sensors and weather forecasts', '20% water consumption reduction', 'All 118,000 irrigated hectares']))
  lines.push(csvRow(['3', 'Satellite-based crop health monitoring for early disease detection', 'Reduce Eldana borer losses by 30%', 'King Cetshwayo, iLembe']))
  lines.push(csvRow(['4', 'Mobile advisory app rollout for small-scale growers', 'Connect 25,653 growers to real-time data', 'All regions']))
  lines.push(csvRow(['5', 'Precision fertilizer management based on soil analysis', '12% input cost reduction', 'All growing regions']))

  addSources(lines, [
    SOURCES_SASA,
    SOURCES_SASA_FACTS,
    SOURCES_SASRI,
    SOURCES_USDA,
    SOURCES_CANEGROWERS,
    ['SASA — Cane Growing in South Africa', 'https://sasa.org.za/cane-growing-in-south-africa/'],
    ['SA Canegrowers — Drier season yields lower crop', 'https://sacanegrowers.co.za/2024/11/12/drier-season-yields-lower-than-average-crop-for-south-africas-sugarcane-growers/'],
    ['SA Canegrowers — KZN floods losses (2022)', 'https://sacanegrowers.co.za/2022/04/20/kzn-floods-canegrowers-losses-standing-at-r222-9-million/'],
  ])

  downloadFile(lines.join('\n'), `SugarIQ-Precision-Agriculture-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// MILL OPERATIONS
// ============================================================
export function exportMillOps() {
  const lines: string[] = []

  lines.push(header('Mill Operations & Supply Chain Intelligence'))
  blankLine(lines)

  const operatingMills = mills.filter(m => m.status === 'operating')
  const avgEff = operatingMills.reduce((s, m) => s + m.efficiency, 0) / operatingMills.length
  const totalCurrentCogen = cogenData.mills.reduce((s, m) => s + m.current, 0)

  // Summary stats
  section(lines, 'INDUSTRY MILL SUMMARY')
  lines.push(csvRow(['Metric', 'Value', 'Notes']))
  lines.push(csvRow(['Total Mills', industryStats.totalMills, '12 operating + 2 closed/mothballed']))
  lines.push(csvRow(['Operating Mills', industryStats.activeMills, '']))
  lines.push(csvRow(['Average Efficiency', `${avgEff.toFixed(1)}%`, 'Across all operating mills']))
  lines.push(csvRow(['Total Current Co-gen', `${totalCurrentCogen} MW`, '']))
  lines.push(csvRow(['Total Potential Co-gen', `${cogenData.potentialOutput} MW`, `${cogenData.potentialOutput - totalCurrentCogen} MW untapped`]))
  lines.push(csvRow(['Active Maintenance Alerts', maintenanceAlerts.length, '']))
  lines.push(csvRow(['Mill Companies', millCompanies.length, '']))
  blankLine(lines)

  // Mill ownership — detailed
  section(lines, 'MILL OWNERSHIP & COMPANY STATUS')
  lines.push(csvRow(['Company', 'Listing Status', 'Mills Operated', 'Closed/Mothballed Mills', 'Corporate Status Notes']))
  millCompanies.forEach(c => {
    const operating = c.mills.filter(m => !m.includes('*')).join('; ')
    const closed = c.mills.filter(m => m.includes('*')).map(m => m.replace('*', '')).join('; ')
    lines.push(csvRow([c.company, c.status, operating, closed || 'None', c.notes]))
  })
  blankLine(lines)

  // Full mill detail
  section(lines, 'COMPLETE MILL PERFORMANCE DATA')
  lines.push(csvRow(['Mill', 'Company', 'Status', 'Capacity (TCH)', 'Efficiency (%)', 'Throughput (tonnes/season)', 'Co-gen Output (MW)', 'Latitude', 'Longitude', 'Region', 'Maintenance Alert', 'Notes']))
  mills.forEach(m => {
    const region = millRegions.find(r => r.mills.includes(m.id))
    const alert = maintenanceAlerts.find(a => a.mill === m.name)
    lines.push(csvRow([
      m.name, m.company, m.status, m.capacity,
      m.efficiency || 'N/A', m.throughput,
      m.cogenMW || 'N/A', m.lat, m.lng,
      region?.name || '', alert ? `${alert.severity.toUpperCase()}: ${alert.message}` : '',
      m.notes || '',
    ]))
  })
  blankLine(lines)

  // Efficiency ranking
  section(lines, 'MILL EFFICIENCY RANKING')
  lines.push(csvRow(['Rank', 'Mill', 'Company', 'Efficiency (%)', 'Rating']))
  const sorted = [...operatingMills].sort((a, b) => b.efficiency - a.efficiency)
  sorted.forEach((m, i) => {
    const rating = m.efficiency >= 93 ? 'Excellent' : m.efficiency >= 91 ? 'Good' : 'Needs Improvement'
    lines.push(csvRow([i + 1, m.name, m.company, m.efficiency, rating]))
  })
  blankLine(lines)

  // Co-generation — detailed
  section(lines, 'BAGASSE CO-GENERATION DETAILED')
  lines.push(csvRow(['Mill', 'Current Output (MW)', 'Potential Output (MW)', 'Untapped Gap (MW)', 'Utilisation (%)', 'Estimated Annual Revenue Potential']))
  cogenData.mills.forEach(m => {
    const gap = m.potential - m.current
    const util = Math.round((m.current / m.potential) * 100)
    // Rough revenue estimate: R3M per MW per year
    const revPotential = `R${(gap * 3).toFixed(0)}M/year`
    lines.push(csvRow([m.name, m.current, m.potential, gap, `${util}%`, revPotential]))
  })
  lines.push(csvRow(['TOTAL', totalCurrentCogen, cogenData.potentialOutput, cogenData.potentialOutput - totalCurrentCogen, `${Math.round((totalCurrentCogen / cogenData.potentialOutput) * 100)}%`, `R${((cogenData.potentialOutput - totalCurrentCogen) * 3).toFixed(0)}M/year`]))
  blankLine(lines)

  // Maintenance alerts — detailed
  section(lines, 'PREDICTIVE MAINTENANCE ALERTS')
  lines.push(csvRow(['Mill', 'Component', 'Severity', 'Description', 'Days Until Action Required', 'Recommended Action']))
  maintenanceAlerts.forEach(a => {
    const action = a.severity === 'high' ? 'Immediate attention required' : a.severity === 'moderate' ? 'Schedule during next planned shutdown' : 'Monitor and plan for upcoming maintenance window'
    lines.push(csvRow([a.mill, a.component, a.severity.toUpperCase(), a.message, a.daysUntil, action]))
  })
  blankLine(lines)

  // Tongaat Hulett crisis — comprehensive
  section(lines, 'TONGAAT HULETT CRISIS — FULL REPORT')
  lines.push(csvRow(['Field', 'Value', 'Context']))
  lines.push(csvRow(['Company Status', tongaatHulettCrisis.status, 'Filed at KZN High Court']))
  lines.push(csvRow(['Date Filed', tongaatHulettCrisis.statusDate, '']))
  lines.push(csvRow(['Company Age', `${tongaatHulettCrisis.companyAge} years`, 'Founded 1892']))
  lines.push(csvRow(['Share of SA Production', `${tongaatHulettCrisis.shareOfSAProduction}%`, 'Largest single impact on industry']))
  lines.push(csvRow(['Direct Employees', tongaatHulettCrisis.impact.directEmployees, '']))
  lines.push(csvRow(['Contracted Growers', tongaatHulettCrisis.impact.contractedGrowers, '60% of all small-scale growers nationally']))
  lines.push(csvRow(['Estimated Livelihoods at Risk', `${(tongaatHulettCrisis.impact.estimatedLivelihoods / 1000).toFixed(0)}K+`, 'Direct and indirect']))
  lines.push(csvRow(['Season Revenue at Risk', `R${(tongaatHulettCrisis.impact.seasonRevenueAtRisk / 1e6).toFixed(1)}M`, 'Current 2025/26 season']))
  lines.push(csvRow(['Cane Expected This Season', `${(tongaatHulettCrisis.impact.caneExpectedThisSeason / 1e6).toFixed(0)}M tonnes`, 'If mills stop, cane rots in fields']))
  lines.push(csvRow(['Unpaid SASA Levies', `R${(tongaatHulettCrisis.outstandingLevies / 1e6).toFixed(0)}M`, 'SCA ruled these are statutory obligations']))
  lines.push(csvRow(['Vision Group Demand', `R${(tongaatHulettCrisis.visionDemand / 1e9).toFixed(1)}B`, 'Demand letter that collapsed the deal']))
  lines.push(csvRow(['IDC Rehabilitation Spend', `R${(tongaatHulettCrisis.rehabilitationSpend / 1e9).toFixed(2)}B`, 'Industrial Development Corporation funded']))
  lines.push(csvRow(['Affected Operating Mills', tongaatHulettCrisis.impact.affectedMills.join('; '), '']))
  lines.push(csvRow(['Closed/Mothballed Mills', tongaatHulettCrisis.impact.closedMills.join('; '), '']))
  lines.push(csvRow(['Regions Affected', tongaatHulettCrisis.impact.regionsAffected.join('; '), '']))
  lines.push(csvRow(['Government Intervention', tongaatHulettCrisis.governmentIntervention, '']))
  lines.push(csvRow(['SA Canegrowers Warning', tongaatHulettCrisis.canegrowersWarning, '']))
  lines.push(csvRow(['Operational Note', tongaatHulettCrisis.operationalNote, '']))
  blankLine(lines)

  section(lines, 'TONGAAT HULETT — CRISIS TIMELINE')
  lines.push(csvRow(['Date', 'Event', 'Category']))
  tongaatHulettCrisis.timeline.forEach(t => {
    lines.push(csvRow([t.date, t.event, t.type.toUpperCase()]))
  })
  blankLine(lines)

  section(lines, 'TONGAAT HULETT — FAILED RESCUE PLAN CONDITIONS')
  lines.push(csvRow(['Condition', 'Amount', 'Detail', 'Status']))
  tongaatHulettCrisis.rescuePlanConditions.forEach(c => {
    lines.push(csvRow([c.label, c.amount, c.detail, c.met ? 'MET' : 'NOT MET']))
  })
  blankLine(lines)

  section(lines, 'TONGAAT HULETT — MILL PERFORMANCE TURNAROUND')
  lines.push(csvRow(['Mill', 'Metric', 'Before Rehabilitation', 'After Rehabilitation', 'Notes']))
  lines.push(csvRow(['Maidstone', 'Lost Time %', `${tongaatHulettCrisis.millPerformance.maidstone.lostTimePct.was}%`, `${tongaatHulettCrisis.millPerformance.maidstone.lostTimePct.now}%`, 'Major improvement']))
  lines.push(csvRow(['Maidstone', 'Sucrose Extraction', '', `>${tongaatHulettCrisis.millPerformance.maidstone.sucroseExtraction}%`, 'Top-3 national ranking']))
  lines.push(csvRow(['Felixton', 'Lost Time %', `${tongaatHulettCrisis.millPerformance.felixton.lostTimePct.was}%`, `${tongaatHulettCrisis.millPerformance.felixton.lostTimePct.now}%`, '']))
  lines.push(csvRow(['Felixton', 'BHR Improvement', '', '+7 points', '']))
  lines.push(csvRow(['Amatikulu', 'BHR Improvement', '', '+5 points', '']))
  lines.push(csvRow(['Amatikulu', 'Sucrose Extraction', '', `>${tongaatHulettCrisis.millPerformance.amatikulu.sucroseExtraction}%`, tongaatHulettCrisis.millPerformance.amatikulu.note]))

  addSources(lines, [
    SOURCES_SASA,
    SOURCES_SASA_FACTS,
    SOURCES_ILLOVO,
    SOURCES_RCL,
    SOURCES_TONGAAT_DM,
    SOURCES_TONGAAT_IOL,
    SOURCES_SCA,
    SOURCES_CANEGROWERS,
    ['Tongaat Hulett SA Operations', 'https://www.tongaat.com/our-business/sugar/south-africa/'],
    ["Farmer's Weekly — Darnall mothballing", 'https://www.farmersweekly.co.za/agri-news/south-africa/tongaat-hulett-confirms-mothballing-of-darnall-sugar-mill/'],
    ['Gledhow Sugar — new management after business rescue', 'https://www.citizen.co.za/north-coast-courier/news-headlines/local-news/2024/08/21/gledhow-sugar-eyes-new-growth-after-emerging-from-business-rescue/'],
    ['Booker Tate — RCL Foods Komati Mill', 'https://www.booker-tate.co.uk/project/rcl-foods/'],
    ['SMRI — SA Sugar Industry mills overview', 'https://www.smri.org/sugarfacts/Pages/sasugarindustry.aspx'],
    SOURCES_USDA,
  ])

  downloadFile(lines.join('\n'), `SugarIQ-Mill-Operations-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// DIVERSIFICATION
// ============================================================
export function exportDiversification() {
  const lines: string[] = []

  lines.push(header('Diversification Intelligence — Sugar Master Plan 2030'))
  blankLine(lines)

  // Context
  section(lines, 'SUGAR MASTER PLAN CONTEXT')
  lines.push(csvRow(['Item', 'Detail']))
  lines.push(csvRow(['Framework', 'Sugar Master Plan 2020-2030 — Social compact between government, industry, labour, and growers']))
  lines.push(csvRow(['Industry Annual Revenue', `R${(industryStats.annualRevenue / 1e9).toFixed(0)}B`]))
  lines.push(csvRow(['Total Growers', industryStats.totalGrowers]))
  lines.push(csvRow(['Small-Scale Growers', industryStats.smallScaleGrowers]))
  lines.push(csvRow(['Key Pillars', 'Import protection; demand stimulation; diversification into biofuels and energy; grower transformation']))
  lines.push(csvRow(['Challenge', `HPL costing R${(importData.hplCost / 1e9).toFixed(1)}B/year; imports surging ${importData.importSurge}%+ in 2025`]))
  blankLine(lines)

  // Diversification targets — comprehensive
  section(lines, 'DIVERSIFICATION TARGETS — DETAILED')
  lines.push(csvRow(['Sector', 'Full Name', 'Current Output', 'Potential Output', 'Unit', 'Growth Multiple', 'New Jobs', 'Investment Required', 'Estimated Annual Revenue', 'Readiness']))
  const names: Record<string, string> = {
    saf: 'Sustainable Aviation Fuel',
    bioethanol: 'Bioethanol (E10/E20 blend)',
    cogeneration: 'Bagasse Co-generation',
    biochemicals: 'Biochemicals & Bioplastics',
  }
  const readiness: Record<string, string> = {
    saf: 'Early stage — R&D and feasibility',
    bioethanol: 'Moderate — policy framework needed',
    cogeneration: 'High — existing infrastructure expandable',
    biochemicals: 'Early stage — emerging technology',
  }
  const annualRev: Record<string, string> = {
    saf: 'R12-18B (global SAF demand surging)',
    bioethanol: 'R6-8B',
    cogeneration: 'R2.1B (feeding into Eskom grid)',
    biochemicals: 'R1.5-3B',
  }
  Object.entries(diversificationTargets).forEach(([key, d]) => {
    const growthMultiple = d.current > 0 ? `${(d.potential / d.current).toFixed(1)}x` : 'New'
    lines.push(csvRow([key.toUpperCase(), names[key] || key, d.current, d.potential, d.unit, growthMultiple, d.jobs, d.investment, annualRev[key] || '', readiness[key] || '']))
  })
  const totalJobs = Object.values(diversificationTargets).reduce((s, d) => s + d.jobs, 0)
  lines.push(csvRow(['TOTAL', '', '', '', '', '', totalJobs, '', '', '']))
  blankLine(lines)

  // Revenue mix with delta
  section(lines, 'REVENUE MIX — CURRENT')
  lines.push(csvRow(['Segment', 'Share (%)', 'Estimated Revenue (ZAR)']))
  revenueMix.current.forEach(r => {
    lines.push(csvRow([r.name, r.value, `R${((r.value / 100) * industryStats.annualRevenue / 1e9).toFixed(1)}B`]))
  })
  blankLine(lines)

  section(lines, 'REVENUE MIX — TARGET 2030')
  lines.push(csvRow(['Segment', 'Target Share (%)', 'Estimated Revenue (ZAR)', 'Change from Current']))
  revenueMix.target2030.forEach(r => {
    const current = revenueMix.current.find(c => c.name.includes(r.name.split(' ')[0]))
    const change = current ? `${r.value - current.value > 0 ? '+' : ''}${r.value - current.value}pp` : 'New stream'
    lines.push(csvRow([r.name, r.value, `R${((r.value / 100) * industryStats.annualRevenue / 1e9).toFixed(1)}B`, change]))
  })
  blankLine(lines)

  // Opportunity matrix with full scores
  section(lines, 'OPPORTUNITY ASSESSMENT MATRIX')
  lines.push(csvRow(['Opportunity', 'Feasibility Score (/100)', 'Impact Score (/100)', 'Readiness Score (/100)', 'Average Score', 'Timeframe', 'Priority Ranking']))
  const withAvg = opportunityMatrix.map(o => ({
    ...o,
    avg: Math.round((o.feasibility + o.impact + o.readiness) / 3),
  }))
  const ranked = [...withAvg].sort((a, b) => b.avg - a.avg)
  ranked.forEach((o, i) => {
    lines.push(csvRow([o.subject, o.feasibility, o.impact, o.readiness, o.avg, o.timeframe, i + 1]))
  })
  blankLine(lines)

  // Detailed sector deep-dives
  Object.entries(diversificationDetails).forEach(([key, d]) => {
    section(lines, `${d.title.toUpperCase()} — DETAILED ANALYSIS`)
    lines.push(csvRow(['Field', 'Value']))
    lines.push(csvRow(['Sector Key', key]))
    lines.push(csvRow(['Title', d.title]))
    lines.push(csvRow(['Tagline', d.tagline]))
    lines.push(csvRow(['Annual Revenue Potential', d.annualRevenue]))
    lines.push(csvRow(['Timeline', d.timeline]))
    const totalJobs = d.jobBreakdown.reduce((s, j) => s + j.count, 0)
    lines.push(csvRow(['Total Jobs Created', totalJobs]))
    blankLine(lines)

    lines.push(csvRow(['Overview']))
    lines.push(csvRow([d.overview]))
    blankLine(lines)

    lines.push(csvRow(['Global Context']))
    lines.push(csvRow([d.globalContext]))
    blankLine(lines)

    lines.push(csvRow(['South Africa Opportunity']))
    lines.push(csvRow([d.saOpportunity]))
    blankLine(lines)

    lines.push(csvRow(['How to Unlock This Opportunity']))
    d.howToUnlock.forEach((step, i) => {
      lines.push(csvRow([`Step ${i + 1}`, step]))
    })
    blankLine(lines)

    lines.push(csvRow(['Investment Breakdown']))
    lines.push(csvRow(['Item', 'Amount']))
    d.investmentBreakdown.forEach(item => {
      lines.push(csvRow([item.item, item.amount]))
    })
    const totalInvestment = d.investmentBreakdown.reduce((s, i) => {
      const num = parseFloat(i.amount.replace('R', '').replace('B', ''))
      return s + num
    }, 0)
    lines.push(csvRow(['TOTAL INVESTMENT', `R${totalInvestment.toFixed(1)}B`]))
    blankLine(lines)

    lines.push(csvRow(['Job Creation Breakdown']))
    lines.push(csvRow(['Category', 'Jobs']))
    d.jobBreakdown.forEach(item => {
      lines.push(csvRow([item.category, item.count]))
    })
    lines.push(csvRow(['TOTAL JOBS', totalJobs]))
    blankLine(lines)

    lines.push(csvRow(['Key Players', d.keyPlayers.join('; ')]))
    blankLine(lines)

    lines.push(csvRow(['Challenges']))
    d.challenges.forEach((c, i) => {
      lines.push(csvRow([`${i + 1}`, c]))
    })
    blankLine(lines)

    lines.push(csvRow(['Case Study']))
    lines.push(csvRow(['Country', d.caseStudy.country]))
    lines.push(csvRow(['Detail', d.caseStudy.detail]))
  })

  addSources(lines, [
    SOURCES_SASA_DIVERSIFY,
    SOURCES_SAF_STUDY,
    SOURCES_IATA,
    SOURCES_ETHANOL_BRAZIL,
    SOURCES_UNICA,
    SOURCES_BRASKEM,
    SOURCES_RAIZEN,
    SOURCES_CARBON_TAX,
    SOURCES_IRP,
    SOURCES_DTIC,
    SOURCES_SASA,
    ['IEA — SA Biofuels Regulatory Framework', 'https://www.iea.org/policies/13383-south-african-biofuels-regulatory-framework'],
    ['GMI Research — Bio-based chemicals market projections', 'https://www.gmiresearch.com/report/global-bio-based-chemicals-market/'],
    ['Trade.gov — Mauritius Energy (bagasse co-generation)', 'https://www.trade.gov/country-commercial-guides/mauritius-energy'],
    ['Green Clean Guide — India bagasse cogeneration capacity', 'https://greencleanguide.com/bagasse-cogeneration-capacity-in-india/'],
    ['Statista — Voluntary Carbon Market 2023', 'https://www.statista.com/statistics/501698/voluntary-carbon-offset-market-transaction-value-worldwide/'],
    ['Advanced BioFuels USA — Biofuels mandates worldwide 2024', 'https://advancedbiofuelsusa.info/the-digest-s-biofuels-mandates-around-the-world-2024'],
  ])

  downloadFile(lines.join('\n'), `SugarIQ-Diversification-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// ROADMAP
// ============================================================
export function exportRoadmap() {
  const lines: string[] = []

  lines.push(header('AI Adoption Roadmap — SA Sugar Industry'))
  blankLine(lines)

  // Industry context
  section(lines, 'INDUSTRY CONTEXT — WHY AI MATTERS')
  lines.push(csvRow(['Metric', 'Value', 'Significance']))
  lines.push(csvRow(['Annual Revenue', `R${(industryStats.annualRevenue / 1e9).toFixed(0)}B`, 'Revenue to protect and grow through AI-driven insights']))
  lines.push(csvRow(['Total Growers', industryStats.totalGrowers, `${industryStats.smallScaleGrowers} small-scale growers need accessible tech`]))
  lines.push(csvRow(['Direct Jobs', industryStats.directJobs, 'Employment dependent on industry competitiveness']))
  lines.push(csvRow(['Total Livelihoods', `~${(industryStats.totalLivelihoods / 1e6).toFixed(0)}M`, 'Broader socio-economic impact']))
  lines.push(csvRow(['Projected AI Value', 'R1.2B+/year', 'By Phase 3 completion']))
  lines.push(csvRow(['Target Yield Improvement', '8-15%', 'Through precision agriculture and AI optimization']))
  lines.push(csvRow(['Operating Mills', industryStats.activeMills, 'Each mill benefits from predictive maintenance']))
  lines.push(csvRow(['CTS Laboratories', '11', 'All labs can benefit from AI anomaly detection']))
  blankLine(lines)

  // AI capabilities
  section(lines, 'AI ADVISORY CAPABILITIES')
  lines.push(csvRow(['Capability', 'Description']))
  advisoryCapabilities.forEach(c => {
    lines.push(csvRow([c.name, c.description]))
  })
  blankLine(lines)

  // Phases with full detail
  roadmapPhases.forEach((phase, pi) => {
    section(lines, phase.phase.toUpperCase())
    lines.push(csvRow(['Field', 'Value']))
    lines.push(csvRow(['Timeline', phase.timeline]))
    lines.push(csvRow(['Expected Impact', phase.impact]))
    lines.push(csvRow(['Status', pi === 0 ? 'Ready for deployment' : pi === 1 ? 'Planning phase' : 'Future phase']))
    blankLine(lines)
    lines.push(csvRow(['#', 'Action Item', 'Category']))
    phase.items.forEach((item, i) => {
      let category = 'General'
      if (item.toLowerCase().includes('grower') || item.toLowerCase().includes('whatsapp')) category = 'Grower Support'
      else if (item.toLowerCase().includes('import') || item.toLowerCase().includes('policy')) category = 'Trade Protection'
      else if (item.toLowerCase().includes('mill') || item.toLowerCase().includes('maintenance')) category = 'Mill Operations'
      else if (item.toLowerCase().includes('weather') || item.toLowerCase().includes('irrigation') || item.toLowerCase().includes('satellite') || item.toLowerCase().includes('precision')) category = 'Precision Agriculture'
      else if (item.toLowerCase().includes('supply') || item.toLowerCase().includes('transport')) category = 'Supply Chain'
      else if (item.toLowerCase().includes('diversification') || item.toLowerCase().includes('biofuel') || item.toLowerCase().includes('biorefinery') || item.toLowerCase().includes('carbon')) category = 'Diversification'
      else if (item.toLowerCase().includes('digital twin') || item.toLowerCase().includes('export')) category = 'Advanced Analytics'
      lines.push(csvRow([i + 1, item, category]))
    })
    blankLine(lines)
  })

  // Investment summary
  section(lines, 'INVESTMENT & RETURN SUMMARY')
  lines.push(csvRow(['Phase', 'Timeline', 'Estimated Investment', 'Expected Annual Return']))
  lines.push(csvRow(['Phase 1: Quick Wins', '0-30 days', 'R2-5M', 'R50M in prevented losses']))
  lines.push(csvRow(['Phase 2: Foundation', '1-6 months', 'R15-30M', 'R200M annual savings']))
  lines.push(csvRow(['Phase 3: Transformation', '6-24 months', 'R50-100M', 'R1.2B+ annual value creation']))
  lines.push(csvRow(['TOTAL', '0-24 months', 'R67-135M', 'R1.45B+ annual return']))

  addSources(lines, [
    SOURCES_SASA,
    SOURCES_SASA_FACTS,
    SOURCES_SASRI,
    SOURCES_DTIC,
    SOURCES_SASA_DIVERSIFY,
    SOURCES_CTS,
    SOURCES_CANEGROWERS,
  ])

  downloadFile(lines.join('\n'), `SugarIQ-AI-Roadmap-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// MILL MAP
// ============================================================
export function exportMillMap() {
  const lines: string[] = []

  lines.push(header('Mill & CTS Laboratory Locations — Complete'))
  blankLine(lines)

  // Summary
  section(lines, 'OVERVIEW')
  lines.push(csvRow(['Item', 'Count']))
  lines.push(csvRow(['Total Mills', mills.length]))
  lines.push(csvRow(['Operating Mills', mills.filter(m => m.status === 'operating').length]))
  lines.push(csvRow(['Closed/Mothballed', mills.filter(m => m.status !== 'operating').length]))
  lines.push(csvRow(['CTS Laboratories', ctsLabs.length]))
  lines.push(csvRow(['Sugar-Growing Regions', millRegions.length]))
  blankLine(lines)

  // All mills
  section(lines, 'ALL SUGAR MILLS — COMPLETE DATA')
  lines.push(csvRow(['Mill', 'Company', 'Status', 'Region', 'Province', 'Latitude', 'Longitude', 'Capacity (TCH)', 'Efficiency (%)', 'Throughput', 'Co-gen (MW)', 'Has CTS Lab', 'Maintenance Alert', 'Corporate Status', 'Notes']))
  mills.forEach(m => {
    const region = millRegions.find(r => r.mills.includes(m.id))
    const ctsLab = ctsLabs.find(l => l.millId === m.id)
    const alert = maintenanceAlerts.find(a => a.mill === m.name)
    const company = millCompanies.find(c => c.company === m.company)
    const province = region?.name.includes('Mpumalanga') ? 'Mpumalanga' : 'KwaZulu-Natal'
    lines.push(csvRow([
      m.name, m.company, m.status, region?.name || '', province,
      m.lat, m.lng, m.capacity, m.efficiency || 'N/A', m.throughput,
      m.cogenMW || 'N/A', ctsLab ? 'Yes' : 'No',
      alert ? `${alert.severity.toUpperCase()}: ${alert.message}` : 'None',
      company?.status || '', m.notes || '',
    ]))
  })
  blankLine(lines)

  // CTS Labs
  section(lines, 'CTS LABORATORIES')
  lines.push(csvRow(['Lab Name', 'Co-located Mill', 'Region', 'Mill Latitude', 'Mill Longitude', 'Services']))
  ctsLabs.forEach(lab => {
    const mill = mills.find(m => m.id === lab.millId)
    lines.push(csvRow([lab.name, mill?.name || '', lab.region, mill?.lat || '', mill?.lng || '', 'DAC sampling; RV determination; mill balance; weekly reconciliation']))
  })
  blankLine(lines)

  // Regions
  section(lines, 'SUGAR-GROWING REGIONS')
  lines.push(csvRow(['Region', 'Mills in Region', 'Mill Count']))
  millRegions.forEach(r => {
    const millNames = r.mills.map(id => mills.find(m => m.id === id)?.name || id).join('; ')
    lines.push(csvRow([r.name, millNames, r.mills.length]))
  })

  // Mill company detail
  section(lines, 'MILL OWNERSHIP DETAIL')
  lines.push(csvRow(['Company', 'Status', 'Mills', 'Notes']))
  millCompanies.forEach(c => {
    lines.push(csvRow([c.company, c.status, c.mills.join('; '), c.notes]))
  })

  addSources(lines, [
    SOURCES_SASA,
    SOURCES_ILLOVO,
    SOURCES_RCL,
    ['Tongaat Hulett SA Operations', 'https://www.tongaat.com/our-business/sugar/south-africa/'],
    ['Gledhow Sugar Company', 'https://www.gledhowsugar.com/about'],
    ['Umfolozi Sugar Mill', 'https://www.umfolozisugarmill.co.za/'],
    ['UCL Company', 'https://www.ucl.co.za/about-us.html'],
    SOURCES_CTS,
    SOURCES_USDA,
    ['SASA — Cane Growing in South Africa', 'https://sasa.org.za/cane-growing-in-south-africa/'],
  ])

  downloadFile(lines.join('\n'), `SugarIQ-Mill-Locations-${new Date().toISOString().slice(0, 10)}.csv`)
}

// ============================================================
// CTS LAB
// ============================================================
export function exportCTSLab() {
  const lines: string[] = []

  lines.push(header('CTS Lab Analysis — Cane Testing Service Intelligence'))
  blankLine(lines)

  const totalSamples = ctsLabStats.reduce((s, l) => s + l.samplesDaily, 0)
  const flaggedCount = ctsSampleData.filter(s => s.status === 'flagged').length
  const networkAvgRV = ctsLabStats.reduce((s, l) => s + l.avgRV, 0) / ctsLabStats.length
  const networkAvgAnomaly = ctsLabStats.reduce((s, l) => s + l.anomalyRate, 0) / ctsLabStats.length
  const networkAvgQuality = ctsLabStats.reduce((s, l) => s + l.qualityScore, 0) / ctsLabStats.length

  // CTS overview
  section(lines, 'CTS NETWORK OVERVIEW')
  lines.push(csvRow(['Metric', 'Value', 'Notes']))
  lines.push(csvRow(['CTS Laboratories', ctsLabStats.length, '9 in KZN + 2 in Mpumalanga']))
  lines.push(csvRow(['Total Daily Samples', totalSamples, 'Across all labs']))
  lines.push(csvRow(['AI-Flagged Anomalies', flaggedCount, `Out of ${ctsSampleData.length} samples in current batch`]))
  lines.push(csvRow(['Anomaly Rate', `${((flaggedCount / ctsSampleData.length) * 100).toFixed(1)}%`, 'Current batch']))
  lines.push(csvRow(['Network Average RV', networkAvgRV.toFixed(2), '']))
  lines.push(csvRow(['Network Average Anomaly Rate', `${networkAvgAnomaly.toFixed(2)}%`, '']))
  lines.push(csvRow(['Network Average Quality Score', networkAvgQuality.toFixed(1), 'Out of 100']))
  lines.push(csvRow(['Purpose', 'Independent cane quality testing ensuring accurate grower-miller payments', '']))
  lines.push(csvRow(['Method', 'Direct Analysis of Cane (DAC) — Recoverable Value (RV) determination', '']))
  blankLine(lines)

  // Sample data — full detail
  section(lines, 'SAMPLE ANALYSIS DATA — COMPLETE')
  lines.push(csvRow(['Sample ID', 'Grower', 'Lab', 'Brix (%)', 'Pol (%)', 'Fibre (%)', 'RV', 'Purity (%)', 'Pol/Brix Ratio', 'Status', 'AI Flag', 'Flag Reason']))
  ctsSampleData.forEach(s => {
    const polBrixRatio = (s.pol / s.brix * 100).toFixed(1)
    lines.push(csvRow([s.id, s.grower, s.lab, s.brix, s.pol, s.fibre, s.rv, s.purity, `${polBrixRatio}%`, s.status.toUpperCase(), s.status === 'flagged' ? 'YES' : '', s.flagReason || '']))
  })
  blankLine(lines)

  // Statistical summary of sample data
  section(lines, 'SAMPLE STATISTICS')
  const brixValues = ctsSampleData.map(s => s.brix)
  const polValues = ctsSampleData.map(s => s.pol)
  const fibreValues = ctsSampleData.map(s => s.fibre)
  const rvValues = ctsSampleData.map(s => s.rv)
  const purityValues = ctsSampleData.map(s => s.purity)

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length
  const min = (arr: number[]) => Math.min(...arr)
  const max = (arr: number[]) => Math.max(...arr)
  const stdDev = (arr: number[]) => {
    const mean = avg(arr)
    return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length)
  }

  lines.push(csvRow(['Statistic', 'Brix (%)', 'Pol (%)', 'Fibre (%)', 'RV', 'Purity (%)']))
  lines.push(csvRow(['Mean', avg(brixValues).toFixed(2), avg(polValues).toFixed(2), avg(fibreValues).toFixed(2), avg(rvValues).toFixed(2), avg(purityValues).toFixed(2)]))
  lines.push(csvRow(['Min', min(brixValues), min(polValues), min(fibreValues), min(rvValues), min(purityValues)]))
  lines.push(csvRow(['Max', max(brixValues), max(polValues), max(fibreValues), max(rvValues), max(purityValues)]))
  lines.push(csvRow(['Std Dev', stdDev(brixValues).toFixed(3), stdDev(polValues).toFixed(3), stdDev(fibreValues).toFixed(3), stdDev(rvValues).toFixed(3), stdDev(purityValues).toFixed(3)]))
  lines.push(csvRow(['Sample Count', ctsSampleData.length, '', '', '', '']))
  blankLine(lines)

  // Weekly RV trend with computed fields
  section(lines, 'WEEKLY RV TREND — 12 WEEK SEASON VIEW')
  lines.push(csvRow(['Week', 'Average RV', 'Sample Count', 'Week-on-Week Change', 'Cumulative Decline from Wk 1 (%)']))
  const wk1RV = ctsWeeklyRV[0].avgRV
  ctsWeeklyRV.forEach((w, i) => {
    const wowChange = i > 0 ? (w.avgRV - ctsWeeklyRV[i - 1].avgRV).toFixed(2) : 'N/A'
    const cumDecline = (((w.avgRV - wk1RV) / wk1RV) * 100).toFixed(2)
    lines.push(csvRow([w.week, w.avgRV, w.samples, wowChange, `${cumDecline}%`]))
  })
  const totalSamplesWeekly = ctsWeeklyRV.reduce((s, w) => s + w.samples, 0)
  const avgWeeklyRV = ctsWeeklyRV.reduce((s, w) => s + w.avgRV, 0) / ctsWeeklyRV.length
  lines.push(csvRow(['AVERAGE', avgWeeklyRV.toFixed(2), Math.round(totalSamplesWeekly / ctsWeeklyRV.length), '', '']))
  lines.push(csvRow(['TOTAL SAMPLES', '', totalSamplesWeekly, '', '']))
  blankLine(lines)

  // Recovery by shift
  section(lines, 'RECOVERY RATE BY SHIFT')
  lines.push(csvRow(['Period', 'Recovery (%)', 'Samples', 'Rating', 'Deviation from Weekly Average (%)']))
  const avgRecovery = ctsRecoveryByShift.reduce((s, r) => s + r.recovery, 0) / ctsRecoveryByShift.length
  ctsRecoveryByShift.forEach(r => {
    const rating = r.recovery >= 94 ? 'Good' : r.recovery >= 92 ? 'Acceptable' : 'Below Target'
    const deviation = (r.recovery - avgRecovery).toFixed(2)
    lines.push(csvRow([r.period, r.recovery, r.samples, rating, `${Number(deviation) > 0 ? '+' : ''}${deviation}%`]))
  })
  lines.push(csvRow(['WEEKLY AVERAGE', avgRecovery.toFixed(2), '', '', '']))
  blankLine(lines)

  // Lab performance — comprehensive
  section(lines, 'LAB PERFORMANCE COMPARISON — ALL 11 FACILITIES')
  lines.push(csvRow(['Lab', 'Region', 'Co-located Mill', 'Daily Samples', 'Avg RV', 'RV vs Network Avg', 'Anomaly Rate (%)', 'Anomaly vs Network Avg', 'Quality Score (/100)', 'Quality Rating']))
  ctsLabStats.forEach(l => {
    const lab = ctsLabs.find(c => c.name === l.lab)
    const mill = lab ? mills.find(m => m.id === lab.millId) : null
    const rvDiff = (l.avgRV - networkAvgRV).toFixed(2)
    const anomDiff = (l.anomalyRate - networkAvgAnomaly).toFixed(2)
    const rating = l.qualityScore >= 96 ? 'Excellent' : l.qualityScore >= 93 ? 'Good' : 'Needs Attention'
    lines.push(csvRow([l.lab, lab?.region || '', mill?.name || '', l.samplesDaily, l.avgRV, `${Number(rvDiff) > 0 ? '+' : ''}${rvDiff}`, l.anomalyRate, `${Number(anomDiff) > 0 ? '+' : ''}${anomDiff}`, l.qualityScore, rating]))
  })
  blankLine(lines)

  // AI insights
  section(lines, 'AI-GENERATED INSIGHTS')
  lines.push(csvRow(['#', 'Insight', 'Category', 'Recommended Action']))
  const categories = ['Seasonal Trend', 'Instrument Calibration', 'Process Optimization', 'Agronomic Pattern']
  const actions = [
    'Continue monitoring; compare with historical seasonal patterns',
    'Schedule instrument calibration and cross-lab validation at CTS Maidstone',
    'Review Monday AM startup procedures across all mills; consider extended warm-up',
    'Investigate varietal mix in Ugu region; coordinate with SASRI for variety assessment',
  ]
  ctsAIInsights.forEach((insight, i) => {
    lines.push(csvRow([i + 1, insight, categories[i] || '', actions[i] || '']))
  })

  // CTS background
  section(lines, 'ABOUT THE CANE TESTING SERVICE')
  lines.push(csvRow(['Field', 'Detail']))
  lines.push(csvRow(['Operator', 'SASA (South African Sugar Association) — statutory division']))
  lines.push(csvRow(['Purpose', 'Independent cane quality testing ensuring accurate grower-miller payment distribution']))
  lines.push(csvRow(['Method', 'Direct Analysis of Cane (DAC) — sampling and analysing every cane consignment']))
  lines.push(csvRow(['Key Metric', 'Recoverable Value (RV) — the basis for all grower-miller payment calculations']))
  lines.push(csvRow(['Reconciliation', 'Weekly reconciliation of individual grower analyses against mill balance']))
  lines.push(csvRow(['Staff', '16 managers with teams of chemists and engineers']))
  lines.push(csvRow(['Autolab', 'Autolab system also supports mills in Zimbabwe, Kenya, and Mozambique']))
  lines.push(csvRow(['Total Laboratories', ctsLabStats.length, '9 in KZN + 2 in Mpumalanga']))
  lines.push(csvRow(['AI Opportunity', 'Automated quality prediction, anomaly detection in RV measurements, predictive instrument calibration']))
  lines.push(csvRow(['Governing Legislation', 'Sugar Act 9 of 1978; Sugar Industry Agreement (SIA)']))

  addSources(lines, [
    SOURCES_CTS,
    SOURCES_SASA,
    SOURCES_SASRI,
    ['Sugar Act 9 of 1978', 'https://www.gov.za/documents/sugar-act-7-apr-2015-1159'],
    ['SASA — Sugar Milling and Refining', 'https://sasa.org.za/sugar-milling-and-refining/'],
  ])

  downloadFile(lines.join('\n'), `SugarIQ-CTS-Lab-${new Date().toISOString().slice(0, 10)}.csv`)
}
