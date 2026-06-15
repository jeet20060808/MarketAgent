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

export type AgentId = (typeof AGENTS)[number]["id"];

export type AgentResults = Record<string, string | null>;
