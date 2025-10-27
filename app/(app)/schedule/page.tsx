import { addDays, eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

async function getWeekAppointments(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 0 });
  const end = endOfWeek(baseDate, { weekStartsOn: 0 });

  const appointments = await prisma.appointment.findMany({
    where: {
      startAt: { gte: start, lte: end },
    },
    orderBy: { startAt: "asc" },
    include: {
      patient: true,
      provider: true,
    },
  });

  const days = eachDayOfInterval({ start, end }).map((date) => ({
    date,
    appointments: [] as typeof appointments,
  }));

  appointments.forEach((appointment) => {
    const dayIndex = Math.floor(
      (appointment.startAt.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days[dayIndex]) {
      days[dayIndex].appointments.push(appointment);
    }
  });

  return { start, end, days };
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const baseDate = searchParams.week
    ? new Date(searchParams.week)
    : new Date();

  const { start, end, days } = await getWeekAppointments(baseDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agenda semanal</h1>
          <p className="text-sm text-slate-500">
            Visualize sessões por dia e gerencie rapidamente confirmações e pagamentos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="secondary">
            <Link href={`/schedule?week=${format(addDays(start, -7), "yyyy-MM-dd")}`}>
              Semana anterior
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/schedule?week=${format(addDays(start, 7), "yyyy-MM-dd")}`}>
              Próxima semana
            </Link>
          </Button>
          <Button asChild>
            <Link href="/schedule/new">Agendar sessão</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semana {format(start, "dd/MM")} - {format(end, "dd/MM")}</CardTitle>
          <CardDescription>
            Clique em uma sessão para visualizar detalhes e atualizar status.
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6 lg:grid-cols-7">
          {days.map((day) => (
            <div key={day.date.toISOString()} className="rounded-2xl border border-white/10 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  {format(day.date, "EEE")}
                </p>
                <span className="text-xs text-slate-500">
                  {format(day.date, "dd/MM")}
                </span>
              </div>
              <div className="mt-3 space-y-3">
                {day.appointments.length === 0 ? (
                  <p className="text-xs text-slate-400">Sem sessões</p>
                ) : (
                  day.appointments.map((appointment) => (
                    <Link
                      key={appointment.id}
                      href={`/patients/${appointment.patientId}`}
                      className="block rounded-xl border border-white/15 bg-surface-muted px-3 py-2 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <p className="text-xs font-semibold text-slate-700">
                        {formatDateTime(appointment.startAt, "HH:mm")} • {appointment.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appointment.patient.fullName ||
                          `${appointment.patient.firstName} ${appointment.patient.lastName}`}
                      </p>
                      <Badge
                        variant={
                          appointment.paymentStatus === "PAID"
                            ? "success"
                            : appointment.paymentStatus === "PARTIAL"
                              ? "warning"
                              : "danger"
                        }
                        className="mt-1"
                      >
                        {appointment.paymentStatus === "PAID"
                          ? "Pago"
                          : appointment.paymentStatus === "PARTIAL"
                            ? "Parcial"
                            : "Pendente"}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

