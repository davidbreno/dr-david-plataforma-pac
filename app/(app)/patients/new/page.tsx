import { redirect } from "next/navigation";
import { createPatientAction } from "@/lib/actions/patient-actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

async function createPatient(formData: FormData) {
  const result = await createPatientAction(formData);
  redirect(`/patients/${result.patientId}`);
}

export default function NewPatientPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Novo paciente
        </h1>
        <p className="text-sm text-slate-500">
          Preencha os dados cadastrais para iniciar o histórico clínico.
        </p>
      </div>

      <form action={async (formData) => { "use server"; const result = await createPatientAction(formData); redirect(`/patients/${result.patientId}`); }} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados principais</CardTitle>
            <CardDescription>
              Informações básicas sobre o paciente.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="firstName">
                Nome
              </label>
              <Input id="firstName" name="firstName" required placeholder="Ana" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="lastName">
                Sobrenome
              </label>
              <Input id="lastName" name="lastName" required placeholder="Souza" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                E-mail
              </label>
              <Input id="email" name="email" type="email" placeholder="ana@exemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="phone">
                Telefone / WhatsApp
              </label>
              <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="birthDate">
                Data de nascimento
              </label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="gender">
                Gênero
              </label>
              <Select id="gender" name="gender" defaultValue="UNDISCLOSED">
                <option value="UNDISCLOSED">Prefiro não informar</option>
                <option value="FEMALE">Feminino</option>
                <option value="MALE">Masculino</option>
                <option value="NON_BINARY">Não binário</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="status">
                Status
              </label>
              <Select id="status" name="status" defaultValue="ACTIVE">
                <option value="ACTIVE">Ativo</option>
                <option value="WAITING">Lista de espera</option>
                <option value="DISCHARGED">Alta</option>
                <option value="INACTIVE">Inativo</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="documentNumber">
                CPF / Documento
              </label>
              <Input id="documentNumber" name="documentNumber" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="notes">
                Observações iniciais
              </label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Anote informações relevantes, alergias relatadas ou plano odontológico."
              />
            </div>
          </div>
        </Card>

        <Button type="submit" className="h-12 rounded-xl px-10 text-base">
          Salvar paciente
        </Button>
      </form>
    </div>
  );
}
