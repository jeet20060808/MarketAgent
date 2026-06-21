"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArrowButton from "@/components/ArrowButton";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Search, 
  BookOpen, 
  FileText, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Download,
  GitBranch,
  Copy,
  ChevronRight,
  AlertCircle,
  FileDown,
  Plus,
  Mic,
  ArrowUp,
  Brain,
  BarChart3,
  ClipboardList,
  Cog,
  Wrench,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Activity,
  Presentation,
  Zap,
  type LucideIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { InvestorMode } from "@/components/InvestorMode";
import Aurora from "@/components/Aurora/Aurora";

interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string; message?: string }) => void) | null;
  onresult: ((event: {
    results: {
      isFinal: boolean;
      0: {
        transcript: string;
      };
    }[];
  }) => void) | null;
  start: () => void;
  stop: () => void;
}

// ── Agent Configurations ──
export interface AgentConfig {
  id: string;
  name: string;
  Icon: LucideIcon;
  color: string;
  accentClass: string;
  numberClass: string;
  role: string;
  description: string;
  outputs: string[];
}

function AgentIcon({ Icon, color, size = 15, className = "" }: { Icon: LucideIcon; color: string; size?: number; className?: string }) {
  return <Icon size={size} className={`flex-shrink-0 ${className}`} style={{ color }} />;
}

export const AGENTS: AgentConfig[] = [
  {
    id: "advisor",
    name: "STARTUP ADVISOR",
    Icon: Brain,
    color: "#F7C948",
    accentClass: "badge-yellow",
    numberClass: "section-number-yellow",
    role: "Idea Validation",
    description: "Validates your startup idea with deep analysis of problem-market fit",
    outputs: ["Problem Statement", "Target Audience", "Business Model", "Key Risks", "Opportunities"],
  },
  {
    id: "research",
    name: "MARKET RESEARCH",
    Icon: BarChart3,
    color: "#3B82F6",
    accentClass: "badge-blue",
    numberClass: "section-number-blue",
    role: "Market Intelligence",
    description: "Maps the competitive landscape and quantifies market opportunity",
    outputs: ["Top 3 Competitors", "Market Size (TAM)", "Key Trends", "Opportunities"],
  },
  {
    id: "product",
    name: "PRODUCT MANAGER",
    Icon: ClipboardList,
    color: "#36e376ff",
    accentClass: "badge-yellow",
    numberClass: "section-number-green",
    role: "Product Strategy",
    description: "Defines features, user stories, and a roadmap for your MVP",
    outputs: ["Features", "User Stories", "MVP Scope", "Roadmap"],
  },
  {
    id: "architecture",
    name: "ARCHITECTURE",
    Icon: Cog,
    color: "#ffa60dff",
    accentClass: "badge-pink",
    numberClass: "section-number-orange",
    role: "Technical Design",
    description: "Designs the database schema, APIs, and system architecture",
    outputs: ["Database Tables", "API Endpoints", "Tech Stack", "System Architecture"],
  },
  {
    id: "marketing",
    name: "MARKETING",
    Icon: Rocket,
    color: "#EC4899",
    accentClass: "badge-pink",
    numberClass: "section-number-pink",
    role: "Go-To-Market",
    description: "Creates launch copy, social posts, and an email campaign",
    outputs: ["Landing Headline", "Value Proposition", "LinkedIn Post", "Email Campaign", "Channels"],
  },
  {
    id: "engineering",
    name: "ENGINEERING MANAGER",
    Icon: Wrench,
    color: "#8B5CF6",
    accentClass: "badge-blue",
    numberClass: "section-number-yellow",
    role: "Engineering Execution",
    description: "Plans sprints, team structure, backlog, and release strategy",
    outputs: ["Execution Strategy", "Team Requirements", "Sprint Plan", "Timeline", "Risks", "Backlog", "Team KPIs", "Release Strategy"],
  },
  {
    id: "risk",
    name: "RISK ANALYST",
    Icon: AlertTriangle,
    color: "#EF4444",
    accentClass: "badge-pink",
    numberClass: "section-number-orange",
    role: "Risk Assessment",
    description: "Identifies market, technical, financial, and compliance risks with mitigation strategies",
    outputs: ["Market Risks", "Technical Risks", "Compliance Risks", "Risk Score", "Top Critical Risks", "Mitigation Plan"],
  },
  {
    id: "financial",
    name: "FINANCIAL ANALYST",
    Icon: DollarSign,
    color: "#10B981",
    accentClass: "badge-yellow",
    numberClass: "section-number-green",
    role: "Financial Modeling",
    description: "Models revenue, pricing, CAC/LTV, burn rate, and funding requirements",
    outputs: ["Revenue Model", "Pricing Strategy", "CAC & LTV", "Break-even Estimate", "Funding Requirements", "Investment Recommendation"],
  },
];

export type AgentResults = Record<string, string | null>;

export interface ScoreData {
  startupScore: number;
  marketScore: number;
  marketReason: string;
  revenueScore: number;
  revenueReason: string;
  executionScore: number;
  executionReason: string;
  competitionScore: number;
  competitionReason: string;
  riskScore: number;
  riskReason: string;
  scoreCalculation: {
    marketWeight: number;
    revenueWeight: number;
    executionWeight: number;
    competitionWeight: number;
    riskWeight: number;
  };
  recommendation: string;
  investorVerdict: string;
  calculationExplanation: string;
}

