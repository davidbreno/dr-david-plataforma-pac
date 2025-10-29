import { notFound } from "next/navigation";
// import { format } from "date-fns"; // Não utilizado
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadAttachmentAction, deleteAttachmentAction } from "@/lib/actions/upload-actions";
import { PatientAnamnesis } from "@/components/patient/patient-anamnesis";
import { getLatestOdontogram } from "@/lib/actions/odontogram-actions";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // Não utilizado
// import { Select } from "@/components/ui/select"; // Não utilizado

const statusLabel: Record<string, string> = {
  ACTIVE: "Ativo",
  WAITING: "Lista de espera",
  DISCHARGED: "Alta",
  INACTIVE: "Inativo",
};

const statusVariant: Record<string, "success" | "warning" | "danger" | "outline"> = {
  ACTIVE: "success",
  WAITING: "warning",
  DISCHARGED: "outline",
  INACTIVE: "outline",
};

async function getPatient(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { startAt: "desc" },
        take: 10,
        include: {
          provider: true,
        },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
      finances: {
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      anamnesisSets: {
        orderBy: { filledAt: "desc" },
        include: {
          template: true,
        },
      },
    },
  });
}

async function deleteAttachment(formData: FormData) {
  "use server";
  const attachmentId = formData.get("attachmentId")?.toString();
  const patientId = formData.get("patientId")?.toString();
  if (!attachmentId || !patientId) return;
  await deleteAttachmentAction(attachmentId, patientId);
}

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params?.id) {
    notFound();
  }

  const patient = await getPatient(params.id);
  if (!patient) {
    notFound();
  }

  const odontogram = await getLatestOdontogram(patient.id);
  // const templates = await prisma.anamnesisTemplate.findMany({
  //   orderBy: { name: "asc" },
  // }); // Não utilizado

  // Tipos para os dados do paciente
  type Appointment = typeof patient.appointments[number];
  type Finance = typeof patient.finances[number];
  type AnamnesisSet = typeof patient.anamnesisSets[number];
  type Attachment = typeof patient.attachments[number];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {patient.fullName || `${patient.firstName} ${patient.lastName}`}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Badge variant={statusVariant[patient.status] ?? "outline"}>
              {statusLabel[patient.status] ?? patient.status}
            </Badge>
            {patient.email ? <span>{patient.email}</span> : null}
            {patient.phone ? <span>{patient.phone}</span> : null}
            {patient.documentNumber ? <span>{patient.documentNumber}</span> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.location.href = `/schedule/new?patientId=${patient.id}`}>
            Agendar consulta
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Histórico clínico</CardTitle>
            <CardDescription>
              Sessões recentes e status de atendimento.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6">
            {patient.appointments.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum atendimento registrado.</p>
            ) : (
              patient.appointments.map((appointment: Appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-white/12 bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800">
                      {formatDateTime(appointment.startAt)}
                    </p>
                    <Badge variant="outline">{appointment.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-700">{appointment.title}</p>
                  <p className="text-xs text-slate-500">
                    Profissional: {appointment.provider?.name ?? "Equipe"}
                  </p>
                  {appointment.fee ? (
                    <p className="text-xs text-slate-500">
                      Valor: {formatCurrency(Number(appointment.fee))}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo financeiro</CardTitle>
            <CardDescription>Lançamentos relacionados ao paciente.</CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6">
            {patient.finances.length === 0 ? (
              <p className="text-sm text-slate-500">Sem lançamentos financeiros.</p>
            ) : (
              patient.finances.map((tx: Finance) => (
                <div
                  key={tx.id}
                  className="rounded-xl border border-white/12 bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800">{tx.category}</p>
                    <Badge variant={tx.type === "INCOME" ? "success" : "danger"}>
                      {tx.type === "INCOME" ? "Receita" : "Despesa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{formatDateTime(tx.createdAt)}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Anamneses</CardTitle>
            <CardDescription>Histórico e status de pagamento.</CardDescription>
          </CardHeader>
          <div className="space-y-3 px-6 pb-6">
            {patient.anamnesisSets.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhuma anamnese resposta foi registrada para este paciente.
              </p>
            ) : (
              patient.anamnesisSets.map((entry: AnamnesisSet) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-xl border border-white/12 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-800">{entry.template.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(entry.filledAt)} • {entry.filledById ? "Equipe" : "Paciente"}
                    </p>
                    {entry.notes ? (
                      <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        entry.paymentStatus === "PAID"
                          ? "success"
                          : entry.paymentStatus === "PARTIAL"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {entry.paymentStatus === "PAID"
                        ? "Pago"
                        : entry.paymentStatus === "PARTIAL"
                          ? "Pago parcial"
                          : "Pendente"}
                    </Badge>
                    {entry.amountDue ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Valor: {formatCurrency(Number(entry.amountDue))}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Card de Nova anamnese removido pois rota não existe */}
        <Card>
          <CardHeader>
            <CardTitle>Anamnese completa</CardTitle>
            <CardDescription>
              Registre observações clínicas detalhadas vinculadas ao odontograma do paciente.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <PatientAnamnesis
              patientId={patient.id}
              responseSetId={odontogram?.responseSetId ?? undefined}
              odontogram={
                odontogram
                  ? {
                      chartType: odontogram.chartType,
                      entries: odontogram.entries.map(
  (entry: typeof odontogram.entries[number]) => ({
    toothNumber: entry.toothNumber,
    status: entry.status,
    annotations: entry.annotations ?? undefined,
  })
),

                    }
                  : undefined
              }
            />
          </div>
        </Card>
        </section>

      <Card>
        <CardHeader>
          <CardTitle>Anexos</CardTitle>
          <CardDescription>Envie exames, radiografias, consentimentos e recibos.</CardDescription>
        </CardHeader>
        <div className="space-y-6 px-6 pb-6">
          <form
            action={async (formData) => {
              "use server";
              await uploadAttachmentAction(formData);
            }}
            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-surface-muted px-4 py-4"
            encType="multipart/form-data"
          >
            <input type="hidden" name="patientId" value={patient.id} />
            <label className="text-sm font-medium text-slate-700">
              Adicionar novo arquivo
            </label>
            <Input name="file" type="file" required />
            <Button type="submit" className="h-10 w-fit px-4">
              Fazer upload
            </Button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patient.attachments.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhum arquivo anexado ainda.
              </p>
            ) : (
              patient.attachments.map((attachment: Attachment) => (
                <div
                  key={attachment.id}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">{attachment.name}</p>
                    <p className="text-xs text-slate-500">
                      {attachment.mimeType} • {formatDateTime(attachment.createdAt)}
                    </p>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-sm font-semibold text-primary hover:underline"
                      title={`Abrir arquivo: ${attachment.name}`}
                    >
                      Abrir arquivo
                    </a>
                  </div>
                  <form action={deleteAttachment} className="mt-4">
                    <input type="hidden" name="attachmentId" value={attachment.id} />
                    <input type="hidden" name="patientId" value={patient.id} />
                    <Button type="submit" className="h-8 px-2 text-xs text-red-600 hover:text-red-800">
                      Remover
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}


