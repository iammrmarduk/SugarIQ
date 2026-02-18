// r7106-extended.ts — Full 134-column R7106 interface, XLSX parser, and validation
import * as XLSX from 'xlsx'
import { MILL_NAMES } from './r7106-data'

// ── Extended Record Interface ──────────────────────────────────────────

export interface R7106ExtendedRecord {
  // Identification (4)
  mill: number
  millName: string
  week: number
  tandem: number

  // Cane (17)
  caneTons: number
  canePolTons: number
  canePolPct: number
  caneBrixTons: number
  caneBrixPct: number
  caneNonPolTons: number
  caneNonPolPct: number
  caneFibreTons: number
  caneFibrePct: number
  caneMoistureTons: number
  caneMoisturePct: number
  caneRvTons: number
  caneRvPct: number
  caneSucroseTons: number
  caneSucrosePct: number
  canePurity: number
  caneSucPurity: number

  // Mixed Juice (18)
  mjTons: number
  mjTonsPct: number
  mjPolTons: number
  mjPolPct: number
  mjSucroseTons: number
  mjSucrosePct: number
  mjBrixTons: number
  mjBrixPct: number
  mjNonPolTons: number
  mjNonPolPct: number
  mjNonSucTons: number
  mjNonSucPct: number
  mjInsSolidsTons: number
  mjInsSolidsPct: number
  mjPolPurity: number
  mjSucPurity: number
  mjSucPolRatio: number
  mjNonSucNonPolRatio: number

  // Bagasse (19)
  bagTons: number
  bagTonsPct: number
  bagPolTons: number
  bagPolPct: number
  bagSucroseTons: number
  bagSucrosePct: number
  bagBrixTons: number
  bagBrixPct: number
  bagNonPolTons: number
  bagNonPolPct: number
  bagNonSucTons: number
  bagNonSucPct: number
  bagFibreTons: number
  bagFibrePct: number
  bagMoistureTons: number
  bagMoisturePct: number
  bagPolPurity: number
  bagSucPurity: number
  bagSucPolRatio: number

  // Clarified Mud (17)
  mudTons: number
  mudTonsPct: number
  mudPolTons: number
  mudPolPct: number
  mudSucroseTons: number
  mudSucrosePct: number
  mudBrixTons: number
  mudBrixPct: number
  mudNonPolTons: number
  mudNonPolPct: number
  mudNonSucTons: number
  mudNonSucPct: number
  mudInsSolidsTons: number
  mudInsSolidsPct: number
  mudPolPurity: number
  mudSucPurity: number
  mudSucPolRatio: number

  // Imbibition Water (6)
  imbMassTons: number
  imbMassPct: number
  imbPolTons: number
  imbPolPct: number
  imbBrixTons: number
  imbBrixPct: number

  // DAC / Factors (18)
  dacCaneTons: number
  dacPolTons: number
  dacPolPct: number
  dacBrixTons: number
  dacBrixPct: number
  dacNonPolTons: number
  dacNonPolPct: number
  dacFibreTons: number
  dacFibrePct: number
  dacMoistureTons: number
  dacMoisturePct: number
  dacFactorPol: number
  dacFactorBrix: number
  dacFactorNonPol: number
  dacFactorFibre: number
  dacFactorMoisture: number
  dacPurity: number
  dacSucPurity: number

  // Time Account (19)
  timeEfficiency: number
  millingHours: number
  millingHoursPct: number
  mechStopHours: number
  mechStopPct: number
  noCaneHours: number
  noCanePct: number
  opStopHours: number
  opStopPct: number
  scheduledHours: number
  scheduledPct: number
  foreignMatterHours: number
  foreignMatterPct: number
  engineeringHours: number
  engineeringPct: number
  forceMajeureHours: number
  forceMajeurePct: number
  depitPlantHours: number
  depitPlantPct: number

  // Factor Diffs (7)
  diffBrixPol: number
  diffMjMb: number
  diffMbDac: number
  diffMjDacUnadj: number
  diffMjDacAdjImbMud: number
  diffMjDacAdjImb: number
  diffMjDacAdjMud: number

  // Performance (10)
  polExtraction: number
  sucroseExtraction: number
  rvPolPct: number
  crushRate: number
  fibreCrushRate: number
  imbPercentFibre: number
  polPercentFibreBag: number
  closingStock: number
  weeklyRain: number
  ytdRain: number
}

