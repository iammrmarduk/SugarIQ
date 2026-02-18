// ===== INDUSTRY OVERVIEW =====
export const industryStats = {
  annualRevenue: 24_000_000_000, // SASA official: "R24 billion annual direct income"
  totalGrowers: 26_740,
  smallScaleGrowers: 25_653,
  largeScaleGrowers: 1_087,
  activeMills: 12,
  totalMills: 14, // 12 operating + Darnall (mothballed) + Umzimkulu (closed)
  caneCrushed: 17_300_000,
  sugarProduced: 1_940_000,
  areaUnderCane: 348_000,
  directJobs: 65_000,
  indirectJobs: 270_000,
  totalLivelihoods: 1_000_000,
  irrigatedPct: 22, // ~22% by area; accounts for ~35% of production
  avgYieldPerHa: 56,
}

// ===== IMPORT DATA =====
export const importData = {
  totalImports2025: 153_344,
  importSurge: 400, // SA Canegrowers/SASA official figure; 153,344t Jan-Sep 2025 vs historical averages
  estimatedLosses: 760_000_000, // R760M documented Jan-Aug 2025; full-year may exceed R1B
  itacReferencePrice: 680,
  sasaRequestedPrice: 905,
  hplCost: 1_200_000_000,
  monthlyImports: [
    { month: 'Jan', tonnes: 12_450, year2024: 3_100 },
    { month: 'Feb', tonnes: 14_820, year2024: 2_800 },
    { month: 'Mar', tonnes: 18_300, year2024: 3_400 },
    { month: 'Apr', tonnes: 21_740, year2024: 4_100 },
    { month: 'May', tonnes: 19_680, year2024: 3_700 },
    { month: 'Jun', tonnes: 16_540, year2024: 3_200 },
    { month: 'Jul', tonnes: 15_890, year2024: 3_500 },
    { month: 'Aug', tonnes: 17_234, year2024: 3_900 },
    { month: 'Sep', tonnes: 16_690, year2024: 3_300 },
  ],
  sourceCountries: [
    { country: 'Brazil', pct: 48, tonnes: 73_605 },
    { country: 'Thailand', pct: 18, tonnes: 27_602 },
    { country: 'Guatemala', pct: 12, tonnes: 18_401 },
    { country: 'India', pct: 12, tonnes: 18_401 },
    { country: 'Other', pct: 10, tonnes: 15_335 },
  ],
  priceComparison: [
    { label: 'SA Local', price: 12_450, currency: 'ZAR/t' },
    { label: 'World Raw', price: 8_200, currency: 'ZAR/t' },
    { label: 'Brazil Export', price: 7_100, currency: 'ZAR/t' },
    { label: 'Thailand Export', price: 7_500, currency: 'ZAR/t' },
    { label: 'India Subsidized', price: 5_900, currency: 'ZAR/t' },
  ],
}

// ===== YIELD / PRODUCTION DATA =====
export const yieldHistory = [
  { season: '2019/20', cane: 19.3, sugar: 2.16, yield: 60.2 },
  { season: '2020/21', cane: 18.2, sugar: 2.04, yield: 57.8 },
  { season: '2021/22', cane: 17.2, sugar: 1.80, yield: 52.3 },
  { season: '2022/23', cane: 16.5, sugar: 1.84, yield: 54.7 },
  { season: '2023/24', cane: 17.1, sugar: 1.91, yield: 55.9 },
  { season: '2024/25', cane: 16.8, sugar: 1.88, yield: 55.2 },
  { season: '2025/26', cane: 17.3, sugar: 1.94, yield: 56.0 },
]

export const regionalHealth = [
  { region: 'Ugu', district: 'KZN South Coast', health: 87, risk: 'low', rainfall: 1250, temp: 22.4, notes: 'Good growing conditions, coastal moisture' },
  { region: 'uMgungundlovu', district: 'KZN Midlands', health: 72, risk: 'moderate', rainfall: 980, temp: 19.8, notes: 'Moderate drought stress, frost risk in winter' },
  { region: 'iLembe', district: 'KZN North Coast', health: 81, risk: 'low', rainfall: 1100, temp: 23.1, notes: 'Consistent performance, adequate rainfall' },
  { region: 'King Cetshwayo', district: 'Zululand Coast', health: 78, risk: 'moderate', rainfall: 1050, temp: 23.8, notes: 'Eldana borer pressure increasing' },
  { region: 'Zululand', district: 'Northern KZN', health: 69, risk: 'high', rainfall: 850, temp: 24.5, notes: 'Water stress, requires irrigation expansion' },
  { region: 'Nkomazi', district: 'Mpumalanga', health: 83, risk: 'low', rainfall: 780, temp: 25.2, notes: 'Fully irrigated, strong yields despite low rainfall' },
]

