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

This proposal outlines a ten-session Applied AI Consulting and Development Programme to be delivered at SASA's Mount Edgecombe facility. The engagement is structured as a professional services programme under the professional fees budget — not a training initiative. The focus throughout is on building, integrating, and deploying AI-driven tools and workflows directly into SASA's existing systems and data environment.

Work will be conducted using SASA's own operational data — mill performance records, laboratory outputs, historical datasets spanning multiple centres — and will build directly on the foundations already established by members of the SASA team who have begun integrating AI into their reporting and analysis workflows.

Each session is a co-development engagement: the consultant and the SASA team work together to design, build, and refine AI-powered tools that address real operational problems. The programme concludes with working integrations embedded in SASA's infrastructure and a governance framework that sustains the capability independently.

---

## Engagement Philosophy

This is not a theoretical programme. Every session works with SASA's actual data and systems. The deliverables are not slide decks or certificates — they are working tools, tested integrations, documented workflows, and deployable automation pipelines.

**Framing principles:**
- We build models together using company data, not constructed examples
- Each session produces something SASA keeps and uses immediately
- Advanced team members (where applicable) are leveraged as context contributors and peer demonstrators, not held back to match the group pace
- Sessions accommodate different capability levels simultaneously — some participants will be building, others will be directing and reviewing
- Every co-developed asset is stored in a shared SASA consulting log (SharePoint or equivalent) accessible to all participants including online attendees

---

## Programme Structure

**Format:** 10 co-development sessions × 7 hours
**Location:** SASA facility, Mount Edgecombe (in-person + hybrid remote)
**Attendance:** Up to 15 in-person (managers and directors) + up to 11 supervisors joining remotely for selected sessions
**Cadence:** Approximately one session every two weeks, with flexibility based on team needs and progress
**Session format:** 3.5 hours / lunch and breaks / 3.5 hours — structure within each block flexible based on the work in progress

**Flexibility provisions:**
- Sessions can be paused mid-programme to consolidate or catch up where needed
- Different groups can be engaged at different depths simultaneously within the same session
- Online supervisors receive a 15-minute synthesis at the start of each session covering what was produced in the previous one
- All session outputs are stored in the shared consulting log for anyone who misses a session

---

## Session Descriptions

### Session 1 — Foundations Audit & Strategic Framing
*Establishing a shared baseline — mapping where AI creates real value for SASA*

The first session is a structured audit and alignment exercise. Rather than covering theory, we map SASA's current data landscape, establish the programme's specific integration targets, and standardise tooling across the group.

**What we do together:**
- Review and contextualise AI work already completed within SASA — presenting existing dashboards and analysis as the benchmark for the rest of the group
- Map SASA's data landscape: identify which datasets (10-year records, LIMS exports, Autolab outputs, mill reports) are candidates for AI integration and where the highest operational friction currently exists
- Configure and standardise tooling: Claude Pro shared account, Microsoft Copilot licence review, browser and desktop setup for all participants
- Establish a shared prompt discipline using SASA's own report language and terminology
- Define the programme's capstone goal as a group — one or two agreed integration targets (e.g., LIMS exception flagging, automated report commentary) that every subsequent session builds toward
- Set up the shared consulting log where all session outputs are stored

**Session deliverable:** SASA data and systems map + programme integration targets document

---

### Session 2 — Excel as a Data Engineering Surface
*Rebuilding existing Excel workflows as AI-augmented decision tools*

**What we do together:**
- Rebuild one real SASA Excel report using Claude as a live co-pilot: formula logic, data cleaning, conditional exception flagging — no manual formatting
- Introduce structured data principles that make AI tools reason reliably over tabular data
- Build a reusable Claude prompt library for Excel tasks: summarisation, anomaly detection, trend commentary
- Apply Microsoft Copilot's Excel integration to the same dataset and establish which tool fits which workflow
- Design an exception-flagging template for one reporting area (e.g., laboratory results outside control limits) that a supervisor can operate without technical support

**Session deliverable:** Rebuilt AI-augmented Excel report + exception-flagging template for one SASA reporting area

---

### Session 3 — Working with Large Datasets & RAG
*Making 10 years of multi-centre SASA data queryable — without uploading everything to an AI*