// ── Column Mapping (positional) ──────────────────────────────────────

/** Ordered list of R7106ExtendedRecord keys mapping column index → field.
 *  Index in this array = column index in the XLSX data rows. */
const COLUMN_MAP: (keyof R7106ExtendedRecord)[] = [
  // Identification (0-3)
  'mill', 'millName', 'week', 'tandem',
  // Cane (4-20)
  'caneTons', 'canePolTons', 'canePolPct', 'caneBrixTons', 'caneBrixPct',
  'caneNonPolTons', 'caneNonPolPct', 'caneFibreTons', 'caneFibrePct',
  'caneMoistureTons', 'caneMoisturePct', 'caneRvTons', 'caneRvPct',
  'caneSucroseTons', 'caneSucrosePct', 'canePurity', 'caneSucPurity',
  // Mixed Juice (21-38)
  'mjTons', 'mjTonsPct', 'mjPolTons', 'mjPolPct', 'mjSucroseTons', 'mjSucrosePct',
  'mjBrixTons', 'mjBrixPct', 'mjNonPolTons', 'mjNonPolPct', 'mjNonSucTons', 'mjNonSucPct',
  'mjInsSolidsTons', 'mjInsSolidsPct', 'mjPolPurity', 'mjSucPurity',
  'mjSucPolRatio', 'mjNonSucNonPolRatio',
  // Bagasse (39-57)
  'bagTons', 'bagTonsPct', 'bagPolTons', 'bagPolPct', 'bagSucroseTons', 'bagSucrosePct',
  'bagBrixTons', 'bagBrixPct', 'bagNonPolTons', 'bagNonPolPct', 'bagNonSucTons', 'bagNonSucPct',
  'bagFibreTons', 'bagFibrePct', 'bagMoistureTons', 'bagMoisturePct',
  'bagPolPurity', 'bagSucPurity', 'bagSucPolRatio',
  // Clarified Mud (58-74)
  'mudTons', 'mudTonsPct', 'mudPolTons', 'mudPolPct', 'mudSucroseTons', 'mudSucrosePct',
  'mudBrixTons', 'mudBrixPct', 'mudNonPolTons', 'mudNonPolPct', 'mudNonSucTons', 'mudNonSucPct',
  'mudInsSolidsTons', 'mudInsSolidsPct', 'mudPolPurity', 'mudSucPurity', 'mudSucPolRatio',
  // Imbibition Water (75-80)
  'imbMassTons', 'imbMassPct', 'imbPolTons', 'imbPolPct', 'imbBrixTons', 'imbBrixPct',
  // DAC / Factors (81-98)
  'dacCaneTons', 'dacPolTons', 'dacPolPct', 'dacBrixTons', 'dacBrixPct',
  'dacNonPolTons', 'dacNonPolPct', 'dacFibreTons', 'dacFibrePct',
  'dacMoistureTons', 'dacMoisturePct',
  'dacFactorPol', 'dacFactorBrix', 'dacFactorNonPol', 'dacFactorFibre', 'dacFactorMoisture',
  'dacPurity', 'dacSucPurity',
  // Time Account (99-117)
  'timeEfficiency',
  'millingHours', 'millingHoursPct',
  'mechStopHours', 'mechStopPct',
  'noCaneHours', 'noCanePct',
  'opStopHours', 'opStopPct',
  'scheduledHours', 'scheduledPct',
  'foreignMatterHours', 'foreignMatterPct',
  'engineeringHours', 'engineeringPct',
  'forceMajeureHours', 'forceMajeurePct',
  'depitPlantHours', 'depitPlantPct',
  // Factor Diffs (118-124)
  'diffBrixPol', 'diffMjMb', 'diffMbDac',
  'diffMjDacUnadj', 'diffMjDacAdjImbMud', 'diffMjDacAdjImb', 'diffMjDacAdjMud',
  // Performance (125-134)
  'polExtraction', 'sucroseExtraction', 'rvPolPct', 'crushRate', 'fibreCrushRate',
  'imbPercentFibre', 'polPercentFibreBag', 'closingStock', 'weeklyRain', 'ytdRain',
]

// String fields (all others are numeric)
const STRING_FIELDS = new Set<keyof R7106ExtendedRecord>(['millName'])