type AppState = "input" | "processing" | "results";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const MAX_TOTAL_SIZE = 1024 * 1024; // 1MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Simple markdown-to-HTML renderer ── */
function renderMarkdown(text: string): string {
  if (!text) return "";
  
  // Escape raw HTML tags to prevent XSS before parsing markdown
  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const blocks = escapedText.split("\n");
  const processed: string[] = [];
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer.filter((row) => !row.match(/^\|[\s\-:|]+\|$/));
    if (rows.length === 0) {
      tableBuffer = [];
      return;
    }
    const headerCells = rows[0].split("|").filter(Boolean).map((c) => c.trim());
    const bodyRows = rows.slice(1);
    let tableHtml = '<table class="md-table"><thead><tr>';
    headerCells.forEach((cell) => {
      tableHtml += `<th>${cell}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";
    bodyRows.forEach((row) => {
      const cells = row.split("|").filter(Boolean).map((c) => c.trim());
      tableHtml += "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
    });
    tableHtml += "</tbody></table>";
    processed.push(tableHtml);
    tableBuffer = [];
  };

  blocks.forEach((line) => {
    if (line.trim().startsWith("|")) {
      tableBuffer.push(line.trim());
      return;
    }
    flushTable();
    processed.push(line);
  });
  flushTable();

  let html = processed.join("\n")
    .replace(/\$(\d)/g, '₹$1')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-emphasis">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^#### (.+)$/gm, '<h4 class="md-section">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="md-section">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-section">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-section">$1</h1>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  html = html
    .replace(/<p>([^<]*(?:Score|Recommendation|Critical|Overall|Final|Verdict|Viability|Break-even|Top \d|Key Finding)[^<]*)<\/p>/gi, '<p class="md-key-line">$1</p>')
    .replace(/<li>([^<]*(?:High|Medium|Low|Severe|Critical)[^<]*)<\/li>/gi, '<li class="md-key-li">$1</li>');

  return html;
}

/* ── Distill key insights from agent results ── */
function distillInsights(results: AgentResults): string[] {
  const insights: string[] = [];
  
  for (const [agentId, result] of Object.entries(results)) {
    if (!result) continue;
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) continue;
    const lines = result.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('|'));
    // Look for lines with insight keywords (score, verdict, recommendation, finding)
    const keywordLine = lines.find(l =>
      /score|verdict|recommend|key finding|insight|opportunit|critical|top \d|market size|tam|break[-\s]even/i.test(l)
    );
    const chosenLine = keywordLine || lines[lines.length - 1];
    if (chosenLine) {
      const cleaned = chosenLine.replace(/^[\*\-\d\.]+\s*/, '').replace(/\*\*/g, '').trim();
      if (cleaned.length > 10) {
        insights.push(`**${agent.name}**: ${cleaned.slice(0, 150)}${cleaned.length > 150 ? '...' : ''}`);
      }
    }
  }
  
  return insights.slice(0, AGENTS.length);
}

/* ── Generate Notion-compatible markdown ── */
function generateNotionDoc(idea: string, results: AgentResults, scoreData?: ScoreData | null): string {
  let doc = `# Startup Package: ${idea}\n\n`;
  doc += `> Generated by AI Founder OS on ${new Date().toLocaleDateString()}\n\n`;
  
  if (scoreData) {
    doc += `## Founder Snapshot Score: ${scoreData.startupScore}/100\n\n`;
    doc += `> **Investor Verdict:** ${scoreData.investorVerdict}\n\n`;
    doc += `### Calculation Walkthrough\n`;
    doc += `${scoreData.calculationExplanation}\n\n`;
    doc += `### Pillar Breakdown\n\n`;
    doc += `| Pillar | Score | Weight | Reason |\n`;
    doc += `| :--- | :---: | :---: | :--- |\n`;
    doc += `| Market | ${scoreData.marketScore} | 30% | ${scoreData.marketReason} |\n`;
    doc += `| Revenue | ${scoreData.revenueScore} | 25% | ${scoreData.revenueReason} |\n`;
    doc += `| Execution | ${scoreData.executionScore} | 20% | ${scoreData.executionReason} |\n`;
    doc += `| Competition | ${scoreData.competitionScore} | 15% | ${scoreData.competitionReason} |\n`;
    doc += `| Risk Mitigation | ${scoreData.riskScore} | 10% | ${scoreData.riskReason} |\n\n`;
    doc += `### Recommendation\n`;
    doc += `${scoreData.recommendation}\n\n`;
    doc += `---\n\n`;
  }
  
  AGENTS.forEach((agent, i) => {
    doc += `## ${i + 1}. ${agent.name} — ${agent.role}\n\n`;
    
    if (results[agent.id]) {
      doc += `> **Agent Output:**\n\n`;
      doc += results[agent.id];
      doc += `\n\n`;
    } else {
      doc += `> No output generated for this agent.\n\n`;
    }
    
    doc += `---\n\n`;
  });
  
  doc += `## Summary\n\n`;
  doc += `| Agent | Role | Status |\n`;
  doc += `|-------|------|--------|\n`;
  AGENTS.forEach(agent => {
    const status = results[agent.id] ? 'Complete' : 'No Data';
    doc += `| ${agent.name} | ${agent.role} | ${status} |\n`;
  });
  
  return doc;
}

/* ── Extract a section from agent markdown content ── */
function extractPrdSection(text: string | null, keywords: string[], fallbackTitle?: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  let capturing = false;
  const content: string[] = [];
  
  for (const line of lines) {
    const cleanLine = line.trim();
    if (cleanLine.startsWith("#")) {
      const isMatch = keywords.some(k => cleanLine.toLowerCase().includes(k.toLowerCase()));
      if (isMatch) {
        capturing = true;
        continue; // skip the heading line itself
      } else if (capturing) {
        break; // stop capturing on next heading
      }
    } else if (cleanLine.match(/^\d+\.\s/)) {
      const isMatch = keywords.some(k => cleanLine.toLowerCase().includes(k.toLowerCase()));
      if (isMatch) {
        if (!capturing) {
          capturing = true;
          continue;
        } else {
          break;
        }
      }
    }
    
    if (capturing) {
      content.push(line);
    }
  }
  
  const res = content.join("\n").trim();
  if (!res && fallbackTitle) {
    const paras = text.split("\n\n").filter(p => p.trim() && !p.trim().startsWith("#"));
    if (fallbackTitle === "Problem Statement") {
      return paras.length > 3 ? paras.slice(3, 6).join("\n\n") : paras.slice(Math.min(1, paras.length - 1)).join("\n\n");
    }
    return paras.slice(0, 3).join("\n\n");
  }
  return res;
}

/* ── Generate Product Requirements Document (PRD) markdown ── */
function generatePRD(idea: string, results: AgentResults): string {
  let doc = `# Product Requirements Document (PRD)\n\n`;
  doc += `## Project: ${idea}\n`;
  doc += `* **Author**: AI PM Agent\n`;
  doc += `* **Date**: ${new Date().toLocaleDateString()}\n`;
  doc += `* **Version**: 1.0 (Draft)\n`;
  doc += `* **Status**: Compiled & Validated\n\n`;
  doc += `> This Product Requirements Document specifies the functional requirements, user experiences, technical architecture, and launch strategies synthesized by AI Founder OS.\n\n`;
  doc += `---\n\n`;

  // 1. Objectives & Executive Summary
  doc += `## 1. Executive Summary & Vision\n\n`;
  const vision = extractPrdSection(results.advisor, ["overview", "vision", "summary", "fit"], "Overview");
  if (vision) {
    doc += `${vision}\n\n`;
  } else {
    doc += `The primary goal of **${idea}** is to address market problems through a scalable, automated service.\n\n`;
  }

  // 2. User Problems & Audience
  doc += `## 2. Target Audience & Core Problems\n\n`;
  const problem = extractPrdSection(results.advisor, ["problem", "audience", "target"], "Problem Statement");
  if (problem) {
    doc += `${problem}\n\n`;
  } else {
    doc += `### Core User Pain Points:\n* Lack of automated solutions for this workflow.\n* High barriers of entry for new market entrants.\n\n`;
  }

  // 3. MVP Features & Functional Spec
  doc += `## 3. Functional Requirements & MVP Features\n\n`;
  const features = extractPrdSection(results.product, ["features", "user stories", "scope", "mvp"], "Features");
  if (features) {
    doc += `${features}\n\n`;
  } else {
    doc += `### MVP Scope Items:\n* Core Dashboard visualization.\n* Multi-agent execution panel.\n* Consolidated reporting engine.\n\n`;
  }

  // 4. Tech Stack & Architecture
  doc += `## 4. Technical Architecture & Database Schema\n\n`;
  const tech = extractPrdSection(results.architecture, ["database", "schema", "api", "tech stack"], "Database Tables");
  if (tech) {
    doc += `${tech}\n\n`;
  } else {
    doc += `### Technical Stack:\n* **Frontend**: React, Next.js, Tailwind CSS\n* **Database**: SQL-compatible schema\n* **APIs**: Rest endpoints for orchestrating prompts\n\n`;
  }

  // 5. Release Roadmap & Sprint Plan
  doc += `## 5. Release Roadmap & Sprint Plan\n\n`;
  const roadmap = extractPrdSection(results.engineering, ["timeline", "sprint", "milestones", "plan"], "Sprint Plan");
  if (roadmap) {
    doc += `${roadmap}\n\n`;
  } else {
    doc += `### Launch Milestones:\n* **Week 1-2**: Backend Setup & API schemas.\n* **Week 3-4**: Frontend implementation and Dashboard layout.\n* **Week 5**: Release Candidate & Polish.\n\n`;
  }

  // 6. GTM Strategy
  doc += `## 6. Go-To-Market & Growth Channels\n\n`;
  const gtm = extractPrdSection(results.marketing, ["gtm", "channel", "launch", "campaign"], "Channels");
  if (gtm) {
    doc += `${gtm}\n\n`;
  } else {
    doc += `### Growth Channels:\n* Product Hunt & Hacker News organic launch.\n* Targeted outreach to startup newsletters and communities.\n\n`;
  }

  return doc;
}

/* ── Compact Business Breakdown — 3 chart panels ── */
const BREAKDOWN_SEGMENTS = [
  { label: "Market", value: 18, color: "#ea580c" },
  { label: "Product", value: 14, color: "#f97316" },
  { label: "Technical", value: 14, color: "#fb923c" },
  { label: "GTM", value: 14, color: "#f59e0b" },
  { label: "Ops", value: 12, color: "#fbbf24" },
  { label: "Risk", value: 14, color: "#fcd34d" },
  { label: "Finance", value: 14, color: "#fde047" },
];

const PILLAR_BARS = [
  { label: "Validation", value: 82, color: "#ea580c" },
  { label: "Market Fit", value: 76, color: "#f97316" },
  { label: "Product", value: 88, color: "#f59e0b" },
  { label: "Execution", value: 71, color: "#fbbf24" },
  { label: "Financial", value: 79, color: "#fcd34d" },
];

function DonutChart({ segments, size = 96 }: { segments: typeof BREAKDOWN_SEGMENTS; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 50, cy = 50, r = 38, ir = 24;

  const paths = segments.map((seg, i) => {
    const previousSegments = segments.slice(0, i);
    const startAngle = (previousSegments.reduce((sum, s) => sum + s.value, 0) / total) * 360;
    const sliceAngle = (seg.value / total) * 360;
    const endAngle = startAngle + sliceAngle;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1o = cx + r * Math.cos(startRad), y1o = cy + r * Math.sin(startRad);
    const x2o = cx + r * Math.cos(endRad), y2o = cy + r * Math.sin(endRad);
    const x1i = cx + ir * Math.cos(endRad), y1i = cy + ir * Math.sin(endRad);
    const x2i = cx + ir * Math.cos(startRad), y2i = cy + ir * Math.sin(startRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const d = `M ${x1o} ${y1o} A ${r} ${r} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${ir} ${ir} 0 ${largeArc} 0 ${x2i} ${y2i} Z`;
    return (
      <motion.path
        key={i}
        d={d}
        fill={seg.color}
        stroke="#111113"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
      {paths}
    </svg>
  );
}

function HorizontalBarChart({ bars }: { bars: typeof PILLAR_BARS }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {bars.map((bar, i) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-[9px] w-14 truncate uppercase tracking-wide font-mono text-zinc-400">
            {bar.label}
          </span>
          <div className="flex-1 h-2 rounded bg-zinc-800/80 border border-zinc-700/50 overflow-hidden">
            <motion.div
              className="h-full rounded transition-all"
              style={{ background: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            />
          </div>
          <span className="text-[9px] w-7 text-right font-semibold font-mono text-zinc-100">
            {bar.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function AgentOutputChart({ results }: { results: AgentResults }) {
  return (
    <div className="flex items-end justify-between gap-1.5 h-[72px] w-full px-1">
      {AGENTS.map((agent, i) => {
        const len = results[agent.id]?.length ?? 0;
        const height = Math.max(12, Math.min(72, (len / 1200) * 72));
        return (
          <div key={agent.id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <div className="relative w-full flex items-end justify-center h-full">
              <motion.div
                className="w-full max-w-[14px] rounded-t"
                style={{ 
                  height, 
                  background: "linear-gradient(to top, #ea580c, #f59e0b)", 
                  opacity: len ? 1 : 0.25 
                }}
                title={`${agent.name}: ${len} chars`}
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
            <AgentIcon Icon={agent.Icon} color={agent.color} size={10} />
          </div>
        );
      })}
    </div>
  );
}

function AnimatedScore({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      const t = setTimeout(() => setDisplayValue(0), 0);
      return () => clearTimeout(t);
    }

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="text-5xl font-extrabold tracking-tighter text-[#1A1A1A] score-glow-text" style={{ fontFamily: 'var(--font-heading)' }}>
      {displayValue}
    </span>
  );
}

function BusinessBreakdownCharts({ results }: { results: AgentResults }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="breakdown-chart-card bg-[#161618] border border-zinc-800/80 p-4 rounded-xl">
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp size={13} className="text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-300">Allocation</span>
        </div>
        <div className="flex items-center gap-4">
          <DonutChart segments={BREAKDOWN_SEGMENTS} />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {BREAKDOWN_SEGMENTS.slice(0, 4).map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5 text-[9px] font-mono">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                <span className="truncate text-zinc-400">{seg.label}</span>
                <span className="ml-auto font-semibold text-zinc-100">{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="breakdown-chart-card bg-[#161618] border border-zinc-800/80 p-4 rounded-xl">
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 size={13} className="text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-300">Pillar Scores</span>
        </div>
        <HorizontalBarChart bars={PILLAR_BARS} />
      </div>

      <div className="breakdown-chart-card bg-[#161618] border border-zinc-800/80 p-4 rounded-xl">
        <div className="flex items-center gap-1.5 mb-3">
          <Activity size={13} className="text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-300">Agent Output</span>
        </div>
        <AgentOutputChart results={results} />
      </div>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [idea, setIdea] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [results, setResults] = useState<AgentResults>({});
  const [toolLogs, setToolLogs] = useState<{ icon: string; text: string }[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [investorMode, setInvestorMode] = useState(false);
  const [notionCopied, setNotionCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const processingRef = useRef(false);

  // ── Scoring Engine States ──
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  // ── PRD Generation States ──
  const [showPrdModal, setShowPrdModal] = useState(false);
  const [isCalculatingPrd, setIsCalculatingPrd] = useState(false);
  const [prdStepIndex, setPrdStepIndex] = useState(0);
  const [prdContent, setPrdContent] = useState("");
  const [prdCopied, setPrdCopied] = useState(false);
  const [showConfirmBackModal, setShowConfirmBackModal] = useState(false);

  // ── Accordion State for Detailed Analysis ──
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({
    advisor: true,
  });

  const toggleAgentAccordion = (agentId: string) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentId]: !prev[agentId],
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition || (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const t = setTimeout(() => setSpeechSupported(false), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setSpeechSupported(true), 0);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: { error: string; message?: string }) => {
      const errorType = event?.error ?? event?.message ?? "unknown";
      if (["not-allowed", "service-not-allowed", "permission-denied"].includes(errorType)) {
        setIsRecording(false);
        setSpeechSupported(false);
        return;
      }
      setIsRecording(false);
    };

    recognition.onresult = (event: {
      results: {
        isFinal: boolean;
        0: {
          transcript: string;
        };
      }[];
    }) => {
      const transcript = Array.from(event.results || [])
        .filter((result) => result.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (!transcript) return;
      setIdea((prev) => `${prev.trim()}${prev.trim() ? " " : ""}${transcript}`);
    };

    recognitionRef.current = recognition as ISpeechRecognition;

    return () => {
      clearTimeout(t);
      recognitionRef.current?.stop?.();
    };
  }, []);

  const toggleVoiceRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      console.error("Voice recognition failed to start:", error);
      setIsRecording(false);
    }
  }, [isRecording]);

  // ── Tool Simulation Logs ──
  const simulateToolExecution = useCallback((stepIndex: number) => {
    const logs = [
      { icon: "Zap", text: "File Tool: Parsing uploaded documents & context..." },
      { icon: "Search", text: "Search Tool: Market Research Agent searching competitor matrices & TAM data..." },
      { icon: "BookOpen", text: "Notion Tool: Startup Advisor generating validation workspace & feedback summary..." },
      { icon: "BookOpen", text: "Notion Tool: Product Manager compiling Product Requirements Document (PRD)..." },
      { icon: "GitBranch", text: "GitHub Tool: Architect provisioning workspace repository & generating system schemas..." },
      { icon: "BookOpen", text: "Notion Tool: Marketing Agent drafting launch copy & GTM strategy..." },
      { icon: "GitBranch", text: "GitHub Tool: Engineering Manager filing Sprint milestones & P0/P1/P2 issues..." },
      { icon: "AlertTriangle", text: "Risk Tool: Risk Analyst scoring market, technical & compliance exposure..." },
      { icon: "DollarSign", text: "Finance Tool: Financial Analyst modeling revenue, CAC/LTV & burn rate..." },
      { icon: "FileText", text: "PDF Tool: Compiling unified Startup Package report..." },
    ];
    
    setToolLogs((prev) => [...prev, logs[stepIndex] || { icon: "", text: "" }]);
  }, []);

  const activeRollingIndex = completedAgents.length;

  const revealAgentsProgressively = useCallback(() => {
    const agentIds = AGENTS.map((a) => a.id);
    const delays = agentIds.map((_, i) => 1000 + i * 1200);

    // Start file tool log
    simulateToolExecution(0);

    agentIds.forEach((id, i) => {
      setTimeout(() => {
        setCompletedAgents((prev) => [...prev, id]);
        
        // Trigger corresponding tool logs
        if (id === "research") simulateToolExecution(1);
        if (id === "advisor") simulateToolExecution(2);
        if (id === "product") simulateToolExecution(3);
        if (id === "architecture") simulateToolExecution(4);
        if (id === "marketing") simulateToolExecution(5);
        if (id === "engineering") simulateToolExecution(6);
        if (id === "risk") simulateToolExecution(7);
        if (id === "financial") simulateToolExecution(8);

        if (i === agentIds.length - 1) {
          simulateToolExecution(9);
          setTimeout(() => {
            setState("results");
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#F7C948", "#EC4899", "#3B82F6", "#22C55E"]
            });
          }, 1200);
        }
      }, delays[i]);
    });
  }, [simulateToolExecution]);

  const handleSubmit = useCallback(async () => {
    if (!idea.trim() && uploadedFiles.length === 0) return;
    if (processingRef.current) return;
    processingRef.current = true;

    setCompletedAgents([]);
    setResults({});
    setToolLogs([]);
    setState("processing");

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: idea.trim() || `Startup plan based on uploaded context: ${uploadedFiles[0]?.name}`,
          files: uploadedFiles 
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();

      const mapped: AgentResults = {
        advisor: data.advisor ?? null,
        research: data.research ?? null,
        product: data.product ?? null,
        architecture: data.architecture ?? null,
        marketing: data.marketing ?? null,
        engineering: data.engineering ?? null,
        risk: data.risk ?? null,
        financial: data.financial ?? null,
      };

      setResults(mapped);
      revealAgentsProgressively();
    } catch (error) {
      console.error("Orchestration failed:", error);
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setState("input");
    } finally {
      processingRef.current = false;
    }
  }, [idea, uploadedFiles, revealAgentsProgressively]);

  const handleReset = useCallback(() => {
    setState("input");
    setIdea("");
    setUploadedFiles([]);
    setCompletedAgents([]);
    setResults({});
    setToolLogs([]);
    setFileError(null);
    setShowNotionModal(false);
    processingRef.current = false;
    // Reset Scoring states
    setScoreData(null);
    setIsScoring(false);
    setScoreError(null);
  }, []);

  const handleGenerateScore = useCallback(async () => {
    if (isScoring) return;
    setIsScoring(true);
    setScoreError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() || `Startup plan: ${uploadedFiles[0]?.name}`, results }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate scores");
      }
      const data = await res.json();
      setScoreData(data);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#F7C948", "#EC4899", "#3B82F6"]
      });
    } catch (err) {
      console.error("Scoring error:", err);
      setScoreError(err instanceof Error ? err.message : "Failed to compute snapshot scores");
    } finally {
      setIsScoring(false);
    }
  }, [idea, results, isScoring, uploadedFiles]);

  // ── File Upload Handlers with size limits ──
  const processFiles = (files: FileList) => {
    setFileError(null);
    const currentTotalSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);

    Array.from(files).forEach((file) => {
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" exceeds 500KB limit (${formatFileSize(file.size)}). Please use a smaller file.`);
        return;
      }

      // Check total size
      if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
        setFileError(`Total upload limit of 1MB reached. Remove a file before adding more.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || "text/plain",
            size: file.size,
            content: content || `[Simulated content extraction for ${file.name}]`,
          },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  // ── Unified Package Compilation ──
  const getUnifiedPackageText = () => {
    let output = `# STARTUP PACKAGE: EXECUTIVE STRATEGY & PLAN\n\n`;
    output += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    if (scoreData) {
      output += `=========================================\n`;
      output += `FOUNDER SNAPSHOT SCORE: ${scoreData.startupScore}/100\n`;
      output += `=========================================\n\n`;
      output += `Investor Verdict: ${scoreData.investorVerdict}\n\n`;
      output += `Calculation Breakdown:\n${scoreData.calculationExplanation}\n\n`;
      output += `Pillar Scores:\n`;
      output += `- Market Score: ${scoreData.marketScore}/100 (Reason: ${scoreData.marketReason})\n`;
      output += `- Revenue Score: ${scoreData.revenueScore}/100 (Reason: ${scoreData.revenueReason})\n`;
      output += `- Execution Score: ${scoreData.executionScore}/100 (Reason: ${scoreData.executionReason})\n`;
      output += `- Competition Score: ${scoreData.competitionScore}/100 (Reason: ${scoreData.competitionReason})\n`;
      output += `- Risk Score: ${scoreData.riskScore}/100 (Reason: ${scoreData.riskReason})\n\n`;
      output += `Recommendation: ${scoreData.recommendation}\n\n`;
      output += `-----------------------------------------\n\n`;
    }

    AGENTS.forEach((agent) => {
      output += `=========================================\n`;
      output += `${agent.name.toUpperCase()} - ${agent.role.toUpperCase()}\n`;
      output += `=========================================\n\n`;
      output += results[agent.id] || "No data compiled.";
      output += `\n\n`;
    });
    return output;
  };

  const downloadPackage = () => {
    const element = document.createElement("a");
    const file = new Blob([getUnifiedPackageText()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${idea.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-startup-package.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyNotion = () => {
    const doc = generateNotionDoc(idea || "Startup Package", results, scoreData);
    navigator.clipboard.writeText(doc);
    setNotionCopied(true);
    setTimeout(() => setNotionCopied(false), 2000);
  };

  const handleDownloadNotion = () => {
    const doc = generateNotionDoc(idea || "Startup Package", results, scoreData);
    const element = document.createElement("a");
    const file = new Blob([doc], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${idea.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-notion-doc.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGeneratePrd = () => {
    setIsCalculatingPrd(true);
    setPrdStepIndex(0);
    setPrdCopied(false);
    
    // Simulate steps of consolidation
    const totalSteps = 5;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < totalSteps) {
        setPrdStepIndex(currentStep);
      } else {
        clearInterval(interval);
        const compiledPrd = generatePRD(idea || "Startup Package", results);
        setPrdContent(compiledPrd);
        setIsCalculatingPrd(false);
        setShowPrdModal(true);
      }
    }, 850); // 850ms per step, total ~4.2 seconds
  };

  const handleCopyPrd = () => {
    navigator.clipboard.writeText(prdContent);
    setPrdCopied(true);
    setTimeout(() => setPrdCopied(false), 2000);
  };

  const handleDownloadPrd = () => {
    const element = document.createElement("a");
    const file = new Blob([prdContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${idea.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-prd.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const insights = distillInsights(results);
  const totalUploadSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="landing-shell min-h-screen bg-[#f5ebe4] p-3 md:p-5 flex items-center justify-center">
      <div className="landing-window relative w-full max-w-[1440px] min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-40px)] bg-[#f5dccb] border-[10px] border-[#adacaa] rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          {state !== "results" && (
            <img
              src="/landing/search1.jpeg"
              alt="search"
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-body)' }}>
      
      {/* ── Marquee Banner ── */}
      <div className="marquee-banner">
        <div className="marquee-content">
          <span>AI FOUNDER OS</span>
          <span>MULTI-AGENT SYSTEM</span>
          <span>STRATEGY & VALIDATION</span>
          <span>MARKET INTELLIGENCE</span>
          <span>PRODUCT ARCHITECTURE</span>
          <span>AI FOUNDER OS</span>
          <span>MULTI-AGENT SYSTEM</span>
          <span>STRATEGY & VALIDATION</span>
          <span>MARKET INTELLIGENCE</span>
          <span>PRODUCT ARCHITECTURE</span>
          <span>RISK ANALYSIS</span>
          <span>FINANCIAL MODELING</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ──────────────── PHASE 1: INPUT ──────────────── */}
          {state === "input" && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full px-6 py-16 flex flex-col items-center justify-center min-h-[85vh] relative"
            >
              {/* Back Button */}
              <div className="absolute left-6 top-6 z-20">
                <Link href="/">
                  <ArrowButton />
                </Link>
              </div>
              
              <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
              
              {/* Headline */}
              <h1
                className="text-3xl sm:text-4xl text-center tracking-tight leading-tight mb-3 relative -mt-15 text-center"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              >
                What&apos;s on the agenda today?
              </h1>

              {/* Chat-style composer */}
              <div className="w-full max-w-3xl mt-50">
                <div
                  className={`chat-composer${isDragging ? " chat-composer-dragging" : ""}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && processFiles(e.target.files)}
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="chat-composer-plus"
                    title="Attach files"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className="chat-composer-plus"
                    title={speechSupported ? (isRecording ? "Stop voice input" : "Start voice input") : "Voice input not supported"}
                    disabled={!speechSupported}
                  >
                    <Mic size={18} className={isRecording ? "text-green-400" : ""} />
                  </button>
                  <textarea
                    id="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ask anything about your startup idea..."
                    rows={1}
                    className="chat-composer-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (idea.trim() || uploadedFiles.length > 0) handleSubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!idea.trim() && uploadedFiles.length === 0}
                    className="chat-composer-send"
                    title="Launch agents"
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : "Press + to attach files · Max 500KB each"}
                  </span>
                  <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                    {formatFileSize(totalUploadSize)} / 1 MB
                  </span>
                </div>

                {fileError && (
                  <div className="flex items-center gap-2 px-3 py-2 mt-2 rounded" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF4444' }} />
                    <span className="text-xs" style={{ color: '#DC2626' }}>{fileError}</span>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px]"
                        style={{ background: 'var(--cream-dark)', border: '1px solid var(--border-light)', color: 'var(--ink-light)' }}
                      >
                        <FileText className="w-3 h-3" style={{ color: 'var(--ink-muted)' }} />
                        <span className="max-w-[140px] truncate font-medium">{file.name}</span>
                        <span style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{formatFileSize(file.size)}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          className="hover:text-red-500 transition-colors p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tool Cards — Field Notes style */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-14">
                <div className="editorial-card tool-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>Search Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed">Runs real-time web scans for TAM, competitor data, and market dynamics.</p>
                </div>

                <div className="editorial-card tool-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>GitHub Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed">Generates sprint cycles, DB mapping, API endpoints, and tasks.</p>
                </div>

                <div className="editorial-card tool-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>Notion Workspace</span>
                  </div>
                  <p className="text-xs leading-relaxed">Compiles structured docs, user stories, and GTM plans.</p>
                </div>

                <div className="editorial-card tool-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>Risk Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed">Scores market, technical, and compliance risks with mitigation strategies.</p>
                </div>

                <div className="editorial-card tool-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileDown className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>Finance Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed">Builds revenue models, CAC/LTV projections, and funding requirements.</p>
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {/* ──────────────── PHASE 2: PROCESSING — Rolling Agent Transition ──────────────── */}
          {state === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full px-6 py-16 flex flex-col justify-center min-h-[85vh] relative"
            >
              {/* Back Button */}
              <div className="absolute left-6 top-6 z-20">
                <ArrowButton onClick={() => setShowConfirmBackModal(true)} />
              </div>
              
              <div className="max-w-5xl mx-auto w-full flex flex-col justify-center">
              {/* Header */}
              <div className="text-center mb-10 -mt-12 relative">
                <div className="badge-yellow mb-4 mx-auto inline-flex animate-stamp">
                  <span>Compiling</span>
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                  Assembling Startup Package
                </h2>
                <p className="text-sm" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                  {AGENTS.length} agents · sequential workspace tools · rolling pipeline
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-3xl mx-auto mb-10">
                <div className="flex justify-between items-center text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                  <span style={{ color: 'var(--ink)' }}>Assembly Progress</span>
                  <span style={{ color: 'var(--ink-muted)' }}>{completedAgents.length} / {AGENTS.length} Complete</span>
                </div>
                <div className="h-3 w-full overflow-hidden" style={{ background: 'var(--cream-dark)', border: '2px solid var(--border)', borderRadius: '2px' }}>
                  <motion.div 
                    className="h-full"
                    style={{ background: 'var(--accent-yellow)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedAgents.length / AGENTS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Split: Rolling Agent Card + Timeline + Tool Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left: Timeline + Rolling Agent Card */}
                <div className="lg:col-span-3 flex gap-6">
                  {/* Vertical Timeline */}
                  <div className="flex flex-col items-center gap-0 pt-2 flex-shrink-0">
                    {AGENTS.map((agent, i) => {
                      const isComplete = completedAgents.includes(agent.id);
                      const isActive = i === activeRollingIndex && !isComplete;
                      return (
                        <div key={agent.id} className="flex flex-col items-center">
                          <div 
                            className={`timeline-dot ${isComplete ? 'complete' : isActive ? 'active' : ''}`}
                            title={agent.name}
                          >
                            {isComplete && (
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          {i < AGENTS.length - 1 && (
                            <div className={`timeline-line h-[42px] ${isComplete ? 'complete' : ''}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rolling Agent Card — shows ONE agent at a time */}
                  <div className="flex-1 min-h-[340px] flex items-start">
                    <AnimatePresence mode="wait">
                      {AGENTS.map((agent, i) => {
                        if (i !== activeRollingIndex) return null;
                        const isComplete = completedAgents.includes(agent.id);
                        
                        return (
                          <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, x: 60, rotate: 6 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: -60, rotate: -6 }}
                            transition={{ 
                              duration: 0.5, 
                              ease: [0.22, 0.61, 0.36, 1]
                            }}
                            className="w-full editorial-card p-6 flex flex-col gap-4 bg-[#1a1a1a]"
                            style={{ borderColor: agent.color, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                          >
                            {/* Agent Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span 
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                                  style={{ 
                                    background: agent.color, 
                                    color: '#fff',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    border: '2px solid var(--ink)'
                                  }}
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                  <h3 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>
                                    <AgentIcon Icon={agent.Icon} color={agent.color} size={18} />
                                    {agent.name}
                                  </h3>
                                  <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: '#a1a1aa' }}>
                                    {agent.role}
                                  </p>
                                </div>
                              </div>
                              {isComplete ? (
                                <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--accent-green)' }} />
                              ) : (
                                <RefreshCw className="w-5 h-5 animate-spin" style={{ color: agent.color }} />
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed" style={{ color: '#d4d4d8' }}>
                              {agent.description}
                            </p>

                            {/* Output Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {agent.outputs.map((out, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-[9px] px-2.5 py-1 rounded font-semibold uppercase"
                                  style={{ 
                                    background: '#27272a', 
                                    border: '1px solid #3f3f46',
                                    color: '#e4e4e7',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: '0.04em'
                                  }}
                                >
                                  {out}
                                </span>
                              ))}
                            </div>

                            {/* Status bar */}
                            <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                              {isComplete ? (
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
                                  ✓ Analysis Complete
                                </span>
                              ) : (
                                <span className="text-xs uppercase tracking-wider animate-pulse-subtle" style={{ fontFamily: 'var(--font-mono)', color: agent.color }}>
                                  ● Processing...
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: Tool logs console */}
                <div className="lg:col-span-2 flex flex-col h-[380px] overflow-hidden bg-[#1a1a1a] border-2 border-[#1a1a1a] rounded-sm">
                  <div className="px-4 py-2.5 flex items-center justify-between bg-[#111] border-b border-[#333]">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-300" style={{ fontFamily: 'var(--font-mono)' }}>Automated Tool Logs</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F7C948]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {toolLogs.map((log, index) => {
                      const IconMap: Record<string, LucideIcon> = { Zap, Search, BookOpen, GitBranch, AlertTriangle, DollarSign, FileText };
                      const IconComp = log.icon ? IconMap[log.icon] : null;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-2.5 rounded flex items-center gap-2 bg-white/5 text-zinc-100"
                        >
                          {IconComp && <IconComp size={12} className="flex-shrink-0" />}
                          <span>{log.text}</span>
                        </motion.div>
                      );
                    })}
                    <div className="flex items-center gap-2 mt-auto pt-2 animate-pulse-subtle text-zinc-400">
                      <span>&gt;_ Listening for workspace triggers...</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {/* ──────────────── PHASE 3: RESULTS — Consolidated Summary Report ──────────────── */}
          {state === "results" && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-[85vh]"
            >
              {investorMode ? (
                <InvestorMode results={results} onClose={() => setInvestorMode(false)} />
              ) : (
                <>
                  {/* Dashboard Header Banner */}
                  <div className="print:hidden pl-24 pr-6 sm:pl-28 sm:pr-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative border-b border-zinc-800 bg-[#121214]">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <ArrowButton onClick={() => setShowConfirmBackModal(true)} className="arrow-btn-white" />
                    </div>
                    <div>
                      <div className="badge-yellow mb-2 animate-stamp">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PACKAGE ASSEMBLED</span>
                      </div>
                      <h2 className="text-xl font-bold truncate max-w-xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                        {idea || "Startup Package"}
                      </h2>
                    </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                  <button
                    onClick={() => window.print()}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: 'transparent', color: '#ffffff', borderColor: '#ffffff' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Report</span>
                  </button>
                  <button
                    onClick={() => setInvestorMode(true)}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: '#FF8A00', color: '#1a1a1a', borderColor: '#FF8A00' }}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Pitch This Startup</span>
                  </button>
                  <button
                    onClick={() => setShowNotionModal(true)}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: 'var(--accent-yellow)', color: '#ffffff', borderColor: 'var(--accent-yellow)' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Notion Doc</span>
                  </button>
                  <button
                    onClick={handleGeneratePrd}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: '#EC4899', color: '#ffffff', borderColor: '#EC4899' }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate PRD</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-secondary px-4 py-2 flex items-center gap-2"
                    style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>New Strategy</span>
                  </button>
                </div>
              </div>

              {/* ── Consolidated Summary Report (1-2 pages max) ── */}
              <div className="summary-report flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-5 print:p-4 print:gap-4">
                
                {/* Cover Header */}
                <section className="editorial-card p-6 print:border print:border-gray-300 print:hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="badge-pink">
                      <Rocket className="w-3 h-3" />
                      <span>AI Founder OS</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                      STAMPED {new Date().getFullYear()}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-800 my-4" />
                  
                  <h1 className="text-3xl sm:text-4xl tracking-tight leading-tight text-white font-heading">
                    {idea || "Startup Strategy Report"}
                  </h1>
                  <p className="text-xs mt-2 font-mono text-zinc-400 tracking-widest uppercase">
                    Unified Package · {new Date().toLocaleDateString()} · {AGENTS.length} Agent Compilation
                  </p>
                </section>

                {/* Key Insights */}
                {insights.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="editorial-card p-5 print:hidden"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="section-number section-number-yellow font-heading">01</span>
                      <h2 className="text-lg font-bold tracking-tight font-heading">KEY INSIGHTS</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {insights.map((insight, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.01, translateY: -2 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="flex gap-3 p-4 rounded-xl text-xs leading-relaxed border bg-[#161618] border-zinc-800/80 hover:border-amber-500/30 transition-all duration-300"
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500 flex-shrink-0 mt-0.5 border border-amber-500/20">
                            <Zap className="w-3 h-3" />
                          </div>
                          <div className="flex-1 text-zinc-300" dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Agent Summary Table */}
                <motion.section 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="editorial-card p-5 print:hidden"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="section-number section-number-pink font-heading">02</span>
                    <h2 className="text-lg font-bold tracking-tight font-heading">AGENT SUMMARY</h2>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-[#161618]">
                    <table className="agent-summary-table w-full">
                      <colgroup>
                        <col style={{ width: "42px" }} />
                        <col style={{ width: "160px" }} />
                        <col style={{ width: "130px" }} />
                        <col />
                        <col style={{ width: "85px" }} />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="font-mono text-zinc-400">#</th>
                          <th className="font-mono text-zinc-400">Agent</th>
                          <th className="font-mono text-zinc-400">Role</th>
                          <th className="font-mono text-zinc-400">Top Finding</th>
                          <th className="font-mono text-zinc-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {AGENTS.map((agent, i) => {
                          const agentResult = results[agent.id];
                          const topFinding = agentResult
                            ? agentResult.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'))[0]?.replace(/^[\*\-\d\.]+\s*/, '').replace(/\*\*/g, '').trim().slice(0, 95) || "—"
                            : "—";
                          const hasResult = Boolean(agentResult);
                          return (
                            <tr key={agent.id} className={hasResult ? "bg-amber-500/[0.01]" : ""}>
                              <td className="cell-num font-mono text-zinc-500 font-bold">
                                {String(i + 1).padStart(2, '0')}
                              </td>
                              <td className="cell-agent">
                                <span className="inline-flex items-center gap-2 font-medium">
                                  <AgentIcon Icon={agent.Icon} color={agent.color} size={14} />
                                  <span>{agent.name}</span>
                                </span>
                              </td>
                              <td className="cell-role text-xs text-zinc-400">{agent.role}</td>
                              <td className="cell-finding text-zinc-300 text-xs">{topFinding}</td>
                              <td className="cell-status">
                                {hasResult ? (
                                  <span className="status-pill status-complete inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span>Done</span>
                                  </span>
                                ) : (
                                  <span className="status-pill status-empty inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                    <span>Pending</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.section>

                {/* Founder Snapshot Score */}
                <motion.section 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="editorial-card p-5 relative overflow-hidden print:hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="section-number section-number-yellow font-heading">03</span>
                      <h2 className="text-lg font-bold tracking-tight font-heading">FOUNDER SNAPSHOT SCORE</h2>
                    </div>
                    {scoreData && (
                      <span className="badge-yellow">
                        {scoreData.investorVerdict.split(/[-–—:]/)[0].trim()}
                      </span>
                    )}
                  </div>

                  {!scoreData ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center bg-[#161618] rounded-xl border border-dashed border-zinc-800/80">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                        <Brain className="w-6 h-6 animate-float text-amber-500" />
                      </div>
                      <h3 className="text-sm font-bold mb-1.5 text-zinc-100">FOUNDER SCORE READY</h3>
                      <p className="text-xs max-w-md mb-5 px-4 text-zinc-400 leading-relaxed">
                        Evaluate your startup across 5 critical pillars (Market, Revenue, Execution, Competition, Risk) using our weighted scoring algorithm.
                      </p>
                      <button
                        onClick={handleGenerateScore}
                        disabled={isScoring}
                        className="btn-primary px-6 py-3 flex items-center gap-2"
                        style={{ background: '#FF8A00', borderColor: '#FF8A00', color: '#000000' }}
                      >
                        {isScoring ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Calculating Scores...</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-4 h-4" />
                            <span>GENERATE SCORE</span>
                          </>
                        )}
                      </button>
                      {scoreError && (
                        <p className="text-xs text-red-500 mt-3 font-medium">⚠️ {scoreError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Circle Gauge on Left */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-[#161618] border border-zinc-850 shadow-inner relative overflow-hidden min-h-[240px] gauge-card">
                          <div className="absolute w-24 h-24 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
                          
                          <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <defs>
                                <linearGradient id="scoreProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#ea580c" />
                                  <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                              </defs>
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#27272a"
                                strokeWidth="7"
                              />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="url(#scoreProgressGradient)"
                                strokeWidth="8"
                                strokeDasharray={251.2}
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * scoreData.startupScore) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                                style={{ filter: "drop-shadow(0px 0px 4px rgba(245, 158, 11, 0.4))" }}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                              <AnimatedScore value={scoreData.startupScore} />
                              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                                OVERALL
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-center mt-4 px-2">
                            <span className="text-[9px] font-mono uppercase tracking-widest block text-zinc-400">
                              INVESTOR VERDICT
                            </span>
                            <h4 className="text-sm font-bold text-zinc-100 uppercase mt-1 tracking-tight">
                              {scoreData.investorVerdict}
                            </h4>
                          </div>
                        </div>

                        {/* Weights and Explanations on Right */}
                        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                          <div className="flex flex-col gap-4">
                            {/* Market Score */}
                            <div className="score-pillar-row">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-zinc-200">Market Score (30% Weight)</span>
                                <span className="text-zinc-100 font-mono">{scoreData.marketScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-zinc-800/80 rounded-sm overflow-hidden mt-1.5">
                                <div className="h-full bg-amber-500 rounded-sm" style={{ width: `${scoreData.marketScore}%` }} />
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{scoreData.marketReason}</p>
                            </div>

                            {/* Revenue Score */}
                            <div className="score-pillar-row">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-zinc-200">Revenue Score (25% Weight)</span>
                                <span className="text-zinc-100 font-mono">{scoreData.revenueScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-zinc-800/80 rounded-sm overflow-hidden mt-1.5">
                                <div className="h-full bg-orange-500 rounded-sm" style={{ width: `${scoreData.revenueScore}%` }} />
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{scoreData.revenueReason}</p>
                            </div>

                            {/* Execution Score */}
                            <div className="score-pillar-row">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-zinc-200">Execution Score (20% Weight)</span>
                                <span className="text-zinc-100 font-mono">{scoreData.executionScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-zinc-800/80 rounded-sm overflow-hidden mt-1.5">
                                <div className="h-full bg-amber-400 rounded-sm" style={{ width: `${scoreData.executionScore}%` }} />
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{scoreData.executionReason}</p>
                            </div>

                            {/* Competition Score */}
                            <div className="score-pillar-row">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-zinc-200">Competition Score (15% Weight)</span>
                                <span className="text-zinc-100 font-mono">{scoreData.competitionScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-zinc-800/80 rounded-sm overflow-hidden mt-1.5">
                                <div className="h-full bg-orange-400 rounded-sm" style={{ width: `${scoreData.competitionScore}%` }} />
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{scoreData.competitionReason}</p>
                            </div>

                            {/* Risk Score */}
                            <div className="score-pillar-row">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-zinc-200">Risk Mitigation Score (10% Weight)</span>
                                <span className="text-zinc-100 font-mono">{scoreData.riskScore}/100</span>
                              </div>
                              <div className="h-2 w-full bg-zinc-800/80 rounded-sm overflow-hidden mt-1.5">
                                <div className="h-full bg-amber-300 rounded-sm" style={{ width: `${scoreData.riskScore}%` }} />
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{scoreData.riskReason}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-zinc-800/80 flex flex-col gap-4">
                        <div>
                          <h4 className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-2">SCORE CALCULATION WALKTHROUGH</h4>
                          <p className="text-xs text-zinc-300 leading-relaxed bg-[#161618] p-4 rounded-xl border border-zinc-800/80">
                            {scoreData.calculationExplanation}
                          </p>
                        </div>
                        
                        <div className="bg-[#161618] text-zinc-300 p-4 rounded-xl font-mono text-[11px] flex flex-col gap-2 border border-zinc-800/80 shadow">
                          <span className="text-amber-500 font-bold">Weighted Formula Computation</span>
                          <span className="text-zinc-400">Startup Score = (Market × 30%) + (Revenue × 25%) + (Execution × 20%) + (Competition × 15%) + (Risk × 10%)</span>
                          <span className="text-zinc-400">Startup Score = ({scoreData.marketScore} × 0.30) + ({scoreData.revenueScore} × 0.25) + ({scoreData.executionScore} × 0.20) + ({scoreData.competitionScore} × 0.15) + ({scoreData.riskScore} × 0.10)</span>
                          <span className="text-amber-500 font-bold">Startup Score = {((scoreData.marketScore || 0) * 0.30).toFixed(1)} + {((scoreData.revenueScore || 0) * 0.25).toFixed(1)} + {((scoreData.executionScore || 0) * 0.20).toFixed(1)} + {((scoreData.competitionScore || 0) * 0.15).toFixed(1)} + {((scoreData.riskScore || 0) * 0.10).toFixed(1)} = {scoreData.startupScore}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <h4 className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">MAIN RECOMMENDATIONS</h4>
                          <p className="text-xs text-zinc-300 leading-relaxed bg-[#161618] p-4 rounded-xl border border-zinc-800/80">{scoreData.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.section>

                {/* Business Breakdown — 3 compact charts */}
                <section className="editorial-card p-5 print:hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="section-number section-number-blue font-heading">04</span>
                    <h2 className="text-lg font-bold tracking-tight font-heading">BUSINESS BREAKDOWN</h2>
                  </div>
                  <BusinessBreakdownCharts results={results} />
                </section>

                {/* Full Compiled Report — expandable accordions */}
                <section className="editorial-card overflow-hidden print:hidden">
                  <div className="p-5 flex items-center justify-between border-b border-zinc-850 bg-[#161618]">
                    <div className="flex items-center gap-3">
                      <span className="section-number section-number-orange font-heading">05</span>
                      <h2 className="text-lg font-bold tracking-tight font-heading">DETAILED ANALYSIS</h2>
                    </div>
                    <button onClick={downloadPackage} className="btn-secondary px-4 py-2 flex items-center gap-1.5 text-[10px]" style={{ color: '#ffffff', background: 'transparent', borderColor: 'rgba(255,255,255,0.15)' }}>
                      <FileDown className="w-3.5 h-3.5 text-white" />
                      <span>Download .md</span>
                    </button>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    {AGENTS.map((agent, i) => {
                      const agentResult = results[agent.id];
                      const isExpanded = expandedAgents[agent.id];
                      return (
                        <div key={agent.id} className="rounded-xl border border-zinc-800 bg-[#161618]/70 overflow-hidden">
                          {/* Accordion Trigger */}
                          <button
                            onClick={() => toggleAgentAccordion(agent.id)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/20 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-zinc-500 font-bold">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="text-sm font-semibold inline-flex items-center gap-2 text-white">
                                <AgentIcon Icon={agent.Icon} color={agent.color} size={15} />
                                {agent.name}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">— {agent.role}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-zinc-400"
                            >
                              <ChevronRight className="w-4 h-4 transform rotate-90" />
                            </motion.div>
                          </button>
                          
                          {/* Accordion Content */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-5 pb-5 pt-2 border-t border-zinc-850/50 bg-[#0d0d0f]/40">
                                  {agentResult ? (
                                    <div
                                      className="markdown-content markdown-compact text-xs text-zinc-300 leading-relaxed"
                                      dangerouslySetInnerHTML={{ __html: renderMarkdown(agentResult) }}
                                    />
                                  ) : (
                                    <p className="text-xs italic text-zinc-500">No output generated.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
              </>
              )}

              {/* Print-only Full Detailed Analysis (Only visible when printing) */}
              <div className="hidden print:block space-y-8 bg-white text-black p-6 w-full">
                <div className="border-b-2 border-black pb-4 mb-8 text-center">
                  <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
                    {idea || "Startup Strategy Report"}
                  </h1>
                  <p className="text-sm text-zinc-600 font-mono tracking-widest uppercase mt-2">
                    Unified Package · {new Date().toLocaleDateString()} · Detailed Analysis
                  </p>
                </div>
                {AGENTS.map((agent, i) => {
                  const agentResult = results[agent.id];
                  return (
                    <div key={agent.id} className="page-break-after avoid-break-inside pb-6 border-b border-zinc-200 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
                        <span className="text-lg font-mono text-zinc-500 font-bold">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h2 className="text-2xl font-bold text-black">{agent.name}</h2>
                        <span className="text-sm font-mono text-zinc-500 font-semibold">— {agent.role}</span>
                      </div>
                      {agentResult ? (
                        <div
                          className="markdown-content text-black text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(agentResult) }}
                        />
                      ) : (
                        <p className="text-xs italic text-zinc-400">No output generated yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Notion Export Modal ── */}
      {showNotionModal && (
        <div className="notion-modal-overlay" onClick={() => setShowNotionModal(false)}>
          <motion.div 
            className="notion-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notion-modal-header">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Notion Document Export</span>
              </div>
              <button onClick={() => setShowNotionModal(false)} className="p-1 hover:opacity-60 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="notion-modal-body">
              <pre>{generateNotionDoc(idea || "Startup Package", results, scoreData)}</pre>
            </div>
            <div className="notion-modal-footer">
              <button onClick={handleCopyNotion} className="btn-secondary px-4 py-2 flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" />
                <span>{notionCopied ? "Copied!" : "Copy"}</span>
              </button>
              <button onClick={handleDownloadNotion} className="btn-primary px-4 py-2 flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PRD Calculation Loading Overlay ── */}
      {isCalculatingPrd && (
        <div className="prd-modal-overlay">
          <motion.div 
            className="bg-[#1A1A1A] p-8 rounded-2xl max-w-md w-full flex flex-col items-center text-center prd-loading-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="w-16 h-16 rounded-full bg-[#EC4899]/10 border-2 border-[#EC4899] flex items-center justify-center mb-6 animate-pulse">
              <Brain className="w-8 h-8 text-[#EC4899]" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Consolidating PRD Spec
            </h3>
            
            <p className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-6 font-mono">
              Synthesizing multi-agent outputs
            </p>
            
            {/* Custom loader bar */}
            <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#EC4899] transition-all duration-300"
                style={{ width: `${((prdStepIndex + 1) / 5) * 100}%` }}
              />
            </div>
            
            {/* Stepper text messages */}
            <div className="text-xs text-gray-300 min-h-[32px] font-medium">
              {prdStepIndex === 0 && "Step 1: Extracting user stories & feature definitions..."}
              {prdStepIndex === 1 && "Step 2: Processing target audience & problem statements..."}
              {prdStepIndex === 2 && "Step 3: Compiling API schemas & data structures..."}
              {prdStepIndex === 3 && "Step 4: Structuring sprint execution milestones..."}
              {prdStepIndex === 4 && "Step 5: Formatting Product Requirements Document..."}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PRD View Modal ── */}
      {showPrdModal && (
        <div className="prd-modal-overlay" onClick={() => setShowPrdModal(false)}>
          <motion.div 
            className="prd-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prd-modal-header">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#EC4899]" />
                <span className="text-[#EC4899]">Compiled Product Requirements Spec</span>
              </div>
              <button onClick={() => setShowPrdModal(false)} className="p-1 text-[#EC4899] hover:opacity-60 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prd-modal-body">
              <div 
                className="markdown-content text-white text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(prdContent) }}
              />
            </div>
            
            <div className="prd-modal-footer">
              <button onClick={handleCopyPrd} className="btn-secondary px-4 py-2 flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" />
                <span>{prdCopied ? "Copied!" : "Copy Spec"}</span>
              </button>
              <button onClick={handleDownloadPrd} className="btn-primary px-4 py-2 flex items-center gap-2" style={{ background: '#EC4899', color: '#ffffff', borderColor: '#EC4899' }}>
                <Download className="w-3.5 h-3.5" />
                <span>Download Spec</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Custom Confirmation Modal ── */}
      {showConfirmBackModal && (
        <div className="notion-modal-overlay" onClick={() => setShowConfirmBackModal(false)}>
          <motion.div 
            className="notion-modal max-w-sm"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '380px', borderRadius: '24px' }}
          >
            <div className="notion-modal-header">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Go Back?</span>
              </div>
            </div>
            <div className="notion-modal-body text-center py-6 px-4">
              <p className="text-sm font-medium text-white mb-2">
                Do you really want to go back?
              </p>
              <p className="text-xs text-gray-300">
                Your current compilation and progress will be lost.
              </p>
            </div>
            <div className="notion-modal-footer justify-center gap-4">
              <button 
                onClick={() => {
                  setShowConfirmBackModal(false);
                  handleReset();
                }} 
                className="btn-primary px-5 py-2"
                style={{ background: '#EF4444', color: '#fff', borderColor: '#EF4444' }}
              >
                Go Back
              </button>
              <button 
                onClick={() => setShowConfirmBackModal(false)} 
                className="btn-secondary px-5 py-2"
              >
                Stay
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-5 px-8 text-center" style={{ borderTop: '2px solid var(--border)', background: 'var(--ink)', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
        <span style={{ color: 'var(--cream-dark)' }}>
        AXORA AI System Workspace · Tools: Search · GitHub · Notion · PDF · File Reader
        </span>
      </footer>
    </div>
    </div>
    </div>
  );
}