"use client";

import { ReactNode, useMemo, useState } from "react";

export type ResultTab = {
  id: string;
  label: string;
  content: ReactNode;
};

export type ResultTabsProps = {
  tabs: ResultTab[];
  defaultTabId?: string;
};

export function ResultTabs({ tabs, defaultTabId }: ResultTabsProps) {
  const initialTab = useMemo(() => {
    return tabs.find((tab) => tab.id === defaultTabId) ?? tabs[0];
  }, [defaultTabId, tabs]);

  const [activeTabId, setActiveTabId] = useState(initialTab?.id ?? "");

  if (!tabs.length) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  return (
    <section
      id="results"
      className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-white text-zinc-950"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/60 p-5 text-zinc-100">
        {activeTab.content}
      </div>
    </section>
  );
}
