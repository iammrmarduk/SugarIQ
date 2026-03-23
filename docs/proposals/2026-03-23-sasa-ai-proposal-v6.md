# Applied AI Consulting & Development Programme
## South African Sugar Association (SASA)

**Prepared for:** South African Sugar Association (SASA)
**Prepared by:** Richard [Surname] | [Company Name]
**Date:** 23 March 2026
**Reference:** PROP-SASA-2026-006
**Budget Line:** Professional Fees

> **Deadline Note:** All documentation must be approved by Wednesday, 25 March 2026.

---

## Executive Summary

This proposal outlines a six-session Applied AI Consulting and Development Programme to be delivered at SASA's Mount Edgecombe facility. The engagement is structured as a professional services programme under the professional fees budget — not a training initiative. The focus throughout is on building, integrating, and deploying AI-driven tools and workflows directly into SASA's existing systems and data environment.

Work will be conducted using SASA's own operational data and will build directly on the foundations already established by members of the SASA team. Each session is a co-development engagement: the consultant and the SASA team work together to design, build, and refine AI-powered tools that address real operational problems.

The programme is structured to deliver three things SASA can sustain independently: a working local AI deployment that keeps sensitive data on-premise, a set of agentic automation pipelines that run without constant human instruction, and a 12-month integration roadmap with individual action plans every participant walks away with.

---

## Engagement Philosophy

This is not a theoretical programme. Every session works with SASA's actual data and systems. The deliverables are working tools, tested integrations, documented workflows, and reusable automation templates.

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

---

## Session Descriptions

### Session 1 — Foundations Audit, Strategic Framing & Prompt Engineering
*Establishing a shared baseline and the prompt discipline that underpins the whole programme*

The first session maps SASA's current data landscape, standardises tooling across the group, and agrees on the specific integration targets every subsequent session will build toward. Existing AI work already completed within SASA is reviewed and used as the benchmark for the whole group.

**What we do together:**
- Review and contextualise AI work already completed internally — presenting existing work as the benchmark, not the exception
- Map SASA's data landscape: R7106 records, LIMS exports, Autolab outputs, multi-centre historical data, mill reports — identify where the highest operational friction currently exists
- Configure and standardise tooling: Claude Pro shared account, Microsoft Copilot licence review, setup for all participants
- **Prompt Engineering Foundations:** prompt anatomy (role, context, task, format); Claude-specific techniques — XML tags, 200K context window, system prompts; prompt iteration workflow; common failure modes with real SASA examples
- Establish SASA's shared prompt library in SharePoint — naming conventions, categories, validation discipline
- Define the programme's capstone goals as a group

**Session deliverable:** SASA data and systems map + integration targets document + consulting log + seed prompt library (10–15 entries)

---

### Session 2 — Excel, Reporting & AI-Generated Workflows
*Rebuilding data workflows and eliminating manual report commentary — in one day*

This session combines AI-augmented Excel work with report narrative automation: two sides of the same problem — turning SASA's data into decisions faster and with less manual effort.

**What we do together:**
- Rebuild one real SASA Excel report using Claude as a live co-pilot
- **Prompt reuse patterns:** parameterised templates vs. fixed prompts; Excel prompt library (summarise, flag exceptions, extract trends, compare periods); prompt curation discipline — version what works
- Apply Microsoft Copilot's Excel integration to the same dataset — establish which tool fits which workflow
- Design an exception-flagging template for one reporting area that a supervisor can operate without technical support
- Audit the current reporting burden: quantify hours per week spent writing the same interpretive commentary
- Build a repeatable narrative workflow: structured data → Claude prompt → draft narrative → human review and sign-off
- Use Copilot PowerPoint integration to generate a presentation from a SASA data summary
- Design a report commentary template encoding SASA's house style, regulatory language, and exception conventions
- Produce one complete AI-assisted report draft from real data — reviewed and approved by a director in the same session

**Session deliverable:** AI-augmented Excel report + exception-flagging template + Excel prompt library + reusable report commentary template + one completed AI-assisted report draft

