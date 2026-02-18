// ===== AI DEMOS — Calculation Functions & Types =====
// Pure client-side math for 5 interactive sugar engineering simulations.
// Based on Hugot's "Handbook of Cane Sugar Engineering", SASTA benchmarks,
// and standard sugar technology equations.

import { ctsSampleData } from './data'

// ===== SHARED TYPES =====

export interface SliderConfig {
  label: string
  min: number
  max: number
  step: number
  default: number
  unit: string
}

// ===== 1. BOILING HOUSE SIMULATOR =====

export const boilingHouseSliders: Record<string, SliderConfig> = {
  feedBrix: { label: 'Feed Brix', min: 60, max: 75, step: 0.5, default: 67, unit: '°Bx' },
  feedPurity: { label: 'Feed Purity', min: 78, max: 92, step: 0.5, default: 85, unit: '%' },
  targetCrystalSize: { label: 'Target Crystal Size', min: 0.3, max: 1.2, step: 0.05, default: 0.6, unit: 'mm' },
  vacuumPanTemp: { label: 'Vacuum Pan Temp', min: 60, max: 75, step: 0.5, default: 65, unit: '°C' },
}

export interface BoilingHouseResult {
  supersaturationProfile: { time: number; ss: number; phase: string }[]
  crystalYield: number
  massecuiteDensity: number
  motherLiquorPurity: number
  qualityIndicators: {
    label: string
    value: number
    unit: string
    status: 'good' | 'warning' | 'poor'
  }[]
  yieldBreakdown: { name: string; value: number }[]
  referenceMill: string
}

export function calculateBoilingHouse(
  feedBrix: number,
  feedPurity: number,
  targetCrystalSize: number,
  vacuumPanTemp: number,
): BoilingHouseResult {
  // Supersaturation coefficient (Hugot): SS depends on temp, brix, purity
  // At 65°C, saturated brix for pure sucrose ≈ 77. For impure solutions, lower.
  const saturationBrix = 77 - (100 - feedPurity) * 0.35 - (vacuumPanTemp - 65) * 0.25
  const peakSS = feedBrix / saturationBrix

  // Supersaturation profile over a ~120 min pan cycle
  const supersaturationProfile: BoilingHouseResult['supersaturationProfile']  = []
  for (let t = 0; t <= 120; t += 5) {
    let ss: number
    let phase: string
    if (t <= 15) {
      // Concentration phase: SS rises
      phase = 'Concentration'
      ss = 1.0 + (peakSS - 1.0) * (t / 15)
    } else if (t <= 30) {
      // Seeding zone: SS peaks then dips slightly as crystals form
      phase = 'Seeding'
      ss = peakSS - (peakSS - 1.0) * 0.15 * ((t - 15) / 15)
    } else if (t <= 90) {
      // Crystal growth: SS gradually decreases as sugar deposits
      phase = 'Growth'
      const growthProgress = (t - 30) / 60
      ss = peakSS * (1 - 0.15) - growthProgress * (peakSS * 0.35)
    } else {
      // Tightening: final concentration, SS drops to near saturation
      phase = 'Tightening'
      const tightenProgress = (t - 90) / 30
      const ssAt90 = peakSS * (1 - 0.15) - 1.0 * (peakSS * 0.35)
      ss = ssAt90 - tightenProgress * (ssAt90 - 1.02)
    }
    supersaturationProfile.push({ time: t, ss: Math.round(ss * 1000) / 1000, phase })
  }

  // Crystal yield: higher purity → better yield; larger crystals → slightly lower yield
  const purityFactor = (feedPurity - 78) / (92 - 78) // 0..1
  const sizePenalty = (targetCrystalSize - 0.3) / (1.2 - 0.3) * 5 // 0..5% penalty
  const baseYield = 42 + purityFactor * 18 // 42-60% range
  const crystalYield = Math.round((baseYield - sizePenalty + (peakSS - 1) * 8) * 100) / 100

  // Massecuite density (kg/m³): ~1450-1500 depending on brix
  const massecuiteDensity = Math.round(1380 + feedBrix * 1.6)

  // Mother liquor purity drops from feed purity
  const motherLiquorPurity = Math.round((feedPurity - 12 - purityFactor * 6) * 100) / 100

  // Quality indicators
  const qualityIndicators: BoilingHouseResult['qualityIndicators'] = [
    {
      label: 'Crystal CV',
      value: Math.round(Math.max(18, 25 + (targetCrystalSize - 0.6) * 15 + (1 - purityFactor) * 8) * 10) / 10,
      unit: '%',
      status: targetCrystalSize >= 0.5 && targetCrystalSize <= 0.8 ? 'good' : 'warning',
    },
    {
      label: 'Color (ICUMSA)',
      value: Math.round(150 - purityFactor * 80 + (vacuumPanTemp - 65) * 5),
      unit: 'IU',
      status: feedPurity > 85 ? 'good' : feedPurity > 82 ? 'warning' : 'poor',
    },
    {
      label: 'Grain Count',
      value: Math.round(1200 / (targetCrystalSize * targetCrystalSize) * (0.8 + purityFactor * 0.4)),
      unit: '/g',
      status: 'good',
    },
    {
      label: 'Pan Time',
      value: Math.round(90 + targetCrystalSize * 40 - (vacuumPanTemp - 60) * 2),
      unit: 'min',
      status: vacuumPanTemp >= 63 && vacuumPanTemp <= 70 ? 'good' : 'warning',
    },
  ]

  const yieldBreakdown = [
    { name: 'A-Sugar', value: Math.round(crystalYield * 0.65 * 10) / 10 },
    { name: 'B-Sugar', value: Math.round(crystalYield * 0.22 * 10) / 10 },
    { name: 'C-Sugar', value: Math.round(crystalYield * 0.13 * 10) / 10 },
  ]

  const mills = ['Sezela', 'Komati', 'Malelane', 'Noodsberg', 'Pongola']
  const referenceMill = mills[Math.floor((feedBrix - 60) / 3) % mills.length]

  return {
    supersaturationProfile,
    crystalYield,
    massecuiteDensity,
    motherLiquorPurity,
    qualityIndicators,
    yieldBreakdown,
    referenceMill,
  }
}

