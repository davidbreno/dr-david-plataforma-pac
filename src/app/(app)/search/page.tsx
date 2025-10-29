import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { term?: string };
}) {
  const term = searchParams.term?.trim();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Busca</CardTitle>
          <CardDescription>
            Esta seção estará disponível em breve. Enquanto isso, utilize o menu
            lateral para navegar entre os módulos.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          {term ? (
            <p className="text-sm text-[color:rgb(var(--foreground-rgb)/0.65)]">
              Último termo pesquisado: <span className="font-semibold">{term}</span>
            </p>
          ) : (
            <p className="text-sm text-[color:rgb(var(--foreground-rgb)/0.65)]">
              Digite algo na barra superior para iniciar uma pesquisa.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
