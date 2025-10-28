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
    <aside className="relative hidden h-screen w-72 shrink-0 border-r border-gray-200 bg-white px-4 pb-6 pt-5 shadow-[0_0_45px_rgba(200,200,200,0.15)] lg:flex lg:flex-col">
      <div className="space-y-4 px-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] transition hover:border-gray-300 hover:bg-gray-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 via-gray-100 to-white text-sm font-semibold text-gray-800">
            {workspaceInitials}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {clinicName}
            </span>
            <span className="text-xs text-gray-500">Workspace principal</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
        </button>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-1">
        <div className="space-y-7">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
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
                          ? "bg-primary/10 text-primary shadow-[0_12px_26px_rgba(70,226,189,0.12)]"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 transition",
                          isActive
                            ? "border-primary/40 bg-primary/20 text-primary"
                            : "group-hover:border-gray-300 group-hover:bg-gray-100 group-hover:text-gray-900",
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

      <footer className="mt-6 space-y-3 border-t border-gray-200 pt-5">
        <div className="space-y-1">
          {footerLinks.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
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
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-300"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-xs text-gray-500">
          <p className="text-sm font-semibold text-gray-900">Plano Premium</p>
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