// ===== 2. SUCROSE LOSS PROCESS FLOW =====

export interface ProcessStage {
  id: string
  name: string
  icon: string
  minLoss: number
  maxLoss: number
  defaultLoss: number
  unit: string
  description: string
}

export const processStages: ProcessStage[] = [
  { id: 'extraction', name: 'Extraction', icon: '⚙️', minLoss: 1.5, maxLoss: 3.0, defaultLoss: 2.0, unit: '%', description: 'Milling tandem efficiency' },
  { id: 'clarification', name: 'Clarification', icon: '🧪', minLoss: 0.3, maxLoss: 0.8, defaultLoss: 0.5, unit: '%', description: 'Mud & filter cake losses' },
  { id: 'evaporation', name: 'Evaporation', icon: '♨️', minLoss: 0.1, maxLoss: 0.3, defaultLoss: 0.15, unit: '%', description: 'Entrainment & degradation' },
  { id: 'crystallization', name: 'Crystallization', icon: '💎', minLoss: 0.5, maxLoss: 1.5, defaultLoss: 0.9, unit: '%', description: 'Final molasses sucrose' },
  { id: 'centrifugation', name: 'Centrifugation', icon: '🔄', minLoss: 0.2, maxLoss: 0.5, defaultLoss: 0.3, unit: '%', description: 'Wash water dilution' },
  { id: 'drying', name: 'Drying/Handling', icon: '📦', minLoss: 0.1, maxLoss: 0.3, defaultLoss: 0.15, unit: '%', description: 'Mechanical & storage' },
]

export interface SucroseLossResult {
  totalLoss: number
  overallRecovery: number
  sucroseTracking: { stage: string; sucrose: number; loss: number; cumLoss: number }[]
  lossBreakdown: { name: string; loss: number; fill: string }[]
  benchmarkComparison: { metric: string; current: number; benchmark: number; unit: string }[]
}

const stageColors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#3b82f6', '#6b7280']

export function calculateSucroseLoss(losses: Record<string, number>): SucroseLossResult {
  const initialSucrose = 100 // normalized to 100 units
  let remaining = initialSucrose
  let totalLoss = 0
  const sucroseTracking: SucroseLossResult['sucroseTracking'] = []
  const lossBreakdown: SucroseLossResult['lossBreakdown'] = []

  // Add initial point
  sucroseTracking.push({ stage: 'Cane In', sucrose: 100, loss: 0, cumLoss: 0 })

  processStages.forEach((stage, i) => {
    const loss = losses[stage.id] ?? stage.defaultLoss
    const sucroseThisStage = remaining * (loss / 100)
    remaining -= sucroseThisStage
    totalLoss += sucroseThisStage

    sucroseTracking.push({
      stage: stage.name,
      sucrose: Math.round(remaining * 100) / 100,
      loss: Math.round(sucroseThisStage * 100) / 100,
      cumLoss: Math.round(totalLoss * 100) / 100,
    })

    lossBreakdown.push({
      name: stage.name,
      loss: Math.round(sucroseThisStage * 100) / 100,
      fill: stageColors[i],
    })
  })

  const overallRecovery = Math.round(remaining * 100) / 100

  // SASTA benchmark comparison
  const benchmarkComparison = [
    { metric: 'Overall Recovery', current: overallRecovery, benchmark: 96.1, unit: '%' },
    { metric: 'Total Loss', current: Math.round(totalLoss * 100) / 100, benchmark: 3.9, unit: '%' },
    { metric: 'Extraction Loss', current: losses['extraction'] ?? 2.0, benchmark: 1.8, unit: '%' },
    { metric: 'Molasses Loss', current: losses['crystallization'] ?? 0.9, benchmark: 0.8, unit: '%' },
  ]

  return { totalLoss: Math.round(totalLoss * 100) / 100, overallRecovery, sucroseTracking, lossBreakdown, benchmarkComparison }
}

// ===== 3. CTS RV PREDICTION =====

export const rvSliders: Record<string, SliderConfig> = {
  brix: { label: 'Brix', min: 18, max: 24, step: 0.1, default: 21.4, unit: '°Bx' },
  pol: { label: 'Pol', min: 14, max: 20, step: 0.1, default: 18.2, unit: '%' },
  fibre: { label: 'Fibre', min: 11, max: 17, step: 0.1, default: 13.8, unit: '%' },
}

export interface RVPredictionResult {
  predictedRV: number
  purity: number
  sensitivityData: { variable: number; rv: number }[]
  sweepVariable: string
  comparisonData: { id: string; actualRV: number; predictedRV: number; error: number }[]
  modelStats: { metric: string; value: string }[]
}