// ===== MILL OPERATIONS DATA =====
export const millCompanies = [
  {
    company: 'Illovo Sugar',
    mills: ['Sezela', 'Eston', 'Noodsberg', 'Umzimkulu*'],
    status: 'Private (ABF subsidiary)',
    notes: 'Largest sugar producer in Africa. Subsidiary of Associated British Foods (ABF); delisted from JSE June 2016. *Umzimkulu suspended Feb 2020; never reopened.',
  },
  {
    company: 'Tongaat Hulett',
    mills: ['Maidstone', 'Amatikulu', 'Felixton', 'Darnall*', 'Huletts Refinery'],
    status: 'Liquidation Filed',
    notes: '*Darnall mothballed since 2020. Provisional liquidation filed 12 Feb 2026 after Vision/IDC funding collapsed. R900M in unpaid SASA levies. 134-year-old company.',
  },
  {
    company: 'RCL Foods',
    mills: ['Komati', 'Malelane', 'Pongola'],
    status: 'Listed (JSE: RCL)',
    notes: 'Mpumalanga operations (~720,000 t sugar/year combined). Komati is the most modern SA mill with lowest production costs. ~78% owned by Remgro.',
  },
  {
    company: 'Gledhow Sugar',
    mills: ['Gledhow'],
    status: 'Private (Illovo 30%)',
    notes: 'KZN North Coast mill (KwaDukuza, est. 1879). Illovo holds 30% stake. Emerged from business rescue in 2024 under Ushukela Consortium management.',
  },
  {
    company: 'Umfolozi Sugar Mill',
    mills: ['Umfolozi'],
    status: 'Private',
    notes: 'Zululand operation, community-oriented.',
  },
  {
    company: 'UCL Company',
    mills: ['Dalton'],
    status: 'Private (co-op)',
    notes: 'KZN Midlands operation (est. 1924). Shareholder-owned by its raw material suppliers. Also produces wattle tannin extracts and pine lumber.',
  },
]

export const maintenanceAlerts = [
  { mill: 'Maidstone', severity: 'high', message: 'Crusher bearing temperature rising — maintenance recommended within 48 hours', component: 'Primary crusher', daysUntil: 2 },
  { mill: 'Sezela', severity: 'moderate', message: 'Turbine service due in 3 weeks — schedule during next planned shutdown', component: 'Steam turbine', daysUntil: 21 },
  { mill: 'Gledhow', severity: 'moderate', message: 'Diffuser refurbishment planned for off-season — parts on order', component: 'Diffuser unit', daysUntil: 45 },
  { mill: 'Felixton', severity: 'low', message: 'Routine boiler inspection due next month', component: 'Boiler #2', daysUntil: 30 },
  { mill: 'Komati', severity: 'low', message: 'Conveyor belt replacement scheduled for maintenance window', component: 'Cane conveyor', daysUntil: 60 },
]

export const cogenData = {
  currentOutput: 120,
  potentialOutput: 700,
  gridContribution: 17,
  mills: [
    { name: 'Komati', current: 18, potential: 65 },
    { name: 'Sezela', current: 15, potential: 55 },
    { name: 'Malelane', current: 14, potential: 50 },
    { name: 'Maidstone', current: 12, potential: 48 },
    { name: 'Felixton', current: 11, potential: 45 },
    { name: 'Noodsberg', current: 10, potential: 42 },
    { name: 'Pongola', current: 10, potential: 40 },
    { name: 'Amatikulu', current: 9, potential: 38 },
    { name: 'Eston', current: 8, potential: 35 },
    { name: 'Umfolozi', current: 7, potential: 32 },
    { name: 'Gledhow', current: 6, potential: 28 },
  ],
}

// ===== DIVERSIFICATION DATA =====
export const diversificationTargets = {
  saf: { current: 0, potential: 433, unit: 'M litres/year', jobs: 15_000, investment: 'R8.5B' },
  bioethanol: { current: 0, potential: 125, unit: 'M litres/year', jobs: 21_000, investment: 'R5.2B' },
  cogeneration: { current: 120, potential: 700, unit: 'MW', jobs: 3_500, investment: 'R12B' },
  biochemicals: { current: 0, potential: 50, unit: 'K tonnes/year', jobs: 2_000, investment: 'R3.1B' },
}

export const revenueMix = {
  current: [
    { name: 'Raw Sugar', value: 52 },
    { name: 'Refined Sugar', value: 28 },
    { name: 'Molasses', value: 8 },
    { name: 'Co-generation', value: 5 },
    { name: 'Other', value: 7 },
  ],
  target2030: [
    { name: 'Sugar Products', value: 40 },
    { name: 'Biofuels (SAF + Ethanol)', value: 25 },
    { name: 'Co-generation', value: 18 },
    { name: 'Biochemicals', value: 10 },
    { name: 'Carbon Credits', value: 7 },
  ],
}

export const opportunityMatrix = [
  { subject: 'SAF', feasibility: 78, impact: 92, readiness: 35, timeframe: 'Medium' },
  { subject: 'Bioethanol', feasibility: 85, impact: 80, readiness: 45, timeframe: 'Short' },
  { subject: 'Co-generation', feasibility: 92, impact: 75, readiness: 65, timeframe: 'Short' },
  { subject: 'Biochemicals', feasibility: 65, impact: 60, readiness: 20, timeframe: 'Long' },
  { subject: 'Carbon Credits', feasibility: 88, impact: 45, readiness: 55, timeframe: 'Short' },
]

