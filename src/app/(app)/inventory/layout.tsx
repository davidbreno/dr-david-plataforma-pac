'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/inventory/implante", label: "Implante" },
  { href: "/inventory/cirurgia", label: "Cirurgia" },
  { href: "/inventory/dentistica", label: "Dentistica" },
];

type InventoryLayoutProps = {
  children: ReactNode;
};

export default function InventoryLayout({ children }: InventoryLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-3xl border border-[var(--border)] bg-surface/95 px-6 py-4 shadow-[0_10px_30px_rgba(13,15,14,0.12)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Controle de Estoque</h1>
          <p className="text-sm text-[var(--foreground)]/60">
            Organize materiais por especialidade, acompanhe quantidades e atualize o estoque em tempo real.
          </p>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2">
          {sections.map((section) => {
            const active = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-[var(--primary-foreground)] shadow-sm"
                    : "bg-white/20 text-[var(--foreground)]/70 hover:bg-white/30 hover:text-[var(--foreground)]"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}
    </div>
  );
}



