import { endOfMonth, format, startOfDay, startOfMonth } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardFinancialChart } from "@/components/dashboard/financial-chart";
import { PatientDemographicsChart } from "@/components/dashboard/patient-demographics-chart";
import {
  CalendarCheck,
  CheckCircle2,
  Clock4,
  Files,
  NotebookPen,
} from "lucide-react";

type FinancialTransaction = {
  createdAt: Date;
  type: "INCOME" | "EXPENSE";
  amount: unknown;
};

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toString" in value) {
    return Number((value as { toString(): string }).toString());
  }
  return 0;
}

function buildFinancialSeries(
  transactions: FinancialTransaction[],
  start: Date,
  end: Date,
) {
  const days: Record<string, { income: number; expense: number }> = {};
  const cursor = new Date(start);
  while (cursor <= end) {
    const label = format(cursor, "dd/MM");
    days[label] = { income: 0, expense: 0 };
    cursor.setDate(cursor.getDate() + 1);
  }

  transactions.forEach((tx) => {
    const label = format(tx.createdAt, "dd/MM");
    if (!days[label]) {
      days[label] = { income: 0, expense: 0 };
    }
    const amount = toNumber(tx.amount);
    if (tx.type === "INCOME") {
      days[label].income += amount;
    } else {
      days[label].expense += amount;
    }
  });

  return Object.entries(days).map(([label, value]) => ({
    label,
    ...value,
  }));
}

function groupByAge(patients: { birthDate: Date | null }[]) {
  const buckets: Record<string, number> = {
    "0-12": 0,
    "13-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61+": 0,
    "Sem info": 0,
  };

  const today = new Date();
  patients.forEach((patient) => {
    if (!patient.birthDate) {
      buckets["Sem info"] += 1;
      return;
    }
    const age =
      today.getFullYear() -
      patient.birthDate.getFullYear() -
      (today < new Date(today.getFullYear(), patient.birthDate.getMonth(), patient.birthDate.getDate())
        ? 1
        : 0);

    if (age <= 12) buckets["0-12"] += 1;
    else if (age <= 20) buckets["13-20"] += 1;
    else if (age <= 40) buckets["21-40"] += 1;
    else if (age <= 60) buckets["41-60"] += 1;
    else buckets["61+"] += 1;
  });

  return buckets;
}

