
export default function AgentsSection() {
  const agents = [
    {
      title: "Market Research",
      desc: "Analyze competitors and trends"
    },
    {
      title: "Idea Validator",
      desc: "Validate startup ideas"
    },
    {
      title: "PRD Agent",
      desc: "Generate product requirements"
    },
    {
      title: "GTM Agent",
      desc: "Create launch strategies"
    },
    {
      title: "Finance Agent",
      desc: "Revenue projections"
    },
    {
      title: "Pitch Deck Agent",
      desc: "Investor-ready presentations"
    }
  ];

  return (
    <section className="min-h-screen bg-[#f5dccb] px-6 py-24">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-gray-500 mb-4">
            AI TEAM
          </p>

          <h2 className="text-6xl font-bold mb-6">
            Meet Your AI Agents
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Specialized agents work together to transform your idea into a complete startup plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.title}
              className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50"
            >
              <h3 className="text-2xl font-bold mb-3">
                {agent.title}
              </h3>

              <p className="text-gray-600">
                {agent.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}