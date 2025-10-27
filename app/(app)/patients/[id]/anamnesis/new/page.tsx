import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { recordAnamnesisResponseAction } from "@/lib/actions/anamnesis-actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AnamnesisQuestionList } from "@/components/anamnesis/anamnesis-question-list";

type PageProps = {
  params: { id: string };
  searchParams: { templateId?: string; notes?: string };
};

async function submitAnamnesis(formData: FormData) {
  const result = await recordAnamnesisResponseAction(formData);
  redirect(`/patients/${formData.get("patientId")?.toString() ?? ""}?anamnesis=${result.responseId}`);
}

export default async function NewAnamnesisPage({ params, searchParams }: PageProps) {
  const templateId = searchParams.templateId;
  if (!templateId) {
    redirect(`/patients/${params.id}`);
  }

  const [patient, template, appointments] = await Promise.all([
    prisma.patient.findUnique({ where: { id: params.id } }),
    prisma.anamnesisTemplate.findUnique({
      where: { id: templateId },
      include: { questions: { orderBy: { order: "asc" } } },
    }),
    prisma.appointment.findMany({
      where: { patientId: params.id },
      orderBy: { startAt: "desc" },
      take: 10,
    }),
  ]);

  if (!patient || !template) {
    notFound();
  }

  const questions = template.questions.map((question) => {
    let options: string[] | undefined;
    if (Array.isArray(question.options)) {
      options = question.options.filter((value): value is string => typeof value === "string");
    } else if (
      question.options &&
      typeof question.options === "object" &&
      "values" in question.options
    ) {
      const raw = (question.options as { values?: unknown }).values;
      if (Array.isArray(raw)) {
        options = raw.filter((value): value is string => typeof value === "string");
      }
    }

    return {
      id: question.id,
      question: question.question,
      type: question.type,
      helperText: question.helperText,
      options,
    };
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Anamnese odontológica
        </h1>
        <p className="text-sm text-slate-500">
          Paciente: {patient.fullName || `${patient.firstName} ${patient.lastName}`} • Modelo:{" "}
          {template.name}
        </p>
      </div>

      <form action={async (formData) => { "use server"; const result = await recordAnamnesisResponseAction(formData); redirect(`/patients/${formData.get("patientId")?.toString() ?? ""}?anamnesis=${result.responseId}`); }} className="space-y-6">
        <input type="hidden" name="patientId" value={patient.id} />
        <input type="hidden" name="templateId" value={template.id} />

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da sessão</CardTitle>
            <CardDescription>
              Vincule a uma consulta e defina o status de pagamento desta anamnese.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Consulta relacionada</label>
              <Select name="appointmentId" defaultValue="">
                <option value="">Não vincular</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.title} • {new Date(appointment.startAt).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Pagamento</label>
              <Select name="paymentStatus" defaultValue="UNPAID">
                <option value="PAID">Pago</option>
                <option value="PARTIAL">Pago parcial</option>
                <option value="UNPAID">Pagamento pendente</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Valor da anamnese (R$)</label>
              <Input name="amountDue" type="number" step="0.01" placeholder="150,00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Valor pago (R$)</label>
              <Input name="amountPaid" type="number" step="0.01" placeholder="150,00" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Observações</label>
              <Textarea
                name="notes"
                rows={3}
                placeholder="Anote medicamentos utilizados, alertas observados ou recomendações."
                defaultValue={searchParams.notes ?? ""}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas do modelo</CardTitle>
            <CardDescription>
              Responda cada pergunta para armazenar no prontuário odontológico.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <AnamnesisQuestionList questions={questions} />
          </div>
        </Card>

        <Button type="submit" className="h-12 rounded-xl px-10 text-base">
          Salvar anamnese
        </Button>
      </form>
    </div>
  );
}
