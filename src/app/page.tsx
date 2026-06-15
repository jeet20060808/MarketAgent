"use client";

import { useState, useCallback, useRef } from "react";

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
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [results, setResults] = useState<AgentResults>({});
  const [activeTab, setActiveTab] = useState(AGENTS[0].id);
  const processingRef = useRef(false);

  const revealAgentsProgressively = useCallback(() => {
    const agentIds = AGENTS.map((a) => a.id);
    const delays = [800, 1600, 2400, 3200, 3800, 4400];

    agentIds.forEach((id, i) => {
      setTimeout(() => {
        setCompletedAgents((prev) => [...prev, id]);

        if (i === agentIds.length - 1) {
          setTimeout(() => {
            setState("results");
          }, 800);
        }
      }, delays[i]);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!idea.trim() || processingRef.current) return;
    processingRef.current = true;

    setCompletedAgents([]);
    setResults({});
    setState("processing");

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
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
  }, [idea, revealAgentsProgressively]);

  const handleReset = useCallback(() => {
    setState("input");
    setIdea("");
    setCompletedAgents([]);
    setResults({});
    setActiveTab(AGENTS[0].id);
    processingRef.current = false;
  }, []);

  const activeAgent = AGENTS.find((a) => a.id === activeTab)!;
  const activeResult = results[activeTab];

  return (
    <>
      {/* ── PHASE 1: Hero Input ── */}
      {state === "input" && (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 grid-bg">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(124,58,237,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center animate-fade-in-up">
            <div className="mb-8 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "var(--gradient-primary)" }}
              >
                ⚡
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-200">
                AI Founder OS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-center leading-tight tracking-tight mb-4">
              <span className="gradient-text">Describe your startup idea.</span>
            </h1>
            <p className="text-zinc-400 text-center text-lg max-w-lg mb-10 leading-relaxed">
              Our AI founding team will validate, research, plan, architect, and market it — in seconds.
            </p>

            <div className="w-full glass-card input-glow p-1 mb-6 transition-all">
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. AI-powered fitness coach for busy professionals"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && idea.trim()) {
                    handleSubmit();
                  }
                }}
                className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 resize-none px-5 py-4 text-base leading-relaxed rounded-[14px] focus:outline-none"
              />
            </div>

            <button
              id="submit-btn"
              onClick={handleSubmit}
              disabled={!idea.trim()}
              className="btn-primary px-8 py-3.5 text-base flex items-center gap-2.5 mb-10"
            >
              Launch Agents
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex flex-wrap justify-center gap-3">
              {AGENTS.map((agent, i) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm animate-fade-in-up"
                  style={{
                    animationDelay: `${0.4 + i * 0.08}s`,
                    opacity: 0,
                    background: `${agent.color}10`,
                    border: `1px solid ${agent.color}20`,
                    color: agent.color,
                  }}
                >
                  <span className="text-base">{agent.icon}</span>
                  <span className="font-medium">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="absolute bottom-8 text-zinc-600 text-xs">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs font-mono">Ctrl + Enter</kbd> to submit
          </p>
        </section>
      )}

      {/* ── PHASE 2: Agent Processing ── */}
      {state === "processing" && (
        <section className="min-h-screen px-6 py-16 grid-bg flex flex-col items-center">
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 30% at 50% 30%, rgba(124,58,237,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="mb-10 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: completedAgents.length === AGENTS.length ? "#34d399" : "#a78bfa",
                      animation: completedAgents.length < AGENTS.length ? "progressPulse 1.5s ease-in-out infinite" : "none",
                    }}
                  />
                  <span className="text-sm font-medium text-zinc-300">
                    {completedAgents.length === AGENTS.length ? "All agents complete" : "Agents working…"}
                  </span>
                </div>
                <span className="text-sm font-mono text-zinc-500">
                  {completedAgents.length}/{AGENTS.length}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(completedAgents.length / AGENTS.length) * 100}%`,
                    background: "var(--gradient-primary)",
                  }}
                />
              </div>
            </div>

            <div className="glass-card px-5 py-4 mb-8 animate-fade-in">
              <p className="text-xs font-medium text-zinc-500 mb-1">Your Idea</p>
              <p className="text-zinc-200 leading-relaxed">{idea}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENTS.map((agent, i) => {
                const isComplete = completedAgents.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    className="glass-card agent-card p-5 flex flex-col gap-3 animate-fade-in-up"
                    data-agent={agent.id}
                    style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: `${agent.color}15` }}
                        >
                          {agent.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-100">{agent.name}</h3>
                          <p className="text-xs text-zinc-500">{agent.role}</p>
                        </div>
                      </div>

                      {isComplete ? (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold animate-fade-in"
                          style={{ background: `${agent.color}20`, color: agent.color }}
                        >
                          ✓
                        </div>
                      ) : (
                        <div className="agent-spinner" style={{ color: agent.color }} />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                      {agent.outputs.map((output, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: isComplete ? agent.color : "rgba(255,255,255,0.1)",
                              transition: "background 0.5s ease",
                              transitionDelay: isComplete ? `${idx * 0.1}s` : "0s",
                            }}
                          />
                          <span
                            className="transition-colors duration-500"
                            style={{
                              color: isComplete ? "#a1a1aa" : "#3f3f46",
                              transitionDelay: isComplete ? `${idx * 0.1}s` : "0s",
                            }}
                          >
                            {output}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-2 border-t border-zinc-800/50">
                      <p className="text-xs" style={{ color: isComplete ? agent.color : "#52525b" }}>
                        {isComplete ? "Complete" : "Processing…"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── PHASE 3: Results Dashboard ── */}
      {state === "results" && (
        <section className="min-h-screen px-6 py-12 grid-bg flex flex-col items-center">
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 30% at 50% 20%, rgba(124,58,237,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
                  <span className="text-xs font-medium text-emerald-400">All {AGENTS.length} agents complete</span>
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">Results Dashboard</h2>
                <p className="text-zinc-500 text-sm mt-1 max-w-lg truncate">{idea}</p>
              </div>
              <button
                id="reset-btn"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all flex items-center gap-2 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Try Another Idea
              </button>
            </div>

            <div className="glass-card p-1.5 mb-6 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <div className="flex gap-1 overflow-x-auto">
                {AGENTS.map((agent) => {
                  const isActive = activeTab === agent.id;
                  return (
                    <button
                      key={agent.id}
                      id={`tab-${agent.id}`}
                      onClick={() => setActiveTab(agent.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0"
                      style={{
                        background: isActive ? `${agent.color}12` : "transparent",
                        color: isActive ? agent.color : "#71717a",
                        border: isActive ? `1px solid ${agent.color}25` : "1px solid transparent",
                      }}
                    >
                      <span className="text-base">{agent.icon}</span>
                      <span className="hidden sm:inline">{agent.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card agent-card animate-fade-in" data-agent={activeAgent.id} key={activeTab} style={{ animationDelay: "0.15s", opacity: 0 }}>
              <div className="p-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${activeAgent.color}12` }}>
                    {activeAgent.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">{activeAgent.name}</h3>
                    <p className="text-sm text-zinc-500">{activeAgent.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {activeAgent.outputs.map((output, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: `${activeAgent.color}12`, color: activeAgent.color, border: `1px solid ${activeAgent.color}20` }}>
                        {output}
                      </div>
                      {i < activeAgent.outputs.length - 1 && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeAgent.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeResult ? (
                  <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeResult) }} />
                ) : (
                  <p className="text-zinc-600 italic">No output received from this agent.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6">
              {AGENTS.map((agent, i) => {
                const hasResult = !!results[agent.id];
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveTab(agent.id)}
                    className="glass-card p-3 text-center transition-all hover:scale-[1.02] animate-fade-in-up cursor-pointer"
                    style={{
                      animationDelay: `${0.3 + i * 0.05}s`,
                      opacity: 0,
                      borderColor: activeTab === agent.id ? `${agent.color}30` : undefined,
                    }}
                  >
                    <div className="text-xl mb-1">{agent.icon}</div>
                    <p className="text-xs font-medium text-zinc-400">{agent.name}</p>
                    <div className="w-1.5 h-1.5 rounded-full mx-auto mt-2" style={{ background: hasResult ? agent.color : "#27272a" }} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
