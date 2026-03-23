# SASA Applied AI Programme — Curriculum Design Spec V6
**Date:** 2026-03-23
**Client:** South African Sugar Association (SASA)
**Facilitator:** Richard [Surname]
**Status:** V6 — Revised session structure: local AI, agents, and build day added to core programme

---

## Changes from V5

- Sessions 2 and 5 (Excel and Reporting) merged into a single session
- New Session 5: Local AI Infrastructure & Agentic Workflows (Ollama + n8n agent pipeline)
- New Session 6: Build Day + Governance & Roadmap close-out — teams build a working tool in-session
- Extension sessions 7–10 updated to reflect what remains after V6 core programme

---

## Context

**Key parameters:**
- Language: "consulting/building" throughout — Professional Fees budget line
- Sessions: 6
- Session length: 7 hours (3.5 + lunch/breaks + 3.5)
- Location: SASA facility, Mount Edgecombe, in-person
- Participants: 15 in-person (11 managers + 3–5 directors) + up to 11 supervisors online
- Cadence: approximately every 2 weeks
- Claude account: ~$100/month (~R1,700) shared
- Technical scope: Python, Node.js, RAG, large datasets (10 years, multiple centres), Ollama, n8n
- Dave and Sheetal already advanced — use their work throughout as examples
- IT meeting pending re: local AI infrastructure (16 GB RAM minimum)
- Paperwork deadline: Wednesday 25 March 2026

---

## Audience

- **In-person:** 11 managers + 3–5 directors (~15 total)
- **Remote:** Up to 11 supervisors joining selected sessions
- **Technical level:** Mixed — Dave and Sheetal already building; others less engaged
- **Approach:** Advanced members contribute as demonstrators; others build at their own level

---

## Pain Points Being Addressed

- Manual report commentary repeated every cycle
- R7106 and multi-centre historical data (10 years) difficult to query and synthesise
- No AI directly embedded in source systems — AI used only after export
- No shared prompt discipline or reusable tooling across the team
- No local AI capability — sensitive data currently at risk if sent to cloud services
- No agentic automation — every task requires a human to initiate it

---

## Curriculum Philosophy

**Core principle:** Every session produces a working deliverable using SASA's actual data. No synthetic examples.

**Prompt Engineering Thread:** Sessions 1–3 carry a deliberate prompt engineering track — embedded in real tasks, not a standalone module.

**Programme arc:**
- Sessions 1–3: Data foundations + prompt literacy
- Session 4: Technical integration glue
- Session 5: Local AI infrastructure + agentic automation
- Session 6: Build day — something real ships — then governance and roadmap close-out

**Build Day (Session 6):** Teams self-select into build groups and spend the morning building one working tool from their automation candidate lists. The afternoon showcases the builds and closes the programme with governance and roadmap. Participants leave with something they can use from Monday.

**Language discipline:** All deliverables framed as "built" or "specified". Invoices reference "Applied AI Consulting" and "integration development".

---

## Session Structure (7 hours)

| Time | Block |
|---|---|
| 09:00–12:30 | Morning block (3.5 hrs, one break included) |
| 12:30–13:30 | Lunch |
| 13:30–17:00 | Afternoon block (3.5 hrs, one break included) |

---

## Session Designs

### Session 1 — Foundations Audit, Strategic Framing & Prompt Engineering

**Morning:**
- Review AI work already done by Dave and Sheetal — present as the benchmark, not the exception
- Map SASA's data landscape: R7106 records, LIMS exports, Autolab CSVs, multi-centre historical data, mill reports
- Identify datasets with highest integration potential and operational friction
- Configure tooling: Claude Pro shared account, Copilot licence review, desktop setup for all attendees

**Afternoon — Prompt Engineering Foundations (90 min):**
- Prompt anatomy: role, context, task, format (RCTF) — build SASA's first template using actual report language
- Claude-specific techniques: XML tags for structured output; 200K token context window; Projects vs. conversations; system prompts
- Prompt iteration workflow: draft → test → refine → save — treating prompts as living documents
- Common failure modes: vague instructions, missing context, unspecified format — diagnose from real SASA examples
- Define programme capstone goals as a group — agreed integration targets all sessions build toward
- Establish SASA shared prompt library in SharePoint: naming, categories, validation discipline

**Deliverable:** SASA data & systems map + integration targets document + consulting log + seed prompt library (10–15 entries)

---

### Session 2 — Excel, Reporting & AI-Generated Workflows

This session combines AI-augmented Excel work with report narrative automation — two sides of the same problem: turning data into decisions faster.

