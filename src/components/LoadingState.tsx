export function LoadingState() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Processing
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            The agent swarm is working.
          </h2>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          Live orchestration
        </span>
      </div>

      <div className="space-y-4">
        {[
          "Startup Advisor is framing the opportunity",
          "Market Research is scanning competitors",
          "Product Manager is shaping the MVP",
          "Architect is mapping the system",
          "Marketing is drafting launch assets",
        ].map((step) => (
          <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
            <span className="text-sm text-zinc-300">{step}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
        <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
        <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
      </div>
    </section>
  );
}
