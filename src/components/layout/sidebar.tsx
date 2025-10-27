"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Cog,
  CreditCard,
  Files,
  LayoutDashboard,
  LineChart,
  MessagesSquare,
  Users,
  ShieldPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/patients", label: "Pacientes", icon: Users },
  { href: "/schedule", label: "Agenda", icon: CalendarCheck },
  { href: "/finance", label: "Financeiro", icon: CreditCard },
  { href: "/reports", label: "Relatorios", icon: LineChart },
  { href: "/documents", label: "Documentos", icon: Files },
  { href: "/marketing", label: "Marketing", icon: MessagesSquare },
  { href: "/inventory", label: "Estoque", icon: ShieldPlus },
  { href: "/settings", label: "Configuracoes", icon: Cog },
];

type SidebarProps = {
  clinicName?: string;
};

export function Sidebar({ clinicName = "Dr. David Breno" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="relative hidden h-screen w-64 shrink-0 rounded-r-3xl border-r border-[#2a2a2a] bg-gradient-to-b from-[#0f0f0f] via-[#161616] to-[#202020] shadow-[0_0_35px_rgba(0,0,0,0.45)] lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white/5 backdrop-blur">
          <Image
            src="/logo-dr-david.png"
            alt="Logo Dr. David Breno"
            fill
            sizes="36px"
            className="object-contain"
            priority
          />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold text-white drop-shadow">
            {clinicName}
          </p>
          <p className="text-[11px] font-medium text-white/60">CRO/MG 71-476</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white shadow-[0_12px_26px_rgba(0,0,0,0.45)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/60")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-none absolute right-0 top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#3a3a3a] opacity-70" />
    </aside>
  );
}




