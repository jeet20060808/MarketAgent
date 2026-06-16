import Link from "next/link";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Agents", href: "#agents" },
  { label: "Results", href: "#results" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-sm font-black text-zinc-950 shadow-lg shadow-cyan-500/20 transition-transform duration-200 group-hover:scale-105">
            AO
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
              AI Founder OS
            </span>
            <span className="text-xs text-zinc-400">Agentic startup studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="#idea-input"
          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 hover:text-white"
        >
          Run Agents
        </a>
      </div>
    </header>
  );
}