---

### Session 3 — Working with Large Datasets, RAG & Context Management
*Making 10 years of multi-centre SASA data queryable and manageable*

**What we do together:**
- Introduce Retrieval Augmented Generation (RAG): how AI answers questions about large datasets without being given everything at once — the AI-as-librarian analogy
- Work directly with SASA's multi-year, multi-centre datasets; surface where current data structures create friction
- Build a simple document index for targeted AI queries
- **Context management and large dataset prompting:** context window limits in practice; when to paste vs. chunk vs. use RAG; chunking strategies for 10-year data; summarisation chains; prompting for synthesis vs. extraction; multi-document prompting across SASA sources
- Design a data-preparation checklist for SASA's specific formats (LIMS, Autolab, mill reports)

**Session deliverable:** SASA data-preparation checklist + working RAG demonstration + context management reference card

---

### Session 4 — Python & Automation Pipelines
*Writing and understanding the code that connects SASA's systems to AI*

**What we do together:**
- Establish the consulting frame: managers direct and review the code — the AI writes it. This session builds the literacy to do that confidently
- Build a real data pipeline using AI-generated Python: LIMS export → transformation → flagged output → formatted report
- Introduce Node.js alongside Python: when each is appropriate; API and SharePoint connectors
- Introduction to version control for AI-generated code
- Each participant identifies one repetitive data task in their area that could be automated — these form the Session 6 build briefs

**Note:** Python and Node.js must be installed on attendee machines before this session. IT support required.

**Session deliverable:** Working data pipeline stub (LIMS export → processed output) + automation candidate list per team area

---

### Session 5 — Local AI Infrastructure & Agentic Workflows
*The session that changes how SASA thinks about AI: from a tool you ask to a system that acts*

This session deploys SASA's local AI capability — keeping sensitive data on-premise — and introduces agentic automation: AI processes that run without constant human instruction.

**Morning — Local AI Deployment:**
- Open with findings from the IT infrastructure meeting — map against Session 3 data boundary decisions
- Install and configure a local AI model on SASA's server with IT present
- Walk through Ollama server mode and Open WebUI browser access — no software required on individual machines; any browser, any device on the SASA network
- Build a local RAG demonstration: query internal SASA documents with no internet connection
- Design SASA's data governance framework: what goes to Claude Pro, what stays on-premise — one-page policy for director sign-off

**Afternoon — Agentic Workflows:**
- What is an agent? The difference between "I ask an AI a question" and "the AI does the task and tells me when something needs attention" — with SASA-relevant examples
- Introduce n8n: open-source visual workflow builder, runs on SASA's own infrastructure, no per-seat licence cost
- Build a SASA agent pipeline together: data input → exception check → draft alert → output to SharePoint or file
- Connect the pipeline to the Session 4 Python output — real data, not a demo
- Design SASA's first agentic use case specification: inputs, trigger conditions, outputs, human review gate

**Server minimum specification:** 16 GB RAM, modern multi-core CPU, dedicated GPU with 4+ GB VRAM recommended, 50 GB storage, network-accessible

**Session deliverable:** Local AI server operational + working n8n agent pipeline + agentic use case specification + data governance policy

---

### Session 6 — Build Day, Governance & Programme Roadmap
*Teams build something real. Then the programme closes with a clear path forward.*

The final session is structured in two halves: a morning build day where teams construct a working tool, and an afternoon that turns the programme into a sustained 12-month capability.

**Morning — Build Day:**
- Teams self-select into 2–3 build groups based on their Session 4 automation candidate lists
- Each group selects one build target: a prompt-driven Excel exception report, a Python data pipeline for their specific area, a local RAG query system over a SASA document set, or an n8n agent workflow
- Richard works across groups as senior consultant; advanced team members lead their groups
- **Goal:** every group ships a working first version — not a prototype, something usable from Monday