// SASA RV formula coefficients fitted to ctsSampleData
const RV_COEFF_A = 0.9100
const RV_COEFF_B = 0.4200

function predictRV(brix: number, pol: number, fibre: number): number {
  return RV_COEFF_A * pol * (100 - fibre) / 100 - RV_COEFF_B * (brix - pol)
}

export function calculateRVPrediction(
  brix: number,
  pol: number,
  fibre: number,
  sweepVar: 'brix' | 'pol' | 'fibre' = 'pol',
): RVPredictionResult {
  const predictedRV = Math.round(predictRV(brix, pol, fibre) * 100) / 100
  const purity = Math.round((pol / brix) * 10000) / 100

  // Sensitivity sweep: vary one variable while holding others constant
  const sensitivityData: RVPredictionResult['sensitivityData'] = []
  const config = rvSliders[sweepVar]
  for (let v = config.min; v <= config.max; v += config.step) {
    const rv = sweepVar === 'brix'
      ? predictRV(v, pol, fibre)
      : sweepVar === 'pol'
        ? predictRV(brix, v, fibre)
        : predictRV(brix, pol, v)
    sensitivityData.push({
      variable: Math.round(v * 10) / 10,
      rv: Math.round(rv * 100) / 100,
    })
  }

  // Compare against existing CTS samples
  const comparisonData = ctsSampleData.map(s => {
    const pred = predictRV(s.brix, s.pol, s.fibre)
    return {
      id: s.id,
      actualRV: s.rv,
      predictedRV: Math.round(pred * 100) / 100,
      error: Math.round(Math.abs(pred - s.rv) * 100) / 100,
    }
  })

  const errors = comparisonData.map(c => c.error)
  const mae = errors.reduce((s, e) => s + e, 0) / errors.length
  const rmse = Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / errors.length)
  const maxErr = Math.max(...errors)

  const modelStats = [
    { metric: 'MAE', value: mae.toFixed(3) },
    { metric: 'RMSE', value: rmse.toFixed(3) },
    { metric: 'Max Error', value: maxErr.toFixed(3) },
    { metric: 'Samples', value: String(ctsSampleData.length) },
  ]

  return { predictedRV, purity, sensitivityData, sweepVariable: sweepVar, comparisonData, modelStats }
}

// ===== 4. ENERGY BALANCE OPTIMIZER =====

export const energySliders: Record<string, SliderConfig> = {
  fibrePct: { label: 'Fibre Content', min: 12, max: 18, step: 0.5, default: 14.5, unit: '%' },
  bagasseMoisture: { label: 'Bagasse Moisture', min: 45, max: 52, step: 0.5, default: 48, unit: '%' },
  boilerEfficiency: { label: 'Boiler Efficiency', min: 60, max: 80, step: 1, default: 68, unit: '%' },
  caneThroughput: { label: 'Cane Throughput', min: 100, max: 300, step: 10, default: 200, unit: 't/hr' },
}

export interface EnergyBalanceResult {
  bagasseProduced: number       // t/hr
  calorificValue: number        // kJ/kg
  steamGenerated: number        // t/hr
  processSteamDemand: number    // t/hr
  electricityGenerated: number  // MW
  processElectricDemand: number // MW
  exportPotential: number       // MW
  energySurplus: number         // GJ/hr
  energyFlowData: { name: string; input: number; output: number }[]
  summaryStats: { label: string; value: number; unit: string; color: string }[]
}

