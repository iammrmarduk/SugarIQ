# SASA AI Training Programme — Design Spec
**Date:** 2026-03-22
**Client:** South African Sugar Association (SASA)
**Facilitator:** [Your Name]
**Status:** Approved by client — ready for proposal

---

## Context

SASA previously attended a Session 0 intro covering basic AI tools and prompt engineering. That session was hampered by locked machines preventing tool installation. This 6-session programme builds on that foundation, going significantly deeper across coding, data workflows, local AI, and agentic automation.

### Audience
- Mixed group: mill operations, agronomists, field staff, data analysts, management
- Technical level: Some — Excel-heavy, basic scripting in parts of the room, no hardcore developers
- Format: Small in-person group (<10) + hybrid remote attendees via video link
- Session length: 9:30–15:00 (5.5 hours)

### Pain Points to Address
- **Reporting:** Weekly/monthly reports taking too long to compile
- **Data:** Working with R7106 mill data (Excel exports, season performance analysis)
- **Communication:** Writing reports, summaries, grower letters, proposals

### Success Criteria
- Practical skills: Attendees use AI tools independently in their day-to-day work
- Tool building: Specific people can build scripts, templates, and workflows the organisation actually uses
- Strategic direction: SASA has a clear sense of where AI fits in their roadmap and a plan to build internal capability

---

## Curriculum Philosophy

**Approach:** Project-led learning with largely self-contained sessions.
Each session teaches tools in the morning and applies them to a real SASA workflow in the afternoon. Sessions 1–2 are fully independent. Sessions 3, 4, and 5 form a soft technical track — each can be followed without the previous one, but a pre-built starter script is provided for Sessions 4 and 5 so that attendees who missed an earlier session can still participate fully. All sessions build toward a running artefact — the **SASA Intelligence Toolkit** — across the full programme.

> **Note on Session 1:** The SASA Prompt Library created here is the foundation for the community of practice introduced in Session 6. Establish from day one where it lives (SharePoint / Google Doc), who owns it, and how attendees will add to it between sessions.

**Session Structure:**
| Time | Block |
|---|---|
| 9:30–10:30 | Teach — concepts + demo |
| 10:30–10:45 | Break |
| 10:45–12:15 | Guided hands-on |
| 12:15–13:00 | Lunch |
| 13:00–14:30 | Build — apply to real SASA workflow |
| 14:30–15:00 | Review + challenge for next session |

---

## Session Designs

### Session 1 — AI as Your Thinking Partner (Deep Dive)
**Theme:** Getting dramatically more out of AI tools already accessible

**Morning:**
- Reframe session 0 limitations — locked machines, what we missed
- Mental model shift: AI as junior analyst, not search engine
- Advanced prompting: role assignment, chain-of-thought, few-shot examples
- Long document analysis — paste a full mill report, structured questioning
- Tone, format, audience control — same content, three outputs
- Microsoft Copilot in Word & Outlook (no install required)

**Afternoon — Build:**
- Each person identifies their most time-consuming writing task
- Build and refine a prompt that produces a usable first draft
- Collect into shared **SASA Prompt Library** (Google Doc / SharePoint)

**Session Deliverable:** SASA Prompt Library — 10–15 tested, named prompts for real tasks

---

### Session 2 — Excel & Data Mastery with AI
**Theme:** Integrating Claude directly with Excel — and beyond

**Morning:**
- Direct Claude integration with Excel — send data to Claude and receive analysis, summaries, and recommendations without leaving the spreadsheet
- AI-generated formulas — describe what you want, get the formula
- Data cleaning with Claude — paste messy data, get clean structured output
- Dashboard building from R7106 exports — pivot tables, conditional formatting via AI
- Excel Copilot walkthrough (where available)
- *(PowerPoint integration — generating slides directly from data. Requires paid Claude account — see account recommendation below.)*

> **Claude Account Recommendation:** Full Excel/PowerPoint integration and top-model access require a paid Claude subscription. Recommended: one shared Claude Team or API account at ~$200/month for the whole team. Unlocks top models (Opus-level), maximum effort/extended thinking, Projects, and all integration features used in Sessions 2 onwards.

**Afternoon — Build:**
- Connect Claude to Excel using the integration layer
- Work with actual R7106 export data — send to Claude, receive formatted analysis
- Generate a performance summary and slide-ready PowerPoint output driven by AI

**Session Deliverable:** Live Claude–Excel integration producing automated mill reporting and analysis

---

