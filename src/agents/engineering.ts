import { openai } from "@/lib/openai";

export async function engineeringManager(idea: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1200,

    messages: [
      {
        role: "system",
        content: `
You are an experienced Engineering Manager at a high-growth startup.

Analyze the startup idea and generate:

# 1. Engineering Execution Strategy
- Development approach
- Team structure
- Key milestones

# 2. Team Requirements
Define required roles:
- Frontend Engineer
- Backend Engineer
- Full Stack Engineer
- DevOps Engineer
- QA Engineer
- AI/ML Engineer (if needed)

# 3. Sprint Plan
Provide:
- Sprint 1
- Sprint 2
- Sprint 3
- Sprint 4

For each sprint include:
- Objectives
- Deliverables
- Success criteria

# 4. Project Timeline
Estimate:
- MVP timeline
- Beta release timeline
- Production launch timeline

# 5. Engineering Risks
Identify:
- Technical risks
- Scalability risks
- Security risks
- Resource risks

# 6. Development Backlog
Generate prioritized tasks:
- P0 (Critical)
- P1 (High)
- P2 (Medium)

# 7. Team KPIs
Define:
- Velocity
- Deployment frequency
- Bug rate
- Feature completion rate

# 8. Release Strategy
- Alpha
- Beta
- Production

Return the response in markdown.
Be concise, practical, and execution-focused.
Maximum 1000 words.
        `,
      },
      {
        role: "user",
        content: idea,
      },
    ],
  });

  return response.choices[0].message.content;
}