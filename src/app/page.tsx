"use client";
import {Navbar} from "@/components/Navbar";
import {IdeaInput} from "@/components/IdeaInput";
import {SummaryCard} from "@/components/SummaryCard";
import {ResultTabs} from "@/components/ResultTabs";
import {Footer} from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <IdeaInput onSubmit={() => {}} />
        <SummaryCard label="Summary" value="Enter an idea to generate insights." />
        <ResultTabs tabs={[] as any} />
      </div>

      <Footer />
    </main>
  );
}