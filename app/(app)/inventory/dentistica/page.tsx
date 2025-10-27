"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RestorativeItem = {
  id?: string;
  nome: string;
  quantidade: string;
  cor: string;
  observacoes: string;
};

const emptyRestorative: RestorativeItem = {
  nome: "",
  quantidade: "",
  cor: "",
  observacoes: "",
};

export default function RestorativeInventoryPage() {
  const [items, setItems] = useState<RestorativeItem[]>([]);
  const [form, setForm] = useState<RestorativeItem>(emptyRestorative);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleChange(field: keyof RestorativeItem, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyRestorative);
    setEditingId(null);
  }

  async function loadItems() {
    try {
      const res = await fetch("/api/inventory/restorative", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(
        (data ?? []).map((d: any) => ({ id: d.id, nome: d.name, quantidade: String(d.quantity), cor: d.color ?? "", observacoes: d.notes ?? "" })) as RestorativeItem[],
      );
    } catch {}
  }

  useEffect(() => { loadItems(); }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nome || !form.quantidade) {
      return;
    }

    if (editingId) {
      await fetch(`/api/inventory/restorative/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.nome, quantity: Number(form.quantidade), color: form.cor, notes: form.observacoes }),
      });
    } else {
      await fetch(`/api/inventory/restorative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.nome, quantity: Number(form.quantidade), color: form.cor, notes: form.observacoes }),
      });
    }

    resetForm();
    await loadItems();
  }

  function handleEdit(id: string) {
    const selected = items.find((item) => item.id === id);
    if (!selected) return;
    setForm(selected);
    setEditingId(id);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/inventory/restorative/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await loadItems();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Materiais de dentistica</CardTitle>
          <CardDescription className="text-white/60">
            Controle resinas, adesivos e outros materiais restauradores.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Nome do material</label>
            <Input
              value={form.nome}
              onChange={(event) => handleChange("nome", event.target.value)}
              placeholder="Ex: Resina A2"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Quantidade</label>
              <Input
                type="number"
                min="0"
                value={form.quantidade}
                onChange={(event) => handleChange("quantidade", event.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Cor / Lote</label>
              <Input
                value={form.cor}
                onChange={(event) => handleChange("cor", event.target.value)}
                placeholder="Ex: A2, B1, 3M"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Observacoes</label>
            <Textarea
              rows={3}
              value={form.observacoes}
              onChange={(event) => handleChange("observacoes", event.target.value)}
              placeholder="Validade, uso clinico, reposicao prevista, etc."
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1">
              {editingId ? "Salvar alteracoes" : "Adicionar ao estoque"}
            </Button>
            {editingId ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Itens cadastrados</CardTitle>
          <CardDescription className="text-white/60">
            Atualize ou remova materiais conforme o consumo.
          </CardDescription>
        </CardHeader>
        <div className="space-y-3 px-6 pb-6">
          {items.length === 0 ? (
            <p className="text-sm text-white/50">Nenhum material registrado no momento.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1f1f1f] p-4 shadow-inner shadow-black/30"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">{item.nome}</span>
                  <span className="text-xs text-white/60">Quantidade: {item.quantidade}</span>
                  {item.cor ? (
                    <span className="text-xs text-white/60">Cor/Lote: {item.cor}</span>
                  ) : null}
                </div>
                {item.observacoes ? (
                  <p className="text-xs text-white/60">{item.observacoes}</p>
                ) : null}
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => handleEdit(item.id!)}>
                    Editar
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => handleDelete(item.id!)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}


