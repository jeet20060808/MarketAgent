# AXORA AI 🚀

> Your founding team, on demand. Turn a single startup idea into a comprehensive, print-ready Startup Package in seconds.

Axora AI is a high-performance **Multi-Agent Orchestration System** built on Next.js. A team of **8 specialized AI agents** work in parallel using simulated system workspace tools to validate, research, draft, design, plan, model, assess, and market your startup idea.

---

## ⚙️ Multi-Agent Architecture & Tools
<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/dc5bad3a-e0ab-4d6f-ba94-4d95c7df5b09" />

Each agent is fully equipped with context-driven tools to execute their specific startup lifecycle workflow:

1. **🧠 Startup Advisor Agent** — _Idea Validation_
   - **Notion Tool**: Generates validation workspaces, evaluates problem-market fit, analyzes target audiences, business models, and potential project risks.
2. **📊 Market Research Agent** — _Market Intelligence_
   - **Search Tool**: Scans active web data for competitor matrices, TAM assessments, and key market growth trends.
3. **📋 Product Manager Agent** — _Product Strategy_
   - **Notion Tool**: Drafts detailed Product Requirements Documents (PRDs), compiles MVP feature scopes, and defines user stories.
4. **⚙️ Architect Agent** — _Technical Design_
   - **GitHub Tool**: Generates high-level technical layouts, recommended tech stacks, API endpoints, and database schemas.
5. **🚀 Marketing Agent** — _Go-To-Market Strategy_
   - **Notion Tool**: Crafts landing page headlines, launch value propositions, social copy, and initial email outreach campaigns.
6. **🛠️ Engineering Manager Agent** — _Engineering Execution_
   - **GitHub Tool**: Formulates development execution blueprints, maps engineering staffing requirements, structures sprint milestones, and populates P0/P1/P2 backlogs.
7. **🛡️ Risk Analyst Agent** — _Risk Assessment_
   - **Risk Tool**: Identifies market, technical, financial, and compliance risks with detailed mitigation strategies.
8. **💰 Financial Analyst Agent** — _Financial Modeling_
   - **Finance Tool**: Models revenue streams, pricing strategies, CAC/LTV projections, break-even estimations, and funding requirements.

---

## 🎨 Key Features & Frontend Experience

- **⚡ Unified Document Workspace**: All agent reports stream sequentially into a single frame, providing a cohesive startup blueprint without needing tabbed navigation.
- **📂 File Tool Dropzone**: Upload raw business plans, competitor spreadsheets, existing mock PRDs, or startup idea PDFs to act as additional context for agent prompts.
- **📟 Automated Tool Logs Console**: Live terminal emulation displaying active system tool triggers (`Search Tool`, `GitHub Tool`, `Notion Tool`, `PDF Tool`, `File Tool`) during agent execution.
- **📄 Custom PDF Report Export**: High-fidelity `@media print` CSS configurations that hide executive summary containers and focus purely on generating the **Full Detailed Analysis** report starting directly from page 1.
- **✨ Premium Dark Theme Pitch Startup**: The Pitch Deck (Investor Mode) features a high-end dark theme matching the consolidated report aesthetics, with dynamically sizing slide boxes that expand naturally based on their contents to eliminate scrollbars.

---

## 🚀 Getting Started

### Prerequisites

Create a `.env.local` file in the root directory:

```env
NVIDIA_API_KEY=your-api-key-here
ALLOWED_ORIGIN=http://localhost:3000
```

> **Note:** `ALLOWED_ORIGIN` controls CORS — set it to your production domain when deploying.

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the local development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security Features

- **Content Security Policy**: Strict CSP headers restrict script, style, and connection sources to prevent XSS and data exfiltration.
- **Rate Limiting**: API endpoints are rate-limited (20 requests/minute per IP) to prevent abuse.
- **Request Validation**: Body size limits (5MB), idea length caps (10K chars), file count/size limits (10 files, 500KB each, 1MB total).
- **File Upload Safety**: MIME type allowlisting, file name sanitization (rejects path separators and special chars).
- **CORS Restriction**: Cross-origin requests locked to the `ALLOWED_ORIGIN` environment variable.
- **No Secret Leakage**: API error messages are generic (no implementation details exposed). The `/api/test` endpoint that leaked API key existence has been removed.
- **HTTP Security Headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy` are all set to hardened values.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (Turbopack)
- **Styling**: TailwindCSS & Vanilla CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **LLM Orchestration**: OpenAI SDK (routed via NVIDIA Integrate APIs)
- **Exporting**: High-fidelity `@media print` CSS configurations