export function calculateEnergyBalance(
  fibrePct: number,
  bagasseMoisture: number,
  boilerEfficiency: number,
  caneThroughput: number,
): EnergyBalanceResult {
  // Bagasse production: ~28-30% of cane weight is bagasse; fibre content determines it
  // Bagasse ≈ 2 × fibre (approximately, as bagasse = fibre + moisture + dissolved solids)
  const bagasseProduced = Math.round(caneThroughput * (fibrePct / 100) * 2 * 10) / 10

  // Net Calorific Value of wet bagasse (Hugot standard):
  // NCV = 19,256 × (1 - w) - 2,511 × w  (kJ/kg, w = fractional moisture)
  // At 48% moisture → ~8,808 kJ/kg (correct range: 7,500–9,500 kJ/kg)
  const w = bagasseMoisture / 100
  const calorificValue = Math.round(19256 * (1 - w) - 2511 * w)

  // Steam generation: boiler converts bagasse energy to steam
  // Steam enthalpy ≈ 2800 kJ/kg (at typical mill conditions, ~20 bar)
  const steamEnthalpy = 2800
  const totalEnergy = bagasseProduced * 1000 * calorificValue // kJ/hr
  const steamGenerated = Math.round((totalEnergy * boilerEfficiency / 100) / steamEnthalpy / 1000 * 10) / 10

  // Process steam demand: ~450-550 kg steam per tonne cane
  const specificSteamDemand = 500 // kg/t cane
  const processSteamDemand = Math.round(caneThroughput * specificSteamDemand / 1000 * 10) / 10

  // Electricity: turbine converts ~80-100 kWh per tonne steam (back-pressure turbine)
  const kwhPerTonneSteam = 90
  const electricityGenerated = Math.round(steamGenerated * kwhPerTonneSteam / 1000 * 100) / 100

  // Process electric demand: ~25-30 kWh per tonne cane
  const kwhPerTonneCane = 28
  const processElectricDemand = Math.round(caneThroughput * kwhPerTonneCane / 1000 * 100) / 100

  const exportPotential = Math.round((electricityGenerated - processElectricDemand) * 100) / 100

  // Energy surplus in GJ/hr
  const surplusSteam = steamGenerated - processSteamDemand
  const energySurplus = Math.round(surplusSteam * steamEnthalpy / 1_000_000 * 100) / 100

  const energyFlowData = [
    { name: 'Bagasse Energy', input: Math.round(totalEnergy / 1_000_000), output: 0 },
    { name: 'Boiler Losses', input: 0, output: Math.round(totalEnergy * (1 - boilerEfficiency / 100) / 1_000_000) },
    { name: 'Steam Output', input: Math.round(steamGenerated * steamEnthalpy / 1_000_000), output: 0 },
    { name: 'Process Heat', input: 0, output: Math.round(processSteamDemand * steamEnthalpy / 1_000_000) },
    { name: 'Power Gen', input: Math.round(electricityGenerated * 3.6), output: 0 },
    { name: 'Process Power', input: 0, output: Math.round(processElectricDemand * 3.6) },
  ]

  const summaryStats = [
    { label: 'Bagasse', value: bagasseProduced, unit: 't/hr', color: 'text-orange-400' },
    { label: 'Steam', value: steamGenerated, unit: 't/hr', color: 'text-blue-400' },
    { label: 'Power Gen', value: electricityGenerated, unit: 'MW', color: 'text-yellow-400' },
    { label: 'Export', value: Math.max(0, exportPotential), unit: 'MW', color: exportPotential > 0 ? 'text-green-400' : 'text-red-400' },
  ]

  return {
    bagasseProduced,
    calorificValue,
    steamGenerated,
    processSteamDemand,
    electricityGenerated,
    processElectricDemand,
    exportPotential,
    energySurplus,
    energyFlowData,
    summaryStats,
  }
}

// ===== 5. CRYSTAL GROWTH VISUALIZER =====

export const crystalSliders: Record<string, SliderConfig> = {
  supersaturation: { label: 'Supersaturation', min: 1.05, max: 1.40, step: 0.01, default: 1.20, unit: 'SS' },
  temperature: { label: 'Temperature', min: 60, max: 80, step: 0.5, default: 70, unit: '°C' },
  purity: { label: 'Solution Purity', min: 75, max: 95, step: 0.5, default: 85, unit: '%' },
}

export interface CrystalGrowthResult {
  growthRate: number         // μm/min
  growthOverTime: { time: number; size: number }[]
  sizeDistribution: { size: number; frequency: number }[]
  qualityMetrics: { metric: string; value: number; fullMark: number }[]
  summaryStats: { label: string; value: string; description: string }[]
}

export function calculateCrystalGrowth(
  supersaturation: number,
  temperature: number,
  purity: number,
): CrystalGrowthResult {
  // Crystal growth rate: G = k * (SS - 1)^n * exp(-Ea / RT) * purity_factor
  // k = 120 μm/min (empirical), n = 1.5, Ea/R ≈ 4000 K
  const k = 120
  const n = 1.5
  const EaOverR = 4000
  const T = temperature + 273.15 // Kelvin
  const purityFactor = (purity / 100) * (1 + (purity - 75) / 100) // impurities slow growth
  const growthRate = k * Math.pow(supersaturation - 1, n) * Math.exp(-EaOverR / T) * purityFactor

  // Growth over time (120 min pan cycle)
  const growthOverTime: CrystalGrowthResult['growthOverTime'] = []
  let currentSize = 50 // initial seed size in μm
  for (let t = 0; t <= 120; t += 5) {
    growthOverTime.push({
      time: t,
      size: Math.round(currentSize),
    })
    // Size grows, but rate slows as crystal gets larger (surface-to-volume ratio decreases)
    const sizeFactor = Math.max(0.3, 1 - (currentSize - 50) / 1500)
    currentSize += growthRate * 5 * sizeFactor
  }

  // Crystal size distribution (normal distribution around final size)
  const finalSize = currentSize
  const cv = 25 + (1 - purityFactor) * 15 + (supersaturation > 1.3 ? 10 : 0) // CV%
  const sigma = finalSize * (cv / 100)
  const sizeDistribution: CrystalGrowthResult['sizeDistribution'] = []
  const distStep = Math.max(1, sigma / 5)
  for (let s = Math.max(0, finalSize - 4 * sigma); s <= finalSize + 4 * sigma; s += distStep) {
    const z = (s - finalSize) / sigma
    const freq = Math.exp(-0.5 * z * z)
    sizeDistribution.push({
      size: Math.round(s),
      frequency: Math.round(freq * 100) / 100,
    })
  }

  // Crystal quality metrics for radar chart
  const meanAperture = Math.round(finalSize) // μm
  const icumsa = Math.round(Math.max(30, 200 - purity * 1.8 - (temperature - 60) * 0.5))
  const uniformity = Math.round(Math.max(40, 100 - cv))
  const filterability = Math.round(Math.min(100, purity * 0.9 + (100 - cv) * 0.3))
  const dissolutionRate = Math.round(Math.min(100, 50 + (1000 / Math.max(100, finalSize)) * 30 + purity * 0.2))

  const qualityMetrics = [
    { metric: 'Uniformity', value: uniformity, fullMark: 100 },
    { metric: 'Color (ICUMSA)', value: Math.round(Math.max(0, 100 - icumsa / 2)), fullMark: 100 },
    { metric: 'Filterability', value: filterability, fullMark: 100 },
    { metric: 'Dissolution', value: dissolutionRate, fullMark: 100 },
    { metric: 'Crystal Size', value: Math.round(Math.min(100, meanAperture / 10)), fullMark: 100 },
    { metric: 'Growth Rate', value: Math.round(Math.min(100, growthRate * 10)), fullMark: 100 },
  ]

  const summaryStats = [
    { label: 'Growth Rate', value: `${growthRate.toFixed(2)} μm/min`, description: 'Linear crystal growth' },
    { label: 'Final MA', value: `${meanAperture} μm`, description: 'Mean aperture at 120 min' },
    { label: 'CV', value: `${cv.toFixed(1)}%`, description: 'Size distribution spread' },
    { label: 'ICUMSA Color', value: `${icumsa} IU`, description: 'Crystal color index' },
  ]

  return {
    growthRate: Math.round(growthRate * 100) / 100,
    growthOverTime,
    sizeDistribution,
    qualityMetrics,
    summaryStats,
  }
}

