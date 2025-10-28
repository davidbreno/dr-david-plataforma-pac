"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const implantTypes = [
  { value: "CMI", label: "CMI" },
  { value: "HE", label: "HE" },
  { value: "HI", label: "HI" },
  { value: "TAPA", label: "Tapa implante" },
] as const;

const implantTypeImages: Record<(typeof implantTypes)[number]["value"], string> = {
  CMI: "/images/implantes/cmi.png",
  HE: "/images/implantes/he.png",
  HI: "/images/implantes/hi.png",
  TAPA: "/images/implantes/tapa.png",
};

type ImplantForm = {
  id?: string;
  tipo: string;
  comprimento: string;
  diametro: string;
  quantidade: string;
  marca: string;
};

const emptyForm: ImplantForm = {
  tipo: "CMI",
  comprimento: "",
  diametro: "",
  quantidade: "",
  marca: "",
};

export default function ImplantInventoryPage() {
  const [items, setItems] = useState<ImplantForm[]>([]);
  const [form, setForm] = useState<ImplantForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing items from API
  async function loadItems() {
    try {
      const res = await fetch("/api/inventory/implants", { cache: "no-store" });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Erro ao carregar itens");
        return;
      }
      const data = await res.json();
      setItems(
        (data ?? []).map((d: any) => ({
          id: d.id,
          tipo: d.type,
          comprimento: d.lengthMm != null ? String(d.lengthMm) : "",
          diametro: d.diameterMm != null ? String(d.diameterMm) : "",
          quantidade: d.quantity != null ? String(d.quantity) : "0",
          marca: d.brand ?? "",
        })) as ImplantForm[],
      );
      setError(null);
    } catch {}
  }

  // first load
  useEffect(() => { loadItems(); }, []);

  function handleChange(field: keyof ImplantForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    if (!form.comprimento || !form.diametro || !form.quantidade || !form.marca) {
      setSaving(false);
      return;
    }

    if (editingId) {
      const res = await fetch(`/api/inventory/implants/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.tipo,
          lengthMm: Number(form.comprimento),
          diameterMm: Number(form.diametro),
          quantity: Number(form.quantidade),
          brand: form.marca,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Falha ao salvar");
        setSaving(false);
        return;
      }
    } else {
      const res = await fetch(`/api/inventory/implants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.tipo,
          lengthMm: Number(form.comprimento),
          diameterMm: Number(form.diametro),
          quantity: Number(form.quantidade),
          brand: form.marca,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Falha ao salvar");
        setSaving(false);
        return;
      }
    }

    resetForm();
    await loadItems();
    setSaving(false);
  }

  function handleEdit(id: string) {
    const selected = items.find((item) => item.id === id);
    if (!selected) return;
    setForm(selected);
    setEditingId(id);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/inventory/implants/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Falha ao excluir");
      return;
    }
    if (editingId === id) resetForm();
    await loadItems();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm uppercase tracking-[0.3em] text-[color:rgb(var(--foreground-rgb)/0.7)]">Estoque de implante</CardTitle>
        </CardHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-surface px-5 pb-5 pt-4 shadow-lg"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:rgb(var(--foreground-rgb)/0.7)]">Tipo</label>
            <Select
              value={form.tipo}
              onChange={(event) => handleChange("tipo", event.target.value)}
            >
              {implantTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:rgb(var(--foreground-rgb)/0.7)]">Comprimento (mm)</label>
              <Input
                value={form.comprimento}
                onChange={(event) => handleChange("comprimento", event.target.value)}
                placeholder="Ex: 11"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:rgb(var(--foreground-rgb)/0.7)]">diametro (mm)</label>
              <Input
                value={form.diametro}
                onChange={(event) => handleChange("diametro", event.target.value)}
                placeholder="Ex: 3.75"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:rgb(var(--foreground-rgb)/0.7)]">Quantidade</label>
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
              <label className="text-sm font-medium text-[color:rgb(var(--foreground-rgb)/0.7)]">Marca</label>
              <Input
                value={form.marca}
                onChange={(event) => handleChange("marca", event.target.value)}
                placeholder="Ex: Neodent"
                required
              />
            </div>
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

      <Card className="h-fit border-none bg-transparent shadow-none">
        {error ? (
          <div className="mb-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {items.length === 0 ? (
            <p className="rounded-2xl border border-[var(--border)] bg-surface px-5 py-3 text-sm text-[color:rgb(var(--foreground-rgb)/0.6)]">
              Nenhum implante registrado ainda. Adicione seu primeiro item ao lado.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-surface-muted px-3 py-2 shadow-md"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex flex-col gap-1.5 text-sm text-[var(--foreground)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                        {item.tipo}
                      </span>
                      <span className="text-[color:rgb(var(--foreground-rgb)/0.7)]">
                        {item.comprimento} mm x {item.diametro} mm
                      </span>
                    </div>
                    <div className="rounded-lg bg-white/5 px-3 py-1 text-xs text-[color:rgb(var(--foreground-rgb)/0.6)]">
                      Quantidade: {item.quantidade} &nbsp; Marca: {item.marca}
                    </div>
                  </div>

                  {implantTypeImages[item.tipo as keyof typeof implantTypeImages] ? (
                    <Image
                      src={implantTypeImages[item.tipo as keyof typeof implantTypeImages]}
                      alt={`Imagem do implante ${item.tipo}`}
                      width={48}
                      height={48}
                      className="h-13 w-13 flex-shrink-0 object-contain"
                    />
                  ) : null}
                </div>

                <div className="flex gap-2 text-sm">
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


















