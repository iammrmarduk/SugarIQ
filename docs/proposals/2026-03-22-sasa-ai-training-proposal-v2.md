# AI Training Programme Proposal
## South African Sugar Association

**Prepared for:** South African Sugar Association (SASA)
**Prepared by:** [Your Name / Company]
**Date:** March 2026
**Reference:** SASA-AI-2026-001

---

## Introduction

Following the introductory AI workshop earlier this year, this proposal outlines a structured six-session training programme designed to take your team significantly further — from awareness to practical capability.

The programme is built specifically for the sugar industry. Every exercise, dataset, and workflow example is grounded in the work your team does day to day: mill performance data, season reporting, grower communications, and operational analysis. By the end of the programme, your team will not only know how to use modern AI tools — they will have built things with them that your organisation can actually use.

Sessions are designed to be spread across the calendar (minimum one week apart) rather than delivered back to back. This gives participants time to apply what they've learned between sessions, which significantly improves retention and confidence.

---

## Programme Overview

| Session | Title | Theme |
|---|---|---|
| 1 | AI as Your Thinking Partner | Getting dramatically more from AI tools you already have |
| 2 | Excel & Data Mastery with AI | Turning spreadsheets into analysis engines |
| 3 | Coding with AI | Building scripts and automations — no prior coding needed |
| 4 | Running AI Locally | AI that stays on your machine — private, fast, free |
| 5 | Agentic Workflows | AI that runs tasks automatically |
| 6 | Capstone & Roadmap | Showcase, strategy, and your 90-day plan |

**Format:** Full day, 9:30–15:00 | In-person with hybrid remote option
**Group size:** Up to 10 in-person participants + remote attendees via video link

---

## Session Details

### Session 1 — AI as Your Thinking Partner
*Building on the introductory session — going deeper*

The first session addressed the basics of AI tools and prompting. This session picks up from there and demonstrates how dramatically your results improve when you understand how to frame problems, assign context, and structure your requests.

**What we cover:**
- The mental model shift — AI as a junior analyst, not a search engine
- Advanced prompting: role assignment, chain-of-thought reasoning, multi-step instructions
- Analysing long documents — paste an entire mill season report and ask structured questions
- Controlling tone, format, and audience — produce three different versions of the same content
- Microsoft Copilot in Word and Outlook — AI built into the tools you already use, no installation needed

**Afternoon — hands-on build:**
Each participant identifies their most time-consuming writing task (weekly report, grower letter, incident summary, board update) and builds a reusable prompt that produces a first draft they would actually use. The best prompts are collected into the **SASA Prompt Library** — a shared, living document your team continues to grow after the programme ends.

**What you leave with:** SASA Prompt Library — 10–15 tested, named prompts for real tasks

---

### Session 2 — Excel & Data Mastery with AI
*Integrating Claude directly with Excel — and beyond*

Your team already lives in Excel. This session goes beyond prompting and shows how to integrate Claude directly with your spreadsheets — so AI isn't something you switch to separately, it's part of the workflow itself.

**What we cover:**
- Direct Claude integration with Excel — send data to Claude and receive analysis, summaries, and recommendations without leaving the spreadsheet
- AI-generated formulas — describe in plain language what you want, receive the formula
- Data cleaning and restructuring — paste messy, inconsistent data and get clean structured output
- Building performance dashboards from R7106 weekly exports — pivot tables, charts, conditional formatting, all guided by AI
- Microsoft Excel Copilot walkthrough (where available on your licences)
- *(PowerPoint integration also covered — generating slides and summaries directly from data. Note: full integration features require a paid Claude account — see the recommended account below.)*

**Recommended Claude account:** To get full value from integrations, access to the top-tier models, and the maximum effort/extended thinking settings, we recommend SASA share a single Claude Team or API account at approximately **$200/month**. This gives the whole team access without per-seat costs and unlocks the features used in this session and beyond.

**Afternoon — hands-on build:**
Working with actual R7106 export data, participants connect Claude to their Excel workflow, analyse mill performance data, generate a formatted summary report, and explore the PowerPoint integration to produce a slide-ready output — all driven by AI, not manual formatting.

**What you leave with:** Live Claude–Excel integration producing automated mill reporting and analysis from your own data

---

### Session 3 — Coding with AI (No Experience Required)
*You don't need to know how to code — you need to know what you want*

This session reframes coding entirely. With AI as your co-author, you describe what you need in plain language and guide the result — the AI writes the code. Participants are often surprised how quickly they can produce working tools.

**What we cover:**
- The new paradigm: describe the problem, AI writes the code, you review and guide
- Claude Code CLI — a terminal-based AI coding assistant, demonstrated from first install to first result
- Windsurf IDE — an AI-powered code editor that lets you have a conversation about your project
- Python fundamentals through AI: reading a CSV file, filtering and summarising data, exporting results
- When to use which tool — Claude Code vs Windsurf vs the Claude.ai browser interface

