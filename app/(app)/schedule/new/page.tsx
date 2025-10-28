import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { upsertAppointmentAction } from "@/lib/actions/appointment-actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: { patientId?: string };
}) {
  const [patients, professionals] = await Promise.all([
    prisma.patient.findMany({ orderBy: { fullName: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Agendar sessão</h1>
        <p className="text-sm text-[color:rgb(var(--foreground-rgb)/0.6)]">
          Defina paciente, profissional e condições do atendimento.
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await upsertAppointmentAction(formData);
          redirect(/patients/);
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações da sessão</CardTitle>
            <CardDescription>Preencha os campos obrigatórios</CardDescription>
          </CardHeader>
          <div className="grid gap-3 px-6 pb-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Paciente</label>
                <Select name="patientId" defaultValue={searchParams.patientId ?? ""} required>
                  <option value="" disabled>
                    Selecione o paciente
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName || ${patient.firstName} }
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Profissional</label>
                <Select name="providerId" required>
                  <option value="" disabled>
                    Selecione o profissional
                  </option>
                  {professionals.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Título</label>
              <Input name="title" required placeholder="Consulta, profilaxia, procedimento" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Início</label>
                <Input name="startAt" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Término</label>
                <Input name="endAt" type="datetime-local" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Valor (R$)</label>
              <Input name="fee" type="number" step="0.01" placeholder="200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Observações</label>
              <Textarea name="description" rows={4} placeholder="Detalhes adicionais" />
            </div>
          </div>
        </Card>

        <Button type="submit" className="h-12 rounded-xl px-10 text-base">
          Salvar sessão
        </Button>
      </form>
    </div>
  );
}


