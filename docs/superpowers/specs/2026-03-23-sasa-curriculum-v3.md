# SASA Applied AI Programme — Curriculum Design Spec V3
**Date:** 2026-03-23
**Client:** South African Sugar Association (SASA)
**Facilitator:** Richard [Surname]
**Status:** Updated post-meeting — ready for proposal v3

---

## Context & Changes from V2

**Key changes from meeting (23 March 2026):**
- Language shift: "training" → "consulting/building" — must sit under Professional Fees budget
- Sessions: 6 → 10 (may reduce to 8 if budget not approved)
- Session length: 5.5 hours → 7 hours (3.5 + lunch/breaks + 3.5)
- Location confirmed: SASA facility, Mount Edgecombe, in-person
- Participants: 15 in-person (11 managers + 3–5 directors) + up to 11 supervisors joining online
- Cadence: approximately every 2 weeks (flexible)
- Claude account: ~$100/month (~R1,700) shared — not $200
- New technical areas: Node.js, LIMS integration, Autolab, RAG, large datasets (10 years, multiple centres)
- Dave and Sheetal already advanced — use their work as context and examples throughout
- IT meeting tomorrow re: local AI infrastructure (16 GB RAM minimum)
- Deadline for all paperwork: Wednesday 25 March 2026

---

## Audience

- **In-person:** 11 managers + 3–5 directors, SASA Mount Edgecombe (~15 total)
- **Remote:** Up to 11 supervisors joining selected sessions online
- **Technical level:** Mixed — some already using Claude for dashboards and analysis (Dave, Sheetal), others less engaged. Must support both simultaneously.
- **Existing work:** Significant AI work already done by Dave and Sheetal — review before Session 1 to use as working examples throughout

---

## Pain Points Being Addressed

- Manually authored report commentary repeated week after week
- R7106 and multi-centre historical data (10 years) difficult to query and synthesise
- LIMS exception detection relies on manual review of lengthy reports
- Autolab instrument data not connected to any alerting system
- No AI directly embedded in source systems — AI used only after data is exported
- SharePoint adequate for documents but insufficient architecture for AI integration

---

## Curriculum Philosophy

**Core principle:** Every session produces a working deliverable using SASA's actual data. No synthetic examples.

**Pacing:**
- Sessions 1–3: Data and tooling foundations
- Sessions 4–6: Technical capability + local infrastructure
- Sessions 7–8: SASA-specific system integrations (LIMS, Autolab, agents)
- Sessions 9–10: Production deployment + institutionalisation

**Hybrid access:** Sessions 3, 5, and 8 are most self-contained for online supervisors. Each session opens with a 15-minute synthesis of previous session output.

**Catch-up provision:** All outputs stored in shared SASA consulting log (SharePoint). Missed sessions → review deliverables and re-engage without being blocked.

**Language discipline:** All deliverables framed as "built" or "specified", not "learned". Invoices and materials reference "Applied AI Consulting" and "integration development".

---

## Session Structure (7 hours)

| Time | Block |
|---|---|
| 09:00–12:30 | Morning block (3.5 hrs, one break included) |
| 12:30–13:30 | Lunch |
| 13:30–17:00 | Afternoon block (3.5 hrs, one break included) |

Structure within blocks is flexible based on the work in progress.

---

## Session Designs

### Session 1 — Foundations Audit & Strategic Framing

**Morning:**
- Review AI work already done by Dave and Sheetal — present as the benchmark, not the exception
- Map SASA's data landscape together: R7106 records, LIMS exports, Autolab CSVs, multi-centre historical data, mill reports
- Identify datasets with highest integration potential and operational friction
- Configure tooling: Claude Pro shared account, Copilot licence review, desktop setup for all attendees

**Afternoon:**
- Establish shared prompt discipline using SASA's own report language
- Define programme capstone goal(s) as a group — agreed integration targets for all sessions to build toward
- Set up shared consulting log in SharePoint: folder structure, naming conventions, access for online attendees

**Deliverable:** SASA data & systems map + agreed integration targets document + consulting log established

---

### Session 2 — Excel as a Data Engineering Surface

**Morning:**
- Rebuild one real SASA Excel report using Claude as live co-pilot
- Structured data principles: column naming, type consistency, AI-readable format
- Build Claude prompt library for Excel: summarisation, anomaly detection, trend commentary

**Afternoon:**
- Apply Microsoft Copilot Excel integration to same dataset — compare outputs, establish workflow preference
- Design exception-flagging template for one reporting area (e.g., lab results outside control limits)
- Document workflow for supervisor-level operation

**Deliverable:** Rebuilt AI-augmented Excel report + exception-flagging template for one SASA reporting area

---

### Session 3 — Working with Large Datasets & RAG

**Morning:**
- Introduce RAG (Retrieval Augmented Generation): the AI-as-librarian pattern — practical analogy, no code required
- Work with SASA multi-year multi-centre data: slice, filter, summarise using Claude with structured exports
- Surface data structural problems that limit AI effectiveness

