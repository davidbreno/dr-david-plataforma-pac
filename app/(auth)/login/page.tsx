import type { Metadata } from "next";
import { Suspense } from "react";
import { Check, ShieldPlus } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

const benefits = [
  "Painel com proximos atendimentos e indicadores em tempo real",
  "Cadastro completo de pacientes, anamnese e anexos",
  "Controle financeiro e relatorios em um unico lugar",
];

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o painel da sua clinica odontologica",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl backdrop-blur">
      <div
        className="hidden w-1/2 flex-col justify-between p-10 text-white lg:flex"
        style={{
          background: "linear-gradient(150deg, var(--background-muted) 0%, var(--surface-contrast) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <ShieldPlus className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              Dr. David Breno
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Atendimento moderno e organizado
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white">
            Gestao inteligente para profissionais de odontologia
          </h3>
          <ul className="space-y-3 text-sm text-white/75">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/15">
                  <Check className="h-4 w-4" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/60">
            Dados protegidos com criptografia e infraestrutura Vercel.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-8 bg-white/95 px-8 py-10 text-white sm:px-12 lg:w-1/2">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-white/60">
            Acompanhe agenda, pacientes e financeiro em um unico painel.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-xs text-white/50">
          Ao continuar voce concorda com os{" "}
          <a href="/terms" className="font-medium text-white hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="/privacy" className="font-medium text-white hover:underline">
            Politica de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