**What we do together:**
- Introduce Retrieval Augmented Generation (RAG): how AI can answer questions about large document and data collections without being given the entire dataset — the pattern that makes 10-year historical analysis practical
- Work directly with SASA's multi-year, multi-centre datasets: slice, filter, and summarise using Claude with structured exports; surface where the current data structures create friction
- Build a simple document index so AI tools can be pointed at the right data subset rather than everything at once
- Introduce Python at a practical level: a 5-line script that reshapes or merges datasets that would take hours in Excel, written through AI assistance — no prior coding required
- Design a data-preparation checklist for SASA's specific formats (LIMS exports, Autolab CSVs, mill reports) for consistent AI-ready data across the team

**Session deliverable:** SASA data-preparation checklist + working RAG demonstration against internal documents

---

### Session 4 — Python & Node.js as Integration Glue
*Writing and understanding the code that connects SASA's systems to AI*

**What we do together:**
- Establish the consulting frame: managers direct and review the code, the AI writes it — this session builds the literacy to do that confidently
- Build a real data pipeline using AI-generated Python: LIMS export → transformation → flagged output → formatted report
- Introduce Node.js alongside Python: when each is appropriate (Python for data transformation; Node.js for API and web-facing connectors to SharePoint and source systems)
- Each participant identifies one repetitive data task in their area that could be automated — these become the source material for Sessions 7 and 8

**Note:** Python and Node.js must be installed on attendee machines before this session. IT support required.

**Session deliverable:** Working data pipeline stub (LIMS export → processed output) + automation candidate list per team area

---

### Session 5 — PowerPoint, Reporting & AI-Generated Narratives
*Eliminating manual report commentary and presentation preparation*

**What we do together:**
- Audit the current reporting burden: quantify hours per week spent writing interpretive text around the same data — the ROI conversation
- Build a repeatable workflow: structured data → Claude prompt → draft narrative → human review and sign-off; applied to one actual SASA periodic report
- Use Microsoft Copilot's PowerPoint integration to generate a presentation from a SASA data summary; refine live through prompt iteration
- Design a report commentary template encoding SASA's house style, regulatory language, and exception-flagging conventions
- Produce one complete AI-assisted report draft from real data — something a director can review and approve in the same session

**Session deliverable:** AI-assisted SASA report draft + reusable report commentary template

---

### Session 6 — Running AI on SASA Infrastructure
*Deploying AI models inside SASA's environment — no data leaves the building*

This session is timed to follow the IT infrastructure meeting and incorporates its findings directly.

**What we do together:**
- Open with findings from the IT meeting — map them against SASA's data boundary decisions from Session 3
- Install and configure a local AI model on SASA's server (or test machine) with IT present — so participants understand what they are commissioning
- Design SASA's data governance framework: what goes to Claude Pro, what stays on-premise — documented as a one-page policy for director sign-off
- Build a local RAG demonstration: index a set of SASA internal documents (procedures, historical reports) and query them using the local model — no internet required
- Establish the hosting and maintenance model: who owns it, what the upgrade path is

**Server minimum specification:** 16 GB RAM, modern multi-core CPU, dedicated GPU with 4+ GB VRAM recommended, 50 GB storage, network-accessible

**Session deliverable:** Local AI server operational + data governance policy document

---

### Session 7 — LIMS & Autolab Integration
*Connecting AI directly to SASA's laboratory management systems*

**What we do together:**
- Map the current LIMS data flow end to end: data entry → review → exception detection → reporting — and identify where exceptions are caught late or missed entirely
- Build an AI-assisted exception detection layer: define business rules with laboratory managers, implement as a Python script or prompt chain that flags out-of-spec results automatically
- Design the notification architecture: when an exception is flagged, what happens — who is alerted, through what channel (email, Teams, SharePoint), what the alert contains
- Address Autolab integration: map where AI can intercept instrument data upstream of LIMS to catch calibration drift or anomalies before results are recorded
- Produce a written integration specification — a clear brief that IT can implement or commission — as the session deliverable

**Session deliverable:** LIMS exception detection workflow + Autolab integration specification

---

### Session 8 — Agentic Workflows & Automation Pipelines
*Building AI processes that run without constant human instruction*

**What we do together:**
- Distinguish an agent from a prompt: a sequence of decisions, actions, and checks running on a schedule — using SASA's LIMS exception workflow from Session 7 as the reference case
- Build a multi-step agentic workflow: data arrives → AI checks against rules → exception detected → draft alert generated → human reviews and acts
- Introduce tool use: how agents are given specific capabilities (read a file, send an email, query a system) without unrestricted access
- Design failure modes and override controls: how agentic workflows fail safely, escalate correctly, and maintain a clear audit trail — critical for a regulated environment
- Each participant maps one workflow in their area for conversion from manual review to agentic exception flagging — inputs for Session 9

