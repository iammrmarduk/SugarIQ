# Applied AI Consulting & Development Programme
## South African Sugar Association (SASA)

**Prepared for:** South African Sugar Association (SASA)
**Prepared by:** Richard [Surname] | [Company Name]
**Date:** 23 March 2026
**Reference:** PROP-SASA-2026-003
**Budget Line:** Professional Fees

> **Deadline Note:** All documentation must be approved by Wednesday, 25 March 2026.

---

## Executive Summary

This proposal outlines a six-session Applied AI Consulting and Development Programme to be delivered at SASA's Mount Edgecombe facility. The engagement is structured as a professional services programme under the professional fees budget — not a training initiative. The focus throughout is on building, integrating, and deploying AI-driven tools and workflows directly into SASA's existing systems and data environment.

Work will be conducted using SASA's own operational data — mill performance records, laboratory outputs, historical datasets spanning multiple centres — and will build directly on the foundations already established by members of the SASA team who have begun integrating AI into their reporting and analysis workflows.

Each session is a co-development engagement: the consultant and the SASA team work together to design, build, and refine AI-powered tools that address real operational problems. The programme concludes with a working local AI deployment, a data governance policy, and a 12-month integration roadmap that enables SASA to sustain and extend the capability independently.

---

## Engagement Philosophy

This is not a theoretical programme. Every session works with SASA's actual data and systems. The deliverables are not slide decks or certificates — they are working tools, tested integrations, documented workflows, and reusable automation templates.

**Framing principles:**
- We build using company data, not constructed examples
- Each session produces something SASA keeps and uses immediately
- Advanced team members are leveraged as context contributors and peer demonstrators
- Sessions accommodate different capability levels simultaneously — some participants build, others direct and review
- Every co-developed asset is stored in a shared SASA consulting log (SharePoint) accessible to all participants

---

## Programme Structure

**Format:** 6 co-development sessions × 7 hours
**Location:** SASA facility, Mount Edgecombe (in-person + hybrid remote)
**Attendance:** Up to 15 in-person (managers and directors) + up to 11 supervisors joining remotely for selected sessions
**Cadence:** Approximately one session every two weeks
**Session format:** 3.5 hours / lunch and breaks / 3.5 hours

**Flexibility provisions:**
- Sessions can be paused mid-programme to consolidate or catch up
- Different groups can be engaged at different depths simultaneously
- Online supervisors receive a 15-minute synthesis at the start of each session
- All outputs stored in the consulting log for anyone who misses a session

---

## Session Descriptions

### Session 1 — Foundations Audit & Prompt Foundations
*Establishing a shared baseline — and the prompt discipline that underpins the whole programme*

The first session is a structured audit and alignment exercise. We map SASA's current data landscape, establish the programme's specific integration targets, standardise tooling, and build the shared prompt foundations the whole team will use from this point forward.

**What we do together:**
- Review and contextualise AI work already completed within SASA — presenting existing dashboards and analysis as the benchmark for the rest of the group
- Map SASA's data landscape: R7106 records, LIMS exports, Autolab outputs, mill reports — identify where the highest operational friction currently exists
- Configure and standardise tooling: Claude Pro shared account, Microsoft Copilot licence review, setup for all participants
- **Prompt Engineering Foundations:** prompt anatomy (role, context, task, format); Claude-specific techniques — XML tags, 200K context window, system prompts; prompt iteration workflow; common failure modes with real SASA examples
- Establish SASA's shared prompt library in SharePoint — naming conventions, categories, validation discipline
- Define the programme's capstone goals as a group

**Session deliverable:** SASA data and systems map + integration targets document + seed prompt library (10–15 entries)

---

### Session 2 — Excel as a Data Engineering Surface
*Rebuilding existing Excel workflows as AI-augmented decision tools*

**What we do together:**
- Rebuild one real SASA Excel report using Claude as a live co-pilot
- Introduce structured data principles that make AI tools reason reliably over tabular data
- **Prompt reuse patterns:** parameterised prompt templates vs. fixed prompts; building an Excel prompt library (summarise, flag exceptions, extract trends, compare periods); prompt curation discipline — version what works, avoid drift across the team
- Apply Microsoft Copilot's Excel integration to the same dataset and establish which tool fits which workflow
- Design an exception-flagging template for one reporting area that a supervisor can operate without technical support

**Session deliverable:** Rebuilt AI-augmented Excel report + exception-flagging template + Excel prompt library additions

---

### Session 3 — Working with Large Datasets, RAG & Context Management
*Making 10 years of multi-centre SASA data queryable and manageable*

**What we do together:**
- Introduce Retrieval Augmented Generation (RAG): how AI answers questions about large datasets without being given everything at once
- Work directly with SASA's multi-year, multi-centre datasets; surface where current data structures create friction
- **Context management and large dataset prompting:** context window limits in practice; when to paste vs. chunk vs. use RAG; chunking strategies for 10-year data; summarisation chains; prompting for synthesis vs. extraction; multi-document prompting across SASA sources
- Build a simple document index for targeted AI queries
- Design a data-preparation checklist for SASA's specific formats