**Morning — Excel as a Data Engineering Surface:**
- Rebuild one real SASA Excel report using Claude as live co-pilot
- Structured data principles: column naming, type consistency, AI-readable format
- **Prompt reuse patterns (45 min):** parameterised templates vs. fixed prompts; Excel prompt library (summarise, flag, extract, compare); prompt curation discipline; add validated prompts to shared library
- Apply Microsoft Copilot Excel integration — compare outputs, establish workflow preference
- Design exception-flagging template for one reporting area

**Afternoon — AI-Generated Report Narratives:**
- Audit the reporting burden: quantify hours per week writing the same interpretive commentary — the ROI conversation
- Build a repeatable narrative workflow: structured data → Claude prompt → draft → human review → sign-off
- Use Microsoft Copilot PowerPoint integration to generate slides from a SASA data summary
- Design a report commentary template encoding SASA's house style, regulatory language, and exception conventions
- Produce one complete AI-assisted report draft from real data — reviewed and approved by a director in-session

**Deliverable:** AI-augmented Excel report + exception-flagging template + Excel prompt library + reusable report commentary template + one completed AI-assisted report draft

---

### Session 3 — Working with Large Datasets, RAG & Context Management

**Morning:**
- Introduce RAG (Retrieval Augmented Generation): the AI-as-librarian pattern — practical analogy, no code required
- Work directly with SASA's multi-year, multi-centre datasets; surface where current data structures create friction
- Build a simple document index for targeted AI queries

**Afternoon — Context Management & Large Dataset Prompting (90 min):**
- Context window management: Claude's 200K token capacity — when to paste vs. chunk vs. use RAG
- Chunking strategies: split large datasets and query across chunks without losing coherence
- Summarisation chains: compress 10-year multi-centre data into structured briefings without losing outliers
- Prompting for synthesis vs. extraction — "what does this mean" vs. "find the anomalies"
- Multi-document prompting: structuring queries across multiple SASA sources in one conversation
- Design SASA data-preparation checklist for LIMS, Autolab, and mill formats

**Deliverable:** SASA data-preparation checklist + working RAG demonstration + context management reference card

> **Note for online supervisors:** High-value session — RAG concept, context guide, and checklist apply across all roles.

---

### Session 4 — Python & Automation Pipelines

**Morning:**
- Consulting frame: managers direct and review code, the AI writes it — this session builds that literacy
- Build a real Python data pipeline: LIMS export → transformation → flagged output → formatted report
- Introduce Node.js: when Python, when Node — API/web connectors to SharePoint and source systems

**Afternoon:**
- Complete the pipeline stub: LIMS export → Python → Excel/JSON output
- Introduce version control thinking for AI-generated code
- Each participant identifies one repetitive data task in their area for automation — these form the Session 6 build brief

**Prerequisite:** Python 3.x, Node.js LTS, and VS Code pre-installed. IT support required.

**Deliverable:** Working LIMS-to-output data pipeline stub + automation candidate list per team area (input to Session 6 build day)

---

### Session 5 — Local AI Infrastructure & Agentic Workflows

The session that changes how SASA thinks about AI: from a tool you ask questions to a system that does work.

**Morning — Local AI Deployment:**
- Open with IT meeting findings — map against Session 3 data boundary decisions
- Install and configure local AI model on SASA server with IT present
- Walk through Ollama server mode + Open WebUI browser access — no software required on individual machines
- Build local RAG demonstration: index SASA internal documents, query without internet
- Design SASA data governance framework: cloud vs. on-premise classification — one-page policy for director sign-off

**Afternoon — Agentic Workflows:**
- What is an agent? The difference between "I ask an AI" and "the AI does the task" — with SASA-relevant examples
- Introduce n8n: open-source visual workflow builder, runs on SASA infrastructure, no per-seat licence
- Build a simple SASA agent pipeline together: data input → exception check → draft alert → output to SharePoint or file
- Connect the pipeline to the Session 4 Python output — something real, not a demo
- Design SASA's first agentic use case specification — inputs, trigger conditions, outputs, human review gate

**Server minimum spec:**
- 16 GB RAM (32 GB recommended)
- Modern CPU (i7/Ryzen 7+)
- Dedicated GPU with 4+ GB VRAM (12 GB recommended for 7B models)
- 50 GB free SSD · Network-accessible, preferably wired

**Deliverable:** Local AI server operational + working n8n agent pipeline + SASA agentic use case specification + data governance policy

---

### Session 6 — Build Day, Governance & Programme Roadmap

The programme culminates with something concrete. Teams build a working tool; the afternoon turns that into a sustained capability.

**Morning — Build Day:**
- Teams self-select into 2–3 build groups based on their Session 4 automation candidate lists
- Each group selects one build target — examples: a prompt-driven Excel exception report, a Python pipeline for their data area, a local RAG Q&A over a SASA document set, or a simple n8n agent workflow
- Richard rotates between groups as senior consultant/reviewer
- Advanced members (Dave, Sheetal) lead their groups; others contribute at their level
- **Goal:** every group ships something that works — not a prototype, a usable first version