### Session 3 — Coding with AI (No Experience Required)
**Theme:** You don't need to know how to code — you need to know what you want

**Morning:**
- New paradigm: describe the problem, AI writes the code, you guide and review
- Claude Code CLI — install, setup, first commands
- Windsurf IDE — conversation with your codebase
- Python basics through AI: reading a CSV, filtering, exporting summary
- When to use Claude Code vs Windsurf vs Claude.ai

**Afternoon — Build:**
- AI-assisted Python script that:
  - Reads an R7106 CSV export
  - Calculates per-mill averages for key fields
  - Outputs formatted summary report (CSV or PDF)
- Everyone runs it on their machine with real data

**Session Deliverable:** Working Python script — R7106 → automated summary report

**Prerequisite:** Machines must have admin rights. Python 3.x pre-installed or IT approval to install on day.

---

### Session 4 — Running AI Locally (Privacy, Speed, Control)
**Theme:** One dedicated machine on the network — everyone connects via browser

**Morning:**
- Why local models matter for a regulated/sensitive industry (confidential mill data, grower records)
- The network model: Ollama runs as a server on one dedicated machine; all attendees access it via Open WebUI in their browser — no per-machine setup required
- Installing and configuring Ollama in server mode
- Model choices: Llama 3, Mistral, Gemma, Phi-3 — what each is good for
- Open WebUI — everyone connects via browser, like a shared web app
- Continue.dev extension for VS Code — connects to the local Ollama server

**Afternoon — Build:**
- All attendees connect to the shared local AI server via browser
- Query a confidential-style mill report — nothing leaves the network
- Extend the Session 3 Python script to use Ollama for AI-generated narrative summaries
  *(Starter script provided for attendees who missed Session 3 — no dependency on attendance)*

**Session Deliverable:** Shared local AI server accessible to everyone on the network

> **Note:** This is intentionally an offline session — Claude.ai is not used to reinforce the "local only" theme and demonstrate that capable AI does not require cloud connectivity or subscriptions.

**Dedicated Machine Hardware Spec (facilitator to confirm with SASA IT ahead of this session):**

SASA does not need to install AI on every machine. One dedicated machine on the local network is sufficient.

| Component | Minimum (demo / 2B models) | Recommended (team use / 7B models) |
|---|---|---|
| CPU | Modern i5 / Ryzen 5 (8th gen+) | Intel i7 / Ryzen 7 (12th gen+) |
| RAM | 16 GB | 32 GB |
| GPU | Any dedicated GPU with 4 GB VRAM | NVIDIA RTX 3060 (12 GB VRAM) or better |
| Storage | 20 GB free (SSD) | 50 GB free (SSD) |
| Network | Local network access | Wired ethernet preferred |
| OS | Windows 10/11 or Linux | Windows 10/11 or Ubuntu 22.04+ |

*Ollama runs as a background service on this machine. All team members access it via browser — no AI software required on individual machines.*

---

### Session 5 — Agentic Workflows (AI That Does the Work)
**Theme:** Stop prompting manually — build AI that runs tasks automatically

**Morning:**
- What agents are: AI + tools + a loop
- MCP (Model Context Protocol) — connecting Claude to files, Excel, browsers, APIs
- n8n for no-code automation (open source, self-hostable)
- Agentic patterns relevant to sugar industry: anomaly flagging, report triggers, grower alerts

**Afternoon — Build (group chooses one):**

All three options use a **pre-scaffolded n8n workflow** provided by the facilitator. Attendees configure and extend it rather than build from scratch — this keeps the afternoon achievable for a non-developer group.
*(Pre-configured Ollama connection and starter script provided for attendees who missed Session 4 — no dependency on prior attendance)*

- **Option A:** Agent that monitors a folder for new R7106 exports → processes them via Python → emails a flagged anomaly summary
  - *Pre-built: folder watch node, Python processor. Attendees configure: email credentials, flagging thresholds*
- **Option B:** Workflow that reads weekly mill data → sends to local Ollama → saves AI-generated narrative to SharePoint
  - *Pre-built: data read node, Ollama connection. Attendees configure: SharePoint target, narrative prompt*
- **Option C:** Grower communication workflow — data row in → AI fills a letter template → output to file or email
  - *Pre-built: data ingestion, template. Attendees configure: letter tone, output destination*

**Minimum viable outcome per option:** A working end-to-end run with real or sample data, even if not all configuration is complete.

**Session Deliverable:** Working automated workflow connected to a real SASA data source

---

