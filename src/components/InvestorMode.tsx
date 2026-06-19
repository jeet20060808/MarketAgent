"use client";

import React, { useState } from "react";
import { 
  Target, AlertCircle, Lightbulb, TrendingUp, MonitorPlay, 
  Briefcase, Award, Rocket, LineChart, DollarSign, 
  Map, Users, Download, CheckSquare, Square, FileText, CheckCircle2, ChevronLeft
} from "lucide-react";
import type { AgentResults } from "@/app/dashboard/page";
import { marked } from "marked";
import pptxgen from "pptxgenjs";

// Use marked for robust markdown rendering (tables, bold, etc)
function renderMarkdown(text: string): string {
  if (!text) return "<p class='text-zinc-500 italic'>No data compiled yet.</p>";
  
  // Escape raw HTML tags to prevent XSS before parsing markdown
  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Strip out remaining unwanted markdown headers if they leaked through
  let cleanedText = escapedText.replace(/^#+\s+.*$/gm, '').trim();
  // Strip out numbered list items if they were used as headings and leaked through at the very start
  cleanedText = cleanedText.replace(/^\d+\.\s+[A-Za-z\s]+(?!.)/gm, '').trim();
  
  return marked.parse(cleanedText) as string;
}

function extractSection(text: string | null, keywords: string[]): string {
  if (!text) return "";
  const lines = text.split('\n');
  let capturing = false;
  let content: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let headingMatch = null;
    let inlineContent = "";

    if (/^#+\s*/.test(trimmed)) {
      headingMatch = trimmed.replace(/^#+\s*/, "");
    } else if (/^\d+\.\s*(.*)$/.test(trimmed)) {
      headingMatch = trimmed.replace(/^\d+\.\s*/, "");
    } else if (/^([A-Za-z][A-Za-z\s]+?):\s*(.*)$/.test(trimmed)) {
      const [, heading, rest] = trimmed.match(/^([A-Za-z][A-Za-z\s]+?):\s*(.*)$/)!;
      headingMatch = heading;
      inlineContent = rest;
    }

    if (headingMatch) {
      const isMatch = keywords.some(k => headingMatch!.toLowerCase().includes(k.toLowerCase()));
      if (isMatch) {
        capturing = true;
        if (inlineContent) {
          content.push(inlineContent);
        }
        continue;
      }

      if (capturing) {
        break;
      }
      continue;
    }

    if (capturing) {
      content.push(line);
    }
  }

  const res = content.join('\n').trim();
  if (res) {
    return res;
  }

  const lower = text.toLowerCase();
  for (const keyword of keywords) {
    const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`([^\\n.?!]*\\b${escapedKeyword}\\b[^\\n.?!]*[.?!])`, 'i');
    const match = regex.exec(text);
    if (match) {
      return match[1].trim();
    }
  }

  return "";
}

