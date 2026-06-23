# AI Founder OS — AXORA AI

> Your founding team, on demand. Turn a single startup idea into a comprehensive startup package — validated, researched, planned, architected, marketed, risk-assessed, and financially modeled in seconds.

AI Founder OS is a high-performance **Multi-Agent Orchestration System** powered by NVIDIA's LLM APIs. A team of **8 specialized AI agents** run in parallel to analyze your startup idea and produce a complete, investor-ready package.

![Uploading Screenshot 2026-06-23 at 10.36.40 PM.png…]()
---

## ⚙️ Multi-Agent Architecture

Each agent uses tool-specific prompts to execute their role in the startup lifecycle:

| Agent | Role | Tools |
|-------|------|-------|
| **Startup Advisor** | Idea Validation | Notion Workspace — validates problem-market fit, target audience, business model |
| **Market Research** | Market Intelligence | Search Tool — competitor matrices, TAM, market trends |
| **Product Manager** | Product Strategy | Notion Workspace — PRD, MVP scope, user stories, roadmap |
| **Architect** | Technical Design | GitHub Tool — tech stack, API endpoints, DB schemas |
| **Marketing** | Go-To-Market | Notion Workspace — landing copy, social posts, email campaigns |
| **Engineering Manager** | Engineering Execution | GitHub Tool — sprint plans, staffing, backlog, milestones |
| **Risk Analyst** | Risk Assessment | Risk Tool — market, technical, financial & compliance risks |
| **Financial Analyst** | Financial Modeling | Finance Tool — revenue models, CAC/LTV, break-even, funding |

All agents execute in parallel via a single `/api/orchestrate` endpoint. A separate scoring engine (`/api/score`) computes the **Founder Snapshot Score**.

---

## 🎨 Features

- **Chat-Style Idea Input** — Text input with file attachments and voice recording (Speech-to-Text)
- **File Upload Dropzone** — Drag & drop business plans, spreadsheets, or PDFs as extra agent context (500KB/file, 1MB total)
- **Live Tool Logs Console** — Animated terminal-style logs showing which tool each agent triggers during execution
- **Tabbed Results Dashboard** — Agent outputs rendered as expandable accordion cards with markdown formatting
- **Founder Snapshot Score** — Weighted scoring (Market 30%, Revenue 25%, Execution 20%, Competition 15%, Risk 10%) with investor verdict
- **PRD Generator** — Compiles a full Product Requirements Document from agent outputs
- **Investor Mode (Pitch Deck)** — VC-ready dark-theme deck with auto-extracted content for 12 slides (problem, solution, market, financials, etc.)
- **Export Formats** — Markdown (Notion-compatible), plain text (Startup Package), PPTX (Pitch Deck), PDF
- **Business Breakdown Charts** — Donut chart, pillar score bars, and agent output volume visualization
- **Confetti Celebration** — Canvas confetti on agent completion and score generation
- **3D Aurora Background** — Animated aurora shader effect on landing page
- **Animated Agent Cards** — Orbiting flip cards on the landing page showcasing each agent

---

## 🚀 Getting Started

### Prerequisites

Create a `.env.local` file in the root directory:

```env
NVIDIA_API_KEY=your-api-key-here
ALLOWED_ORIGIN=http://localhost:3000
```

`ALLOWED_ORIGIN` controls CORS — set it to your production domain when deploying.

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security

- **CSP Headers**: Strict Content-Security-Policy restricting script, style, and connection sources (only NVIDIA API allowed)
- **Rate Limiting**: 20 requests/minute per IP via in-memory rate limiter
- **File Upload Limits**: 500KB per file, 1MB total, sanitized file names
- **CORS**: Locked to `ALLOWED_ORIGIN` env var, restricted to GET/POST with Content-Type
- **HTTP Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`
- **No Secret Leakage**: Generic API error messages, no implementation details exposed

## 🛠️ Technology Stack

| Category | Libraries |
|----------|-----------|
| **Framework** | Next.js 16 (Turbopack), React 19, TypeScript 5 |
| **Styling** | TailwindCSS 4, CSS Modules, Styled Components |
| **Animation** | Framer Motion, OGL (3D WebGL) |
| **Icons** | Lucide React |
| **Charts** | Recharts, custom SVG (donut/bar) |
| **AI/LLM** | OpenAI SDK → NVIDIA Integrate API (`integrate.api.nvidia.com/v1`) |
| **Export** | pptxgenjs (PPTX), canvas-confetti, marked (Markdown) |
| **Fonts** | Inter, DM Serif Display, IBM Plex Mono, Space Grotesk, Pixelify Sans |
