"use client";

import { FormEvent, useState } from "react";

export type IdeaInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  helperText?: string;
};

export function IdeaInput({
  value: controlledValue,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Describe the startup idea, target customer, and what problem it solves.",
  helperText = "Example: An AI copilot for freelance designers that automates scope, billing, and client updates.",
}: IdeaInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue ?? internalValue;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(value.trim());
  };

  const handleChange = (nextValue: string) => {
    if (onChange) {
      onChange(nextValue);
      return;
    }

    setInternalValue(nextValue);
  };

  return (
    <section
      id="idea-input"
      className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Input
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Describe the idea.
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          Multi-agent briefing
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-36 w-full resize-none rounded-3xl border border-white/10 bg-zinc-950/70 px-4 py-4 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-zinc-400">{helperText}</p>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Running agents..." : "Generate plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