// ── XLSX Parser ──────────────────────────────────────────────────────

export interface ParseResult {
  records: R7106ExtendedRecord[]
  warnings: string[]
  checksum: DataChecksum
}

/**
 * Detect the first data row (skip header/section rows).
 * Heuristic: column 0 must be a number (mill code).
 */
function findDataStartRow(rows: unknown[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const cell0 = rows[i]?.[0]
    if (typeof cell0 === 'number' && cell0 >= 1 && cell0 <= 999) {
      return i
    }
  }
  return 0
}

/**
 * Try to detect a shorter column layout (original ~34 columns) and
 * map it to the extended format (filling missing fields with 0).
 */
function isShortFormat(colCount: number): boolean {
  return colCount < 50
}

/** Column map for the original short format (34 columns) */
const SHORT_COLUMN_MAP: { col: number; key: keyof R7106ExtendedRecord }[] = [
  { col: 0, key: 'mill' },
  { col: 1, key: 'millName' },
  { col: 2, key: 'week' },
  { col: 3, key: 'tandem' },
  { col: 4, key: 'caneTons' },
  { col: 5, key: 'canePolPct' },
  { col: 6, key: 'caneBrixPct' },
  { col: 7, key: 'caneNonPolPct' },
  { col: 8, key: 'caneFibrePct' },
  { col: 9, key: 'caneMoisturePct' },
  { col: 10, key: 'caneRvPct' },
  { col: 11, key: 'caneSucrosePct' },
  { col: 12, key: 'canePurity' },
  { col: 13, key: 'mjTonsPct' },
  { col: 14, key: 'mjPolPct' },
  { col: 15, key: 'mjBrixPct' },
  { col: 16, key: 'mjPolPurity' },
  { col: 17, key: 'mjSucPurity' },
  { col: 18, key: 'bagTonsPct' },
  { col: 19, key: 'bagPolPct' },
  { col: 20, key: 'bagFibrePct' },
  { col: 21, key: 'bagMoisturePct' },
  { col: 22, key: 'polExtraction' },
  { col: 23, key: 'sucroseExtraction' },
  { col: 24, key: 'rvPolPct' },
  { col: 25, key: 'crushRate' },
  { col: 26, key: 'fibreCrushRate' },
  { col: 27, key: 'timeEfficiency' },
  { col: 28, key: 'millingHoursPct' },
  { col: 29, key: 'mechStopPct' },
  { col: 30, key: 'noCanePct' },
  { col: 31, key: 'opStopPct' },
  { col: 32, key: 'weeklyRain' },
  { col: 33, key: 'ytdRain' },
]

export function makeEmptyRecord(): R7106ExtendedRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rec: any = {}
  for (const key of COLUMN_MAP) {
    rec[key] = STRING_FIELDS.has(key) ? '' : 0
  }
  return rec as R7106ExtendedRecord
}

function parseNum(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,\s]/g, '')
    if (cleaned === '' || cleaned === '-' || cleaned === 'N/A') return 0
    const n = Number(cleaned)
    return isNaN(n) ? 0 : n
  }
  return 0
}

function parseStr(val: unknown): string {
  if (typeof val === 'string') return val.trim()
  if (typeof val === 'number') return String(val)
  return ''
}

function parseRow(
  row: unknown[],
  colCount: number,
): R7106ExtendedRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rec: any = makeEmptyRecord()

  if (isShortFormat(colCount)) {
    for (const mapping of SHORT_COLUMN_MAP) {
      if (mapping.col >= row.length) continue
      const val = row[mapping.col]
      rec[mapping.key] = STRING_FIELDS.has(mapping.key) ? parseStr(val) : parseNum(val)
    }
  } else {
    for (let i = 0; i < COLUMN_MAP.length && i < row.length; i++) {
      const key = COLUMN_MAP[i]
      const val = row[i]
      rec[key] = STRING_FIELDS.has(key) ? parseStr(val) : parseNum(val)
    }
  }

  // Populate millName from lookup if empty
  if (!rec.millName && rec.mill > 0) {
    rec.millName = MILL_NAMES[rec.mill] ?? `Mill ${rec.mill}`
  }

  return rec
}

