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
      <header className="rounded-3xl border border-white/10 bg-[#1c1c1c] px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">Controle de Estoque</h1>
          <p className="text-sm text-white/60">
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
                    ? "bg-[#c97c02] text-white"
                    : "bg-[#e67c27] text-white/70 hover:bg-white/10 hover:text-white"
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



