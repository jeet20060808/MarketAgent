# AI Founder OS 🚀

> Your founding team, on demand. Turn a single startup idea into a comprehensive, print-ready Startup Package in seconds.

AI Founder OS is a high-performance **Multi-Agent Orchestration System** built on Next.js. A team of **6 specialized AI agents** work in parallel using simulated system workspace tools to validate, research, draft, design, plan, and market your startup idea.

---

## ⚙️ Multi-Agent Architecture & Tools

Each agent is fully equipped with context-driven tools to execute their specific startup lifecycle workflow:

1. **🧠 Startup Advisor Agent** — *Idea Validation*
   - **Notion Tool**: Generates validation workspaces, evaluates problem-market fit, analyzes target audiences, business models, and potential project risks.
2. **📊 Market Research Agent** — *Market Intelligence*
   - **Search Tool**: Scans active web data for competitor matrices, TAM assessments, and key market growth trends.
3. **📋 Product Manager Agent** — *Product Strategy*
   - **Notion Tool**: Drafts detailed Product Requirements Documents (PRDs), compiles MVP feature scopes, and defines user stories.
4. **⚙️ Architect Agent** — *Technical Design*
   - **GitHub Tool**: Generates high-level technical layouts, recommended tech stacks, API endpoints, and database schemas.
5. **🚀 Marketing Agent** — *Go-To-Market Strategy*
   - **Notion Tool**: Crafts landing page headlines, launch value propositions, social copy, and initial email outreach campaigns.
6. **🛠️ Engineering Manager Agent** — *Engineering Execution*
   - **GitHub Tool**: Formulates development execution blueprints, maps engineering staffing requirements, structures sprint milestones, and populates P0/P1/P2 backlogs.

---

## 🎨 Key Features & Frontend Experience

- **⚡ Unified Document Workspace**: All agent reports stream sequentially into a single frame, providing a cohesive startup blueprint without needing tabbed navigation.
- **📂 File Tool Dropzone**: Upload raw business plans, competitor spreadsheets, existing mock PRDs, or startup idea PDFs to act as additional context for agent prompts.
- **📟 Automated Tool Logs Console**: Live terminal emulation displaying active system tool triggers (`Search Tool`, `GitHub Tool`, `Notion Tool`, `PDF Tool`, `File Tool`) during agent execution.
- **📄 PDF Export Utility**: Integrated browser print styling (`@media print`) that strips out UI containers and navigation to generate a high-contrast, clean-layout PDF report.
- **✨ Professional Aesthetics**: Cinematic dark theme built with TailwindCSS, smooth Framer Motion transitions, glowing inputs, custom CSS animations, and canvas confetti indicators on success.

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
