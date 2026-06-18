"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Search, 
  BookOpen, 
  FileText, 
  X, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Download,
  Terminal,
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
  type LucideIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { InvestorMode } from "@/components/InvestorMode";
import Aurora from "@/components/Aurora/Aurora";

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
    name: "Startup Advisor",
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
    name: "Market Research",
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
    name: "Product Manager",
    Icon: ClipboardList,
    color: "#22C55E",
    accentClass: "badge-yellow",
    numberClass: "section-number-green",
    role: "Product Strategy",
    description: "Defines features, user stories, and a roadmap for your MVP",
    outputs: ["Features", "User Stories", "MVP Scope", "Roadmap"],
  },
  {
    id: "architecture",
    name: "Architect",
    Icon: Cog,
    color: "#F97316",
    accentClass: "badge-pink",
    numberClass: "section-number-orange",
    role: "Technical Design",
    description: "Designs the database schema, APIs, and system architecture",
    outputs: ["Database Tables", "API Endpoints", "Tech Stack", "System Architecture"],
  },
  {
    id: "marketing",
    name: "Marketing",
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
    name: "Engineering Manager",
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
    name: "Risk Analyst",
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
    name: "Financial Analyst",
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
  const blocks = text.split("\n");
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
    // Extract first meaningful sentence from each agent's output
    const lines = result.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('|'));
    if (lines.length > 0) {
      const agent = AGENTS.find(a => a.id === agentId);
      const firstLine = lines[0].replace(/^[\*\-\d\.]+\s*/, '').replace(/\*\*/g, '').trim();
      if (firstLine.length > 10 && agent) {
        insights.push(`**${agent.name}**: ${firstLine.slice(0, 150)}${firstLine.length > 150 ? '...' : ''}`);
      }
    }
  }
  
  return insights.slice(0, AGENTS.length);
}