**Afternoon:**
- Build simple document index: SharePoint metadata or structured naming for targeted AI queries
- Introduce Python conceptually — show a 5-line AI-generated script reshaping a dataset
- Design SASA data-preparation checklist for LIMS, Autolab, and mill report formats

**Deliverable:** SASA data-preparation checklist + working RAG demonstration against internal SASA documents

> **Note for online supervisors:** This session is high-value to join — the RAG concept and data checklist apply directly to all roles.

---

### Session 4 — Python & Node.js as Integration Glue

**Morning:**
- Consulting frame: managers direct and review code, AI writes it — session builds that literacy
- Build a real Python data pipeline with AI assistance: LIMS export → transformation → flagged output
- Introduce Node.js contrast: Python for data; Node.js for API/web connectors to SharePoint and source systems

**Afternoon:**
- Build pipeline stub: LIMS export → Python → formatted Excel/JSON output
- Introduce version control thinking for AI-generated code
- Each participant identifies one repetitive data task for automation (inputs for Sessions 7–8)

**Prerequisite:** Python and Node.js must be pre-installed. IT support required.

**Deliverable:** Working LIMS-to-output data pipeline stub + automation candidate list per team area

---

### Session 5 — PowerPoint, Reporting & AI-Generated Narratives

**Morning:**
- Audit reporting burden: hours per week writing the same interpretive text — ROI conversation for directors
- Build repeatable narrative workflow: structured data → Claude prompt → draft → human review → sign-off
- Apply to one actual SASA periodic report

**Afternoon:**
- Use Copilot PowerPoint integration to generate slides from a SASA data summary — refine via prompt iteration
- Design report commentary template: SASA house style, regulatory language, exception conventions encoded
- Produce one complete AI-assisted report draft from real data — something a director reviews in-session

**Deliverable:** AI-assisted SASA report draft + reusable report commentary prompt template

---

### Session 6 — Running AI on SASA Infrastructure

**Morning:**
- Open with IT meeting findings — map against Session 3 data boundary decisions
- Install and configure local AI model on SASA server (with IT present if possible)
- Walk through Ollama server mode + Open WebUI browser access — no software on individual machines

**Afternoon:**
- Design SASA data governance framework: cloud vs. on-premise classification — one-page policy for director sign-off
- Build local RAG demonstration: index SASA internal documents, query without internet
- Establish hosting and maintenance model: ownership, upgrade path, relation to SharePoint

**Server minimum spec:**
- 16 GB RAM (32 GB recommended)
- Modern CPU (i7/Ryzen 7+)
- Dedicated GPU with 4+ GB VRAM (12 GB recommended for 7B models)
- 50 GB free SSD storage
- Network-accessible, preferably wired

**Deliverable:** Local AI server operational + SASA data governance policy document

---

### Session 7 — LIMS & Autolab Integration

**Morning:**
- Map LIMS data flow end to end: entry → review → exception detection → reporting — identify where exceptions are caught late or missed
- Define business rules with laboratory managers
- Build AI-assisted exception detection layer: Python script or prompt chain flagging out-of-spec results

**Afternoon:**
- Design notification architecture: exception detected → channel (email/Teams/SharePoint) → alert content
- Address Autolab: map where AI intercepts instrument data upstream of LIMS (calibration drift, anomaly detection)
- Produce written integration specification: a brief IT can implement independently

**Deliverable:** LIMS exception detection workflow + Autolab integration specification document

---

### Session 8 — Agentic Workflows & Automation Pipelines

**Morning:**
- Distinguish prompt from agent: multi-step autonomous decision-making — use LIMS exception workflow from Session 7 as reference
- Build multi-step agentic workflow: data arrives → AI checks rules → exception detected → draft alert → human reviews → acts
- Introduce tool use and function calling: specific capabilities without unrestricted access

**Afternoon:**
- Design failure modes and human override: safe failure, correct escalation, audit trail — critical for regulated environment
- Each participant maps one workflow for conversion from manual review to agentic exception flagging
- Begin building one selected workflow end-to-end

> **Pre-built n8n scaffold provided:** Attendees configure and extend rather than build from scratch. Pre-configured Ollama connection available if Session 6 server not yet in place.

**Minimum viable outcome:** One working end-to-end run with real or representative data before session ends.

**Deliverable:** Working agentic exception-flagging workflow + automation pipeline maps per team area

---

### Session 9 — Source System Integration & Production Deployment

**Morning:**
- Build functional integration prototypes from Session 8 maps: real data, real rules, real output channels
- Build lightweight API connector (Node.js or Python, AI-generated): SASA AI layer ↔ source system without manual exports
- Address SharePoint role: document/notification layer vs. integration pattern