/**
 * Parse an XLSX ArrayBuffer into R7106ExtendedRecord[].
 * Handles both the extended (134-col) and short (34-col) formats.
 */
export function parseR7106XLSX(buffer: ArrayBuffer): ParseResult {
  const warnings: string[] = []

  const workbook = XLSX.read(buffer, { type: 'array', raw: true })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return { records: [], warnings: ['No sheets found in workbook'], checksum: emptyChecksum() }
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: 0,
    raw: true,
  })

  if (rows.length === 0) {
    return { records: [], warnings: ['Sheet is empty'], checksum: emptyChecksum() }
  }

  // Detect column count from first non-empty row
  let maxCols = 0
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    if (rows[i] && rows[i].length > maxCols) maxCols = rows[i].length
  }

  const dataStart = findDataStartRow(rows)
  if (dataStart > 0) {
    warnings.push(`Skipped ${dataStart} header row(s)`)
  }

  const format = isShortFormat(maxCols) ? 'short' : 'extended'
  warnings.push(`Detected ${format} format (${maxCols} columns)`)

  const records: R7106ExtendedRecord[] = []
  let skipped = 0

  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length === 0) continue

    // Skip rows where column 0 is not a valid mill code
    const mill = parseNum(row[0])
    if (mill < 1 || mill > 999) {
      skipped++
      continue
    }

    records.push(parseRow(row, maxCols))
  }

  if (skipped > 0) {
    warnings.push(`Skipped ${skipped} non-data row(s)`)
  }

  const checksum = computeChecksum(records)
  return { records, warnings, checksum }
}

/**
 * Parse a CSV string into R7106ExtendedRecord[].
 * Falls back to the short-format mapping for backward compatibility.
 */
export function parseR7106CSV(csvText: string): ParseResult {
  const warnings: string[] = []
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)

  if (lines.length === 0) {
    return { records: [], warnings: ['CSV is empty'], checksum: emptyChecksum() }
  }

  // Detect if first row is a header
  const firstCells = lines[0].split(',')
  const startIdx = isNaN(Number(firstCells[0])) ? 1 : 0
  if (startIdx === 1) warnings.push('Skipped 1 header row')

  const colCount = firstCells.length
  const records: R7106ExtendedRecord[] = []

  for (let i = startIdx; i < lines.length; i++) {
    const cells = lines[i].split(',')
    const mill = parseNum(cells[0])
    if (mill < 1 || mill > 999) continue
    records.push(parseRow(cells, colCount))
  }

  const checksum = computeChecksum(records)
  return { records, warnings, checksum }
}

// ── Data Checksum ──────────────────────────────────────────────────────

export interface DataChecksum {
  totalRows: number
  totalMills: number
  millCodes: number[]
  weekMin: number
  weekMax: number
  totalCaneTons: number
  totalMjTons: number
  totalBagTons: number
  totalMudTons: number
  millRowCounts: Record<number, number>
}

function emptyChecksum(): DataChecksum {
  return {
    totalRows: 0,
    totalMills: 0,
    millCodes: [],
    weekMin: 0,
    weekMax: 0,
    totalCaneTons: 0,
    totalMjTons: 0,
    totalBagTons: 0,
    totalMudTons: 0,
    millRowCounts: {},
  }
}

export function computeChecksum(records: R7106ExtendedRecord[]): DataChecksum {
  if (records.length === 0) return emptyChecksum()

  const millSet = new Set<number>()
  const millRowCounts: Record<number, number> = {}
  let weekMin = Infinity
  let weekMax = -Infinity
  let totalCaneTons = 0
  let totalMjTons = 0
  let totalBagTons = 0
  let totalMudTons = 0

  for (const r of records) {
    millSet.add(r.mill)
    millRowCounts[r.mill] = (millRowCounts[r.mill] ?? 0) + 1
    if (r.week < weekMin) weekMin = r.week
    if (r.week > weekMax) weekMax = r.week
    totalCaneTons += r.caneTons
    totalMjTons += r.mjTons
    totalBagTons += r.bagTons
    totalMudTons += r.mudTons
  }

  const millCodes = [...millSet].sort((a, b) => a - b)

  return {
    totalRows: records.length,
    totalMills: millCodes.length,
    millCodes,
    weekMin: weekMin === Infinity ? 0 : weekMin,
    weekMax: weekMax === -Infinity ? 0 : weekMax,
    totalCaneTons: Math.round(totalCaneTons),
    totalMjTons: Math.round(totalMjTons),
    totalBagTons: Math.round(totalBagTons),
    totalMudTons: Math.round(totalMudTons),
    millRowCounts,
  }
}