**Session deliverable:** Working agentic exception-flagging workflow + automation pipeline map per team area

---

### Session 9 — Source System Integration & Production Deployment
*Embedding AI at the point of data creation — not after the fact*

**What we do together:**
- Take two or three workflow maps from Session 8 and build functional integration prototypes: real data, real business rules, real output channels
- Build a lightweight API connector pattern (Node.js or Python, AI-generated) that allows SASA's AI layer to query or receive data from source systems without manual export steps
- Address SharePoint's role explicitly: where it works as a document and notification layer, and where a different integration pattern is needed
- Review the Autolab-to-LIMS chain with prototypes in hand — partial live implementation where possible
- Produce a technical architecture diagram (AI-assisted, reviewed by IT) showing SASA's target state: which systems talk to which AI layer, what data moves where, what humans approve

**Session deliverable:** Working integration prototypes + SASA AI architecture diagram

---

### Session 10 — Capstone Review, Governance & Roadmap
*Consolidating what has been built — and establishing how it is sustained*

**What we do together:**
- Present all working integrations and automations across all ten sessions — directors in attendance to see cumulative return on investment
- Structured review against Session 1 targets: outcome versus ambition, what remains, sequencing of next steps
- Build SASA's AI governance framework: acceptable use policy, data classification rules, prompt library ownership, model maintenance responsibilities
- Design the ongoing operating model: who maintains what, how new use cases are evaluated, how the shared consulting log and integration codebase stay current
- Address skills continuity: which roles need deepened capability, which need operational literacy, what an internal AI consulting function could look like within SASA
- Close with a 12-month roadmap: three to five integration targets, sequenced by value and complexity, with owners and effort estimates

**Session deliverable:** AI governance framework + 12-month integration roadmap

---

## What SASA Receives

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + programme integration targets |
| 2 | AI-augmented Excel report + exception-flagging template |
| 3 | Data-preparation checklist + RAG demonstration against internal documents |
| 4 | Data pipeline stub (LIMS export → processed output) + automation candidate list |
| 5 | AI-assisted SASA report draft + reusable report commentary template |
| 6 | Local AI server operational + data governance policy |
| 7 | LIMS exception detection workflow + Autolab integration specification |
| 8 | Working agentic exception-flagging workflow + automation pipeline maps |
| 9 | Working integration prototypes + SASA AI architecture diagram |
| 10 | AI governance framework + 12-month integration roadmap |

Every session also produces updates to the shared SASA consulting log: prompt libraries, scripts, specifications, and reference materials accessible to all participants.

---

## Technical Requirements

### AI Licensing

**Recommended: Claude Pro shared account**
Approximately **$100/month (approximately R1,700)** — one account shared across the team.

This provides:
- Access to Claude's most capable models
- Extended context for large document and dataset analysis
- Full Excel and PowerPoint integration capabilities (used from Session 2)
- Sufficient usage for a team of 15 in regular use

SASA already holds Microsoft Copilot licences — these are used in Sessions 2 and 5 in combination with Claude.

*Claude licensing details will be provided separately ahead of the IT meeting.*

### Software Requirements

The following must be installed on attendee machines before the sessions indicated:

| Software | Required Before | Notes |
|---|---|---|
| Python 3.x | Session 4 | IT approval or pre-installation required |
| Node.js (LTS) | Session 4 | IT approval or pre-installation required |
| VS Code | Session 4 | Free, standard installation |
| Git (basic) | Session 4 | For managing co-developed scripts |

### Local AI Server (for Session 6 onwards)

One machine on SASA's network dedicated to running AI models. All team members access it via browser — no AI software required on individual machines.

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

Sessions are held approximately every two weeks. The full programme completes in approximately five months. Timing is flexible based on team availability and pace.

| Session | Suggested Timing |
|---|---|
| Session 1 | Week 1 |
| Session 2 | Week 3 |
| Session 3 | Week 5 |
| Session 4 | Week 7 |
| Session 5 | Week 9 |
| Session 6 | Week 11 |
| Session 7 | Week 13 |
| Session 8 | Week 15 |
| Session 9 | Week 17 |
| Session 10 | Week 19 |

---

## Investment

| Item | Sessions | Rate | Fee |
|---|---|---|---|
| Applied AI Consulting & Development | 10 sessions × 7 hours | R3,500 per session | R35,000 |