// ===== 4b. ENERGY BALANCE — OPTIMIZATION LEVERS =====

export interface OptimizationLever {
  parameter: string
  current: string
  impact: string
  action: string
  impactValue: number
}

export interface OptimizedComparison {
  currentExport: number
  optimizedExport: number
  deltaPercent: number
  optimizedParams: { label: string; current: number; optimized: number; unit: string }[]
}

export function calculateOptimizationLevers(
  fibrePct: number,
  bagasseMoisture: number,
  boilerEfficiency: number,
  caneThroughput: number,
): OptimizationLever[] {
  const base = calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput)

  // Compute partial derivatives via finite differences
  const moistureDelta = calculateEnergyBalance(fibrePct, bagasseMoisture - 1, boilerEfficiency, caneThroughput).exportPotential - base.exportPotential
  const boilerDelta = calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency + 1, caneThroughput).exportPotential - base.exportPotential
  const fibreDelta = calculateEnergyBalance(fibrePct + 1, bagasseMoisture, boilerEfficiency, caneThroughput).exportPotential - base.exportPotential
  const throughputDelta = calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput + 10).exportPotential - base.exportPotential

  const levers: OptimizationLever[] = [
    { parameter: 'Bagasse Moisture', current: `${bagasseMoisture}%`, impact: `+${moistureDelta.toFixed(2)} MW per 1%↓`, action: 'Reduce moisture (press maintenance)', impactValue: Math.abs(moistureDelta) },
    { parameter: 'Boiler Efficiency', current: `${boilerEfficiency}%`, impact: `+${boilerDelta.toFixed(2)} MW per 1%↑`, action: 'Upgrade to high-pressure boiler', impactValue: Math.abs(boilerDelta) },
    { parameter: 'Fibre Content', current: `${fibrePct}%`, impact: `+${fibreDelta.toFixed(2)} MW per 1%↑`, action: 'Cane variety selection', impactValue: Math.abs(fibreDelta) },
    { parameter: 'Cane Throughput', current: `${caneThroughput} t/h`, impact: `+${throughputDelta.toFixed(2)} MW per 10t↑`, action: 'Increase crushing rate', impactValue: Math.abs(throughputDelta) },
  ]

  return levers.sort((a, b) => b.impactValue - a.impactValue)
}

export function calculateOptimizedComparison(
  fibrePct: number,
  bagasseMoisture: number,
  boilerEfficiency: number,
  caneThroughput: number,
): OptimizedComparison {
  const current = calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput)
  // Optimized scenario: moisture 46%, boiler 75%
  const optMoisture = Math.min(bagasseMoisture, 46)
  const optBoiler = Math.max(boilerEfficiency, 75)
  const optimized = calculateEnergyBalance(fibrePct, optMoisture, optBoiler, caneThroughput)

  const delta = current.exportPotential !== 0
    ? ((optimized.exportPotential - current.exportPotential) / Math.abs(current.exportPotential)) * 100
    : optimized.exportPotential > 0 ? 100 : 0

  return {
    currentExport: current.exportPotential,
    optimizedExport: optimized.exportPotential,
    deltaPercent: Math.round(delta),
    optimizedParams: [
      { label: 'Bagasse Moisture', current: bagasseMoisture, optimized: optMoisture, unit: '%' },
      { label: 'Boiler Efficiency', current: boilerEfficiency, optimized: optBoiler, unit: '%' },
    ],
  }
}

export interface EnergyFlowNode {
  label: string
  value: number // GJ/hr
  color: string
}

