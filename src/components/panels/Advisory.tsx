import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageSquare, Send, Bot, User, Loader2, Sparkles,
  Droplets, Bug, Leaf, CloudRain, Truck, DollarSign, Globe, FlaskConical,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { AnimatedPanel, StaggerChild } from '../shared/AnimatedPanel'
import { SectionTitle } from '../shared/SectionTitle'
import { StatCard } from '../shared/StatCard'
import { streamOllamaChat } from '../../lib/api'
import { advisoryCapabilities, suggestedQuestions, industryStats } from '../../lib/data'
import { cn } from '../../lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const iconMap: Record<string, typeof Droplets> = {
  Droplets, Bug, Leaf, CloudRain, Truck, DollarSign, Globe, FlaskConical,
}

const keywordResponses: Record<string, string> = {
  import: `**Import Crisis Overview**\n\nThe South African sugar industry is facing an unprecedented import crisis:\n\n- Sugar imports surged **400%+** in 2025, reaching **153,344 tonnes** (Jan-Sep) vs historical averages\n- Documented losses of **R760M+** (Jan-Aug), with full-year losses expected to exceed R1 billion\n- Main sources: Brazil (~48%), Thailand, Guatemala, India\n- ITAC reference price: US$680/tonne; SASA requesting US$905/tonne\n- BevSA counter-proposes lowering to US$552-650/tonne\n- The Health Promotion Levy has cost the industry R1.2 billion\n\nThis threatens 65,000 direct jobs and the livelihoods of 26,740 growers.`,
  yield: `**Yield Optimization Insights**\n\nCurrent SA sugarcane yields average **56 tonnes/hectare**, but there's significant room for improvement:\n\n- Only **~22%** of cane area is under irrigation (accounting for ~35% of production)\n- Smart irrigation could improve yields by **8-15%**\n- SASRI varieties optimized for SA conditions can boost recovery rates\n- Precision agriculture (drones, soil sensors) being adopted across 50,000+ hectares\n- Key regions: Nkomazi (Mpumalanga) leads with 83% health scores despite low rainfall, due to full irrigation`,
  mill: `**Mill Operations Summary**\n\nSouth Africa has **12 operating sugar mills** (6 companies):\n\n- **Illovo Sugar**: Sezela, Eston, Noodsberg (Umzimkulu closed 2021)\n- **Tongaat Hulett**: Maidstone, Amatikulu, Felixton (Darnall mothballed 2020) — under business rescue since Oct 2022\n- **RCL Foods**: Komati, Malelane, Pongola\n- **Independent**: Gledhow, Umfolozi, UCL Dalton\n\nTongaat Hulett's 3 mills currently lead SA in sugar recovery. Average efficiency: ~91%. Bagasse co-generation potential: 700 MW.`,
  diversif: `**Diversification Opportunities**\n\nThe Sugar Master Plan 2030 targets diversification:\n\n- **SAF**: 375-433M litres/year potential — SA is perfectly positioned\n- **Bioethanol**: 125M litres/year, creating 21,000 new jobs\n- **Co-generation**: 700 MW from bagasse to national grid\n- **Biochemicals**: Growing market for bio-based products\n\nTotal new job potential: 41,500+. Investment needed: ~R28.8B across all streams.`,
  grower: `**Grower Support**\n\nThe SA sugar industry supports **26,740 growers**:\n\n- **25,653** small-scale growers (96%)\n- **1,087** large-scale growers\n- ~348,000 hectares under sugarcane\n- AI advisory can reach all growers via WhatsApp in English, isiZulu, and Afrikaans\n- Target: 8-15% yield improvement through precision agriculture\n- SASRI provides research support and new varieties`,
  cts: `**Cane Testing Service (CTS)**\n\nCTS is a SASA division that ensures fair, accurate cane payments:\n\n- Operates **11 laboratories** (9 in KZN, 2 in Mpumalanga), co-located at each operating mill\n- Uses **Direct Analysis of Cane (DAC)** to sample and analyse every cane consignment\n- Determines **Recoverable Value (RV)** — the basis for grower-miller payments\n- Performs weekly reconciliation of individual analyses against mill balance\n- Managed by **16 managers** with teams of chemists and engineers\n- Also runs Autolab, supporting mills in SA, Zimbabwe, Kenya, and Mozambique\n\nCTS handles massive data volumes daily, making it a prime candidate for AI-driven optimization — from automated quality prediction to anomaly detection in RV measurements.`,
  test: `**Cane Testing Service (CTS)**\n\nCTS is a SASA division that ensures fair, accurate cane payments:\n\n- Operates **11 laboratories** (9 in KZN, 2 in Mpumalanga), co-located at each operating mill\n- Uses **Direct Analysis of Cane (DAC)** to sample and analyse every cane consignment\n- Determines **Recoverable Value (RV)** — the basis for grower-miller payments\n- Performs weekly reconciliation of individual analyses against mill balance\n- Managed by **16 managers** with teams of chemists and engineers\n- Also runs Autolab, supporting mills in SA, Zimbabwe, Kenya, and Mozambique\n\nCTS handles massive data volumes daily, making it a prime candidate for AI-driven optimization — from automated quality prediction to anomaly detection in RV measurements.`,
  master: `**Sugar Master Plan**\n\nThe Sugarcane Value Chain Master Plan is a social compact between government, industry, labour, and growers:\n\n1. **Phase 1 (Nov 2020-Mar 2023): Stabilisation** — Restored domestic sales from 1.25M to 1.55M tonnes. Local procurement commitments (80% rising to 95%).\n2. **Phase 2 (from 2024, in development): Growth** — Diversification into biofuels, co-generation. DTIC block exemptions drafted May 2025.\n\nKey targets:\n- Protect 65,000+ direct jobs and ~1 million livelihoods\n- Increase small-scale grower support (25,653 growers)\n- Achieve energy independence through co-generation (700 MW potential)\n- R24B industry revenue maintained and grown`,
}