**Afternoon — Governance & Roadmap Close-out:**
- Showcase: each group presents their build (5 minutes + questions)
- Review all six sessions against Session 1 integration targets — what was built, what remains
- Build SASA AI governance framework: acceptable use policy, data classification, prompt library ownership, model maintenance
- Design ongoing operating model: who owns what, how new use cases are prioritised, how the consulting log stays current
- Address skills continuity: who needs to deepen capability; who needs operational literacy
- 12-month roadmap: 3–5 integration targets sequenced by value and complexity, with owners and effort
- Individual 90-day action plans — one concrete next step per participant

**Deliverable:** Team-built working tools (one per build group, usable from Monday) + data governance policy + 12-month integration roadmap + individual 90-day action plans

---

## Deliverables Summary

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + integration targets + consulting log + seed prompt library |
| 2 | AI-augmented Excel report + exception-flagging template + report commentary template + AI-assisted report draft |
| 3 | Data-preparation checklist + RAG demonstration + context management reference card |
| 4 | LIMS-to-output data pipeline stub + automation candidate list |
| 5 | Local AI server + n8n agent pipeline + agentic use case spec + data governance policy |
| 6 | Team-built working tools + 12-month roadmap + individual 90-day action plans |

---

## Extension Programme (Sessions 7–10)

Available as a follow-on engagement at R3,500 per session.

- **Session 7:** LIMS & Autolab deep integration — AI-assisted exception detection, notification architecture, Autolab data feed
- **Session 8:** Advanced agentic workflows — multi-step pipelines, scheduling, error handling, escalation paths
- **Session 9:** Source system integration & production deployment — API connectors, live LIMS/SharePoint integration
- **Session 10:** Capstone review, advanced governance & extended roadmap

---

## Quote

| Option | Sessions | Rate | Subtotal | VAT (15%) | Total |
|---|---|---|---|---|---|
| 6-session programme | 6 | R3,500 | R21,000 | R3,150 | R24,150 |
| Extension (Sessions 7–10) | 4 | R3,500 | R14,000 | R2,100 | R16,100 |

---

## Prerequisites

**Before Session 1:**
- [ ] Claude Pro shared account set up and access distributed to all attendees
- [ ] Attendee machines have admin rights for software installation
- [ ] Projector and screen on-site + video conferencing link for remote participants
- [ ] SharePoint location established for consulting log and prompt library
- [ ] Richard reviews Dave and Sheetal's existing AI work before this session

**Before Session 4:**
- [ ] Python 3.x pre-installed on all attendee machines (IT support)
- [ ] Node.js LTS pre-installed on all attendee machines (IT support)
- [ ] VS Code pre-installed

**Before Session 5:**
- [ ] IT meeting completed; infrastructure findings available
- [ ] Dedicated AI server available on local network
- [ ] Ollama pre-installed on server
- [ ] Model pre-downloaded (Llama 3 ~4 GB, Mistral ~4 GB, or Phi-3 ~2 GB)
- [ ] n8n pre-installed on server or accessible at a local URL

**Before Session 6:**
- [ ] Build briefs confirmed with each participant group (can be done at end of Session 5)
- [ ] Any data or exports needed for build day prepared and accessible

**All sessions:**
- [ ] Sample or live SASA data available per session topic

---

## Tools Reference

| Tool | Sessions | Cost | Purpose |
|---|---|---|---|
| Claude.ai (Pro shared) | 1–4 | ~R1,700/mo | Primary AI assistant + Excel/PowerPoint integration |
| Microsoft Copilot | 2 | Included in M365 | In-Office AI for Excel and PowerPoint |
| Python | 3, 4, 5, 6 | Free | Data transformation and pipeline scripting |
| Node.js | 4 | Free | API connectors and web-facing integrations |
| VS Code | 4 | Free | Code review and management |
| Ollama | 5, 6 | Free, open-source | Local AI model runtime on SASA server |
| Open WebUI | 5, 6 | Free, open-source | Browser interface to local AI server |
| n8n | 5, 6 | Free, open-source | Visual workflow automation and agentic pipelines |

---

## IT Meeting Prep Notes

- Server specification for local AI (16 GB RAM minimum confirmed)
- LIMS API access or export format (for Sessions 7–10 if extended)
- Autolab data export format and frequency (future integration)
- SharePoint architecture — integration points for n8n connectors
- Python and Node.js installation approval for attendee machines
- Network: can AI server be reached by all attendee machines on same LAN?
- Data security policy — what data can go to Claude Pro vs. must stay on-premise
- n8n installation on server (or as Docker container)
- Claude licensing approval timeline
