import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldPlus } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o painel da sua clínica odontológica",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl rounded-3xl border border-white/10 bg-[#151515]/90 shadow-2xl backdrop-blur">
      <div className="hidden w-1/2 flex-col justify-between rounded-l-3xl bg-gradient-to-br from-[#0d0d0d] via-[#161616] to-[#212121] p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
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
            Gestão inteligente para profissionais de odontologia
          </h3>
          <ul className="space-y-3 text-sm text-white/75">
            <li>• Painel completo com próximas consultas e indicadores</li>
            <li>• Cadastre pacientes, anamnese odontológica e anexos</li>
            <li>• Controle financeiro e relatórios em tempo real</li>
          </ul>
          <p className="text-xs text-white/60">
            Dados protegidos com criptografia e infraestrutura Vercel.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-8 rounded-3xl bg-[#151515]/90 px-8 py-10 text-white sm:px-12 lg:w-1/2">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-white/60">
            Acesse seu painel e acompanhe pacientes, agenda e financeiro em um só lugar.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-xs text-white/50">
          Ao continuar você concorda com os{" "}
          <a href="/terms" className="font-medium text-white hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="/privacy" className="font-medium text-white hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