// ===== DIVERSIFICATION DEEP-DIVE DATA =====
export const diversificationDetails: Record<string, {
  title: string
  tagline: string
  color: string
  overview: string
  globalContext: string
  saOpportunity: string
  howToUnlock: string[]
  keyPlayers: string[]
  challenges: string[]
  timeline: string
  annualRevenue: string
  investmentBreakdown: { item: string; amount: string }[]
  jobBreakdown: { category: string; count: number }[]
  caseStudy: { country: string; detail: string }
}> = {
  saf: {
    title: 'Sustainable Aviation Fuel (SAF)',
    tagline: 'The single largest revenue opportunity for SA sugarcane',
    color: '#a855f7',
    overview: 'Sustainable Aviation Fuel produced from sugarcane ethanol via the alcohol-to-jet (ATJ) pathway. Global aviation must decarbonize — IATA mandates net-zero by 2050, and the EU requires 6% SAF blending by 2030. SA sugarcane is uniquely positioned: our feedstock is abundant, our climate is ideal, and we sit on major flight routes between Africa, Europe, and Asia.',
    globalContext: 'Global SAF demand is projected to reach 449 billion litres by 2050, up from less than 1 billion today. Current SAF trades at 2-4x conventional jet fuel prices, and offtake demand far exceeds supply. Airlines including SAA, British Airways, Lufthansa, and Emirates have committed to SAF procurement targets. SA could capture 1-2% of global supply.',
    saOpportunity: 'South Africa can produce 433 million litres of SAF annually from sugarcane ethanol. This positions SA as Africa\'s first SAF producer, leveraging existing sugar infrastructure, the Richards Bay port complex, and strong aviation connections. SASRI has identified high-yielding energy cane varieties that can boost biomass output by 40% over conventional varieties.',
    howToUnlock: [
      'Establish a national SAF blending mandate (2% by 2028, scaling to 5% by 2032)',
      'Secure offtake agreements with SAA, Comair successors, and international carriers',
      'Build 2-3 ATJ conversion facilities at existing mill sites (Sezela, Komati are ideal)',
      'Partner with Sasol for ATJ technology transfer — Fischer-Tropsch expertise is directly applicable',
      'Access Green Climate Fund and EU CBAM-linked financing for construction',
      'Develop dedicated energy cane varieties with SASRI for maximum biomass yield',
    ],
    keyPlayers: ['SASOL (technology partner)', 'IATA (demand driver)', 'IDC (development finance)', 'SASRI (R&D)', 'SAA (anchor offtaker)', 'ACSA (airport infrastructure)'],
    challenges: ['High capital cost for ATJ facilities (~R3B each)', 'No SA regulatory framework for SAF yet', 'Competition with food vs fuel debate', 'Technology at commercial demonstration stage globally'],
    timeline: '2-5 years to first commercial production',
    annualRevenue: 'R12-18B',
    investmentBreakdown: [
      { item: 'ATJ conversion plants (2-3 facilities)', amount: 'R5.5B' },
      { item: 'Ethanol distillation expansion', amount: 'R1.2B' },
      { item: 'Logistics and storage infrastructure', amount: 'R0.8B' },
      { item: 'Energy cane R&D and planting', amount: 'R0.5B' },
      { item: 'Regulatory and certification', amount: 'R0.5B' },
    ],
    jobBreakdown: [
      { category: 'Construction (temporary)', count: 5000 },
      { category: 'Plant operations', count: 2500 },
      { category: 'Feedstock supply chain', count: 4000 },
      { category: 'Engineering and technical', count: 1500 },
      { category: 'Logistics and distribution', count: 2000 },
    ],
    caseStudy: { country: 'Brazil', detail: 'Raízen (Shell/Cosan JV) produces 82M litres/year of cellulosic ethanol from sugarcane at Piracicaba, now expanding into SAF via ATJ. Their second-gen facility cost US$100M and employs 450 directly. SA can learn from this model.' },
  },
  bioethanol: {
    title: 'Bioethanol (E10/E20 Fuel Blending)',
    tagline: 'Immediate job creator — 21,000 new roles from mandated blending',
    color: '#22c55e',
    overview: 'Fuel-grade ethanol blended into petrol at 10-20% (E10/E20). South Africa already has a Biofuels Industrial Strategy (2007) but has never implemented mandatory blending. Brazil mandates 30% ethanol blending (E30, updated 2025). If SA enacted just E10, it would require 1.2 billion litres annually — of which sugarcane could supply 125 million litres from existing molasses, with room to grow.',
    globalContext: 'Over 80 countries have biofuel blending policies. Brazil\'s sugar-ethanol model supports 3.6 million jobs. The US Renewable Fuel Standard mandates 56 billion litres of renewable fuel annually. India reached its E20 target in 2025. South Africa is one of the only major economies with no biofuel blending mandate despite having the feedstock.',
    saOpportunity: 'SA consumes approximately 12 billion litres of petrol annually. A 10% blend mandate would create massive demand for locally-produced ethanol, reducing oil imports (R200B+ annually) while creating 21,000 rural jobs in sugar regions. Existing molasses production is currently exported cheaply — converting it to ethanol adds 8-10x the value.',
    howToUnlock: [
      'Government to gazette the Biofuels Mandatory Blending regulations (draft exists since 2020)',
      'Start with E2 (2%) mandate, escalating to E10 over 5 years',
      'Build ethanol distilleries co-located at 4-5 sugar mills',
      'Partner with Sasol and PetroSA for fuel blending and distribution infrastructure',
      'Use molasses (currently low-value export) as primary feedstock — no food competition',
      'Establish grower premium payments for cane destined to ethanol production',
    ],
    keyPlayers: ['DMRE (regulations)', 'Sasol/PetroSA (blending)', 'IDC (finance)', 'SASA (industry coordination)', 'Illovo/RCL Foods (distillery sites)'],
    challenges: ['Political will to gazette mandatory blending regulations', 'Petroleum industry lobby against biofuels mandate', 'Initial capital cost for distilleries', 'Price competitiveness vs imported petrol without mandate'],
    timeline: '1-3 years (regulations) + 2 years (construction) = operational by 2029',
    annualRevenue: 'R6-8B',
    investmentBreakdown: [
      { item: 'Ethanol distilleries (4-5 facilities)', amount: 'R3.0B' },
      { item: 'Blending and storage depots', amount: 'R0.8B' },
      { item: 'Feedstock logistics', amount: 'R0.6B' },
      { item: 'Water treatment and environmental', amount: 'R0.4B' },
      { item: 'Regulatory and licensing', amount: 'R0.4B' },
    ],
    jobBreakdown: [
      { category: 'Distillery operations', count: 3000 },
      { category: 'Cane farming (expanded area)', count: 8000 },
      { category: 'Transport and logistics', count: 4000 },
      { category: 'Engineering and maintenance', count: 2000 },
      { category: 'Administration and support', count: 4000 },
    ],
    caseStudy: { country: 'Brazil', detail: 'Brazil\'s ProÁlcool programme (1975-present) created a $28B/year ethanol industry from sugarcane. 370+ distilleries, 3.6M jobs, and E30 mandatory blending (raised from E27 in 2025). Energy security improved as oil imports dropped 40%. SA has the same feedstock advantage.' },
  },
  cogeneration: {
    title: 'Bagasse Co-generation (Grid Power)',
    tagline: 'Most ready opportunity — expandable from today\'s 120 MW to 700 MW',
    color: '#f59e0b',
    overview: 'Every sugar mill burns bagasse (crushed cane fibre) to generate steam for processing. Most mills currently produce just enough electricity for their own needs. With modern high-pressure boilers and turbines, the same bagasse can generate 3-5x more electricity — enough to power the mill AND feed surplus into the national grid. This is baseload renewable energy that runs during the 8-month crushing season.',
    globalContext: 'Brazil has 12,410 MW of installed bagasse co-generation capacity, generating over 21,000 GWh annually — a major pillar of their renewable energy mix. Mauritius gets ~13% of national electricity from bagasse. India produces 10,000+ MW from sugarcane co-generation. These countries demonstrate that sugar mills can be power stations, not just sugar factories.',
    saOpportunity: 'SA mills currently generate 120 MW combined, almost all consumed internally. The potential is 700 MW — a 5.8x increase. At Eskom\'s avoided cost rate of R1.50/kWh, 580 MW of surplus power is worth approximately R2.1B per year. This directly addresses load shedding while creating a reliable new revenue stream for mills. The IRP 2019 includes biomass in its distributed generation and cogeneration allocations — bagasse is the most ready biomass source.',
    howToUnlock: [
      'Replace low-pressure boilers (45 bar) with high-pressure units (82-100 bar) at each mill',
      'Install back-pressure turbine generators and grid-tie infrastructure',
      'Negotiate long-term Power Purchase Agreements (PPAs) with Eskom under REIPPPP',
      'Access Section 12B tax incentives for renewable energy investment',
      'Explore off-season power from biomass (cane trash, wood chips) to extend generation to 12 months',
      'Upgrade Eskom grid connections at mill substations (some need 10x capacity increase)',
    ],
    keyPlayers: ['Eskom (grid buyer)', 'NERSA (tariff regulator)', 'IDC (concessional finance)', 'John Thompson / Babcock (boiler manufacturers)', 'DMRE (IRP allocation)'],
    challenges: ['Eskom grid connection delays and bureaucracy', 'High upfront capital for boiler replacement (R800M-1.2B per mill)', 'Seasonal nature of crushing (8 months)', 'Wheeling charges for third-party power sales'],
    timeline: '1-2 years per mill upgrade; full fleet by 2030',
    annualRevenue: 'R2.1B',
    investmentBreakdown: [
      { item: 'High-pressure boilers (12 mills)', amount: 'R7.2B' },
      { item: 'Turbine generators', amount: 'R2.4B' },
      { item: 'Grid interconnection upgrades', amount: 'R1.2B' },
      { item: 'Electrical infrastructure', amount: 'R0.8B' },
      { item: 'Biomass handling (off-season fuel)', amount: 'R0.4B' },
    ],
    jobBreakdown: [
      { category: 'Power plant operations', count: 1200 },
      { category: 'Boiler and turbine maintenance', count: 800 },
      { category: 'Grid and electrical', count: 500 },
      { category: 'Biomass harvesting (off-season)', count: 600 },
      { category: 'Engineering and management', count: 400 },
    ],
    caseStudy: { country: 'Mauritius', detail: 'Mauritius generates ~13% of national electricity from bagasse co-generation across 4 mills. Omnicane\'s St. Aubin facility exports 70 MW to the grid from a single mill. The government pays a feed-in tariff of US$0.085/kWh. SA mills could replicate this at 10x the scale.' },
  },
  biochemicals: {
    title: 'Biochemicals & Bioplastics',
    tagline: 'High-value niche — turning sugar into biodegradable materials',
    color: '#06b6d4',
    overview: 'Sugarcane is a platform feedstock for biochemicals: succinic acid, lactic acid, PLA bioplastics, bio-based polymers, and specialty chemicals. These products command premium prices (R20,000-80,000/tonne vs R12,000/tonne for raw sugar). As global consumers and regulators push for biodegradable alternatives to petrochemicals, SA sugarcane could supply the base materials.',
    globalContext: 'The global bio-based chemicals market is projected to reach US$160-170B by 2030 (multiple market research estimates). Braskem (Brazil) produces 260,000 tonnes/year of bio-polyethylene from sugarcane ethanol (expanded June 2023). NatureWorks (USA/Thailand) produces PLA bioplastic from plant sugars. The EU Single-Use Plastics Directive is driving massive demand for biodegradable alternatives.',
    saOpportunity: 'SA currently exports molasses and other by-products at commodity prices. Converting these to biochemicals adds 5-20x value. A 50,000 tonne/year biochemicals operation could generate R1.5-3B in revenue. SA has advantages: existing sugar infrastructure, competitive labour costs, proximity to growing African consumer markets, and CSIR/university R&D capacity in bioprocessing.',
    howToUnlock: [
      'Partner with global biochemical companies (Braskem, NatureWorks, Novamont) for technology',
      'Build pilot-scale biorefinery at one mill (Sezela or Komati have space and infrastructure)',
      'Develop CSIR/Stellenbosch University bioprocessing R&D pipeline',
      'Target high-value specialty chemicals first (succinic acid: R40,000/t) before scale products',
      'Establish off-take agreements with SA packaging companies (Mpact, Nampak)',
      'Access DTI Manufacturing Competitiveness Enhancement Programme incentives',
    ],
    keyPlayers: ['CSIR (R&D)', 'Stellenbosch University (bioprocessing)', 'DST/NRF (research funding)', 'Mpact/Nampak (bioplastics offtake)', 'IDC (finance)', 'Braskem (technology partner)'],
    challenges: ['Technology still at pilot/demo scale for many products', 'High R&D costs before commercial viability', 'Competition from petroleum-based chemicals (still cheaper at scale)', 'Limited local expertise in biorefinery operations'],
    timeline: '3-7 years to commercial-scale production',
    annualRevenue: 'R1.5-3B',
    investmentBreakdown: [
      { item: 'Pilot biorefinery facility', amount: 'R0.8B' },
      { item: 'Scale-up to commercial production', amount: 'R1.2B' },
      { item: 'R&D and technology licensing', amount: 'R0.5B' },
      { item: 'Downstream processing', amount: 'R0.4B' },
      { item: 'Environmental compliance', amount: 'R0.2B' },
    ],
    jobBreakdown: [
      { category: 'Bioprocessing operations', count: 600 },
      { category: 'R&D and laboratory', count: 300 },
      { category: 'Feedstock preparation', count: 400 },
      { category: 'Quality control', count: 200 },
      { category: 'Sales and distribution', count: 500 },
    ],
    caseStudy: { country: 'Brazil', detail: 'Braskem produces 260,000 t/year of "I\'m green" bio-polyethylene from sugarcane ethanol at Triunfo (expanded 2023). The plant converts ethanol to ethylene, then polymerizes to PE. Sold to Unilever, P&G, and Johnson & Johnson at a 15-30% premium. Revenue exceeds US$400M/year.' },
  },
  carbon: {
    title: 'Carbon Credits & Climate Finance',
    tagline: 'Monetizing what sugarcane already does — absorb CO₂',
    color: '#06b6d4',
    overview: 'Sugarcane is one of the most efficient carbon-capturing crops on earth, fixing 30-40 tonnes of CO₂ per hectare per year. With 348,000 hectares under cane in SA, the industry is already a massive carbon sink. Carbon credits under Article 6 of the Paris Agreement, voluntary carbon markets (Verra, Gold Standard), and SA\'s own Carbon Tax Act create pathways to monetize this.',
    globalContext: 'The voluntary carbon market was valued at ~US$723M in 2023 (down from ~$1.9B in 2022 due to quality concerns) but is projected to recover to US$10-50B by 2030. Compliance carbon prices in the EU are €60-80/tonne CO₂. SA\'s carbon tax is R236/tonne (2025) and rising. Agricultural carbon credits are gaining acceptance — soil carbon, avoided deforestation, and biomass energy all qualify.',
    saOpportunity: 'SA sugar can generate carbon credits from multiple pathways: (1) bagasse co-generation displacing coal-fired power, (2) bioethanol displacing petrol, (3) soil carbon sequestration from no-till farming practices, (4) methane capture from wastewater treatment, and (5) avoided land-use change. At R300-500 per tonne CO₂e, this represents R1-2B in annual revenue for the industry.',
    howToUnlock: [
      'Register co-generation and biofuel projects under Verra VCS or Gold Standard',
      'Develop Measurement, Reporting and Verification (MRV) systems for soil carbon',
      'Partner with carbon trading platforms (South Pole, Climate Impact Partners)',
      'Bundle small grower credits into tradeable portfolios via SASA coordination',
      'Access Article 6 bilateral agreements (SA has signed with Switzerland, Sweden)',
      'Integrate carbon accounting into SugarIQ platform for real-time credit generation',
    ],
    keyPlayers: ['Verra/Gold Standard (certification)', 'South Pole (trading)', 'National Treasury (carbon tax)', 'DFFE (Paris Agreement)', 'SASA (industry aggregation)', 'Swiss/Swedish governments (Article 6)'],
    challenges: ['Carbon credit verification is complex and expensive', 'Additionality requirements may exclude existing practices', 'Carbon price volatility', 'MRV infrastructure for 348,000 hectares is significant'],
    timeline: '1-2 years for first credits; scaling over 3-5 years',
    annualRevenue: 'R1-2B',
    investmentBreakdown: [
      { item: 'MRV systems and satellite monitoring', amount: 'R0.3B' },
      { item: 'Project registration and certification', amount: 'R0.2B' },
      { item: 'Soil carbon baseline studies', amount: 'R0.1B' },
      { item: 'Carbon trading platform development', amount: 'R0.2B' },
      { item: 'Capacity building and training', amount: 'R0.1B' },
    ],
    jobBreakdown: [
      { category: 'Carbon auditors and verifiers', count: 300 },
      { category: 'MRV technicians', count: 400 },
      { category: 'Data analytics and platform', count: 200 },
      { category: 'Project development', count: 150 },
      { category: 'Trading and finance', count: 150 },
    ],
    caseStudy: { country: 'Brazil', detail: 'Bonsucro-certified mills in Brazil generate carbon credits at US$12-18/tonne CO₂e. Raízen alone sold over 500,000 credits in 2024. The Brazilian Renovabio programme (RenovaBio) creates decarbonization credits (CBIOs) that trade on B3 exchange at ~R$100 each, generating R$2B+ in annual revenue for biofuel producers.' },
  },
}