function getKeywordResponse(input: string): string | null {
  const lower = input.toLowerCase()
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lower.includes(keyword)) return response
  }
  return null
}

interface AdvisoryProps {
  ollamaModel: string | null
  ollamaOnline: boolean
}

export function Advisory({ ollamaModel, ollamaOnline }: AdvisoryProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome to SugarIQ AI Advisory. I\'m your intelligent assistant for the South African sugar industry. Ask me anything about production, imports, diversification, mill operations, or grower support. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    if (ollamaOnline && ollamaModel) {
      // Use Ollama AI
      abortRef.current = new AbortController()
      const chatHistory = [
        ...messages.filter((m) => m.role !== 'assistant' || messages.indexOf(m) !== 0),
        { role: 'user' as const, content: userMessage },
      ]

      await streamOllamaChat(
        ollamaModel,
        chatHistory,
        (token) => {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + token,
            }
            return updated
          })
        },
        () => setIsStreaming(false),
        abortRef.current.signal,
      )
    } else {
      // Keyword fallback
      const response = getKeywordResponse(userMessage) ||
        `Thank you for your question about "${userMessage}". The SugarIQ AI advisory system can provide detailed insights on:\n\n- **Import monitoring** and trade policy\n- **Yield optimization** and precision agriculture\n- **Mill operations** and maintenance\n- **Diversification** opportunities (SAF, bioethanol, co-gen)\n- **Grower support** programs\n- **Sugar Master Plan** 2030 progress\n\nPlease try asking about any of these topics for detailed information.`

      // Simulate streaming for keyword responses
      let i = 0
      const interval = setInterval(() => {
        if (i < response.length) {
          const chunk = response.slice(i, i + 3)
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chunk,
            }
            return updated
          })
          i += 3
        } else {
          clearInterval(interval)
          setIsStreaming(false)
        }
      }, 15)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatedPanel>
      <SectionTitle
        icon={MessageSquare}
        title="AI Grower Advisory System"
        subtitle={ollamaOnline
          ? `Connected to AI (${ollamaModel}) — ask any question about the SA sugar industry`
          : 'Enhanced knowledge base mode — AI connection unavailable'
        }
        iconColor="text-cane-400"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat area - takes 3 columns */}
        <div className="lg:col-span-3">
          <StaggerChild index={0}>
            <div className="flex h-[520px] flex-col rounded-xl border border-slate-700/50 bg-slate-800/30">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'flex-row-reverse' : '',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        msg.role === 'user'
                          ? 'bg-blue-600'
                          : 'bg-gradient-to-br from-cane-400 to-cane-600',
                      )}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-slate-900" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-200',
                      )}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_strong]:text-cane-300 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {isStreaming && i === messages.length - 1 && (
                            <span className="typing-cursor" />
                          )}
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested questions */}
              {messages.length <= 2 && (
                <div className="border-t border-slate-700/50 px-4 py-2">
                  <p className="mb-2 text-[11px] text-slate-500">Suggested questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1 text-[11px] text-slate-300 transition-colors hover:border-cane-500/50 hover:text-cane-300"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-slate-700/50 p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about imports, yields, mills, diversification..."
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cane-500"
                    disabled={isStreaming}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                      input.trim() && !isStreaming
                        ? 'bg-cane-500 text-slate-900 hover:bg-cane-400'
                        : 'bg-slate-700 text-slate-500',
                    )}
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </StaggerChild>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <StaggerChild index={1}>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cane-400" />
                <h3 className="text-sm font-semibold text-white">AI Capabilities</h3>
              </div>
              <div className="space-y-2">
                {advisoryCapabilities.map((cap) => {
                  const Icon = iconMap[cap.icon] || Sparkles
                  return (
                    <div key={cap.name} className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-300">{cap.name}</p>
                        <p className="text-[10px] text-slate-500">{cap.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </StaggerChild>

          <StaggerChild index={2}>
            <StatCard
              title="Small-Scale Growers"
              value={industryStats.smallScaleGrowers}
              icon={User}
              iconColor="text-cane-400"
              description="Potential AI advisory users"
              className="!p-4"
            />
          </StaggerChild>

          <StaggerChild index={3}>
            <div className="rounded-xl border border-cane-700/30 bg-cane-950/20 p-4">
              <p className="text-xs font-semibold text-cane-300">Impact Projection</p>
              <p className="mt-1 text-[11px] text-cane-400/80">
                AI-driven advisory can reach all 25,653 small-scale growers via WhatsApp,
                delivering personalized irrigation, disease, and fertilizer recommendations.
                Projected yield improvement: 8-15% across the grower base.
              </p>
            </div>
          </StaggerChild>

          <StaggerChild index={4}>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
              <p className="text-[11px] text-slate-400">
                <span className={cn(
                  'mr-1.5 inline-block h-2 w-2 rounded-full',
                  ollamaOnline ? 'bg-green-500 pulse-glow' : 'bg-red-500',
                )} />
                {ollamaOnline
                  ? `Connected: ${ollamaModel}`
                  : 'AI Offline — using knowledge base'
                }
              </p>
            </div>
          </StaggerChild>
        </div>
      </div>
    </AnimatedPanel>
  )
}
