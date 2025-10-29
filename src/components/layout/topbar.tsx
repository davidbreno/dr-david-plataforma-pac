"use client";

import { Bell, CalendarPlus, Moon, Search, Sparkles, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

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
  const { theme, toggleTheme } = useTheme();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?term=${encodeURIComponent(trimmed)}`);
  }

  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const themeLabel =
    theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[var(--border)] bg-surface/90 px-4 pr-6 shadow-[0_8px_24px_rgba(15,20,28,0.12)] backdrop-blur lg:px-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.26em] text-[color:rgb(var(--foreground-rgb)/0.55)]">
          Seja Bem Vindo
        </p>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-[var(--foreground)] font-serif">
            Dr. David Breno
          </h1>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 pl-6">
        <form
          onSubmit={handleSubmit}
          className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-surface px-4 py-2 shadow-sm backdrop-blur focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 lg:flex"
        >
          <Search className="h-4 w-4 text-[color:rgb(var(--foreground-rgb)/0.6)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pacientes, agendamentos ou arquivos..."
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[color:rgb(var(--foreground-rgb)/0.45)] outline-none"
          />
          <button
            type="submit"
            className={cn(
              "inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:bg-primary/90",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Buscar
          </button>
        </form>

      <button
        type="button"
        onClick={() => router.push("/schedule/new")}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-md transition hover:bg-primary/90"
      >
        <CalendarPlus className="h-4 w-4" />
        Nova sessao
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-surface text-[color:rgb(var(--foreground-rgb)/0.65)] shadow-sm transition hover:border-primary/60 hover:text-[var(--foreground)]"
        aria-label={themeLabel}
        title={themeLabel}
      >
        <ThemeIcon className="h-5 w-5" />
        <span className="sr-only">{themeLabel}</span>
      </button>

      <button
  type="button"
  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-surface text-[color:rgb(var(--foreground-rgb)/0.65)] shadow-sm transition hover:border-primary/60 hover:text-[var(--foreground)]"
  aria-label="Notificações"
  title="Notificações"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
      </button>
      </div>
    </header>
  );
}
