"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type PatientRow = {
  id: string;
  fullName: string;
  status: string;
  phone?: string | null;
  email?: string | null;
  createdAt: Date;
};

type PatientTableProps = {
  data: PatientRow[];
};

const statusVariant: Record<string, "success" | "warning" | "danger" | "outline"> = {
  ACTIVE: "success",
  WAITING: "warning",
  INACTIVE: "outline",
  DISCHARGED: "outline",
};

export function PatientTable({ data }: PatientTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-surface-muted">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            <th className="px-6 py-3">Paciente</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Telefone</th>
            <th className="px-6 py-3">E-mail</th>
            <th className="px-6 py-3">Cadastro</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-[var(--muted)]">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (
            data.map((patient) => (
              <tr key={patient.id} className="hover:bg-surface-muted/60">
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {patient.fullName}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusVariant[patient.status] ?? "outline"}>
                    {patient.status === "ACTIVE"
                      ? "Ativo"
                      : patient.status === "WAITING"
                        ? "Lista de espera"
                        : patient.status === "DISCHARGED"
                          ? "Alta"
                          : "Inativo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-white/70">{patient.phone ?? "-"}</td>
                <td className="px-6 py-4 text-white/70">{patient.email ?? "-"}</td>
                <td className="px-6 py-4 text-white/70">
                  {format(patient.createdAt, "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