export function calculateEnergyFlowDiagram(
  fibrePct: number,
  bagasseMoisture: number,
  boilerEfficiency: number,
  caneThroughput: number,
): { nodes: EnergyFlowNode[]; exportPositive: boolean } {
  const r = calculateEnergyBalance(fibrePct, bagasseMoisture, boilerEfficiency, caneThroughput)
  const bagasseEnergy = r.bagasseProduced * r.calorificValue / 1000 // GJ/hr
  const steamEnergy = r.steamGenerated * 2800 / 1000 // GJ/hr
  const boilerLoss = bagasseEnergy - steamEnergy
  const processHeat = r.processSteamDemand * 2800 / 1000
  const turbineInput = steamEnergy - processHeat
  const millPower = r.processElectricDemand * 3.6
  const gridExport = r.exportPotential * 3.6

  return {
    nodes: [
      { label: 'Bagasse', value: Math.round(bagasseEnergy * 10) / 10, color: '#f97316' },
      { label: 'Boiler Loss', value: Math.round(boilerLoss * 10) / 10, color: '#64748b' },
      { label: 'Steam', value: Math.round(steamEnergy * 10) / 10, color: '#3b82f6' },
      { label: 'Process Heat', value: Math.round(processHeat * 10) / 10, color: '#eab308' },
      { label: 'Turbine', value: Math.round(turbineInput * 10) / 10, color: '#a855f7' },
      { label: 'Mill Power', value: Math.round(millPower * 10) / 10, color: '#6366f1' },
      { label: 'Grid Export', value: Math.round(Math.abs(gridExport) * 10) / 10, color: r.exportPotential > 0 ? '#22c55e' : '#ef4444' },
    ],
    exportPositive: r.exportPotential > 0,
  }
}

// ===== 6. DATA ANALYSER — CSV PARSING & ANALYSIS =====

export interface ParsedSample {
  id: string
  brix: number
  pol: number
  fibre: number
  rv?: number
  lab?: string
  grower?: string
  date?: string
  area?: string
  testingType?: string
}

export interface ParseResult {
  data: ParsedSample[]
  warnings: string[]
  hasActualRV: boolean
}

export function parseCSVData(text: string): ParseResult {
  const warnings: string[] = []
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) {
    return { data: [], warnings: ['CSV must have a header row and at least one data row'], hasActualRV: false }
  }

  const header = lines[0].toLowerCase().split(',').map(h => h.trim())

  // Flexible column matching
  const colMap: Record<string, number> = {}
  const matchers: Record<string, RegExp> = {
    id: /^(id|sample|sample_id|sampleid|name)$/,
    brix: /^(brix|bx|degrees_brix)$/,
    pol: /^(pol|polarization|pol%)$/,
    fibre: /^(fibre|fiber|fibre%)$/,
    rv: /^(rv|recoverable_value|recoverable)$/,
    lab: /^(lab|laboratory|cts_lab|lab_name)$/,
    grower: /^(grower|grower_id|grower_name|farmer)$/,
    date: /^(date|sample_date|test_date|datetime)$/,
    area: /^(area|region|supply_area|district)$/,
    testingType: /^(testing_type|test_type|type|analysis_type)$/,
  }

  header.forEach((h, i) => {
    for (const [key, re] of Object.entries(matchers)) {
      if (re.test(h) && colMap[key] === undefined) colMap[key] = i
    }
  })

  if (colMap.brix === undefined || colMap.pol === undefined || colMap.fibre === undefined) {
    return { data: [], warnings: ['CSV must contain brix, pol, and fibre columns'], hasActualRV: false }
  }

  const hasActualRV = colMap.rv !== undefined
  const data: ParsedSample[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim())
    const brix = parseFloat(cols[colMap.brix])
    const pol = parseFloat(cols[colMap.pol])
    const fibre = parseFloat(cols[colMap.fibre])

    if (isNaN(brix) || isNaN(pol) || isNaN(fibre)) {
      warnings.push(`Row ${i + 1}: skipped (non-numeric brix/pol/fibre)`)
      continue
    }

    const sample: ParsedSample = {
      id: colMap.id !== undefined ? cols[colMap.id] || `R${i}` : `R${i}`,
      brix,
      pol,
      fibre,
    }

    if (hasActualRV) {
      const rv = parseFloat(cols[colMap.rv])
      if (!isNaN(rv)) sample.rv = rv
    }
    if (colMap.lab !== undefined && cols[colMap.lab]) sample.lab = cols[colMap.lab]
    if (colMap.grower !== undefined && cols[colMap.grower]) sample.grower = cols[colMap.grower]
    if (colMap.date !== undefined && cols[colMap.date]) sample.date = cols[colMap.date]
    if (colMap.area !== undefined && cols[colMap.area]) sample.area = cols[colMap.area]
    if (colMap.testingType !== undefined && cols[colMap.testingType]) sample.testingType = cols[colMap.testingType]

    data.push(sample)
  }

  if (data.length === 0) warnings.push('No valid data rows found')
  return { data, warnings, hasActualRV }
}

export interface DataAnalysis {
  sampleCount: number
  meanRV: number
  anomalyCount: number
  modelR2: number | null
  summaryStats: { label: string; value: string }[]
  distributions: { field: string; bins: { bin: string; count: number }[] }[]
  anomalies: number[] // row indices flagged
  predictions: { id: string; predicted: number; actual?: number; error?: number }[]
  insights: string[]
}