// ===== ADVISORY CAPABILITIES =====
export const advisoryCapabilities = [
  { name: 'Irrigation Scheduling', icon: 'Droplets', description: 'Optimal water management based on soil moisture, weather forecasts, and growth stage' },
  { name: 'Disease Detection', icon: 'Bug', description: 'Early identification of smut, rust, and Eldana borer infestations' },
  { name: 'Fertilizer Planning', icon: 'Leaf', description: 'Precision nutrient management based on soil analysis and yield targets' },
  { name: 'Weather Forecasting', icon: 'CloudRain', description: 'Hyperlocal weather predictions for planting, harvesting, and spraying windows' },
  { name: 'Transport Logistics', icon: 'Truck', description: 'Optimize cane transport routes and mill delivery schedules' },
  { name: 'Financial Advisory', icon: 'DollarSign', description: 'Market prices, cost analysis, and grower payment projections' },
  { name: 'Cane Quality & RV', icon: 'FlaskConical', description: 'CTS lab data integration — RV analysis, quality trends, and payment accuracy' },
  { name: 'Multilingual Support', icon: 'Globe', description: 'Available in English, isiZulu, and Afrikaans for all growers' },
]

// ===== ROADMAP DATA =====
export const roadmapPhases = [
  {
    phase: 'Phase 1: Quick Wins',
    timeline: '0-30 days',
    color: '#22c55e',
    items: [
      'Deploy AI grower advisory chatbot (WhatsApp integration)',
      'Launch real-time import monitoring dashboard',
      'Activate weather-based irrigation alerts for 5,000 growers',
      'Mill efficiency benchmarking across all 12 operating mills',
      'Set up automated SARS/ITAC import data feeds',
    ],
    impact: 'Immediate: R50M in prevented losses through early import alerts',
  },
  {
    phase: 'Phase 2: Foundation',
    timeline: '1-6 months',
    color: '#f59e0b',
    items: [
      'Deploy precision agriculture across 50,000 hectares',
      'Integrate satellite imagery for crop health monitoring',
      'Predictive maintenance system for all operating mills',
      'Supply chain optimization reducing transport costs by 12%',
      'Small-scale grower mobile app rollout (25,653 growers)',
      'Diversification feasibility modeling (SAF, bioethanol)',
    ],
    impact: 'R200M annual savings through operational efficiency',
  },
  {
    phase: 'Phase 3: Transformation',
    timeline: '6-24 months',
    color: '#a855f7',
    items: [
      'Full digital twin of SA sugar supply chain',
      'AI-driven policy impact simulation for SASA advocacy',
      'Autonomous irrigation management across all irrigated areas',
      'Carbon credit quantification and trading platform',
      'Biorefinery planning and investment decision support',
      'Export market intelligence and price prediction',
      'Industry-wide yield optimization: target 8-15% improvement',
    ],
    impact: 'R1.2B+ annual value creation across the entire value chain',
  },
]