**Session deliverable:** SASA data-preparation checklist + working RAG demonstration + context management reference card

---

### Session 4 — Python & Node.js as Integration Glue
*Writing and understanding the code that connects SASA's systems to AI*

**What we do together:**
- Establish the consulting frame: managers direct and review the code, the AI writes it — this session builds the literacy to do that confidently
- Build a real data pipeline using AI-generated Python: LIMS export → transformation → flagged output → formatted report
- Introduce Node.js alongside Python: when each is appropriate
- Each participant identifies one repetitive data task in their area that could be automated

**Note:** Python and Node.js must be installed on attendee machines before this session. IT support required.

**Session deliverable:** Working data pipeline stub (LIMS export → processed output) + automation candidate list per team area

---

### Session 5 — PowerPoint, Reporting & AI-Generated Narratives
*Eliminating manual report commentary and presentation preparation*

**What we do together:**
- Audit the current reporting burden: quantify hours per week spent writing interpretive text — the ROI conversation
- Build a repeatable workflow: structured data → Claude prompt → draft narrative → human review and sign-off
- Use Microsoft Copilot's PowerPoint integration to generate a presentation from a SASA data summary
- Design a report commentary template encoding SASA's house style, regulatory language, and exception conventions
- Produce one complete AI-assisted report draft from real data — reviewed and approved by a director in the same session

**Session deliverable:** AI-assisted SASA report draft + reusable report commentary template

---

### Session 6 — Local AI Infrastructure, Governance & Programme Roadmap
*Deploying AI inside SASA's environment — and establishing how it is sustained*

This session is timed to follow the IT infrastructure meeting. It covers both the technical deployment of a local AI model and the governance and roadmap work that closes the programme with a clear path forward.

**Morning — Local AI Deployment:**
- Open with findings from the IT meeting — map against SASA's data boundary decisions from Session 3
- Install and configure a local AI model on SASA's server with IT present
- Walk through Ollama server mode and Open WebUI browser access — no software required on individual machines
- Design SASA's data governance framework: what goes to Claude Pro, what stays on-premise — one-page policy for director sign-off
- Build a local RAG demonstration: query internal SASA documents with no internet connection

**Afternoon — Governance & Programme Roadmap:**
- Review all six sessions against Session 1 targets — what was built, what remains
- Build SASA's AI governance framework: acceptable use policy, data classification, prompt library ownership, model maintenance
- Design the ongoing operating model: who owns what, how new use cases are prioritised, how the consulting log stays current
- Address skills continuity: which roles need deepened capability, which need operational literacy
- 12-month roadmap: three to five integration targets, sequenced by value and complexity, with owners and effort
- Individual 90-day action plans — one concrete next step per participant

**Server minimum specification:** 16 GB RAM, modern multi-core CPU, dedicated GPU with 4+ GB VRAM recommended, 50 GB storage, network-accessible

**Session deliverable:** Local AI server operational + data governance policy + 12-month integration roadmap + individual 90-day action plans

---

## What SASA Receives

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + integration targets + seed prompt library |
| 2 | AI-augmented Excel report + exception-flagging template + Excel prompt library |
| 3 | Data-preparation checklist + RAG demonstration + context management reference card |
| 4 | Data pipeline stub (LIMS export → processed output) + automation candidate list |
| 5 | AI-assisted SASA report draft + reusable report commentary template |
| 6 | Local AI server + data governance policy + 12-month roadmap + 90-day action plans |

Every session also produces updates to the shared SASA consulting log: prompt libraries, scripts, specifications, and reference materials accessible to all participants.

---

## Extending the Programme

Sessions 7–10 are available as a follow-on engagement at the same rate (R3,500 per session), covering:

- **Session 7:** LIMS & Autolab integration — AI-assisted exception detection, notification architecture
- **Session 8:** Agentic workflows & automation pipelines — multi-step AI processes using n8n
- **Session 9:** Source system integration & production deployment — API connectors, live implementation
- **Session 10:** Capstone review, advanced governance & extended roadmap

---

## Technical Requirements

### AI Licensing

**Recommended: Claude Pro shared account**
Approximately **$100/month (approximately R1,700)** — one account shared across the team.

Provides access to Claude's most capable models, extended context for large document and dataset analysis, and full Excel and PowerPoint integration capabilities.

SASA already holds Microsoft Copilot licences — used in Sessions 2 and 5 in combination with Claude.

*Claude licensing details will be provided separately ahead of the IT meeting.*

### Software Requirements

| Software | Required Before | Notes |
|---|---|---|
| Python 3.x | Session 4 | IT approval or pre-installation required |
| Node.js (LTS) | Session 4 | IT approval or pre-installation required |
| VS Code | Session 4 | Free, standard installation |

