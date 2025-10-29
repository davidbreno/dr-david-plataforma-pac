import { prisma } from "@/lib/prisma";
import { upsertTransactionAction } from "@/lib/actions/transaction-actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

async function getFinanceData() {
  const transactions = await prisma.financialTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      patient: true,
      appointment: true,
    },
    take: 50,
  });

  const totalIncome = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);
  const pending = transactions.filter((tx) => tx.status !== "PAID").length;

  return { transactions, totalIncome, totalExpense, pending };
}

async function createTransaction(formData: FormData) {
  await upsertTransactionAction(formData);
}

export default async function FinancePage() {
  const { transactions, totalIncome, totalExpense, pending } = await getFinanceData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Financeiro</h1>
        <p className="text-sm text-slate-500">
          Controle recebimentos, despesas, convênios e repasses.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Receitas</CardTitle>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalIncome)}</p>
            <CardDescription>Valores creditados</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Despesas</CardTitle>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalExpense)}</p>
            <CardDescription>Pagamentos efetuados</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Pendências</CardTitle>
            <p className="text-2xl font-semibold text-slate-900">{pending}</p>
            <CardDescription>Lançamentos aguardando pagamento</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,380px]">
        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>Últimas transações financeiras registradas</CardDescription>
          </CardHeader>
          <div className="overflow-hidden px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Categoria</th>
                    <th className="px-4 py-2">Valor</th>
                    <th className="px-4 py-2">Paciente</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                        Nenhum lançamento cadastrado.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-muted/50">
                        <td className="px-4 py-3">{formatDateTime(tx.createdAt, "dd/MM/yyyy")}</td>
                        <td className="px-4 py-3">{tx.category}</td>
                        <td
                          className="px-4 py-3 font-semibold"
                          data-transaction-type={tx.type}
                        >
                          {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(Number(tx.amount))}
                        </td>
                        <td className="px-4 py-3">
                          {tx.patient
                            ? tx.patient.fullName ||
                              `${tx.patient.firstName} ${tx.patient.lastName}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              tx.status === "PAID"
                                ? "success"
                                : tx.status === "OVERDUE"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {tx.status === "PAID"
                              ? "Pago"
                              : tx.status === "OVERDUE"
                                ? "Em atraso"
                                : "Pendente"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novo lançamento</CardTitle>
            <CardDescription>Registre contas a receber, convênios e despesas.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <form action={async (formData) => { "use server"; await upsertTransactionAction(formData); }} className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tipo
                </label>
                <Select name="type" defaultValue="INCOME">
                  <option value="INCOME">Receita</option>
                  <option value="EXPENSE">Despesa</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <Select name="status" defaultValue="PENDING">
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                  <option value="OVERDUE">Em atraso</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Categoria
                </label>
                <Input name="category" required placeholder="Consulta, Orto, Convênio..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Valor (R$)
                </label>
                <Input name="amount" type="number" step="0.01" required placeholder="250,00" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paciente
                </label>
                <Input
                  name="patientId"
                  placeholder="ID do paciente (opcional)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Observações
                </label>
                <Textarea name="notes" rows={3} placeholder="Detalhes adicionais" />
              </div>
              <Button type="submit" className="w-full">
                Registrar lançamento
              </Button>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}
