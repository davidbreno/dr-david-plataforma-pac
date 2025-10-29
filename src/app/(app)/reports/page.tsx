import { subMonths, startOfMonth, format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardFinancialChart } from "@/components/dashboard/financial-chart";
import { PatientDemographicsChart } from "@/components/dashboard/patient-demographics-chart";
import { SimpleBarChart } from "@/components/reports/simple-bar-chart";

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toString" in value) {
    return Number((value as { toString(): string }).toString());
  }
  return 0;
}

export default async function ReportsPage() {
  const startRange = subMonths(new Date(), 5);

  const [transactions, statusGroup, genderGroup] = await Promise.all([
    prisma.financialTransaction.findMany({
      where: { createdAt: { gte: startRange } },
    }),
    prisma.patient.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.patient.groupBy({
      by: ["gender"],
      _count: { gender: true },
    }),
  ]);

  const monthlyMap = new Map<string, { income: number; expense: number }>();
  for (let i = 5; i >= 0; i -= 1) {
    const month = format(startOfMonth(subMonths(new Date(), i)), "MMM/yy");
    monthlyMap.set(month, { income: 0, expense: 0 });
  }

  transactions.forEach((tx) => {
    const month = format(startOfMonth(tx.createdAt), "MMM/yy");
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { income: 0, expense: 0 });
    }
    const entry = monthlyMap.get(month)!;
    if (tx.type === "INCOME") {
      entry.income += toNumber(tx.amount);
    } else {
      entry.expense += toNumber(tx.amount);
    }
  });

  const financialSeries = Array.from(monthlyMap.entries()).map(([label, value]) => ({
    label,
    income: value.income,
    expense: value.expense,
  }));

  const patientStatusData = statusGroup.map((item) => ({
    label: item.status,
    value: item._count.status,
  }));

  const genderData = genderGroup.map((item, index) => ({
    label: item.gender,
    value: item._count.gender,
    color: ["#2563eb", "#f97316", "#22c55e", "#8b5cf6"][index % 4],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Relatórios</h1>
        <p className="text-sm text-slate-500">
          Acompanhe indicadores estratégicos da clínica odontológica.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas x Despesas (últimos 6 meses)</CardTitle>
            <CardDescription>
              Projeção comparativa entre entradas e saídas.
            </CardDescription>
          </CardHeader>
          <div className="px-4 pb-6">
            <DashboardFinancialChart data={financialSeries} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos pacientes</CardTitle>
            <CardDescription>Distribuição atual por estágio de relacionamento.</CardDescription>
          </CardHeader>
          <div className="px-4 pb-6">
            <SimpleBarChart data={patientStatusData} color="#0ea5e9" />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil por gênero</CardTitle>
            <CardDescription>
              Use essa visão para segmentar campanhas e comunicações.
            </CardDescription>
          </CardHeader>
          <div className="px-4 pb-6">
            <PatientDemographicsChart data={genderData} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procedimentos mais rentáveis</CardTitle>
            <CardDescription>
              Baseado nas categorias financeiras lançadas no sistema.
            </CardDescription>
          </CardHeader>
          <div className="px-4 pb-6">
            <SimpleBarChart
              data={Object.entries(
                transactions
                  .filter((tx) => tx.type === "INCOME")
                  .reduce<Record<string, number>>((acc, tx) => {
                    acc[tx.category] = (acc[tx.category] ?? 0) + toNumber(tx.amount);
                    return acc;
                  }, {}),
              ).map(([label, value]) => ({ label, value }))}
              color="#22c55e"
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