function buildHistogram(values: number[], bins: number = 8): { bin: string; count: number }[] {
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const binWidth = range / bins
  const result: { bin: string; count: number }[] = []
  for (let i = 0; i < bins; i++) {
    const lo = min + i * binWidth
    const hi = lo + binWidth
    const label = `${lo.toFixed(1)}`
    const count = values.filter(v => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length
    result.push({ bin: label, count })
  }
  return result
}

export function analyseUploadedData(data: ParsedSample[]): DataAnalysis {
  if (data.length === 0) {
    return { sampleCount: 0, meanRV: 0, anomalyCount: 0, modelR2: null, summaryStats: [], distributions: [], anomalies: [], predictions: [], insights: [] }
  }

  const brixVals = data.map(d => d.brix)
  const polVals = data.map(d => d.pol)
  const fibreVals = data.map(d => d.fibre)

  // Predict RV for all
  const predictions = data.map(d => {
    const pred = predictRV(d.brix, d.pol, d.fibre)
    const result: DataAnalysis['predictions'][number] = {
      id: d.id,
      predicted: Math.round(pred * 100) / 100,
    }
    if (d.rv !== undefined) {
      result.actual = d.rv
      result.error = Math.round(Math.abs(pred - d.rv) * 100) / 100
    }
    return result
  })

  const predictedRVs = predictions.map(p => p.predicted)
  const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length
  const stdDev = (arr: number[]) => {
    const m = mean(arr)
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length)
  }

  const meanRV = Math.round(mean(predictedRVs) * 100) / 100

  // Anomaly detection: >2σ from mean for any of brix, pol, fibre
  const stats = { brix: { m: mean(brixVals), s: stdDev(brixVals) }, pol: { m: mean(polVals), s: stdDev(polVals) }, fibre: { m: mean(fibreVals), s: stdDev(fibreVals) } }
  const anomalies: number[] = []
  data.forEach((d, i) => {
    const bOutlier = stats.brix.s > 0 && Math.abs(d.brix - stats.brix.m) > 2 * stats.brix.s
    const pOutlier = stats.pol.s > 0 && Math.abs(d.pol - stats.pol.m) > 2 * stats.pol.s
    const fOutlier = stats.fibre.s > 0 && Math.abs(d.fibre - stats.fibre.m) > 2 * stats.fibre.s
    if (bOutlier || pOutlier || fOutlier) anomalies.push(i)
  })

  // R² if actual RV present
  let modelR2: number | null = null
  const actuals = data.filter(d => d.rv !== undefined).map(d => d.rv!)
  if (actuals.length >= 3) {
    const preds = data.filter(d => d.rv !== undefined).map(d => predictRV(d.brix, d.pol, d.fibre))
    const meanActual = mean(actuals)
    const ssTot = actuals.reduce((s, v) => s + (v - meanActual) ** 2, 0)
    const ssRes = actuals.reduce((s, v, i) => s + (v - preds[i]) ** 2, 0)
    modelR2 = ssTot > 0 ? Math.round((1 - ssRes / ssTot) * 10000) / 10000 : 1
  }

  // Build distributions
  const distributions = [
    { field: 'Brix', bins: buildHistogram(brixVals) },
    { field: 'Pol', bins: buildHistogram(polVals) },
    { field: 'Fibre', bins: buildHistogram(fibreVals) },
    { field: 'Predicted RV', bins: buildHistogram(predictedRVs) },
  ]

  // Summary stats
  const summaryStats = [
    { label: 'Samples', value: String(data.length) },
    { label: 'Mean RV', value: meanRV.toFixed(2) },
    { label: 'Anomalies', value: String(anomalies.length) },
    { label: 'Model R²', value: modelR2 !== null ? modelR2.toFixed(4) : 'N/A' },
  ]

  // AI Insights — compare against CTS benchmark
  const benchmarks = {
    brix: mean(ctsSampleData.map(s => s.brix)),
    pol: mean(ctsSampleData.map(s => s.pol)),
    fibre: mean(ctsSampleData.map(s => s.fibre)),
    rv: mean(ctsSampleData.map(s => s.rv)),
  }

  const insights: string[] = []
  const uploadMeanBrix = mean(brixVals)
  const uploadMeanPol = mean(polVals)
  const uploadMeanFibre = mean(fibreVals)

  if (Math.abs(uploadMeanBrix - benchmarks.brix) > 0.3) {
    insights.push(`Your mean Brix (${uploadMeanBrix.toFixed(1)}) is ${uploadMeanBrix > benchmarks.brix ? 'above' : 'below'} the CTS benchmark (${benchmarks.brix.toFixed(1)}) by ${Math.abs(uploadMeanBrix - benchmarks.brix).toFixed(1)} points`)
  }
  if (Math.abs(uploadMeanPol - benchmarks.pol) > 0.3) {
    insights.push(`Your mean Pol (${uploadMeanPol.toFixed(1)}) is ${uploadMeanPol > benchmarks.pol ? 'above' : 'below'} the CTS benchmark (${benchmarks.pol.toFixed(1)}) by ${Math.abs(uploadMeanPol - benchmarks.pol).toFixed(1)} points`)
  }
  if (Math.abs(uploadMeanFibre - benchmarks.fibre) > 0.3) {
    insights.push(`Your mean Fibre (${uploadMeanFibre.toFixed(1)}%) is ${uploadMeanFibre > benchmarks.fibre ? 'above' : 'below'} the CTS benchmark (${benchmarks.fibre.toFixed(1)}%) by ${Math.abs(uploadMeanFibre - benchmarks.fibre).toFixed(1)} points`)
  }
  if (Math.abs(meanRV - benchmarks.rv) > 0.3) {
    insights.push(`Your mean predicted RV (${meanRV.toFixed(2)}) is ${meanRV > benchmarks.rv ? 'above' : 'below'} the CTS benchmark (${benchmarks.rv.toFixed(2)})`)
  }
  if (anomalies.length > 0) {
    insights.push(`${anomalies.length} sample${anomalies.length > 1 ? 's' : ''} flagged as anomalies (>2σ from mean) — review highlighted rows`)
  }
  if (insights.length === 0) {
    insights.push('Your data aligns closely with the CTS benchmark — no significant deviations detected')
  }

  return { sampleCount: data.length, meanRV, anomalyCount: anomalies.length, modelR2, summaryStats, distributions, anomalies, predictions, insights }
}

