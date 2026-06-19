# AXORA AI 🚀

> Your founding team, on demand. Turn a single startup idea into a comprehensive, print-ready Startup Package in seconds.

Axora AI is a high-performance **Multi-Agent Orchestration System** built on Next.js. A team of **8 specialized AI agents** work in parallel using simulated system workspace tools to validate, research, draft, design, plan, model, assess, and market your startup idea.

---

## ⚙️ Multi-Agent Architecture & Tools

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

Create a `.env.local` file in the root directory and add your NVIDIA API key:

```env
NVIDIA_API_KEY=your-api-key-here
```

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

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (Turbopack)
- **Styling**: TailwindCSS & Vanilla CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **LLM Orchestration**: OpenAI SDK (routed via NVIDIA Integrate APIs)
- **Exporting**: High-fidelity `@media print` CSS configurations
