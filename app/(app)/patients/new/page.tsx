import { redirect } from "next/navigation";
import { createPatientAction } from "@/lib/actions/patient-actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

function resolveError(code?: string) {
  switch (code) {
    case "EMAIL_ALREADY_EXISTS":
      return "Já existe um paciente cadastrado com este e-mail.";
    default:
      return undefined;
  }
}

export default function NewPatientPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = resolveError(searchParams.error);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Novo paciente</h1>
        <p className="text-sm text-[color:rgb(var(--foreground-rgb)/0.6)]">
          Preencha os dados cadastrais para iniciar o histórico clínico.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <form
        action={async (formData) => {
          "use server";
          const result = await createPatientAction(formData);
          if (!result.success) {
            redirect(/patients/new?error=);
          }
          redirect(/patients/);
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Dados principais</CardTitle>
            <CardDescription>Informações básicas sobre o paciente.</CardDescription>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="firstName">
                Nome
              </label>
              <Input id="firstName" name="firstName" required placeholder="Ana" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="lastName">
                Sobrenome
              </label>
              <Input id="lastName" name="lastName" required placeholder="Souza" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
                E-mail
              </label>
              <Input id="email" name="email" type="email" placeholder="ana@exemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="phone">
                Telefone / WhatsApp
              </label>
              <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="birthDate">
                Data de nascimento
              </label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="gender">
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
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="status">
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
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="documentNumber">
                CPF / Documento
              </label>
              <Input id="documentNumber" name="documentNumber" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="notes">
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
