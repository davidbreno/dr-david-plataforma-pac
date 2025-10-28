"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type ToothStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "NOTE";

type ToothEditorProps = {
  toothNumber: string | null;
  initialAnnotations?: string;
  initialStatus?: ToothStatus;
  onSave: (params: { annotations: string; status: ToothStatus }) => void;
  onRemove?: () => void;
  onCancel?: () => void;
};

export function ToothEditor({
  toothNumber,
  initialAnnotations = "",
  initialStatus = "OPEN",
  onSave,
  onRemove,
  onCancel,
}: ToothEditorProps) {
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [status, setStatus] = useState<ToothStatus>(initialStatus);

  if (!toothNumber) {
    return (
      <Card className="w-full max-w-sm border border-dashed border-[var(--border)] bg-surface/60">
        <CardHeader>
          <CardTitle className="text-sm">Selecione um dente</CardTitle>
          <CardDescription>Escolha o dente no odontograma para registrar informações.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-sm">Dente {toothNumber}</CardTitle>
        <CardDescription>Atualize o status clínico e anotações específicas.</CardDescription>
      </CardHeader>
      <div className="space-y-3 px-6 pb-6">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="tooth-status">
            Situação
          </label>
          <Select
            id="tooth-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ToothStatus)}
          >
            <option value="OPEN">Aberto</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Finalizado</option>
            <option value="NOTE">Anotações</option>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="tooth-annotations">
            Anotações
          </label>
          <Textarea
            id="tooth-annotations"
            rows={4}
            value={annotations}
            onChange={(event) => setAnnotations(event.target.value)}
            placeholder="Observações clínicas, plano de tratamento, recomendações..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={() => onSave({ annotations, status })}
          >
            Salvar
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
          {onRemove ? (
            <Button type="button" variant="destructive" onClick={onRemove}>
              Excluir
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
