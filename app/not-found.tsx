import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Página não encontrada
      </h1>
      <p className="max-w-md text-sm text-[color:rgb(var(--foreground-rgb)/0.65)]">
        O endereço acessado não existe ou foi movido. Escolha outra opção no menu ou volte para o início.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-md transition hover:bg-primary/90"
      >
        Voltar para início
      </Link>
    </div>
  );
}