/* ── Generate Notion-compatible markdown ── */
function generateNotionDoc(idea: string, results: AgentResults): string {
  let doc = `# Startup Package: ${idea}\n\n`;
  doc += `> Generated by AI Founder OS on ${new Date().toLocaleDateString()}\n\n`;
  doc += `---\n\n`;
  
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

/* ── Compact Business Breakdown — 3 chart panels ── */
const BREAKDOWN_SEGMENTS = [
  { label: "Market", value: 18, color: "#3B82F6" },
  { label: "Product", value: 14, color: "#22C55E" },
  { label: "Technical", value: 14, color: "#F97316" },
  { label: "GTM", value: 14, color: "#EC4899" },
  { label: "Ops", value: 12, color: "#8B5CF6" },
  { label: "Risk", value: 14, color: "#EF4444" },
  { label: "Finance", value: 14, color: "#10B981" },
];

const PILLAR_BARS = [
  { label: "Validation", value: 82, color: "#F7C948" },
  { label: "Market Fit", value: 76, color: "#3B82F6" },
  { label: "Product", value: 88, color: "#22C55E" },
  { label: "Execution", value: 71, color: "#8B5CF6" },
  { label: "Financial", value: 79, color: "#10B981" },
];

function DonutChart({ segments, size = 96 }: { segments: typeof BREAKDOWN_SEGMENTS; size?: number }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let cumulative = 0;
  const cx = 50, cy = 50, r = 38, ir = 24;

  const paths = segments.map((seg, i) => {
    const startAngle = cumulative;
    const sliceAngle = (seg.value / total) * 360;
    cumulative += sliceAngle;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (cumulative - 90) * (Math.PI / 180);
    const x1o = cx + r * Math.cos(startRad), y1o = cy + r * Math.sin(startRad);
    const x2o = cx + r * Math.cos(endRad), y2o = cy + r * Math.sin(endRad);
    const x1i = cx + ir * Math.cos(endRad), y1i = cy + ir * Math.sin(endRad);
    const x2i = cx + ir * Math.cos(startRad), y2i = cy + ir * Math.sin(startRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const d = `M ${x1o} ${y1o} A ${r} ${r} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${ir} ${ir} 0 ${largeArc} 0 ${x2i} ${y2i} Z`;
    return <path key={i} d={d} fill={seg.color} stroke="#FAF6EF" strokeWidth="1" />;
  });

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
      {paths}
    </svg>
  );
}

function HorizontalBarChart({ bars }: { bars: typeof PILLAR_BARS }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-[9px] w-14 truncate uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-muted)" }}>
            {bar.label}
          </span>
          <div className="flex-1 h-2 rounded-sm overflow-hidden" style={{ background: "var(--cream-dark)", border: "1px solid var(--border-light)" }}>
            <div className="h-full rounded-sm transition-all" style={{ width: `${bar.value}%`, background: bar.color }} />
          </div>
          <span className="text-[9px] w-7 text-right font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
            {bar.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function AgentOutputChart({ results }: { results: AgentResults }) {
  return (
    <div className="flex items-end justify-between gap-1 h-[72px] w-full px-1">
      {AGENTS.map((agent) => {
        const len = results[agent.id]?.length ?? 0;
        const height = Math.max(12, Math.min(72, (len / 1200) * 72));
        return (
          <div key={agent.id} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <div
              className="w-full max-w-[14px] rounded-t-sm"
              style={{ height, background: agent.color, opacity: len ? 1 : 0.25 }}
              title={agent.name}
            />
            <AgentIcon Icon={agent.Icon} color={agent.color} size={10} />
          </div>
        );
      })}
    </div>
  );
}

function BusinessBreakdownCharts({ results }: { results: AgentResults }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="breakdown-chart-card">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={13} style={{ color: "var(--accent-blue)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>Allocation</span>
        </div>
        <div className="flex items-center gap-3">
          <DonutChart segments={BREAKDOWN_SEGMENTS} />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            {BREAKDOWN_SEGMENTS.slice(0, 4).map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5 text-[9px]">
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                <span className="truncate" style={{ color: "var(--ink-muted)" }}>{seg.label}</span>
                <span className="ml-auto font-semibold" style={{ color: "var(--ink)" }}>{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="breakdown-chart-card">
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 size={13} style={{ color: "var(--accent-green)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>Pillar Scores</span>
        </div>
        <HorizontalBarChart bars={PILLAR_BARS} />
      </div>

      <div className="breakdown-chart-card">
        <div className="flex items-center gap-1.5 mb-2">
          <Activity size={13} style={{ color: "var(--accent-orange)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>Agent Output</span>
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
  const [activeRollingIndex, setActiveRollingIndex] = useState(0);
  const [results, setResults] = useState<AgentResults>({});
  const [toolLogs, setToolLogs] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [investorMode, setInvestorMode] = useState(false);
  const [notionCopied, setNotionCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      const errorType = event?.error ?? event?.message ?? "unknown";
      // Permission errors are common when users deny microphone access — handle quietly
      if (errorType === "not-allowed" || errorType === "service-not-allowed" || errorType === "permission-denied") {
        console.warn("Speech recognition permission denied:", errorType);
        setIsRecording(false);
        setSpeechSupported(false);
        return;
      }

      console.error("Speech recognition error:", errorType, event);
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results || [])
        .filter((result: any) => result.isFinal)
        .map((result: any) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (!transcript) return;
      setIdea((prev) => `${prev.trim()}${prev.trim() ? " " : ""}${transcript}`);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
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
      "⚡ File Tool: Parsing uploaded documents & context...",
      "🔍 Search Tool: Market Research Agent searching competitor matrices & TAM data...",
      "📓 Notion Tool: Startup Advisor generating validation workspace & feedback summary...",
      "📓 Notion Tool: Product Manager compiling Product Requirements Document (PRD)...",
      "🐙 GitHub Tool: Architect provisioning workspace repository & generating system schemas...",
      "📓 Notion Tool: Marketing Agent drafting launch copy & GTM strategy...",
      "🐙 GitHub Tool: Engineering Manager filing Sprint milestones & P0/P1/P2 issues...",
      "⚠️ Risk Tool: Risk Analyst scoring market, technical & compliance exposure...",
      "💰 Finance Tool: Financial Analyst modeling revenue, CAC/LTV & burn rate...",
      "📄 PDF Tool: Compiling unified Startup Package report..."
    ];
    
    setToolLogs((prev) => [...prev, logs[stepIndex] || ""]);
  }, []);

  // Rolling agent transition effect
  useEffect(() => {
    if (state !== "processing") return;
    
    const agentIds = AGENTS.map(a => a.id);
    const currentCompleted = completedAgents.length;
    
    if (currentCompleted < agentIds.length) {
      setActiveRollingIndex(currentCompleted);
    }
  }, [completedAgents, state]);

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
    setActiveRollingIndex(0);
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
    setActiveRollingIndex(0);
    setResults({});
    setToolLogs([]);
    setFileError(null);
    setShowNotionModal(false);
    processingRef.current = false;
  }, []);

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
    const doc = generateNotionDoc(idea || "Startup Package", results);
    navigator.clipboard.writeText(doc);
    setNotionCopied(true);
    setTimeout(() => setNotionCopied(false), 2000);
  };

  const handleDownloadNotion = () => {
    const doc = generateNotionDoc(idea || "Startup Package", results);
    const element = document.createElement("a");
    const file = new Blob([doc], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${idea.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-notion-doc.md`;
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
          <Aurora
            colorStops={["#FF8A00", "#FFB347", "#FFD6A5"]}
            blend={0.45}
            amplitude={1.2}
            speed={0.4}
          />
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
              className="max-w-4xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center min-h-[85vh]"
            >
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl text-center tracking-tight leading-tight mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                What&apos;s on the agenda today?
              </h1>

              <p className="text-center text-sm max-w-lg mb-8" style={{ color: 'var(--ink-muted)' }}>
                Describe your startup idea or attach context files. Eight specialized agents will compile your unified package.
              </p>

              {/* Chat-style composer */}
              <div className="w-full max-w-3xl">
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
            </motion.div>
          )}

          {/* ──────────────── PHASE 2: PROCESSING — Rolling Agent Transition ──────────────── */}
          {state === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto w-full px-6 py-16 flex flex-col justify-center min-h-[85vh]"
            >
              {/* Header */}
              <div className="text-center mb-10">
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
                <div className="lg:col-span-2 flex flex-col h-[380px] overflow-hidden" style={{ background: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: '4px' }}>
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: '#111', borderBottom: '1px solid #333' }}>
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)', color: '#888' }}>Automated Tool Logs</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F7C948' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {toolLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#ccc' }}
                      >
                        {log}
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-2 mt-auto pt-2 animate-pulse-subtle" style={{ color: '#555' }}>
                      <span>&gt;_ Listening for workspace triggers...</span>
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
                  <div className="print:hidden px-6 sm:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface)' }}>
                    <div>
                      <div className="badge-yellow mb-2 animate-stamp">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Package Assembled</span>
                      </div>
                      <h2 className="text-xl font-bold truncate max-w-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                        {idea || "Startup Package"}
                      </h2>
                    </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                  <button
                    onClick={() => window.print()}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Report</span>
                  </button>
                  <button
                    onClick={() => setInvestorMode(true)}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: '#FF8A00', color: '#1a1a1a' }}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Pitch This Startup</span>
                  </button>
                  <button
                    onClick={() => setShowNotionModal(true)}
                    className="btn-primary px-4 py-2 flex items-center gap-2"
                    style={{ background: 'var(--accent-yellow)', color: 'var(--ink)' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Notion Doc</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-secondary px-4 py-2 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>New Strategy</span>
                  </button>
                </div>
              </div>

              {/* ── Consolidated Summary Report (1-2 pages max) ── */}
              <div className="summary-report flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-4 print:p-4 print:gap-4">
                
                {/* Cover Header */}
                <section className="editorial-card p-5 print:border print:border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="badge-pink">
                      <Rocket className="w-3 h-3" />
                      <span>AI Founder OS</span>
                    </div>
                    <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                      STAMPED {new Date().getFullYear()}
                    </span>
                  </div>
                  
                  <div style={{ borderTop: '2px solid var(--border)', margin: '8px 0 16px' }} />
                  
                  <h1 className="text-3xl sm:text-4xl tracking-tight leading-tight print:text-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                    {idea || "Startup Strategy Report"}
                  </h1>
                  <p className="text-xs mt-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                    Unified Package · {new Date().toLocaleDateString()} · {AGENTS.length} Agent Compilation
                  </p>
                </section>

                {/* Key Insights */}
                {insights.length > 0 && (
                  <section className="editorial-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="section-number section-number-yellow" style={{ fontFamily: 'var(--font-heading)' }}>01</span>
                      <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Key Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {insights.map((insight, i) => (
                        <div
                          key={i}
                          className="flex gap-2 p-2.5 rounded text-xs leading-relaxed"
                          style={{ background: 'var(--cream)', border: '1px solid var(--border-light)', color: 'var(--ink-light)' }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-yellow)' }} />
                          <span dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Agent Summary Table */}
                <section className="editorial-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="section-number section-number-pink" style={{ fontFamily: 'var(--font-heading)' }}>02</span>
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Agent Summary</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="agent-summary-table w-full">
                      <colgroup>
                        <col style={{ width: "36px" }} />
                        <col style={{ width: "148px" }} />
                        <col style={{ width: "112px" }} />
                        <col />
                        <col style={{ width: "72px" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Agent</th>
                          <th>Role</th>
                          <th>Top Finding</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENTS.map((agent, i) => {
                          const agentResult = results[agent.id];
                          const topFinding = agentResult
                            ? agentResult.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'))[0]?.replace(/^[\*\-\d\.]+\s*/, '').replace(/\*\*/g, '').trim().slice(0, 90) || "—"
                            : "—";
                          const hasResult = Boolean(agentResult);
                          return (
                            <tr key={agent.id} className={hasResult ? "row-complete" : ""}>
                              <td className="cell-num" style={{ color: agent.color }}>
                                {String(i + 1).padStart(2, '0')}
                              </td>
                              <td className="cell-agent">
                                <span className="inline-flex items-center gap-1.5">
                                  <AgentIcon Icon={agent.Icon} color={agent.color} size={13} />
                                  <span className="font-semibold">{agent.name}</span>
                                </span>
                              </td>
                              <td className="cell-role">{agent.role}</td>
                              <td className="cell-finding">{topFinding}</td>
                              <td className="cell-status">
                                {hasResult ? (
                                  <span className="status-pill status-complete"><CheckCircle2 size={11} /> Done</span>
                                ) : (
                                  <span className="status-pill status-empty">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Business Breakdown — 3 compact charts */}
                <section className="editorial-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="section-number section-number-blue" style={{ fontFamily: 'var(--font-heading)' }}>03</span>
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Business Breakdown</h2>
                  </div>
                  <BusinessBreakdownCharts results={results} />
                </section>

                {/* Full Compiled Report — compact single rendering */}
                <section className="editorial-card overflow-hidden">
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: '2px solid var(--border)', background: 'var(--cream-dark)' }}>
                    <div className="flex items-center gap-2">
                      <span className="section-number section-number-orange" style={{ fontFamily: 'var(--font-heading)' }}>04</span>
                      <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Detailed Analysis</h2>
                    </div>
                    <button onClick={downloadPackage} className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-[10px]">
                      <FileDown className="w-3 h-3" />
                      <span>Download .md</span>
                    </button>
                  </div>
                  <div className="p-4 print:p-3">
                    <div className="flex flex-col gap-4">
                      {AGENTS.map((agent, i) => {
                        const agentResult = results[agent.id];
                        return (
                          <div key={agent.id} className="agent-output-block">
                            <div className="flex items-center gap-2 mb-2 pb-1.5" style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: agent.color }}>
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="text-sm font-bold inline-flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                                <AgentIcon Icon={agent.Icon} color={agent.color} size={14} />
                                {agent.name}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>— {agent.role}</span>
                            </div>
                            {agentResult ? (
                              <div
                                className="markdown-content markdown-compact print:text-black text-xs"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(agentResult) }}
                              />
                            ) : (
                              <p className="text-xs italic" style={{ color: 'var(--ink-muted)' }}>No output generated.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
              </>
              )}
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
              <pre>{generateNotionDoc(idea || "Startup Package", results)}</pre>
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

      {/* Footer */}
      <footer className="py-5 px-8 text-center" style={{ borderTop: '2px solid var(--border)', background: 'var(--ink)', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
        <span style={{ color: 'var(--cream-dark)' }}>
          AI Founder OS System Workspace · Tools: Search · GitHub · Notion · PDF · File Reader
        </span>
      </footer>
    </div>
    </div>
    </div>
  );
}