"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Search, 
  BookOpen, 
  FileText, 
  Upload, 
  Plus, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Download, 
  Terminal, 
  Layers, 
  Layout, 
  HelpCircle,
  AlertTriangle,
  FolderOpen,
  GitBranch
} from "lucide-react";
import confetti from "canvas-confetti";

// ── Agent Configurations ──
export interface AgentConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  role: string;
  description: string;
  outputs: string[];
}

export const AGENTS: AgentConfig[] = [
  {
    id: "advisor",
    name: "Startup Advisor",
    icon: "🧠",
    color: "#a78bfa",
    role: "Idea Validation",
    description: "Validates your startup idea with deep analysis of problem-market fit",
    outputs: ["Problem Statement", "Target Audience", "Business Model", "Key Risks", "Opportunities"],
  },
  {
    id: "research",
    name: "Market Research",
    icon: "📊",
    color: "#38bdf8",
    role: "Market Intelligence",
    description: "Maps the competitive landscape and quantifies market opportunity",
    outputs: ["Top 3 Competitors", "Market Size (TAM)", "Key Trends", "Opportunities"],
  },
  {
    id: "product",
    name: "Product Manager",
    icon: "📋",
    color: "#34d399",
    role: "Product Strategy",
    description: "Defines features, user stories, and a roadmap for your MVP",
    outputs: ["Features", "User Stories", "MVP Scope", "Roadmap"],
  },
  {
    id: "architecture",
    name: "Architect",
    icon: "⚙️",
    color: "#fb923c",
    role: "Technical Design",
    description: "Designs the database schema, APIs, and system architecture",
    outputs: ["Database Tables", "API Endpoints", "Tech Stack", "System Architecture"],
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "🚀",
    color: "#f472b6",
    role: "Go-To-Market",
    description: "Creates launch copy, social posts, and an email campaign",
    outputs: ["Landing Headline", "Value Proposition", "LinkedIn Post", "Email Campaign", "Channels"],
  },
  {
    id: "engineering",
    name: "Engineering Manager",
    icon: "🛠️",
    color: "#2dd4bf",
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
  content: string;
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

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [idea, setIdea] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [results, setResults] = useState<AgentResults>({});
  const [activeTab, setActiveTab] = useState("package");
  const [toolLogs, setToolLogs] = useState<string[]>([]);
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
              colors: ["#7c3aed", "#06b6d4", "#34d399", "#f472b6"]
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
    setActiveTab("package");
    processingRef.current = false;
  }, []);

  // ── File Upload Handlers ──
  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type || "text/plain",
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

  const activeAgent = AGENTS.find((a) => a.id === activeTab) || AGENTS[0];
  const activeResult = results[activeTab];

  return (
    <div className="min-h-screen bg-[#07070d] text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

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
              className="max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center justify-center min-h-[90vh]"
            >
              {/* Header Info */}
              <div className="flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-md">
                <Rocket className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300 tracking-wider uppercase">Orchestrated Multi-Agent System</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-center tracking-tight leading-[1.15] mb-6">
                Generate Your Unified <br />
                <span className="gradient-text">Startup Plan & Artifacts</span>
              </h1>

              <p className="text-zinc-400 text-center text-lg max-w-xl mb-12 leading-relaxed">
                Provide your idea or upload context files. Our specialized agents run parallel workflows using core system tools to deliver a comprehensive Startup Package.
              </p>

              {/* Input Area */}
              <div className="w-full glass-card p-6 flex flex-col gap-6 border-zinc-800">
                <div className="flex flex-col gap-2">
                  <label htmlFor="idea-input" className="text-sm font-semibold text-zinc-300">Your Startup Idea</label>
                  <textarea
                    id="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea in detail, or leave blank and upload files..."
                    rows={4}
                    className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 rounded-xl resize-none px-4 py-3 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all"
                  />
                </div>

                {/* File Dropzone */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-zinc-300">Additional Context (File Tool)</span>
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      isDragging 
                        ? "border-violet-500 bg-violet-500/5" 
                        : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files && processFiles(e.target.files)}
                      multiple
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                      <Upload className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-zinc-300 font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs text-zinc-500 mt-1">Upload business plans, competitor reports, PRDs, or idea PDFs</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 p-3 rounded-lg bg-zinc-950/60 border border-zinc-900">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="max-w-[150px] truncate">{file.name}</span>
                        <button 
                          onClick={() => removeFile(index)} 
                          className="hover:text-red-400 transition-colors p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Agent Workspace initialized. Ready to launch.</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!idea.trim() && uploadedFiles.length === 0}
                    className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 shadow-lg shadow-violet-500/10"
                  >
                    <span>Launch Startup Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Workflow Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-16">
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-zinc-300">Search Tool</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">Runs real-time web scans to acquire fresh TAM, competitor matrices, and key market dynamics.</p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-semibold text-zinc-300">GitHub Tool</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">Generates technical sprint cycles, DB mapping, API endpoints, and provisions tasks.</p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-zinc-300">Notion Workspace</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">Compiles structured documentation, business scopes, user stories, and GTM plans.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──────────────── PHASE 2: PROCESSING ──────────────── */}
          {state === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto w-full px-6 py-20 flex flex-col justify-center min-h-[90vh]"
            >
              {/* Headings */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-zinc-100 mb-2">Compiling Startup Package</h2>
                <p className="text-zinc-500 text-sm">6 specialized agents running automated workspace tools in parallel</p>
              </div>

              {/* Progress Slider */}
              <div className="w-full max-w-3xl mx-auto mb-12">
                <div className="flex justify-between items-center text-sm font-medium mb-3">
                  <span className="text-zinc-300">Assembly Progress</span>
                  <span className="text-zinc-400 font-mono">{completedAgents.length} / 6 Complete</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedAgents.length / 6) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Split layout: Left Agents, Right Terminal Tool logs */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* Agents Status Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AGENTS.map((agent, i) => {
                    const isComplete = completedAgents.includes(agent.id);
                    return (
                      <div 
                        key={agent.id}
                        className={`glass-card p-4 flex flex-col justify-between border-zinc-800 transition-all ${
                          isComplete ? "opacity-100 border-zinc-700 bg-zinc-900/10" : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{agent.icon}</span>
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-300">{agent.name}</h4>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{agent.role}</p>
                            </div>
                          </div>
                          {isComplete ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-violet-500 animate-spin" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.outputs.slice(0, 3).map((out, idx) => (
                            <span key={idx} className="text-[9px] bg-zinc-950/60 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                              {out}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tool logs console */}
                <div className="lg:col-span-2 flex flex-col h-[380px] bg-black/80 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Automated Tool Logs</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] text-zinc-400 flex flex-col gap-3">
                    {toolLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2.5 rounded bg-zinc-900/40 border border-zinc-950 text-zinc-300"
                      >
                        {log}
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-2 text-zinc-600 mt-auto pt-2 animate-pulse">
                      <span>&gt;_ Listening for workspace triggers...</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──────────────── PHASE 3: RESULTS ──────────────── */}
          {state === "results" && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-[90vh]"
            >
              {/* Dashboard Header Banner */}
              <div className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Startup package assembled successfully</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-200 truncate max-w-xl">{idea || "Startup Package"}</h2>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 md:flex-initial px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Generate PDF (PDF Tool)</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 md:flex-initial px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>New Strategy</span>
                  </button>
                </div>
              </div>

              {/* Single Frame Document Workspace */}
              <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-10 print:p-0">
                
                {/* Executive Cover Header */}
                <div className="glass-card p-8 border-zinc-900 flex flex-col gap-4 bg-zinc-950/40 print:border-none print:bg-transparent print:p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-400">
                      <Rocket className="w-5 h-5" />
                      <span className="text-xs font-bold tracking-widest uppercase">AI Founder OS</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  
                  <div className="border-t border-zinc-900 my-2 print:border-zinc-300" />
                  
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight print:text-black">
                    {idea || "Simulated Startup Strategy"}
                  </h1>
                  <p className="text-zinc-500 text-xs font-medium">
                    Unified Startup Package assembled on: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Unified Output Sections (Continuous single frame) */}
                <div className="flex flex-col gap-10 print:gap-16">
                  {AGENTS.map((agent) => {
                    const agentResult = results[agent.id];
                    return (
                      <div 
                        key={agent.id}
                        className="glass-card border-zinc-900 bg-zinc-950/10 overflow-hidden flex flex-col print:border-none print:bg-transparent print:p-0"
                      >
                        {/* Section Header */}
                        <div className="p-6 border-b border-zinc-900 bg-zinc-950/30 flex items-center justify-between print:border-zinc-300 print:bg-transparent print:px-0 print:py-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl print:hidden">{agent.icon}</span>
                            <div>
                              <h3 className="text-base font-bold text-zinc-200 print:text-black">{agent.name}</h3>
                              <p className="text-[10px] text-zinc-500">{agent.role}</p>
                            </div>
                          </div>
                        </div>

                        {/* Markdown Output */}
                        <div className="p-6 print:px-0 print:py-4">
                          {agentResult ? (
                            <div 
                              className="markdown-content print:text-black"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(agentResult) }}
                            />
                          ) : (
                            <p className="text-zinc-600 italic">No output generated.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mini footer details */}
      <footer className="border-t border-zinc-950 bg-black/20 py-4 px-8 text-center text-[10px] text-zinc-600">
        AI Founder OS System Workspace · Tools Connected: Search Tool, GitHub API, Notion Workspace, PDF Compiler, File Reader.
      </footer>
    </div>
  );
}