// ── Metric Definitions ─────────────────────────────────────────────────

export interface MetricDef {
  key: keyof R7106ExtendedRecord
  label: string
  shortLabel: string
  unit: string
  section: string
}

export const METRIC_DEFS: MetricDef[] = [
  // Cane
  { key: 'caneTons', label: 'Cane Tonnes', shortLabel: 'Cane t', unit: 't', section: 'Cane' },
  { key: 'canePolPct', label: 'Cane Pol %', shortLabel: 'Pol%', unit: '%', section: 'Cane' },
  { key: 'caneBrixPct', label: 'Cane Brix %', shortLabel: 'Brix%', unit: '%', section: 'Cane' },
  { key: 'caneNonPolPct', label: 'Cane Non-Pol %', shortLabel: 'NonPol%', unit: '%', section: 'Cane' },
  { key: 'caneFibrePct', label: 'Cane Fibre %', shortLabel: 'Fibre%', unit: '%', section: 'Cane' },
  { key: 'caneMoisturePct', label: 'Cane Moisture %', shortLabel: 'Moist%', unit: '%', section: 'Cane' },
  { key: 'caneRvPct', label: 'Cane RV %', shortLabel: 'RV%', unit: '%', section: 'Cane' },
  { key: 'caneSucrosePct', label: 'Cane Sucrose %', shortLabel: 'Suc%', unit: '%', section: 'Cane' },
  { key: 'canePurity', label: 'Cane Purity', shortLabel: 'Purity', unit: '', section: 'Cane' },
  { key: 'caneSucPurity', label: 'Cane Suc Purity', shortLabel: 'SucPur', unit: '', section: 'Cane' },

  // Mixed Juice
  { key: 'mjTonsPct', label: 'MJ Tons %', shortLabel: 'MJ%', unit: '%', section: 'Mixed Juice' },
  { key: 'mjPolPct', label: 'MJ Pol %', shortLabel: 'MJ Pol%', unit: '%', section: 'Mixed Juice' },
  { key: 'mjBrixPct', label: 'MJ Brix %', shortLabel: 'MJ Brix%', unit: '%', section: 'Mixed Juice' },
  { key: 'mjPolPurity', label: 'MJ Pol Purity', shortLabel: 'MJ Pur', unit: '', section: 'Mixed Juice' },
  { key: 'mjSucPurity', label: 'MJ Suc Purity', shortLabel: 'MJ SPur', unit: '', section: 'Mixed Juice' },
  { key: 'mjSucPolRatio', label: 'MJ Suc/Pol Ratio', shortLabel: 'S/P', unit: '', section: 'Mixed Juice' },

  // Bagasse
  { key: 'bagTonsPct', label: 'Bagasse Tons %', shortLabel: 'Bag%', unit: '%', section: 'Bagasse' },
  { key: 'bagPolPct', label: 'Bagasse Pol %', shortLabel: 'Bag Pol%', unit: '%', section: 'Bagasse' },
  { key: 'bagFibrePct', label: 'Bagasse Fibre %', shortLabel: 'Bag Fib%', unit: '%', section: 'Bagasse' },
  { key: 'bagMoisturePct', label: 'Bagasse Moisture %', shortLabel: 'Bag Mst%', unit: '%', section: 'Bagasse' },

  // Clarified Mud
  { key: 'mudTonsPct', label: 'Mud Tons %', shortLabel: 'Mud%', unit: '%', section: 'Clarified Mud' },
  { key: 'mudPolPct', label: 'Mud Pol %', shortLabel: 'Mud Pol%', unit: '%', section: 'Clarified Mud' },

  // Imbibition
  { key: 'imbMassPct', label: 'Imbibition %', shortLabel: 'Imb%', unit: '%', section: 'Imbibition' },

  // DAC Factors
  { key: 'dacFactorPol', label: 'DAC Factor Pol', shortLabel: 'fPol', unit: '', section: 'DAC' },
  { key: 'dacFactorBrix', label: 'DAC Factor Brix', shortLabel: 'fBrix', unit: '', section: 'DAC' },
  { key: 'dacFactorNonPol', label: 'DAC Factor Non-Pol', shortLabel: 'fNonPol', unit: '', section: 'DAC' },
  { key: 'dacFactorFibre', label: 'DAC Factor Fibre', shortLabel: 'fFibre', unit: '', section: 'DAC' },
  { key: 'dacFactorMoisture', label: 'DAC Factor Moisture', shortLabel: 'fMoist', unit: '', section: 'DAC' },
  { key: 'dacPurity', label: 'DAC Purity', shortLabel: 'DAC Pur', unit: '', section: 'DAC' },

  // Time Account
  { key: 'timeEfficiency', label: 'Time Efficiency', shortLabel: 'TimeEff', unit: '%', section: 'Time' },
  { key: 'millingHoursPct', label: 'Milling Hours %', shortLabel: 'Mill%', unit: '%', section: 'Time' },
  { key: 'mechStopPct', label: 'Mechanical Stop %', shortLabel: 'MechSt%', unit: '%', section: 'Time' },
  { key: 'noCanePct', label: 'No Cane %', shortLabel: 'NoCane%', unit: '%', section: 'Time' },
  { key: 'opStopPct', label: 'Operational Stop %', shortLabel: 'OpSt%', unit: '%', section: 'Time' },
  { key: 'scheduledPct', label: 'Scheduled Stop %', shortLabel: 'Sched%', unit: '%', section: 'Time' },
  { key: 'foreignMatterPct', label: 'Foreign Matter %', shortLabel: 'FM%', unit: '%', section: 'Time' },
  { key: 'engineeringPct', label: 'Engineering %', shortLabel: 'Eng%', unit: '%', section: 'Time' },
  { key: 'forceMajeurePct', label: 'Force Majeure %', shortLabel: 'Force%', unit: '%', section: 'Time' },
  { key: 'depitPlantPct', label: 'Depit Plant %', shortLabel: 'Depit%', unit: '%', section: 'Time' },

  // Factor Diffs
  { key: 'diffBrixPol', label: 'Diff Brix-Pol', shortLabel: 'dBP', unit: '', section: 'Diffs' },
  { key: 'diffMjMb', label: 'Diff MJ-MB', shortLabel: 'dMJMB', unit: '', section: 'Diffs' },
  { key: 'diffMbDac', label: 'Diff MB-DAC', shortLabel: 'dMBD', unit: '', section: 'Diffs' },
  { key: 'diffMjDacUnadj', label: 'Diff MJ-DAC Unadj', shortLabel: 'dMDu', unit: '', section: 'Diffs' },

  // Performance
  { key: 'polExtraction', label: 'Pol Extraction', shortLabel: 'PolExtr', unit: '%', section: 'Performance' },
  { key: 'sucroseExtraction', label: 'Sucrose Extraction', shortLabel: 'SucExtr', unit: '%', section: 'Performance' },
  { key: 'rvPolPct', label: 'RV/Pol %', shortLabel: 'RV/Pol', unit: '%', section: 'Performance' },
  { key: 'crushRate', label: 'Crush Rate', shortLabel: 'Crush', unit: 't/hr', section: 'Performance' },
  { key: 'fibreCrushRate', label: 'Fibre Crush Rate', shortLabel: 'FibCrush', unit: 't/hr', section: 'Performance' },
  { key: 'imbPercentFibre', label: 'Imbibition % Fibre', shortLabel: 'Imb/Fib', unit: '%', section: 'Performance' },
  { key: 'polPercentFibreBag', label: 'Pol % Fibre Bag', shortLabel: 'P/FBag', unit: '%', section: 'Performance' },
  { key: 'closingStock', label: 'Closing Stock', shortLabel: 'ClsStk', unit: 't', section: 'Performance' },
  { key: 'weeklyRain', label: 'Weekly Rainfall', shortLabel: 'Rain', unit: 'mm', section: 'Performance' },
  { key: 'ytdRain', label: 'YTD Rainfall', shortLabel: 'YTD Rain', unit: 'mm', section: 'Performance' },
]

/** Lookup map: field key → MetricDef */
export const METRIC_MAP = new Map<keyof R7106ExtendedRecord, MetricDef>(
  METRIC_DEFS.map((d) => [d.key, d]),
)