// ===== DEMO NOTIFICATIONS =====
export const demoNotifications = [
  {
    delay: 120_000, // 2 minutes
    type: 'import' as const,
    title: 'Import Alert',
    message: '2 vessels carrying 12,000t sugar detected en route to Durban — ETA 4 days',
    severity: 'critical' as const,
  },
  {
    delay: 300_000, // 5 minutes
    type: 'weather' as const,
    title: 'Weather Alert',
    message: 'Thunderstorms expected in iLembe district Thursday — harvesting delays likely',
    severity: 'high' as const,
  },
  {
    delay: 480_000, // 8 minutes
    type: 'mill' as const,
    title: 'Mill Alert',
    message: 'Tongaat Maidstone crusher bearing temperature at 94°C — maintenance recommended',
    severity: 'high' as const,
  },
]

// ===== CTS LAB DATA =====
export const ctsSampleData = [
  { id: 'S-0401', grower: 'Naidoo Bros', lab: 'CTS Sezela', brix: 21.4, pol: 18.2, fibre: 13.8, rv: 12.91, purity: 85.05, status: 'normal' as const, flagReason: null },
  { id: 'S-0402', grower: 'Van der Merwe', lab: 'CTS Maidstone', brix: 20.8, pol: 17.6, fibre: 14.1, rv: 12.34, purity: 84.62, status: 'normal' as const, flagReason: null },
  { id: 'S-0403', grower: 'Dlamini Holdings', lab: 'CTS Felixton', brix: 22.1, pol: 18.9, fibre: 13.2, rv: 13.48, purity: 85.52, status: 'normal' as const, flagReason: null },
  { id: 'S-0404', grower: 'Sithole Family', lab: 'CTS Amatikulu', brix: 19.7, pol: 16.4, fibre: 14.5, rv: 11.22, purity: 83.25, status: 'normal' as const, flagReason: null },
  { id: 'S-0405', grower: 'Patel & Sons', lab: 'CTS Eston', brix: 21.9, pol: 18.7, fibre: 13.5, rv: 13.21, purity: 85.39, status: 'normal' as const, flagReason: null },
  { id: 'S-0406', grower: 'Zulu Cane Co-op', lab: 'CTS Noodsberg', brix: 20.3, pol: 17.1, fibre: 14.3, rv: 11.89, purity: 84.24, status: 'flagged' as const, flagReason: 'Low purity ratio — 84.2% vs 85.1% lab average; possible juice degradation' },
  { id: 'S-0407', grower: 'Maharaj Farms', lab: 'CTS Komati', brix: 22.5, pol: 19.1, fibre: 12.9, rv: 13.72, purity: 84.89, status: 'normal' as const, flagReason: null },
  { id: 'S-0408', grower: 'Ngcobo & Partners', lab: 'CTS Malelane', brix: 21.1, pol: 17.9, fibre: 13.7, rv: 12.68, purity: 84.83, status: 'normal' as const, flagReason: null },
  { id: 'S-0409', grower: 'Botha Estate', lab: 'CTS Pongola', brix: 20.6, pol: 17.4, fibre: 14.0, rv: 12.11, purity: 84.47, status: 'normal' as const, flagReason: null },
  { id: 'S-0410', grower: 'Mkhize Growers', lab: 'CTS Gledhow', brix: 21.8, pol: 18.5, fibre: 13.4, rv: 13.15, purity: 84.86, status: 'normal' as const, flagReason: null },
  { id: 'S-0411', grower: 'Singh Agricultural', lab: 'CTS Umfolozi', brix: 19.9, pol: 16.7, fibre: 15.8, rv: 10.84, purity: 83.92, status: 'flagged' as const, flagReason: 'Abnormally high fibre (15.8%) — 1.6σ above seasonal mean; check cane age or variety' },
  { id: 'S-0412', grower: 'Joubert & Co', lab: 'CTS Sezela', brix: 22.3, pol: 19.0, fibre: 13.1, rv: 13.58, purity: 85.20, status: 'normal' as const, flagReason: null },
  { id: 'S-0413', grower: 'Ndlovu Trust', lab: 'CTS Maidstone', brix: 20.1, pol: 16.9, fibre: 14.2, rv: 11.67, purity: 84.08, status: 'normal' as const, flagReason: null },
  { id: 'S-0414', grower: 'Reddy Plantations', lab: 'CTS Felixton', brix: 21.6, pol: 18.4, fibre: 13.6, rv: 13.02, purity: 85.19, status: 'normal' as const, flagReason: null },
  { id: 'S-0415', grower: 'Cele Small-scale', lab: 'CTS Amatikulu', brix: 20.5, pol: 17.3, fibre: 14.4, rv: 11.78, purity: 84.39, status: 'normal' as const, flagReason: null },
  { id: 'S-0416', grower: 'De Villiers Farm', lab: 'CTS Komati', brix: 21.2, pol: 18.0, fibre: 13.9, rv: 12.74, purity: 84.91, status: 'normal' as const, flagReason: null },
  { id: 'S-0417', grower: 'Shabalala Group', lab: 'CTS Noodsberg', brix: 22.0, pol: 18.8, fibre: 13.3, rv: 13.41, purity: 85.45, status: 'normal' as const, flagReason: null },
  { id: 'S-0418', grower: 'Thompson Estate', lab: 'CTS Pongola', brix: 19.4, pol: 16.1, fibre: 14.6, rv: 10.53, purity: 82.99, status: 'flagged' as const, flagReason: 'RV 10.53 below expected range (11.0+) — investigate cane freshness or delivery delay' },
  { id: 'S-0419', grower: 'Moodley Agri', lab: 'CTS Malelane', brix: 21.7, pol: 18.6, fibre: 13.5, rv: 13.18, purity: 85.71, status: 'normal' as const, flagReason: null },
  { id: 'S-0420', grower: 'Khumalo Farmers', lab: 'CTS Gledhow', brix: 20.9, pol: 17.7, fibre: 14.0, rv: 12.41, purity: 84.69, status: 'normal' as const, flagReason: null },
]