### Session 6 — Capstone + Roadmap (Build, Demo, Plan Forward)
**Theme:** Putting it all together — and knowing where to go next

> **Note:** Session 6 intentionally deviates from the standard session structure. There is no teach block or guided hands-on. The full day is split between showcase (morning) and strategic planning (afternoon).

**Morning — Polish & Present (9:30–12:15):**
- 9:30–10:00: Finish and tidy work from sessions 1–5
- 10:00–11:15: Demos — each person/team presents their best build (5 min each, up to 10 people = 50 min + buffer). *(Remote attendees: facilitator to confirm before this session whether they present or observe — if presenting, allow an extra 10–15 min)*
- 11:15–11:30: Break
- 11:30–12:15: Group review — what worked, what surprised, what will actually be used; facilitator synthesises themes

**Afternoon — Strategic Direction:**
- Where AI is heading in agriculture and agribusiness (3–5 year view)
- What SASA should be thinking about: precision ag, grower analytics, supply chain intelligence, predictive maintenance
- Building internal capability: AI champion role, learning cadence
- SASA community of practice: shared prompt library, monthly show-and-tell
- Roadmap exercise: each team leaves with a written 90-day AI adoption plan

**Session Deliverable:** 90-day AI action plans per team + SASA internal AI roadmap document

---

## Programme Deliverables Summary

| Session | Deliverable |
|---|---|
| 1 | SASA Prompt Library (10–15 tested prompts) |
| 2 | Live Claude–Excel integration for automated mill reporting and analysis (+ PowerPoint output) |
| 3 | Python script: R7106 CSV → formatted summary report |
| 4 | Shared local AI server (Ollama + Open WebUI) on dedicated network machine — browser access for all |
| 5 | Working agentic workflow connected to real SASA data |
| 6 | 90-day team action plans + SASA AI roadmap document |

Each session also includes: slide deck, reference sheet, and all exercise files.

---

## Quote

| Item | Cost |
|---|---|
| Session 1 — AI Thinking Partner | R3,500 |
| Session 2 — Excel & Data with AI | R3,500 |
| Session 3 — Coding with AI | R3,500 |
| Session 4 — Local AI Models | R3,500 |
| Session 5 — Agentic Workflows | R3,500 |
| Session 6 — Capstone + Roadmap | R3,500 |
| **Total** | **R21,000** |

*Travel, accommodation and expenses billed separately if applicable. Sessions to be scheduled at mutually agreed dates, recommended 1–2 weeks apart, full programme completable within approximately 8 weeks.*

---

## Prerequisites (SASA to arrange)

**Before Session 1:**
- [ ] Attendee machines have admin rights for software installation
- [ ] Projector/screen on-site + video conferencing link for remote attendees
- [ ] SharePoint or shared drive location established for SASA Prompt Library

**Before Session 3:**
- [ ] Python 3.x pre-installed on all machines, or IT approval to install on the day

**Before Session 4:**
- [ ] Dedicated local AI machine available and on the local network (see hardware spec in Session 4)
- [ ] Ollama installed and running in server mode on the dedicated machine (not on individual attendee machines)
- [ ] VS Code installed on machines being used for coding exercises
- [ ] Chosen model pre-downloaded onto the dedicated machine (Llama 3 ~4GB, Mistral ~4GB, Phi-3 ~2GB) — must be done before session day

**All sessions:**
- [ ] Sample R7106 export data available for exercises (anonymised or sample data acceptable)

---

## Tools Used Across the Programme

| Tool | Sessions | Purpose |
|---|---|---|
| Claude.ai | 1, 2, 3, 5 | Primary AI assistant + Excel/PowerPoint integration (intentionally excluded from Session 4 — offline session) |
| Claude account (~$200/mo shared) | 2+ | Required for full integrations, top models, extended thinking — one shared account recommended |
| Microsoft Copilot (Word/Outlook) | 1, 2 | In-Office AI, no install needed |
| Excel (+ Claude integration) | 2 | Data analysis and reporting via direct Claude integration |
| Claude Code CLI | 3 | Terminal-based AI coding |
| Windsurf IDE | 3 | AI-powered code editor |
| Python | 3, 4, 5 | Scripting and automation |
| Ollama | 4 | Local model runtime |
| Open WebUI | 4 | Local ChatGPT-style interface |
| Continue.dev | 4 | Local AI coding in VS Code |
| n8n | 5 | No-code workflow automation |
| MCP (Model Context Protocol) | 5 | Claude tool connections |
