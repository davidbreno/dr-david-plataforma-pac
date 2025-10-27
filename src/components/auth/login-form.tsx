"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      const response = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      router.push(callbackUrl);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4"
    >
      {error ? (
        <div className={cn("flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger")}>
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-600">
          E-mail profissional
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="contato@drdavidbreno.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-600">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <a className="font-medium text-primary hover:underline" href="/reset-password">
          Esqueci minha senha
        </a>
        <a className="font-medium text-primary hover:underline" href="/register">
          Criar conta
        </a>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 text-base"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Entrando...
          </span>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
