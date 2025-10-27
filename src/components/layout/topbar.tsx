"use client";

import { Bell, CalendarPlus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TopbarProps = {
  user?:
    | {
        name?: string | null;
        role?: string | null;
      }
    | null;
};

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?term=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#161616]/95 px-4 pr-6 shadow-lg backdrop-blur lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">
          Seja Bem Vindo
        </p>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white font-serif">
            Dr. David Breno
          </h1>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 pl-6">
        <form
          onSubmit={handleSubmit}
          className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#1f1f1f] px-4 py-2 shadow-lg focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 lg:flex"
        >
          <Search className="h-4 w-4 text-white/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pacientes, agendamentos ou arquivos..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#787878] outline-none"
          />
          <button
            type="submit"
            className={cn(
              "inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)] transition hover:bg-[#404040]",
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Buscar
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/schedule/new")}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg shadow-black/40 transition hover:bg-[#404040]"
      >
        <CalendarPlus className="h-4 w-4" />
        Nova sessao
      </button>

      <button
        type="button"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#1f1f1f] text-white/60 shadow-lg transition hover:border-primary/60 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
      </button>
      </div>
    </header>
  );
}