**Afternoon — hands-on build:**
Step by step, with AI assistance throughout, participants write a Python script that reads an R7106 CSV export, calculates per-mill averages across key fields, and produces a formatted summary report. Everyone runs it on their own machine with real data.

**What you leave with:** Working Python script — R7106 CSV export → automated summary report

*IT requirement: Machines must have administrator rights. Python 3 must be pre-installed or IT must approve installation on the session day.*

---

### Session 4 — Running AI Locally
*Private, fast, free — one machine on the network serves everyone*

For many organisations, the hesitation around AI tools comes down to data privacy. This session eliminates that concern entirely. Critically, not every person needs to run AI on their own computer — one dedicated machine on the local network can serve the entire team through a browser interface. Nothing leaves the building.

**What we cover:**
- Why local AI matters for the sugar industry — confidential mill data, grower records, regulatory context
- The network model: one server running Ollama, everyone accesses it via browser — no per-machine setup required after initial installation
- Installing and configuring Ollama in server mode on the dedicated machine
- Choosing a model: Llama 3, Mistral, Gemma, Phi-3 — what each is suited for and the trade-offs
- Open WebUI — all attendees connect to it via browser, just like a web app, from their own machines
- Continue.dev — an AI coding assistant for VS Code that connects to the local server

**Afternoon — hands-on build:**
Attendees connect to the shared local AI server via their browsers, query a confidential-style mill report, and experience the full capability of local AI — nothing leaves the network. The Session 3 Python script is extended to call the local model for AI-generated narrative summaries.

> This session is intentionally run offline from cloud services. No external AI tools are used — to demonstrate clearly that capable, private AI requires no internet connection and no ongoing subscription cost.

**What you leave with:** A shared local AI server accessible to everyone on the network — and the knowledge to maintain and extend it

**Dedicated machine specification (SASA to provide for this session and ongoing use):**

The facility needs one machine dedicated to running local AI. It does not need to be powerful enough to run large models — for demo purposes and small team use, a modest GPU-equipped machine is sufficient.

| Component | Minimum (demo / 2B models) | Recommended (team use / 7B models) |
|---|---|---|
| CPU | Modern i5 / Ryzen 5 (8th gen+) | Intel i7 / Ryzen 7 (12th gen+) |
| RAM | 16 GB | 32 GB |
| GPU | Any dedicated GPU with 4 GB VRAM | NVIDIA RTX 3060 (12 GB VRAM) or equivalent |
| Storage | 20 GB free (SSD) | 50 GB free (SSD) |
| Network | Wired or strong WiFi on local network | Wired ethernet preferred |
| OS | Windows 10/11 or Linux | Windows 10/11 or Ubuntu 22.04+ |

*This machine runs Ollama as a background service. All team members access it via a browser — no AI software needs to be installed on individual machines.*

---

### Session 5 — Agentic Workflows
*Stop prompting manually — build AI that runs tasks automatically*

The previous sessions covered AI tools you use actively. This session introduces a different category: AI that works in the background, triggered by events, running tasks on your behalf without you needing to be present.

**What we cover:**
- What AI agents actually are: AI + tools + a loop
- MCP (Model Context Protocol) — the standard that lets Claude connect to files, spreadsheets, browsers, and APIs
- n8n — open-source, self-hostable workflow automation (think Zapier, but you own and control it)
- Patterns relevant to the sugar industry: anomaly detection triggers, scheduled report generation, grower alert systems

**Afternoon — hands-on build:**
The group chooses one of three pre-scaffolded options to complete and run:

- **Option A — Mill Data Monitor:** A workflow that detects new R7106 export files, processes them, and sends an anomaly-flagged summary by email
- **Option B — Narrative Report Generator:** A workflow that reads weekly mill data, sends it to a local AI model, and saves the generated narrative to SharePoint
- **Option C — Grower Communication Workflow:** A data-driven letter generator — one row of grower data in, a personalised letter out

All three options use a pre-built workflow skeleton provided by the facilitator. Participants configure, connect, and run — not build from scratch. The goal is a working end-to-end run with real or representative data before the session ends.

**What you leave with:** Working automated workflow connected to a real SASA data source

---

### Session 6 — Capstone & Roadmap
*Bringing it all together — and knowing where to go next*

The final session has two purposes: celebrating what the team has built, and making sure the momentum continues after the programme ends.

**Morning — showcase:**
Each participant or team presents their best build from the programme in a short demo (5 minutes each). The facilitator draws out themes, common patterns, and standout results. A group discussion covers what genuinely surprised the team and what they will actually continue using.

**Afternoon — strategic direction:**
- Where AI is heading in agriculture and agribusiness over the next three to five years
- What SASA specifically should be preparing for: precision agriculture, grower analytics, supply chain intelligence, predictive maintenance, regulatory reporting automation
- How to build internal capability: identifying an AI champion, establishing a learning cadence, keeping the team's skills current
- Formalising a **SASA Community of Practice** — a shared prompt library (started in Session 1), a regular show-and-tell, and a low-friction way for the team to share what they're learning
- **Roadmap exercise:** Each team leaves with a written 90-day AI adoption plan for their specific area