export const ctsWeeklyRV = [
  { week: 'Wk 1', avgRV: 13.42, samples: 312 },
  { week: 'Wk 2', avgRV: 13.38, samples: 298 },
  { week: 'Wk 3', avgRV: 13.31, samples: 325 },
  { week: 'Wk 4', avgRV: 13.25, samples: 310 },
  { week: 'Wk 5', avgRV: 13.18, samples: 341 },
  { week: 'Wk 6', avgRV: 13.09, samples: 289 },
  { week: 'Wk 7', avgRV: 13.01, samples: 318 },
  { week: 'Wk 8', avgRV: 12.94, samples: 305 },
  { week: 'Wk 9', avgRV: 12.88, samples: 334 },
  { week: 'Wk 10', avgRV: 12.79, samples: 321 },
  { week: 'Wk 11', avgRV: 12.71, samples: 297 },
  { week: 'Wk 12', avgRV: 12.64, samples: 316 },
]

export const ctsRecoveryByShift = [
  { period: 'Mon AM', recovery: 91.2, samples: 48 },
  { period: 'Mon PM', recovery: 93.1, samples: 52 },
  { period: 'Tue AM', recovery: 93.8, samples: 51 },
  { period: 'Tue PM', recovery: 94.2, samples: 49 },
  { period: 'Wed AM', recovery: 94.5, samples: 53 },
  { period: 'Wed PM', recovery: 94.8, samples: 50 },
  { period: 'Thu AM', recovery: 94.6, samples: 47 },
  { period: 'Thu PM', recovery: 95.1, samples: 54 },
  { period: 'Fri AM', recovery: 94.9, samples: 46 },
  { period: 'Fri PM', recovery: 95.3, samples: 51 },
]

