"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Search, 
  BookOpen, 
  FileText, 
  Upload, 
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
  FileDown
} from "lucide-react";
import confetti from "canvas-confetti";

// ── Agent Configurations ──
export interface AgentConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  accentClass: string;
  numberClass: string;
  role: string;
  description: string;
  outputs: string[];
}

export const AGENTS: AgentConfig[] = [
  {
    id: "advisor",
    name: "Startup Advisor",
    icon: "🧠",
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
    icon: "📊",
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
    icon: "📋",
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
    icon: "⚙️",
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
    icon: "🚀",
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
    icon: "🛠️",
    color: "#8B5CF6",
    accentClass: "badge-blue",
    numberClass: "section-number-yellow",
    role: "Engineering Execution",
    description: "Plans sprints, team structure, backlog, and release strategy",
    outputs: ["Execution Strategy", "Team Requirements", "Sprint Plan", "Timeline", "Risks", "Backlog", "Team KPIs", "Release Strategy"],
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
  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map((c: string) => c.trim());
      if (cells.every((c: string) => /^[-:]+$/.test(c))) return '';
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    });

  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table>$1</table>');
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<hr')
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

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
        insights.push(`${agent.icon} **${agent.name}**: ${firstLine.slice(0, 150)}${firstLine.length > 150 ? '...' : ''}`);
      }
    }
  }
  
  return insights.slice(0, 6);
}

/* ── Generate Notion-compatible markdown ── */
function generateNotionDoc(idea: string, results: AgentResults): string {
  let doc = `# 📋 Startup Package: ${idea}\n\n`;
  doc += `> Generated by AI Founder OS on ${new Date().toLocaleDateString()}\n\n`;
  doc += `---\n\n`;
  
  AGENTS.forEach((agent, i) => {
    doc += `## ${agent.icon} ${i + 1}. ${agent.name} — ${agent.role}\n\n`;
    
    if (results[agent.id]) {
      doc += `> **Agent Output:**\n\n`;
      doc += results[agent.id];
      doc += `\n\n`;
    } else {
      doc += `> ⚠️ No output generated for this agent.\n\n`;
    }
    
    doc += `---\n\n`;
  });
  
  doc += `## 📊 Summary\n\n`;
  doc += `| Agent | Role | Status |\n`;
  doc += `|-------|------|--------|\n`;
  AGENTS.forEach(agent => {
    const status = results[agent.id] ? '✅ Complete' : '❌ No Data';
    doc += `| ${agent.icon} ${agent.name} | ${agent.role} | ${status} |\n`;
  });
  
  return doc;
}

