# SASA Applied AI Programme — Curriculum Design Spec V5
**Date:** 2026-03-23
**Client:** South African Sugar Association (SASA)
**Facilitator:** Richard [Surname]
**Status:** V5 — Scaled to 6 sessions at R3,500 each (R21,000 excl. VAT)

---

## Changes from V4

- Programme scaled from 10 to 6 sessions
- Rate unchanged: R3,500 per session
- Total: R21,000 excl. VAT | R3,150 VAT | **R24,150 incl. VAT**
- Sessions 7–10 (LIMS, Autolab, agentic workflows, production deployment) available as a follow-on engagement
- Session 6 expanded: morning covers local AI infrastructure (as before); afternoon now includes condensed governance framework and 12-month roadmap — giving the programme a complete close-out arc

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
- Technical scope: Python, Node.js, RAG, large datasets (10 years, multiple centres)
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
- SharePoint adequate for documents; insufficient for AI integration
- No shared prompt discipline or reusable tooling across the team

---

## Curriculum Philosophy

**Core principle:** Every session produces a working deliverable using SASA's actual data. No synthetic examples.

**Prompt Engineering Thread:** Sessions 1–3 carry a deliberate prompt engineering track — embedded in real tasks, not a standalone module. By Session 3, every participant has a personal prompt library, understands context management, and can adapt prompt patterns to new problems independently.

**Programme arc:**
- Sessions 1–3: Data foundations + prompt literacy
- Sessions 4–5: Technical capability + reporting automation
- Session 6: Local infrastructure + governance + roadmap close-out

**Catch-up provision:** All outputs stored in shared SASA consulting log (SharePoint). Missed sessions → review deliverables and re-engage.

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

### Session 1 — Foundations Audit, Strategic Framing & Prompt Foundations

**Morning:**
- Review AI work already done by Dave and Sheetal — present as the benchmark, not the exception
- Map SASA's data landscape: R7106 records, LIMS exports, Autolab CSVs, multi-centre historical data, mill reports
- Identify datasets with highest integration potential and operational friction
- Configure tooling: Claude Pro shared account, Copilot licence review, desktop setup for all attendees

**Afternoon — Prompt Engineering Foundations (90 min):**
- Prompt anatomy: role, context, task, format (RCTF) — build SASA's first template using actual report language
- Claude-specific techniques: XML tags for structured output; 200K token context window in practice; Projects vs. conversations; system prompts
- Prompt iteration workflow: draft → test → refine → save — treating prompts as living documents
- Common failure modes: vague instructions, missing context, unspecified format — diagnose from real SASA examples
- Define programme capstone goals as a group — agreed integration targets all sessions build toward
- Establish SASA shared prompt library in SharePoint: naming, categories, validation discipline

**Deliverable:** SASA data & systems map + integration targets document + consulting log + seed prompt library (10–15 entries)

---

### Session 2 — Excel as a Data Engineering Surface

**Morning:**
- Rebuild one real SASA Excel report using Claude as live co-pilot
- Structured data principles: column naming, type consistency, AI-readable format
- **Prompt reuse patterns (45 min):** parameterised templates vs. fixed prompts; Excel prompt library (summarise, flag, extract, compare); prompt curation and version discipline; add validated prompts to shared library

**Afternoon:**
- Apply Microsoft Copilot Excel integration to same dataset — compare outputs, establish workflow preference
- Design exception-flagging template for one reporting area (e.g., lab results outside control limits)
- Document workflow for supervisor-level operation

**Deliverable:** Rebuilt AI-augmented Excel report + exception-flagging template + Excel prompt library additions

---

### Session 3 — Working with Large Datasets, RAG & Context Management

**Morning:**
- Introduce RAG (Retrieval Augmented Generation): the AI-as-librarian pattern — practical analogy, no code required
- Work with SASA multi-year multi-centre data: slice, filter, summarise using Claude with structured exports
- Surface data structural problems that limit AI effectiveness

**Afternoon — Context Management & Large Dataset Prompting (90 min):**
- Context window management: Claude's 200K token capacity in practice — when to paste vs. chunk vs. use RAG
- Chunking strategies: how to split a large dataset and query across chunks without losing coherence
- Summarisation chains: compress 10-year multi-centre data into structured briefings without losing outliers
- Prompting for synthesis vs. extraction: different approaches for "what does this mean" vs. "find the anomalies"
- Multi-document prompting: structuring queries across multiple SASA sources in one conversation
- Build simple document index; design SASA data-preparation checklist for LIMS, Autolab, and mill formats

**Deliverable:** SASA data-preparation checklist + working RAG demonstration + context management reference card

> **Note for online supervisors:** High-value session — RAG concept, context guide, and checklist apply across all roles.

---

### Session 4 — Python & Node.js as Integration Glue