*All fees exclude VAT. Travel, accommodation and expenses billed separately where applicable.*
*Sessions are invoiced individually on completion.*
*If the full programme is not approved, a reduced engagement of 8 sessions (R28,000) is available, covering Sessions 1–8.*
*Cancellation or rescheduling requires a minimum of 5 business days' notice.*

**Urgent: All documentation must be approved by Wednesday, 25 March 2026.**

---

## Appendix — AI Terminology Reference

A plain-language glossary of terms used throughout this programme. Intended to keep all participants — regardless of technical background — oriented in sessions.

| Term | Plain-language definition |
|---|---|
| **AI (Artificial Intelligence)** | Software that can understand language, analyse data, and generate text, code, or outputs — without being programmed with explicit rules for every situation |
| **LLM (Large Language Model)** | The type of AI that powers Claude, ChatGPT, and Copilot — trained on large volumes of text to understand and generate language |
| **Claude** | Anthropic's AI assistant — the primary tool used in this programme. Available via browser, API, and mobile |
| **Claude Pro** | A paid subscription tier of Claude (~$100/month) giving access to the most capable models and higher usage limits |
| **Prompt** | The instruction or question you give to an AI. How you phrase a prompt significantly affects the quality of the response |
| **Prompt Engineering** | The practice of crafting prompts precisely to get reliable, high-quality outputs from an AI model |
| **Context Window** | How much text an AI can "see" at once. Larger context windows allow it to work with longer documents and more data in a single conversation |
| **RAG (Retrieval Augmented Generation)** | A technique where an AI retrieves relevant information from a document store or database before generating a response — enabling it to answer questions about large or private datasets without having been trained on them |
| **Token** | The unit an AI processes — roughly one word or part of a word. Pricing and context limits are typically measured in tokens |
| **Copilot** | Microsoft's AI integration built into Microsoft 365 products (Word, Excel, PowerPoint, Outlook). SASA already holds licences |
| **API (Application Programming Interface)** | A structured way for one software system to talk to another. Used to connect Claude to Excel, LIMS, or other systems programmatically |
| **Python** | A widely used programming language, particularly suited to data manipulation and automation. All code in this programme is AI-generated — no prior coding experience required |
| **Node.js** | A JavaScript-based programming environment suited to building web-facing connectors and API integrations |
| **VS Code (Visual Studio Code)** | A free code editor from Microsoft, used to review, run, and manage AI-generated scripts |
| **Claude Code CLI** | A terminal-based tool that lets you run Claude directly from a command line or code environment |
| **Windsurf** | An AI-powered code editor (IDE) where the AI participates in writing and explaining code as you work |
| **Ollama** | A free, open-source tool for running AI language models locally on a server or laptop — no internet or cloud service required |
| **Open WebUI** | A browser-based interface for accessing a locally running Ollama model — looks and feels like ChatGPT but runs entirely on SASA's own hardware |
| **Agent / Agentic Workflow** | An AI set up to complete a multi-step task autonomously — e.g., check LIMS data, detect an exception, draft an alert, and send it — without a human prompting each step |
| **MCP (Model Context Protocol)** | An open standard that allows AI models to connect to external tools and data sources (files, APIs, databases) in a controlled, auditable way |
| **n8n** | An open-source, self-hostable workflow automation tool (similar to Zapier) used to build agentic pipelines. Free and runs on SASA's own infrastructure |
| **RAG pipeline** | The full chain: document store → retrieval of relevant chunks → AI generates response grounded in those chunks — the architecture behind local document Q&A |
| **Fine-tuning** | Training an AI model on specific data to improve its performance on a narrow task. Not used in this programme — prompting and RAG achieve the same goals without the cost and complexity |
| **LIMS (Laboratory Information Management System)** | SASA's laboratory data management system. A key integration target for AI-driven exception detection and alerting |
| **Autolab** | SASA's laboratory instrument automation system. Feeds data into LIMS — an upstream integration point for catching instrument drift and anomalies |
| **Embedding** | A numerical representation of text that allows AI systems to measure similarity between documents — the technical mechanism behind RAG retrieval |
| **SharePoint** | Microsoft's document management and collaboration platform, already in use at SASA. Used in this programme as a notification and document-storage layer |

---

*To confirm your interest or discuss scheduling, please respond to this proposal. A signed acceptance or purchase order constitutes agreement to the terms outlined above. All documentation must be received by Wednesday, 25 March 2026.*

**Richard [Surname]**
**[Email]**
**[Phone]**
**[Company / Trading Name]**