**Afternoon — Governance & Roadmap Close-out:**
- Showcase: each group presents their build (5 minutes each)
- Review all six sessions against Session 1 integration targets — what was built, what remains
- Build SASA's AI governance framework: acceptable use policy, data classification, prompt library ownership, model maintenance
- Design the ongoing operating model: who owns what, how new use cases are prioritised
- Address skills continuity: who needs to go deeper, who needs operational literacy
- 12-month roadmap: three to five integration targets, sequenced by value and complexity, with owners and effort
- Individual 90-day action plans — one concrete next step per participant

**Session deliverable:** Team-built working tools (one per group, usable immediately) + data governance policy + 12-month integration roadmap + individual 90-day action plans

---

## What SASA Receives

| Session | Deliverable |
|---|---|
| 1 | SASA data & systems map + integration targets + consulting log + seed prompt library |
| 2 | AI-augmented Excel report + exception-flagging template + report commentary template + AI-assisted report draft |
| 3 | Data-preparation checklist + RAG demonstration + context management reference card |
| 4 | Data pipeline stub (LIMS export → processed output) + automation candidate list |
| 5 | Local AI server + n8n agent pipeline + agentic use case specification + data governance policy |
| 6 | Team-built working tools + 12-month roadmap + individual 90-day action plans |

Every session also produces updates to the shared SASA consulting log: prompt libraries, scripts, specifications, and reference materials accessible to all participants.

---

## Extending the Programme

Sessions 7–10 are available as a follow-on engagement at the same rate (R3,500 per session):

- **Session 7:** LIMS & Autolab deep integration — AI-assisted exception detection, notification architecture, Autolab data feed
- **Session 8:** Advanced agentic workflows — multi-step pipelines, scheduling, error handling, escalation paths
- **Session 9:** Source system integration & production deployment — API connectors, live LIMS/SharePoint integration
- **Session 10:** Capstone review, advanced governance & extended roadmap

---

## Technical Requirements

### AI Licensing

**Recommended: Claude Pro shared account**
Approximately **$100/month (approximately R1,700)** — one account shared across the team. Provides access to Claude's most capable models, extended context for large document and dataset analysis, and full Excel and PowerPoint integration capabilities. SASA already holds Microsoft Copilot licences — used in Session 2 in combination with Claude.

### Software Requirements

| Software | Required Before | Notes |
|---|---|---|
| Python 3.x | Session 4 | IT approval or pre-installation required |
| Node.js (LTS) | Session 4 | IT approval or pre-installation required |
| VS Code | Session 4 | Free, standard installation |
| n8n | Session 5 | Self-hosted; Docker or direct install on server |

### Local AI Server (Sessions 5 and 6)

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
| **Claude** | Anthropic's AI assistant — the primary tool used in this programme |
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
| **Ollama** | A free, open-source tool for running AI models locally on a server — no internet or cloud service required |
| **Open WebUI** | A browser-based interface for a locally running Ollama model — looks like ChatGPT but runs on SASA's own hardware |
| **Agent / Agentic Workflow** | An AI set up to complete multi-step tasks autonomously — e.g., check data, detect an exception, draft an alert, send it — without a human prompting each step |
| **n8n** | An open-source, self-hostable workflow automation tool used to build agentic pipelines — free, runs on SASA's own infrastructure |
| **MCP (Model Context Protocol)** | An open standard allowing AI models to connect to external tools and data sources in a controlled, auditable way |
| **LIMS (Laboratory Information Management System)** | SASA's laboratory data management system — a key integration target |
| **Autolab** | SASA's laboratory instrument automation system — feeds data into LIMS; an upstream integration point for anomaly detection |
| **SharePoint** | Microsoft's document management platform, already in use at SASA — used as a notification and document-storage layer |

---

*To confirm your interest or discuss scheduling, please respond to this proposal. A signed acceptance or purchase order referencing PROP-SASA-2026-006 constitutes agreement to proceed. All documentation must be received by Wednesday, 25 March 2026.*

**Richard [Surname]**
**[Email]**
**[Phone]**
**[Company / Trading Name]**