export function InvestorMode({ 
  results, 
  onClose 
}: { 
  results: AgentResults; 
  onClose: () => void 
}) {
  const [premiumOptions, setPremiumOptions] = useState({
    pitch: true,
    yc: false,
    onepager: false,
    executive: false,
    forecast: false,
    email: false
  });

  const slides = [
    {
      id: "overview",
      title: "Startup Overview",
      icon: Target,
      color: "#EC4899",
      content: extractSection(results.advisor, ["overview", "idea", "startup"]) || extractSection(results.marketing, ["value proposition", "headline"])
    },
    {
      id: "problem",
      title: "Problem",
      icon: AlertCircle,
      color: "#EF4444",
      content: extractSection(results.advisor, ["problem"])
    },
    {
      id: "solution",
      title: "Solution",
      icon: Lightbulb,
      color: "#F59E0B",
      content: extractSection(results.advisor, ["solution"]) || extractSection(results.product, ["features"])
    },
    {
      id: "market",
      title: "Market Opportunity",
      icon: TrendingUp,
      color: "#3B82F6",
      content: extractSection(results.research, ["market size", "tam", "opportunity"])
    },
    {
      id: "demo",
      title: "Product Demo",
      icon: MonitorPlay,
      color: "#8B5CF6",
      content: extractSection(results.product, ["mvp", "stories"])
    },
    {
      id: "business",
      title: "Business Model",
      icon: Briefcase,
      color: "#10B981",
      content: extractSection(results.advisor, ["business model"]) || extractSection(results.financial, ["revenue model"])
    },
    {
      id: "competition",
      title: "Competitive Advantage",
      icon: Award,
      color: "#F43F5E",
      content: extractSection(results.research, ["competitors", "advantage", "competitive"])
    },
    {
      id: "gtm",
      title: "Go-To-Market",
      icon: Rocket,
      color: "#06B6D4",
      content: extractSection(results.marketing, ["channels", "go-to-market", "strategy"])
    },
    {
      id: "financials",
      title: "Financial Projections",
      icon: LineChart,
      color: "#14B8A6",
      content: extractSection(results.financial, ["cac", "ltv", "break-even", "projection"])
    },
    {
      id: "ask",
      title: "Funding Ask",
      icon: DollarSign,
      color: "#84CC16",
      content: extractSection(results.financial, ["funding", "requirements", "ask"])
    },
    {
      id: "roadmap",
      title: "Roadmap",
      icon: Map,
      color: "#6366F1",
      content: extractSection(results.product, ["roadmap"]) || extractSection(results.engineering, ["timeline", "milestones"])
    },
    {
      id: "team",
      title: "Team",
      icon: Users,
      color: "#F97316",
      content: extractSection(results.engineering, ["team", "roles", "requirements"])
    }
  ];

  const handleDownload = async (format: string) => {
    if (format === "PPTX") {
      const pres = new pptxgen();
      
      const cover = pres.addSlide();
      cover.addText("Startup Pitch Deck", { x: 1, y: 2, w: '80%', fontSize: 36, bold: true, color: "363636" });
      cover.addText("Generated by AI Founder OS", { x: 1, y: 3, w: '80%', fontSize: 18, color: "888888" });

      slides.forEach((slide, idx) => {
        const pptSlide = pres.addSlide();
        pptSlide.addText(`${idx + 1}. ${slide.title}`, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: slide.color.replace('#', '') });
        const plainText = slide.content.replace(/[#*_]/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
        pptSlide.addText(plainText.substring(0, 1000), { x: 0.5, y: 1.5, w: '90%', h: '70%', fontSize: 14, color: "363636", align: "left", valign: "top" });
      });

      pres.writeFile({ fileName: "pitch-deck.pptx" });
    } else if (format === "PDF") {
      window.print();
    } else {
      alert(`Exporting to ${format} is currently not supported natively in this browser.`);
    }
  };

  const generatePremium = () => {
    const selected = Object.keys(premiumOptions).filter(k => premiumOptions[k as keyof typeof premiumOptions]);
    if (selected.length === 0) {
      alert("Please select at least one document type.");
      return;
    }

    const docTemplates: Record<string, string[]> = {
      pitch: slides.map(s => s.id),
      yc: ["overview", "problem", "solution", "market", "competition", "team"],
      onepager: ["overview", "problem", "solution", "market", "financials", "team"],
      executive: ["overview", "problem", "solution", "market", "business", "gtm", "financials", "ask"],
      forecast: ["financials", "ask"],
      email: ["overview", "ask", "team"]
    };
    
    let docContent = "# Premium Documents Output\n\n";
    selected.forEach(s => {
      docContent += `## ${s.toUpperCase()} Document\n\n`;
      const templateIds = docTemplates[s] || [];
      const relevantSlides = slides.filter(slide => templateIds.includes(slide.id));
      
      relevantSlides.forEach(slide => {
        docContent += `### ${slide.title}\n${slide.content.replace(/^#+\s+.*$/gm, '')}\n\n`;
      });
      docContent += "---\n\n";
    });
    
    const blob = new Blob([docContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "premium-package.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const togglePremium = (key: keyof typeof premiumOptions) => {
    setPremiumOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-transparent">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#f5dccb]/90 backdrop-blur-md border-b border-[#d2bba8] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-pink-100 text-pink-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Investor Mode
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">VC-READY PITCH DECK</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Pitch Strategy Generated</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => handleDownload("PPTX")} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            [PPTX]
          </button>
          <button onClick={() => handleDownload("PDF")} className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            [PDF]
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col xl:flex-row gap-8">
        
        {/* Main Pitch Cards Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-50 border border-zinc-100" style={{ color: slide.color }}>
                  <slide.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">SLIDE {String(i+1).padStart(2, '0')}</span>
                  <h3 className="text-sm font-bold text-zinc-900">{slide.title}</h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <div 
                  className="text-xs text-zinc-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(slide.content) }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features Sidebar */}
        <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white shadow-lg border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold">Premium Generation</h2>
            </div>
            <p className="text-xs text-zinc-400 mb-6">Select automated documents to generate from the current strategy.</p>
            
            <div className="flex flex-col gap-3">
              {[
                { id: "pitch", label: "Investor Pitch" },
                { id: "yc", label: "YC Application" },
                { id: "onepager", label: "VC One Pager" },
                { id: "executive", label: "Executive Summary" },
                { id: "forecast", label: "Financial Forecast" },
                { id: "email", label: "Fundraising Email" }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => togglePremium(opt.id as keyof typeof premiumOptions)}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  {premiumOptions[opt.id as keyof typeof premiumOptions] ? (
                    <CheckSquare className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-500" />
                  )}
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={generatePremium}
              className="w-full mt-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Selected
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