export const ctsLabStats = [
  { lab: 'CTS Sezela', samplesDaily: 124, avgRV: 13.05, anomalyRate: 1.8, qualityScore: 96 },
  { lab: 'CTS Maidstone', samplesDaily: 118, avgRV: 12.48, anomalyRate: 3.2, qualityScore: 91 },
  { lab: 'CTS Felixton', samplesDaily: 132, avgRV: 13.25, anomalyRate: 1.5, qualityScore: 97 },
  { lab: 'CTS Amatikulu', samplesDaily: 98, avgRV: 11.92, anomalyRate: 2.1, qualityScore: 94 },
  { lab: 'CTS Eston', samplesDaily: 105, avgRV: 13.18, anomalyRate: 1.9, qualityScore: 95 },
  { lab: 'CTS Noodsberg', samplesDaily: 112, avgRV: 12.87, anomalyRate: 2.4, qualityScore: 93 },
  { lab: 'CTS Komati', samplesDaily: 141, avgRV: 13.31, anomalyRate: 1.6, qualityScore: 97 },
  { lab: 'CTS Malelane', samplesDaily: 138, avgRV: 12.96, anomalyRate: 2.0, qualityScore: 95 },
  { lab: 'CTS Pongola', samplesDaily: 109, avgRV: 12.11, anomalyRate: 2.7, qualityScore: 92 },
  { lab: 'CTS Gledhow', samplesDaily: 87, avgRV: 12.78, anomalyRate: 2.3, qualityScore: 93 },
  { lab: 'CTS Umfolozi', samplesDaily: 83, avgRV: 11.84, anomalyRate: 2.5, qualityScore: 92 },
]