export default async function DashboardPage() {
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);

  const [
    upcomingAppointments,
    pendingTasks,
    financialTransactions,
    patientGenderGroup,
    patients,
    openAnamnesis,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: { startAt: { gte: startOfDay(now) } },
      orderBy: { startAt: "asc" },
      take: 6,
      include: {
        patient: true,
      },
    }),
    prisma.task.findMany({
      where: { status: { not: "DONE" } },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.financialTransaction.findMany({
      where: {
        createdAt: {
          gte: startMonth,
          lte: endMonth,
        },
      },
    }),
    prisma.patient.groupBy({
      by: ["gender"],
      _count: { gender: true },
    }),
    prisma.patient.findMany({
      select: {
        birthDate: true,
      },
    }),
    prisma.anamnesisResponseSet.findMany({
      where: { paymentStatus: { not: "PAID" } },
      include: {
        patient: true,
        template: true,
      },
      orderBy: { filledAt: "desc" },
      take: 4,
    }),
  ]);

  const financialSeries = buildFinancialSeries(
    financialTransactions as FinancialTransaction[],
    startMonth,
    endMonth,
  );

  const totalIncome = financialTransactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((acc, tx) => acc + toNumber(tx.amount), 0);
  const totalExpense = financialTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((acc, tx) => acc + toNumber(tx.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const ageGroups = groupByAge(patients);
  const patientByGender = patientGenderGroup.map((item) => ({
    label: item.gender,
    value: item._count.gender,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.9fr_1fr]">
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="bg-surface">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                Receita do mês
              </CardTitle>
              <p className="text-3xl font-semibold text-white">
                {formatCurrency(totalIncome)}
              </p>
              <CardDescription className="text-xs text-white/50">
                +12% vs mes anterior
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-surface-muted">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                Despesas do mês
              </CardTitle>
              <p className="text-3xl font-semibold text-white">
                {formatCurrency(totalExpense)}
              </p>
              <CardDescription className="text-xs text-white/50">
                -4% vs mes anterior
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-surface-contrast">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                Balanço
              </CardTitle>
              <p className="text-3xl font-semibold text-white">
                {formatCurrency(netBalance)}
              </p>
              <CardDescription className="text-xs text-white/50">
                Última atualização {format(now, "dd/MM HH:mm")}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Próximas sessões</CardTitle>
              <CardDescription>
                Seus próximos pacientes confirmados
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/schedule">Ver agenda</Link>
            </Button>
          </CardHeader>
          <div className="divide-y divide-white/10">
            {upcomingAppointments.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500">
                Nenhuma sessão futura cadastrada.
              </p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {appointment.patient.fullName ||
                        `${appointment.patient.firstName} ${appointment.patient.lastName}`}
                    </p>
                    <p className="text-xs text-white/50">
                      {appointment.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/70">
                      {formatDateTime(appointment.startAt)}
                    </p>
                    <Badge
                      variant={
                        appointment.paymentStatus === "PAID"
                          ? "success"
                          : appointment.paymentStatus === "PARTIAL"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {appointment.paymentStatus === "PAID"
                        ? "Pago"
                        : appointment.paymentStatus === "PARTIAL"
                          ? "Pago parcial"
                          : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Fluxo financeiro</CardTitle>
                <CardDescription>
                  Receitas vs Despesas neste mês
                </CardDescription>
              </div>
              <Badge variant="outline">
                {format(startMonth, "MMM").toUpperCase()}
              </Badge>
            </CardHeader>
            <div className="px-2 pb-6">
              <DashboardFinancialChart data={financialSeries} />
            </div>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Perfil dos pacientes</CardTitle>
                <CardDescription>Distribuição por gênero</CardDescription>
              </div>
            </CardHeader>
            <div className="px-4 pb-6">
              <PatientDemographicsChart
                data={patientByGender.map((item, index) => ({
                  label: item.label,
                  value: item.value,
                  color: ["#f2f2f2", "#cfcfcf", "#9a9a9a", "#6f6f6f"][index % 4],
                }))}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/60">
                {Object.entries(ageGroups).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2"
                  >
                    <span className="font-semibold text-white/70">{value}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Tarefas prioritárias</CardTitle>
                <CardDescription>Organize ações da equipe</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/tasks">
                  <NotebookPen className="mr-2 h-4 w-4" />
                  Nova tarefa
                </Link>
              </Button>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Tudo em dia! Sem pendências.
                </p>
              ) : (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between rounded-xl border border-white/10 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{task.title}</p>
                      {task.description ? (
                        <p className="text-xs text-white/50">
                          {task.description}
                        </p>
                      ) : null}
                    </div>
                    <Badge
                      variant={
                        task.status === "IN_PROGRESS" ? "warning" : "outline"
                      }
                    >
                      {task.status === "IN_PROGRESS"
                        ? "Em andamento"
                        : "Pendente"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Anamneses pendentes</CardTitle>
                <CardDescription>
                  Acompanhamento de pagamentos e alertas
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/anamnesis">
                  <Files className="mr-2 h-4 w-4" />
                  Ver modelos
                </Link>
              </Button>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6">
              {openAnamnesis.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Sem pendências de anamnese.
                </p>
              ) : (
                openAnamnesis.map((response) => (
                  <div
                    key={response.id}
                    className="flex items-start justify-between rounded-xl border border-white/10 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {response.patient.fullName ||
                          response.patient.firstName}
                      </p>
                      <p className="text-xs text-white/50">
                        {response.template.name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        response.paymentStatus === "PAID"
                          ? "success"
                          : response.paymentStatus === "PARTIAL"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {response.paymentStatus === "PAID"
                        ? "Pago"
                        : response.paymentStatus === "PARTIAL"
                          ? "Pago parcial"
                          : "Pagamento pendente"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Agenda do dia
            </CardTitle>
            <CardDescription>
              Resumo rápido das próximas consultas
            </CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6">
            {upcomingAppointments.slice(0, 4).map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-white/10 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">
                    {formatDateTime(appointment.startAt, "dd/MM HH:mm")}
                  </p>
                  <Badge variant="outline">
                    {appointment.status === "SCHEDULED"
                      ? "Confirmado"
                      : appointment.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{appointment.title}</p>
                <p className="text-sm text-white/70">
                  {appointment.patient.fullName || appointment.patient.firstName}
                </p>
              </div>
            ))}
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-slate-500">
                Sem consultas programadas para hoje.
              </p>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock4 className="h-5 w-5 text-primary" />
              Atalhos rápidos
            </CardTitle>
            <CardDescription>Acelere suas rotinas diárias</CardDescription>
          </CardHeader>
          <div className="grid gap-3 px-6 pb-6">
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/patients/new">
                <CheckCircle2 className="mr-3 h-4 w-4" />
                Cadastrar novo paciente
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/finance/new">
                <Clock4 className="mr-3 h-4 w-4" />
                Registrar pagamento
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/anamnesis/new">
                <Files className="mr-3 h-4 w-4" />
                Criar modelo de anamnese
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}


