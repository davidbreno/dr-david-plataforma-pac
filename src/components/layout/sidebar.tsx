"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  ChevronsUpDown,
  Cog,
  CreditCard,
  Files,
  LifeBuoy,
  LayoutDashboard,
  LineChart,
  MessagesSquare,
  Search,
  ShieldPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "Visao Geral",
    items: [
      { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
      { href: "/patients", label: "Pacientes", icon: Users },
      { href: "/schedule", label: "Agenda", icon: CalendarCheck },
      { href: "/documents", label: "Documentos", icon: Files },
    ],
  },
  {
    title: "Gestao da Clinica",
    items: [
      { href: "/finance", label: "Financeiro", icon: CreditCard },
      { href: "/reports", label: "Relatorios", icon: LineChart },
      { href: "/marketing", label: "Marketing", icon: MessagesSquare },
      { href: "/inventory", label: "Estoque", icon: ShieldPlus },
    ],
  },
];

const footerLinks = [
  { href: "/settings", label: "Configuracoes", icon: Cog, disabled: false },
  { href: "#", label: "Ajuda & guias", icon: LifeBuoy, disabled: true },
];

const highlightedItems = new Set(["/schedule", "/inventory"]);

type SidebarProps = {
  clinicName?: string;
};

export function Sidebar({ clinicName = "Dr. David Breno" }: SidebarProps) {
  const pathname = usePathname();
  const workspaceInitials = useMemo(() => {
    const segments = clinicName.trim().split(" ");
    if (segments.length === 0) return "DB";
    if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();
    return (segments[0][0] + segments[segments.length - 1][0]).toUpperCase();
  }, [clinicName]);

  return (
    <aside className="relative hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#111214] px-4 pb-6 pt-5 shadow-[0_0_45px_rgba(8,10,12,0.35)] lg:flex lg:flex-col">
      <div className="space-y-4 px-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 via-white/5 to-white/0 text-sm font-semibold text-white">
            {workspaceInitials}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-white">
              {clinicName}
            </span>
            <span className="text-xs text-white/50">Workspace principal</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-white/40" />
        </button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-1">
        <div className="space-y-7">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname?.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-white/10 text-white shadow-[0_12px_26px_rgba(8,10,12,0.25)]"
                          : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition",
                          isActive
                            ? "border-primary/40 bg-primary/20 text-white"
                            : "group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {highlightedItems.has(item.href) ? (
                        <span className="inline-flex h-2 w-2 rounded-full bg-[#9b5bff]" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <footer className="mt-6 space-y-3 border-t border-white/5 pt-5">
        <div className="space-y-1">
          {footerLinks.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </>
            );

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  aria-disabled
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/40"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-white/60">
          <p className="text-sm font-semibold text-white">Plano Premium</p>
          <p className="mt-1 leading-relaxed">
            Relatorios ilimitados, dashboards personalizados e suporte prioritario.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition hover:text-primary/80"
          >
            Saiba mais
          </button>
        </div>
      </footer>
    </aside>
  );
}