export const ctsAIInsights = [
  'RV trending down 2.8% over last 4 weeks — seasonal, but worth monitoring',
  'CTS Maidstone anomaly rate (3.2%) is 1.4x the network average — investigate instrument calibration',
  'Monday AM recovery is consistently 3.1% lower than weekly average — startup procedure optimization recommended',
  'Grower cluster in Ugu region showing 8% higher fibre content than last season — possible varietal shift',
]

// ===== TONGAAT HULETT CRISIS =====
export const tongaatHulettCrisis = {
  status: 'Provisional Liquidation Filed',
  statusDate: '12 February 2026',
  companyAge: 134,
  shareOfSAProduction: 25, // percent — commonly cited as "a quarter" of SA production
  timeline: [
    { date: '2013-2019', event: 'Accounting fraud — profits overstated by 239%, R12B shareholder value destroyed', type: 'scandal' as const },
    { date: 'Oct 2022', event: 'Entered voluntary business rescue — R1.5B working capital shortfall', type: 'crisis' as const },
    { date: 'Jan 2024', event: 'Creditors approved rescue plan (98.5% majority) — Vision Group designated buyer', type: 'progress' as const },
    { date: '2024-25', event: 'R1.45B IDC-funded rehabilitation programme — mills achieve top-3 national recovery ranking', type: 'progress' as const },
    { date: 'May 2025', event: 'Vision acquired Lender Group claims; implementation depended on IDC funding', type: 'progress' as const },
    { date: 'Dec 2025', event: 'SCA ruled SASA levies are statutory obligations — cannot be suspended in rescue', type: 'crisis' as const },
    { date: '7 Feb 2026', event: 'Sale agreements lapsed — Vision and IDC failed to agree; Vision demanded R11.7B', type: 'crisis' as const },
    { date: '12 Feb 2026', event: 'Business rescue practitioners filed for provisional liquidation at KZN High Court', type: 'crisis' as const },
  ],
  rescuePlanConditions: [
    { label: 'IDC Refinancing', amount: 'R2.3B', detail: 'Post-commencement funding facility to be assumed by Vision', met: false },
    { label: 'SASA Escrow', amount: 'R517M', detail: 'Payment into SASA escrow pending legal proceedings', met: false },
    { label: 'Creditor Distribution', amount: 'R75M', detail: 'For distribution to concurrent creditors', met: false },
  ],
  outstandingLevies: 900_000_000, // R900M unpaid SASA levies
  visionDemand: 11_700_000_000, // R11.7B demand letter
  rehabilitationSpend: 1_450_000_000, // R1.45B IDC-funded rehab
  impact: {
    directEmployees: 7_500,
    contractedGrowers: 15_446, // 60% of all small-scale growers
    affectedMills: ['Maidstone', 'Amatikulu', 'Felixton', 'Huletts Refinery'],
    closedMills: ['Darnall'],
    regionsAffected: ['KZN North Coast', 'Zululand'],
    estimatedLivelihoods: 200_000,
    seasonRevenueAtRisk: 845_700_000, // R845.7M current season
    caneExpectedThisSeason: 1_000_000, // 1M tonnes
  },
  millPerformance: {
    maidstone: { lostTimePct: { was: 33.5, now: 12.4 }, sucroseExtraction: 95, bhr: 90 },
    felixton: { lostTimePct: { was: 27.1, now: 12.9 }, sucroseExtraction: 95, bhr: 90 },
    amatikulu: { sucroseExtraction: 95, bhrImprovement: 5, note: 'Highest sucrose extraction in 5 years' },
  },
  governmentIntervention: 'DTIC Minister Parks Tau intervening directly; government recognises critical importance of continued mill operations',
  canegrowersWarning: 'Liquidation is a "profound risk to the entire SA sugar sector and the million livelihoods it supports"',
  operationalNote: 'Despite corporate collapse, all 3 mills rank top-3 nationally for sugar recovery after R1.45B rehabilitation programme',
}

// ===== GROWER PAYMENT CONFIG =====
export const growerPaymentConfig = {
  pricePerRVUnit: 4850,         // ZAR per RV unit per tonne
  averageTonnesPerGrower: 180,
  totalGrowers: 26740,
}

// ===== CHAT SUGGESTED QUESTIONS =====
export const suggestedQuestions = [
  'What is the current state of the SA sugar import crisis?',
  'How can small-scale growers improve their yields?',
  'What is the potential for sustainable aviation fuel from sugarcane?',
  'Tell me about Tongaat Hulett\'s business rescue situation',
  'What are the key targets of the Sugar Master Plan 2030?',
  'How does the Health Promotion Levy affect the industry?',
  'What does the Cane Testing Service do and how could AI improve it?',
]