/* ── SVG Pie Chart Component ── */
function BusinessPieChart() {
  const segments = [
    { label: "Market Opportunity", value: 25, color: "#3B82F6" },
    { label: "Product Development", value: 20, color: "#22C55E" },
    { label: "Technical Infra", value: 20, color: "#F97316" },
    { label: "Go-To-Market", value: 20, color: "#EC4899" },
    { label: "Operations", value: 15, color: "#8B5CF6" },
  ];

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let cumulativeAngle = 0;
  const cx = 100, cy = 100, r = 80;

  const paths = segments.map((seg, i) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = (seg.value / total) * 360;
    cumulativeAngle += sliceAngle;
    const endAngle = cumulativeAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return (
      <path
        key={i}
        d={d}
        fill={seg.color}
        stroke="#FAF6EF"
        strokeWidth="2"
        style={{ 
          opacity: 0,
          animation: `fadeIn 0.4s ease-out ${0.15 * i}s forwards`
        }}
      />
    );
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-[180px] h-[180px] flex-shrink-0">
        {paths}
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div 
              className="w-3 h-3 rounded-sm border border-[#1A1A1A]" 
              style={{ background: seg.color }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: '#4A4A4A' }}>
              {seg.label}
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>
              {seg.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Agent Tree Structure Component ── */
function AgentTree() {
  const treeAgents = AGENTS;
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col items-center gap-0 min-w-[300px] py-4">
        {treeAgents.map((agent, i) => (
          <div key={agent.id} className="flex flex-col items-center">
            {/* Connector line from above */}
            {i > 0 && (
              <div 
                className="w-[2px] h-6 bg-[#1A1A1A]"
                style={{ 
                  opacity: 0,
                  animation: `fadeIn 0.3s ease-out ${0.2 * i}s forwards`
                }}
              />
            )}
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.35 }}
              className="tree-node flex items-center gap-3"
            >
              <span 
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#1A1A1A]"
                style={{ background: agent.color, color: '#fff' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xs">{agent.icon} {agent.name}</span>
            </motion.div>
            {/* Arrow */}
            {i < treeAgents.length - 1 && (
              <div 
                className="flex flex-col items-center"
                style={{ 
                  opacity: 0,
                  animation: `fadeIn 0.3s ease-out ${0.2 * (i + 1)}s forwards`
                }}
              >
                <ChevronRight className="w-4 h-4 text-[#1A1A1A] rotate-90" />
              </div>
            )}
          </div>
        ))}
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
  const [notionCopied, setNotionCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  // ── Tool Simulation Logs ──
  const simulateToolExecution = useCallback((stepIndex: number) => {
    const logs = [
      "⚡ File Tool: Parsing uploaded documents & context...",
      "🔍 Search Tool: Market Research Agent searching competitor matrices & TAM data...",
      "📓 Notion Tool: Startup Advisor generating validation workspace & feedback summary...",
      "📓 Notion Tool: Product Manager compiling Product Requirements Document (PRD)...",
      "🐙 GitHub Tool: Architect provisioning workspace repository & generating system schemas...",
      "🐙 GitHub Tool: Engineering Manager filing Sprint milestones & P0/P1/P2 issues...",
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
    const delays = [1000, 2200, 3400, 4600, 5800, 7000];

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
        if (id === "engineering") simulateToolExecution(5);

        if (i === agentIds.length - 1) {
          simulateToolExecution(6);
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
      output += `${agent.icon} ${agent.name.toUpperCase()} - ${agent.role.toUpperCase()}\n`;
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-body)' }}>
      
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
              {/* Badge */}
              <div className="badge-yellow mb-8 animate-stamp">
                <Rocket className="w-3.5 h-3.5" />
                <span>Orchestrated Multi-Agent System</span>
              </div>

              {/* Headline — editorial serif */}
              <h1 className="text-4xl sm:text-6xl text-center tracking-tight leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                Generate Your Unified<br />
                <em style={{ fontStyle: 'italic' }}>Startup Plan & Artifacts</em>
              </h1>

              <p className="text-center text-base max-w-xl mb-12 leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                Provide your idea or upload context files. Our specialized agents run parallel workflows using core system tools to deliver a comprehensive Startup Package.
              </p>

              {/* Input Area */}
              <div className="w-full editorial-card p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="idea-input" className="text-xs font-bold tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-light)', letterSpacing: '0.08em' }}>Your Startup Idea</label>
                  <textarea
                    id="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea in detail, or leave blank and upload files..."
                    rows={4}
                    className="w-full resize-none px-4 py-3 text-base focus:outline-none transition-all"
                    style={{ 
                      background: 'var(--cream)',
                      border: '2px solid var(--border-light)',
                      borderRadius: '4px',
                      color: 'var(--ink)',
                      fontFamily: 'var(--font-body)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--ink)';
                      e.target.style.boxShadow = '3px 3px 0px var(--ink)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-light)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* File Dropzone */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-light)', letterSpacing: '0.08em' }}>
                      Additional Context (File Tool)
                    </span>
                    <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                      {formatFileSize(totalUploadSize)} / 1 MB
                    </span>
                  </div>
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all`}
                    style={{
                      borderColor: isDragging ? 'var(--ink)' : 'var(--border-light)',
                      background: isDragging ? 'var(--cream-dark)' : 'transparent',
                      borderRadius: '4px',
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files && processFiles(e.target.files)}
                      multiple
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: 'var(--cream-dark)', border: '2px solid var(--border-light)' }}>
                      <Upload className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Click to upload or drag & drop</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Max 500KB per file · Business plans, reports, PRDs, or PDFs</p>
                    </div>
                  </div>
                </div>

                {/* File Error */}
                {fileError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF4444' }} />
                    <span className="text-xs" style={{ color: '#DC2626' }}>{fileError}</span>
                  </div>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 p-3 rounded" style={{ background: 'var(--cream-dark)', border: '1px solid var(--border-light)' }}>
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', color: 'var(--ink-light)' }}
                      >
                        <FileText className="w-3.5 h-3.5" style={{ color: 'var(--ink-muted)' }} />
                        <span className="max-w-[120px] truncate font-medium">{file.name}</span>
                        <span className="text-[10px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{formatFileSize(file.size)}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }} 
                          className="hover:text-red-500 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Row */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '2px solid var(--border-light)' }}>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.04em' }}>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>AGENT WORKSPACE INITIALIZED · READY TO LAUNCH</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!idea.trim() && uploadedFiles.length === 0}
                    className="btn-primary px-6 py-2.5 flex items-center gap-2"
                  >
                    <span>Launch Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tool Cards — Field Notes style */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-14">
                <div className="editorial-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Search Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-muted)' }}>Runs real-time web scans for TAM, competitor data, and market dynamics.</p>
                </div>

                <div className="editorial-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>GitHub Tool</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-muted)' }}>Generates sprint cycles, DB mapping, API endpoints, and tasks.</p>
                </div>

                <div className="editorial-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Notion Workspace</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-muted)' }}>Compiles structured docs, user stories, and GTM plans.</p>
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
                  6 agents · sequential workspace tools · rolling pipeline
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-3xl mx-auto mb-10">
                <div className="flex justify-between items-center text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                  <span style={{ color: 'var(--ink)' }}>Assembly Progress</span>
                  <span style={{ color: 'var(--ink-muted)' }}>{completedAgents.length} / 6 Complete</span>
                </div>
                <div className="h-3 w-full overflow-hidden" style={{ background: 'var(--cream-dark)', border: '2px solid var(--border)', borderRadius: '2px' }}>
                  <motion.div 
                    className="h-full"
                    style={{ background: 'var(--accent-yellow)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedAgents.length / 6) * 100}%` }}
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
                            className="w-full editorial-card p-6 flex flex-col gap-4"
                            style={{ borderColor: agent.color }}
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
                                  <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                                    {agent.icon} {agent.name}
                                  </h3>
                                  <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
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
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-light)' }}>
                              {agent.description}
                            </p>

                            {/* Output Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {agent.outputs.map((out, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-[9px] px-2.5 py-1 rounded font-semibold uppercase"
                                  style={{ 
                                    background: 'var(--cream-dark)', 
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--ink-light)',
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
              <div className="summary-report flex-1 max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-8 print:p-4 print:gap-6">
                
                {/* Cover Header */}
                <section className="editorial-card p-8 print:border print:border-gray-300">
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
                    Unified Package · {new Date().toLocaleDateString()} · 6 Agent Compilation
                  </p>
                </section>

                {/* Key Insights */}
                {insights.length > 0 && (
                  <section className="editorial-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="section-number section-number-yellow" style={{ fontFamily: 'var(--font-heading)' }}>01</span>
                      <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Key Insights</h2>
                        <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>Field Note</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {insights.map((insight, i) => (
                        <div 
                          key={i} 
                          className="flex gap-3 p-3 rounded text-sm leading-relaxed"
                          style={{ background: 'var(--cream)', border: '1px solid var(--border-light)', color: 'var(--ink-light)' }}
                        >
                          <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-yellow)' }} />
                          <span dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Agent Summary Table */}
                <section className="editorial-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="section-number section-number-pink" style={{ fontFamily: 'var(--font-heading)' }}>02</span>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Agent Summary</h2>
                      <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>Field Note</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th className="text-left p-3 text-[10px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', background: 'var(--cream-dark)', border: '2px solid var(--border)', color: 'var(--ink)' }}>#</th>
                          <th className="text-left p-3 text-[10px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', background: 'var(--cream-dark)', border: '2px solid var(--border)', color: 'var(--ink)' }}>Agent</th>
                          <th className="text-left p-3 text-[10px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', background: 'var(--cream-dark)', border: '2px solid var(--border)', color: 'var(--ink)' }}>Role</th>
                          <th className="text-left p-3 text-[10px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', background: 'var(--cream-dark)', border: '2px solid var(--border)', color: 'var(--ink)' }}>Top Finding</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENTS.map((agent, i) => {
                          const agentResult = results[agent.id];
                          const topFinding = agentResult 
                            ? agentResult.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'))[0]?.replace(/^[\*\-\d\.]+\s*/, '').replace(/\*\*/g, '').trim().slice(0, 100) || "—"
                            : "—";
                          return (
                            <tr key={agent.id}>
                              <td className="p-3 text-sm font-bold" style={{ border: '2px solid var(--border)', fontFamily: 'var(--font-heading)', color: agent.color }}>
                                {String(i + 1).padStart(2, '0')}
                              </td>
                              <td className="p-3 text-sm font-semibold" style={{ border: '2px solid var(--border)', color: 'var(--ink)' }}>
                                {agent.icon} {agent.name}
                              </td>
                              <td className="p-3 text-[10px] uppercase tracking-wider" style={{ border: '2px solid var(--border)', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
                                {agent.role}
                              </td>
                              <td className="p-3 text-xs" style={{ border: '2px solid var(--border)', color: 'var(--ink-light)' }}>
                                {topFinding}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Business Breakdown: Pie Chart + Agent Tree */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <section className="editorial-card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="section-number section-number-blue" style={{ fontFamily: 'var(--font-heading)' }}>03</span>
                      <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Business Breakdown</h2>
                        <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>Field Note</span>
                      </div>
                    </div>
                    <BusinessPieChart />
                  </section>

                  {/* Agent Tree */}
                  <section className="editorial-card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="section-number section-number-green" style={{ fontFamily: 'var(--font-heading)' }}>04</span>
                      <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Agent Pipeline</h2>
                        <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>Tree Structure</span>
                      </div>
                    </div>
                    <AgentTree />
                  </section>
                </div>

                {/* Full Compiled Report — compact single rendering */}
                <section className="editorial-card overflow-hidden">
                  <div className="p-5 flex items-center justify-between" style={{ borderBottom: '2px solid var(--border)', background: 'var(--cream-dark)' }}>
                    <div className="flex items-center gap-3">
                      <span className="section-number section-number-orange" style={{ fontFamily: 'var(--font-heading)' }}>05</span>
                      <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>Detailed Analysis</h2>
                        <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>All Agents Combined</span>
                      </div>
                    </div>
                    <button onClick={downloadPackage} className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-[10px]">
                      <FileDown className="w-3 h-3" />
                      <span>Download .md</span>
                    </button>
                  </div>
                  <div className="p-6 print:p-4">
                    <div className="flex flex-col gap-6">
                      {AGENTS.map((agent, i) => {
                        const agentResult = results[agent.id];
                        return (
                          <div key={agent.id}>
                            <div className="flex items-center gap-2.5 mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <span className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: agent.color }}>
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{agent.icon} {agent.name}</span>
                              <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>— {agent.role}</span>
                            </div>
                            {agentResult ? (
                              <div 
                                className="markdown-content print:text-black text-sm"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(agentResult) }}
                              />
                            ) : (
                              <p className="text-sm italic" style={{ color: 'var(--ink-muted)' }}>No output generated.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
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
  );
}
