// r7106-adapter.ts — Convert between V1 (R7106Record) and V2 (R7106ExtendedRecord) formats

import type { R7106Record } from './r7106-data'
import { MILL_NAMES } from './r7106-data'
import type { R7106ExtendedRecord } from './r7106-extended'
import { makeEmptyRecord } from './r7106-extended'

/**
 * Convert extended (V2) records to V1 format by mapping the 45 V1 fields.
 */
export function extendedToV1(records: R7106ExtendedRecord[]): R7106Record[] {
  return records.map((r) => ({
    mill: r.mill,
    millName: r.millName || MILL_NAMES[r.mill] || `Mill ${r.mill}`,
    week: r.week,
    tandem: r.tandem,
    // Cane
    caneTons: r.caneTons,
    polPercent: r.canePolPct,
    brixPercent: r.caneBrixPct,
    nonPolPercent: r.caneNonPolPct,
    fibrePercent: r.caneFibrePct,
    moisturePercent: r.caneMoisturePct,
    rvPercent: r.caneRvPct,
    sucrosePercent: r.caneSucrosePct,
    purityPercent: r.canePurity,
    // Mixed Juice
    mjTonsPercent: r.mjTonsPct,
    mjPolPercent: r.mjPolPct,
    mjBrixPercent: r.mjBrixPct,
    mjPurity: r.mjPolPurity,
    mjSucPurity: r.mjSucPurity,
    // Bagasse
    bagTonsPercent: r.bagTonsPct,
    bagPolPercent: r.bagPolPct,
    bagFibrePercent: r.bagFibrePct,
    bagMoisturePercent: r.bagMoisturePct,
    // Performance
    polExtraction: r.polExtraction,
    sucroseExtraction: r.sucroseExtraction,
    rvPolPercent: r.rvPolPct,
    crushRate: r.crushRate,
    fibreCrushRate: r.fibreCrushRate,
    // Time
    timeEfficiency: r.timeEfficiency,
    millingHoursPercent: r.millingHoursPct,
    mechStopPercent: r.mechStopPct,
    noCaneStopPercent: r.noCanePct,
    opStopPercent: r.opStopPct,
    // Environment
    weeklyRain: r.weeklyRain,
    ytdRain: r.ytdRain,
  }))
}

/**
 * Convert V1 records to extended (V2) format, filling missing fields with defaults.
 */
export function v1ToExtended(records: R7106Record[]): R7106ExtendedRecord[] {
  return records.map((r) => {
    const ext = makeEmptyRecord()

    // Identification
    ext.mill = r.mill
    ext.millName = r.millName || MILL_NAMES[r.mill] || `Mill ${r.mill}`
    ext.week = r.week
    ext.tandem = r.tandem
    // Cane
    ext.caneTons = r.caneTons
    ext.canePolPct = r.polPercent
    ext.caneBrixPct = r.brixPercent
    ext.caneNonPolPct = r.nonPolPercent
    ext.caneFibrePct = r.fibrePercent
    ext.caneMoisturePct = r.moisturePercent
    ext.caneRvPct = r.rvPercent
    ext.caneSucrosePct = r.sucrosePercent
    ext.canePurity = r.purityPercent
    // Mixed Juice
    ext.mjTonsPct = r.mjTonsPercent
    ext.mjPolPct = r.mjPolPercent
    ext.mjBrixPct = r.mjBrixPercent
    ext.mjPolPurity = r.mjPurity
    ext.mjSucPurity = r.mjSucPurity
    // Bagasse
    ext.bagTonsPct = r.bagTonsPercent
    ext.bagPolPct = r.bagPolPercent
    ext.bagFibrePct = r.bagFibrePercent
    ext.bagMoisturePct = r.bagMoisturePercent
    // Performance
    ext.polExtraction = r.polExtraction
    ext.sucroseExtraction = r.sucroseExtraction
    ext.rvPolPct = r.rvPolPercent
    ext.crushRate = r.crushRate
    ext.fibreCrushRate = r.fibreCrushRate
    // Time
    ext.timeEfficiency = r.timeEfficiency
    ext.millingHoursPct = r.millingHoursPercent
    ext.mechStopPct = r.mechStopPercent
    ext.noCanePct = r.noCaneStopPercent
    ext.opStopPct = r.opStopPercent
    // Environment
    ext.weeklyRain = r.weeklyRain
    ext.ytdRain = r.ytdRain

    return ext
  })
}