**Afternoon:**
- Review Autolab-to-LIMS chain with prototypes in hand — partial live implementation where feasible
- Produce SASA AI architecture diagram: which systems talk to which AI layer, what data moves where, what humans approve
- Document deployment checklist: what each integration requires to go live

**Deliverable:** Working integration prototypes + SASA AI architecture diagram

---

### Session 10 — Capstone Review, Governance & Roadmap

**Morning (showcase):**
- 09:00–09:30: Finish and tidy work from sessions 1–9
- 09:30–11:00: Demos — each participant/team presents their deliverable (5 min each; directors present)
- 11:00–11:15: Break
- 11:15–12:30: Structured review vs. Session 1 targets — what was built, what remains, why

**Afternoon (governance + roadmap):**
- Build SASA AI governance framework: acceptable use, data classification, prompt library ownership, model maintenance
- Design ongoing operating model: who maintains what, how new use cases are prioritised
- Address skills continuity: which roles need deep capability (Dave/Sheetal tier), which need operational literacy
- 12-month roadmap exercise: 3–5 integration targets, sequenced by value and complexity, with owners and effort

**Deliverable:** AI governance framework + 12-month integration roadmap + individual 90-day action plans

---

## Deliverables Summary

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + programme integration targets + consulting log |
| 2 | AI-augmented Excel report + exception-flagging template |
| 3 | Data-preparation checklist + RAG demonstration |
| 4 | LIMS-to-output data pipeline stub + automation candidate list |
| 5 | AI-assisted report draft + report commentary template |
| 6 | Local AI server operational + data governance policy |
| 7 | LIMS exception detection workflow + Autolab integration spec |
| 8 | Agentic exception-flagging workflow + automation pipeline maps |
| 9 | Integration prototypes + SASA AI architecture diagram |
| 10 | Governance framework + 12-month roadmap + 90-day action plans |

---

## Quote Summary

| Option | Sessions | Rate | Subtotal | VAT (15%) | Total |
|---|---|---|---|---|---|
| Full programme | 10 | R3,500 | R35,000 | R5,250 | R40,250 |
| Reduced (if needed) | 8 | R3,500 | R28,000 | R4,200 | R32,200 |

*Sessions 9–10 deferred in the 8-session option.*

---

## Prerequisites

**Before Session 1:**
- [ ] Claude Pro shared account set up and access distributed to all attendees
- [ ] Attendee machines have admin rights for software installation
- [ ] Projector and screen on-site + video conferencing link for remote participants
- [ ] SharePoint location established for consulting log
- [ ] Richard reviews Dave and Sheetal's existing AI work before this session

**Before Session 4:**
- [ ] Python 3.x pre-installed on all attendee machines (IT support)
- [ ] Node.js LTS pre-installed on all attendee machines (IT support)
- [ ] VS Code pre-installed

**Before Session 6:**
- [ ] IT meeting completed; infrastructure findings available
- [ ] Dedicated AI server available on local network (see spec above)
- [ ] Ollama pre-installed on server
- [ ] Chosen model pre-downloaded on server (Llama 3 ~4 GB, Mistral ~4 GB, Phi-3 ~2 GB)

**All sessions:**
- [ ] Sample or live SASA data available per session topic (R7106 exports, LIMS exports, Autolab CSVs as relevant)

---

## Tools Reference

| Tool | Sessions | Cost | Purpose |
|---|---|---|---|
| Claude.ai (Pro shared) | 1–5, 7–10 | ~R1,700/mo | Primary AI assistant + Excel/PowerPoint integration (excluded from S6 — offline) |
| Microsoft Copilot | 2, 5 | Included in M365 | In-Office AI for Excel and PowerPoint |
| Python | 3, 4, 6–9 | Free | Data transformation and pipeline scripting |
| Node.js | 4, 9 | Free | API connectors and web-facing integrations |
| VS Code | 4, 7–9 | Free | Code review and management |
| Windsurf IDE | 4 | Free tier | AI-powered code editor |
| Claude Code CLI | 4 | Free | Terminal-based AI coding |
| Ollama | 6–9 | Free, open-source | Local AI model runtime on SASA server |
| Open WebUI | 6–9 | Free, open-source | Browser interface to local AI server |
| n8n | 8, 9 | Free, open-source | Agentic workflow automation (self-hosted) |
| MCP (Model Context Protocol) | 8, 9 | Free | Claude tool connections to files, APIs, systems |

---

## IT Meeting Prep Notes (Tomorrow)

Key topics to cover with SASA IT:
- Server specification for local AI (see spec above — 16 GB RAM minimum confirmed in meeting)
- LIMS API access or export format for integration work in Session 7
- Autolab data export format and frequency
- SharePoint current architecture — what integration points exist
- Python and Node.js installation approval for attendee machines
- Network architecture: can the AI server be reached by all attendee machines on the same LAN?
- Data security policy — what data can go to Claude Pro vs. must stay on-premise
- Claude licensing approval timeline (Richard to send licensing info before this meeting)
