import { ReactNode } from "react";

export type AgentCardProps = {
  title: string;
  subtitle: string;
  status?: string;
  accent?: string;
  children?: ReactNode;
};

export function AgentCard({
  title,
  subtitle,
  status = "Ready",
  accent = "from-cyan-400 to-emerald-400",
  children,
}: AgentCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${accent}`}
          />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{subtitle}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          {status}
        </span>
      </div>

      {children ? (
        <div className="space-y-3 text-sm leading-6 text-zinc-200">{children}</div>
      ) : null}
    </article>
  );
}
