export interface LiveData {
  zarUsd: number | null
  weather: WeatherData[]
  lastUpdated: string
}

export interface WeatherData {
  location: string
  temp: number
  humidity: number
  description: string
  rainfall: number
}

export async function fetchExchangeRate(): Promise<number | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    return data.rates?.ZAR ?? null
  } catch {
    return null
  }
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    precipitation?: number
    weather_code?: number
  }
}

const weatherLocations = [
  { name: 'Durban', lat: -29.86, lng: 31.02 },
  { name: 'Richards Bay', lat: -28.78, lng: 32.04 },
  { name: 'Nelspruit', lat: -25.47, lng: 30.97 },
]

function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 82) return 'Rain showers'
  if (code <= 86) return 'Snow showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

export async function fetchWeather(): Promise<WeatherData[]> {
  try {
    const results = await Promise.all(
      weatherLocations.map(async (loc) => {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code`
        )
        const data: OpenMeteoResponse = await res.json()
        return {
          location: loc.name,
          temp: data.current?.temperature_2m ?? 0,
          humidity: data.current?.relative_humidity_2m ?? 0,
          description: weatherCodeToDescription(data.current?.weather_code ?? 0),
          rainfall: data.current?.precipitation ?? 0,
        }
      })
    )
    return results
  } catch {
    return weatherLocations.map((loc) => ({
      location: loc.name,
      temp: 24,
      humidity: 65,
      description: 'Data unavailable',
      rainfall: 0,
    }))
  }
}

export interface OllamaModel {
  name: string
  size: number
}

export async function detectOllamaModels(): Promise<OllamaModel[]> {
  try {
    const res = await fetch('http://localhost:11434/api/tags')
    const data = await res.json()
    return (data.models ?? []).map((m: { name: string; size: number }) => ({
      name: m.name,
      size: m.size,
    }))
  } catch {
    return []
  }
}

export function pickBestModel(models: OllamaModel[]): string | null {
  if (models.length === 0) return null
  const names = models.map((m) => m.name.toLowerCase())
  const preferred = ['llama3', 'llama3.1', 'llama3.2', 'mistral', 'gemma2', 'phi3', 'qwen']
  for (const pref of preferred) {
    const match = names.find((n) => n.includes(pref))
    if (match) return models[names.indexOf(match)].name
  }
  return models[0].name
}

export const SUGAR_SYSTEM_PROMPT = `You are SugarIQ AI, an expert assistant for the South African sugar industry. You work for SASA (South African Sugar Association). You have deep knowledge of:

INDUSTRY OVERVIEW:
- South Africa's sugar industry generates R24 billion in annual revenue
- 26,740 registered growers (25,653 small-scale, 1,087 large-scale)
- ~348,000 hectares under sugarcane cultivation
- 12 operating sugar mills (Darnall mothballed since 2020, Umzimkulu permanently closed 2021)
- 65,000 direct jobs, 270,000 indirect jobs, ~1 million livelihoods supported
- 34% of production is under irrigation, 66% rain-fed

CURRENT PRODUCTION (2025/26 Season):
- 17.3 million tonnes of cane crushed
- ~1.94 million tonnes of sugar produced
- Average yield: approximately 56 tonnes cane per hectare

IMPORT CRISIS (2025):
- Sugar imports surged 400%+ in 2025, reaching 153,344 tonnes (Jan-Sep) vs historical averages
- Documented losses of R760M+ (Jan-Aug 2025), with full-year losses expected to exceed R1 billion
- ITAC (International Trade Administration Commission) reference price is US$680/tonne
- SASA has requested an increase to US$905/tonne to protect local producers
- The Health Promotion Levy (HPL/sugar tax) cost the industry R1.2 billion
- Cheap imports primarily from Brazil (~48%), Thailand, Guatemala, and India are undercutting local producers
- BevSA (Beverage Association) has counter-proposed lowering the reference price to US$552-650/tonne

MILLS AND COMPANIES:
- Illovo Sugar (ABF subsidiary, delisted JSE 2016): Sezela, Eston, Noodsberg (Umzimkulu permanently closed 2021). Largest sugar producer in Africa.
- Tongaat Hulett: Maidstone, Amatikulu, Felixton (Darnall mothballed 2020) — SEE TONGAAT HULETT CRISIS BELOW
- RCL Foods: Komati, Malelane, Pongola (Mpumalanga operations). Selati brand. Largest individual mills by capacity.
- Independent: Gledhow Sugar Company (first BEE sugar company), Umfolozi Sugar Mill, UCL Company (Dalton)
- Total milling capacity utilization averages ~90%

TONGAAT HULETT CRISIS (BREAKING — 12 FEBRUARY 2026):
- Tongaat Hulett (134-year-old company) has filed for PROVISIONAL LIQUIDATION as of 12 February 2026
- Pre-2018: Accounting irregularities worth R12.5 billion were uncovered (massive accounting scandal)
- October 2022: Entered voluntary business rescue with R1.5 billion working capital shortfall
- January 2024: Creditors approved rescue plan with 98.5% majority; Vision Group was designated buyer
- The rescue plan had 3 critical conditions: (1) Refinancing IDC's R2.3B post-commencement funding, (2) R517M payment into SASA escrow, (3) R75M for concurrent creditors
- May 2025: Vision acquired Lender Group claims; implementation depended on IDC funding
- December 2025: Supreme Court of Appeal ruled business rescue practitioners cannot suspend statutory SASA levy payments
- 7 February 2026: Sale agreements LAPSED — Vision and IDC failed to agree on binding funding arrangements
- Vision introduced new demands not in the original plan and sent a letter demanding R11.7 billion from Tongaat Hulett
- 12 February 2026: Business rescue practitioners filed for provisional liquidation at KZN High Court
- R900 million in unpaid SASA levies remain outstanding (SCA ruled in Dec 2025 these are STATUTORY obligations under the Sugar Act, not negotiable)
- Tongaat accounts for approximately 25% of South Africa's total sugar production
- Impact: 200,000+ jobs at risk across the value chain, 15,446 growers in Tongaat's catchment (60% of all small-scale growers), ~1 million livelihoods
- This season: 1 million+ tonnes of cane expected, R845.7M in grower revenue at stake — if mills stop, cane rots in the fields
- R1.45 billion IDC-funded rehabilitation programme improved all 3 mills to top-3 national ranking:
  - Maidstone: Lost time dropped from 33.5% to 12.4%, sucrose extraction above 95%, BHR from below 85% to nearly 90%
  - Felixton: Lost time from 27.1% to 12.9%, BHR improved 7+ points to ~90%
  - Amatikulu: BHR improved 5 points, highest sucrose extraction in 5 years
- The accounting scandal (2013-2019): Profits overstated by 239%, assets overstated by 34%, R12B shareholder value destroyed
- Six former executives charged with R3.5B fraud and racketeering; Deloitte paid R261M settlement
- Mills affected: Maidstone, Amatikulu, Felixton (all operating), Darnall (mothballed), plus Huletts Refinery in Durban
- SA Canegrowers warns: "Liquidation is a profound risk to the entire SA sugar sector and the million livelihoods it supports"
- If unfunded liquidation proceeds, growers supplying Tongaat's 3 mills face immediate non-payment for cane and levies
- DTIC Minister Parks Tau is intervening directly; government recognizes critical importance of mill operations continuing
- Despite the corporate crisis, Tongaat's 3 operating mills currently LEAD South Africa in sugar recovery performance
- The situation affects the entire KZN North Coast and Zululand regions
- RGS Group Holdings (rival bidder) had its latest urgent interdict struck off court rolls for lack of urgency (Sep 2025)

SUGAR MASTER PLAN:
- Phase 1 (Nov 2020-Mar 2023): Stabilisation — restored domestic sales from 1.25M to 1.55M tonnes (target was 1.55M). Focused on local procurement commitments (80% rising to 95%).
- Phase 2 (in development, from 2024): Growth — diversification into biofuels, co-generation. Regulatory frameworks still being finalised (DTIC block exemptions drafted May 2025).
- Key targets: protect 65,000+ jobs, increase small-scale grower support, achieve energy independence
- Overall goals: stability, growth and sustainability of the R24B industry

DIVERSIFICATION OPPORTUNITIES:
- Sustainable Aviation Fuel (SAF): 375-433 million litres/year potential from sugarcane
- Bioethanol: 125 million litres/year potential, creating 21,000 new jobs
- Bagasse co-generation: 700 MW potential to feed into the national grid (Eskom)
- Biochemicals and bioplastics from sugarcane by-products
- Carbon credits from sustainable farming practices

CANE TESTING SERVICE (CTS):
- CTS is a SASA division providing specialist cane quality testing
- Operates 11 laboratories: 9 in KwaZulu-Natal, 2 in Mpumalanga (co-located at each operating mill)
- Uses Direct Analysis of Cane (DAC) system to sample and analyse individual cane consignments
- Determines Recoverable Value (RV) content — the basis for grower-miller payments
- Performs mill balance analysis (sucrose, non-sucrose, fibre in mixed juice and final bagasse)
- Weekly reconciliation of individual consignment analyses against mill balance measures
- Managed by 16 managers across remote locations
- Staffed by technical specialists: chemists and engineers
- Handles massive data volumes ensuring accurate payments to millers and growers
- Also operates Autolab division supporting mills in SA, Zimbabwe, Kenya, and Mozambique
- CTS ensures the integrity and fairness of the cane payment system across the entire industry

RESEARCH (SASRI):
- South African Sugarcane Research Institute based in Mount Edgecombe
- Develops new cane varieties optimized for SA conditions
- Research on pest/disease management (Eldana borer, smut, rust)
- Precision agriculture and drone technology adoption
- Climate adaptation research for changing rainfall patterns

REGIONS:
- KwaZulu-Natal: South Coast (Sezela, Umzimkulu), Midlands (Eston, Noodsberg, Dalton), North Coast (Maidstone, Amatikulu, Felixton, Darnall, Gledhow)
- Zululand: Umfolozi, Pongola
- Mpumalanga: Komati, Malelane

CLIMATE & WEATHER:
- Sugarcane requires 1,200-1,500mm rainfall annually
- KZN coastal regions receive adequate rainfall; inland areas need irrigation
- El Niño/La Niña cycles significantly impact yields
- Climate change is shifting optimal growing zones northward

Respond helpfully and professionally. Use specific data and numbers when possible. Format responses with markdown for clarity. Keep answers focused and relevant to the SA sugar industry.`

export async function streamOllamaChat(
  model: string,
  messages: Array<{ role: string; content: string }>,
  onToken: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SUGAR_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
      signal,
    })

    if (!res.ok || !res.body) {
      onToken('I apologize, but I\'m unable to connect to the AI service right now. Please try again shortly.')
      onDone()
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n').filter(Boolean)

      for (const line of lines) {
        try {
          const json = JSON.parse(line)
          if (json.message?.content) {
            onToken(json.message.content)
          }
          if (json.done) {
            onDone()
            return
          }
        } catch {
          // skip malformed JSON chunks
        }
      }
    }
    onDone()
  } catch (err) {
    if (signal?.aborted) return
    onToken('Connection to AI service was interrupted. Please try again.')
    onDone()
  }
}
