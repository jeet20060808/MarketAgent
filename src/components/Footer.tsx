import Link from "next/link";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/jeet20060808/MarketAgent" },
  { label: "Next.js", href: "https://nextjs.org" },
  { label: "OpenAI", href: "https://openai.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-zinc-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-medium text-white">AI Founder OS</p>
          <p className="mt-2 max-w-xl leading-6">
            Built to turn a single idea into a multi-agent startup plan, one pass
            at a time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