**What you leave with:** Individual 90-day AI action plans + a SASA internal AI roadmap document

---

## What Is Included

Each session includes:
- Full-day facilitation (in-person + hybrid remote support)
- Slide deck and printed/digital reference sheet
- All exercise files, datasets, and starter scripts used on the day
- Follow-up Q&A via email for one week after each session

Across the full programme:
- **SASA Prompt Library** — a living document of tested prompts for real tasks, growing across all six sessions
- **Automated Excel reporting template** with VBA macro for weekly mill data
- **Python script** — R7106 CSV export → formatted automated summary report
- **Local AI setup** (Ollama + Open WebUI) on each attendee's machine
- **Working agentic workflow** connected to a real SASA data source
- **90-day team action plans** + **SASA internal AI roadmap document**

---

## Prerequisites

To ensure sessions run smoothly, SASA is asked to arrange the following:

**Before Session 1:**
- Attendee machines have administrator rights for software installation
- Projector and screen on-site; video conferencing link for remote participants
- Shared location established for the SASA Prompt Library (SharePoint, Google Drive, or equivalent)

**Before Session 3:**
- Python 3 pre-installed on all machines, or IT approval to install on the day

**Before Session 4:**
- Dedicated local AI machine available and connected to the local network (see hardware spec in Session 4 above)
- Ollama installed and running in server mode on the dedicated machine
- VS Code installed on machines being used for coding exercises
- Chosen AI model pre-downloaded onto the dedicated machine (2–4 GB) — must be done before session day to avoid bandwidth delays

**All sessions:**
- Sample or anonymised R7106 export data available for exercises

---

## Investment

| Session | Date | Fee |
|---|---|---|
| Session 1 — AI as Your Thinking Partner | TBC | R3,500 |
| Session 2 — Excel & Data Mastery with AI | TBC | R3,500 |
| Session 3 — Coding with AI | TBC | R3,500 |
| Session 4 — Running AI Locally | TBC | R3,500 |
| Session 5 — Agentic Workflows | TBC | R3,500 |
| Session 6 — Capstone & Roadmap | TBC | R3,500 |
| **Programme Total** | | **R21,000** |

*All fees exclude VAT. Travel, accommodation, and expenses are billed separately where applicable. Sessions are invoiced individually on completion. Cancellation or rescheduling requires a minimum of 5 business days' notice.*

---

## Suggested Session Schedule

Sessions work best when spaced one to two weeks apart. This gives participants time to apply what they've learned before the next session, which significantly improves both retention and the quality of work produced in subsequent sessions. At this cadence, the full programme can be completed within approximately two months.

A suggested cadence:

| Session | Suggested Timing |
|---|---|
| Session 1 | Week 1 |
| Session 2 | Week 2–3 |
| Session 3 | Week 3–4 |
| Session 4 | Week 5–6 |
| Session 5 | Week 6–7 |
| Session 6 | Week 7–8 |

Exact dates to be confirmed at mutual agreement.

---

## Tools Used in This Programme

Most tools used are free or open-source. The one recommended paid account is a shared Claude subscription for the whole team.

**Recommended: Shared Claude Account (~$200/month)**
A single shared Claude Team or API account at approximately $200/month covers the whole team and unlocks:
- Access to the most capable Claude models (Opus-level)
- Maximum effort / extended thinking settings for complex analysis
- Projects — organise work by team or use case
- Full Excel and PowerPoint integration features (Session 2)
- Priority access and higher usage limits

This is optional for the introductory sessions but strongly recommended from Session 2 onwards to get the full value of the integrations.

| Tool | Cost | Purpose |
|---|---|---|
| Claude.ai | Free tier / ~$200/mo shared (recommended) | Primary AI assistant + Excel/PowerPoint integration |
| Microsoft Copilot (Word/Outlook) | Included in M365 licences | In-Office AI |
| Python | Free, open-source | Scripting and automation |
| Claude Code CLI | Free | Terminal AI coding assistant |
| Windsurf IDE | Free tier available | AI-powered code editor |
| Ollama | Free, open-source | Local AI model runtime |
| Open WebUI | Free, open-source | Local ChatGPT-style interface |
| Continue.dev | Free, open-source | Local AI coding in VS Code |
| n8n | Free, open-source (self-hosted) | Workflow automation |

---

## About This Programme

This programme was designed in response to SASA's specific request for deeper, more practical AI training following the introductory session. The curriculum is built around three pain points that came directly from that conversation: the time cost of report compilation, the complexity of working with R7106 mill data, and the effort involved in producing written communications at scale.

Every session is designed to be immediately applicable — not theoretical. By the end of the programme, participants will have built tools and workflows they can take back to their desks on Monday.

---

*To confirm your interest or discuss dates, please respond to this proposal. A signed acceptance or purchase order constitutes agreement to the terms outlined above.*

**[Your Name]**
**[Your Email]**
**[Your Phone]**
**[Company / Trading Name]**
