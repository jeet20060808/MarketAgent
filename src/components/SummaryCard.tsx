export type SummaryCardProps = {
  label: string;
  value: string;
  note?: string;
  tone?: "cyan" | "emerald" | "amber" | "rose";
};

const toneClasses: Record<NonNullable<SummaryCardProps["tone"]>, string> = {
  cyan: "from-cyan-400/20 to-cyan-400/5 text-cyan-100",
  emerald: "from-emerald-400/20 to-emerald-400/5 text-emerald-100",
  amber: "from-amber-400/20 to-amber-400/5 text-amber-100",
  rose: "from-rose-400/20 to-rose-400/5 text-rose-100",
};

export function SummaryCard({
  label,
  value,
  note,
  tone = "cyan",
}: SummaryCardProps) {
  return (
    <article
      className={`rounded-[1.5rem] border border-white/10 bg-gradient-to-br p-5 shadow-lg shadow-black/20 ${toneClasses[tone]}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/60">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      {note ? <p className="mt-3 text-sm leading-6 text-white/70">{note}</p> : null}
    </article>
  );
}