// ===== 7. MOLASSES EXHAUSTION SIMULATOR =====

export const molassesSliders: Record<string, SliderConfig> = {
  feedPurity: { label: 'Feed Syrup Purity', min: 78, max: 92, step: 0.5, default: 85, unit: '%' },
  targetMolassesPurity: { label: 'Target Final Mol. Purity', min: 28, max: 40, step: 0.5, default: 34, unit: '%' },
  nswr: { label: 'Non-Sucrose/Water Ratio', min: 0.8, max: 1.5, step: 0.05, default: 1.0, unit: '' },
  caneThroughputMol: { label: 'Cane Throughput', min: 100, max: 300, step: 10, default: 200, unit: 't/hr' },
}

export interface MolassesExhaustionResult {
  strikes: number
  purityWaterfall: { stage: string; purity: number; drop: number }[]
  overallRecovery: number
  molassesSugarLoss: number // t/hr
  revenueImpact: number    // R/hr
  recoveryVsPurity: { targetPurity: number; recovery: number }[]
  strikeComparison: {
    strikes: number
    finalPurity: number
    recovery: number
    molassesLoss: number
    revenueImpact: number
  }[]
}

export function calculateMolassesExhaustion(
  feedPurity: number,
  targetMolassesPurity: number,
  nswr: number,
  caneThroughput: number,
): MolassesExhaustionResult {
  // SJM-based purity drop model per strike
  // Each strike drops purity by an amount that depends on current purity and NS/W ratio
  // Higher NS/W means less effective exhaustion per strike
  function purityAfterStrike(currentPurity: number): number {
    const dropFactor = (currentPurity / 100) * (0.35 / nswr)
    return currentPurity * (1 - dropFactor)
  }

  // Determine strikes needed based on target
  const maxStrikes = 3
  let finalPurity3 = feedPurity
  const purities3: number[] = [feedPurity]
  for (let i = 0; i < 3; i++) {
    finalPurity3 = purityAfterStrike(finalPurity3)
    purities3.push(Math.round(finalPurity3 * 100) / 100)
  }

  let finalPurity2 = feedPurity
  const purities2: number[] = [feedPurity]
  for (let i = 0; i < 2; i++) {
    finalPurity2 = purityAfterStrike(finalPurity2)
    purities2.push(Math.round(finalPurity2 * 100) / 100)
  }

  // Use the strike count that can achieve target or closest
  const use3 = purities3[3] <= targetMolassesPurity || targetMolassesPurity < purities2[2]
  const strikes = use3 ? 3 : 2
  const purities = use3 ? purities3 : purities2

  const stageNames = ['Syrup', 'A-Molasses', 'B-Molasses', 'C-Molasses']
  const purityWaterfall = purities.map((p, i) => ({
    stage: stageNames[i],
    purity: p,
    drop: i > 0 ? Math.round((purities[i - 1] - p) * 100) / 100 : 0,
  }))

  // Recovery = (feedPurity - finalMolassesPurity) / feedPurity * 100 * exhaustion factor
  const finalP = purities[purities.length - 1]
  const overallRecovery = Math.round(((feedPurity - finalP) / feedPurity) * 100 * 100) / 100

  // Molasses sugar loss: sucrose in cane ~13%, mol purity portion
  const sucroseInCane = caneThroughput * 0.13 // t/hr sucrose
  const molassesSugarLoss = Math.round(sucroseInCane * (1 - overallRecovery / 100) * 100) / 100

  // Revenue impact: sugar price ~R8,500/t
  const sugarPrice = 8500
  const revenueImpact = Math.round(molassesSugarLoss * sugarPrice)

  // Recovery vs target purity curve
  const recoveryVsPurity: MolassesExhaustionResult['recoveryVsPurity'] = []
  for (let tp = 28; tp <= 42; tp += 1) {
    const rec = ((feedPurity - tp) / feedPurity) * 100
    recoveryVsPurity.push({
      targetPurity: tp,
      recovery: Math.round(Math.max(0, rec) * 100) / 100,
    })
  }

  // 2-strike vs 3-strike comparison
  function calcForStrikes(n: number) {
    let p = feedPurity
    for (let i = 0; i < n; i++) p = purityAfterStrike(p)
    const rec = ((feedPurity - p) / feedPurity) * 100
    const loss = sucroseInCane * (1 - rec / 100)
    return {
      strikes: n,
      finalPurity: Math.round(p * 100) / 100,
      recovery: Math.round(rec * 100) / 100,
      molassesLoss: Math.round(loss * 100) / 100,
      revenueImpact: Math.round(loss * sugarPrice),
    }
  }

  const strikeComparison = [calcForStrikes(2), calcForStrikes(3)]

  return {
    strikes,
    purityWaterfall,
    overallRecovery,
    molassesSugarLoss,
    revenueImpact,
    recoveryVsPurity,
    strikeComparison,
  }
}