**Morning:**
- Consulting frame: managers direct and review code, AI writes it — session builds that literacy
- Build a real Python data pipeline with AI assistance: LIMS export → transformation → flagged output
- Introduce Node.js contrast: Python for data; Node.js for API/web connectors to SharePoint and source systems

**Afternoon:**
- Build pipeline stub: LIMS export → Python → formatted Excel/JSON output
- Introduce version control thinking for AI-generated code
- Each participant identifies one repetitive data task for automation

**Prerequisite:** Python, Node.js LTS, and VS Code must be pre-installed. IT support required.

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
- Produce one complete AI-assisted report draft from real data — reviewed by a director in-session

**Deliverable:** AI-assisted SASA report draft + reusable report commentary prompt template

---

### Session 6 — Local AI Infrastructure, Governance & Programme Roadmap

This session serves two purposes: deploying SASA's local AI capability, and closing the programme with a governance framework and actionable roadmap.

**Morning:**
- Open with IT meeting findings — map against Session 3 data boundary decisions
- Install and configure local AI model on SASA server (with IT present if possible)
- Walk through Ollama server mode + Open WebUI browser access — no software on individual machines
- Design SASA data governance framework: cloud vs. on-premise classification — one-page policy for director sign-off
- Build local RAG demonstration: index SASA internal documents, query without internet

**Afternoon — Governance & Roadmap Close-out:**
- Review all six sessions against Session 1 integration targets — what was built, what remains
- Build SASA AI governance framework: acceptable use, data classification, prompt library ownership, model maintenance
- Design ongoing operating model: who maintains what, how new use cases are prioritised
- Address skills continuity: Dave/Sheetal tier vs. operational literacy — who needs to go deeper
- 12-month roadmap exercise: 3–5 integration targets sequenced by value and complexity, with owners and effort
- Individual 90-day action plans — one concrete next step per participant

**Server minimum spec:**
- 16 GB RAM (32 GB recommended)
- Modern CPU (i7/Ryzen 7+)
- Dedicated GPU with 4+ GB VRAM (12 GB recommended for 7B models)
- 50 GB free SSD · Network-accessible, preferably wired

**Deliverable:** Local AI server operational + data governance policy + 12-month integration roadmap + individual 90-day action plans

---

## Deliverables Summary

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + integration targets + consulting log + seed prompt library |
| 2 | AI-augmented Excel report + exception-flagging template + Excel prompt library |
| 3 | Data-preparation checklist + RAG demonstration + context management reference card |
| 4 | LIMS-to-output data pipeline stub + automation candidate list |
| 5 | AI-assisted report draft + report commentary template |
| 6 | Local AI server + data governance policy + 12-month roadmap + 90-day action plans |

---

## Quote

| Option | Sessions | Rate | Subtotal | VAT (15%) | Total |
|---|---|---|---|---|---|
| 6-session programme | 6 | R3,500 | R21,000 | R3,150 | R24,150 |
| Extension (Sessions 7–10) | 4 | R3,500 | R14,000 | R2,100 | R16,100 |

*Sessions 7–10 cover LIMS & Autolab integration, agentic workflows, source system deployment, and capstone review. Available as a follow-on engagement.*

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

**Before Session 6:**
- [ ] IT meeting completed; infrastructure findings available
- [ ] Dedicated AI server available on local network
- [ ] Ollama pre-installed on server
- [ ] Model pre-downloaded (Llama 3 ~4 GB, Mistral ~4 GB, or Phi-3 ~2 GB)

**All sessions:**
- [ ] Sample or live SASA data available per session topic

---

## Tools Reference

| Tool | Sessions | Cost | Purpose |
|---|---|---|---|
| Claude.ai (Pro shared) | 1–5 | ~R1,700/mo | Primary AI assistant + Excel/PowerPoint integration |
| Microsoft Copilot | 2, 5 | Included in M365 | In-Office AI for Excel and PowerPoint |
| Python | 3, 4, 6 | Free | Data transformation and pipeline scripting |
| Node.js | 4 | Free | API connectors and web-facing integrations |
| VS Code | 4 | Free | Code review and management |
| Windsurf IDE | 4 | Free tier | AI-powered code editor |
| Claude Code CLI | 4 | Free | Terminal-based AI coding |
| Ollama | 6 | Free, open-source | Local AI model runtime on SASA server |
| Open WebUI | 6 | Free, open-source | Browser interface to local AI server |

---

## IT Meeting Prep Notes

Key topics to cover with SASA IT:
- Server specification for local AI (16 GB RAM minimum confirmed)
- LIMS API access or export format (for future Sessions 7–10 if extended)
- Autolab data export format and frequency (future integration)
- SharePoint architecture — what integration points exist
- Python and Node.js installation approval for attendee machines
- Network: can the AI server be reached by all attendee machines on the same LAN?
- Data security policy — what data can go to Claude Pro vs. must stay on-premise
- Claude licensing approval timeline (Richard to send licensing info before this meeting)