### Local AI Server (for Session 6)

One machine on SASA's network running AI models. All team members access via browser — no AI software on individual machines.

| Component | Minimum | Recommended |
|---|---|---|
| CPU | Intel i5 / Ryzen 5 (8th gen+) | Intel i7 / Ryzen 7 (12th gen+) |
| RAM | 16 GB | 32 GB |
| GPU | Dedicated GPU, 4 GB VRAM | NVIDIA RTX 3060 (12 GB VRAM) or better |
| Storage | 50 GB free SSD | 100 GB free SSD |
| Network | Local network access | Wired ethernet preferred |
| OS | Windows 10/11 or Linux | Ubuntu 22.04+ recommended |

---

## Suggested Schedule

| Session | Suggested Timing |
|---|---|
| Session 1 | Week 1 |
| Session 2 | Week 3 |
| Session 3 | Week 5 |
| Session 4 | Week 7 |
| Session 5 | Week 9 |
| Session 6 | Week 11 |

---

## Investment

| Item | Sessions | Rate | Fee |
|---|---|---|---|
| Applied AI Consulting & Development | 6 sessions × 7 hours | R3,500 per session | R21,000 |

*All fees exclude VAT. VAT at 15% = R3,150. Total including VAT: R24,150.*
*Sessions are invoiced individually on completion.*
*Travel, accommodation and expenses billed separately where applicable.*
*Cancellation or rescheduling requires a minimum of 5 business days' notice.*
*Sessions 7–10 available as a follow-on engagement at R3,500 per session.*

**Urgent: All documentation must be approved by Wednesday, 25 March 2026.**

---

## Appendix — AI Terminology Reference

| Term | Plain-language definition |
|---|---|
| **AI (Artificial Intelligence)** | Software that understands language, analyses data, and generates text or code — without being programmed with explicit rules for every situation |
| **LLM (Large Language Model)** | The type of AI powering Claude, ChatGPT, and Copilot — trained on large volumes of text to understand and generate language |
| **Claude** | Anthropic's AI assistant — the primary tool used in this programme. Available via browser, API, and mobile |
| **Claude Pro** | A paid subscription tier (~$100/month) giving access to the most capable models and higher usage limits |
| **Prompt** | The instruction or question you give to an AI. How you phrase it significantly affects the quality of the response |
| **Prompt Engineering** | The practice of crafting prompts precisely to get reliable, high-quality outputs from an AI model |
| **Context Window** | How much text an AI can "see" at once. Claude supports up to 200,000 tokens — enough for very large documents and datasets |
| **RAG (Retrieval Augmented Generation)** | A technique where AI retrieves relevant information from a document store before generating a response — enabling answers about large or private datasets |
| **Token** | The unit an AI processes — roughly one word or part of a word. Pricing and context limits are measured in tokens |
| **Copilot** | Microsoft's AI integration built into Microsoft 365 (Word, Excel, PowerPoint, Outlook). SASA already holds licences |
| **API (Application Programming Interface)** | A structured way for software systems to talk to each other — used to connect Claude to Excel, LIMS, or other systems |
| **Python** | A widely used programming language suited to data manipulation and automation. All code is AI-generated — no prior experience required |
| **Node.js** | A JavaScript-based environment for building web-facing connectors and API integrations |
| **VS Code (Visual Studio Code)** | A free code editor from Microsoft, used to review, run, and manage AI-generated scripts |
| **Claude Code CLI** | A terminal-based tool for running Claude directly from a command line or code environment |
| **Windsurf** | An AI-powered code editor where the AI participates in writing and explaining code as you work |
| **Ollama** | A free, open-source tool for running AI models locally on a server — no internet or cloud service required |
| **Open WebUI** | A browser-based interface for a locally running Ollama model — looks like ChatGPT but runs on SASA's own hardware |
| **Agent / Agentic Workflow** | An AI set up to complete multi-step tasks autonomously — e.g., check data, detect an exception, draft an alert, send it — without a human prompting each step |
| **MCP (Model Context Protocol)** | An open standard allowing AI models to connect to external tools and data sources in a controlled, auditable way |
| **n8n** | An open-source, self-hostable workflow automation tool used to build agentic pipelines — free, runs on SASA's own infrastructure |
| **LIMS (Laboratory Information Management System)** | SASA's laboratory data management system — a key integration target for AI-driven exception detection |
| **Autolab** | SASA's laboratory instrument automation system — feeds data into LIMS; an upstream integration point for anomaly detection |
| **SharePoint** | Microsoft's document management platform, already in use at SASA — used as a notification and document-storage layer |

---

*To confirm your interest or discuss scheduling, please respond to this proposal. A signed acceptance or purchase order constitutes agreement to proceed. All documentation must be received by Wednesday, 25 March 2026.*

**Richard [Surname]**
**[Email]**
**[Phone]**
**[Company / Trading Name]**
