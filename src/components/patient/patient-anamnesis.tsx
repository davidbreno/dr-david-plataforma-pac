"use client";

import { useState, useTransition } from "react";
import { ToothGrid } from "@/components/odontogram/tooth-grid";
import { ToothEditor } from "@/components/odontogram/tooth-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createOrUpdateOdontogram } from "@/lib/actions/odontogram-actions";

type ToothStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "NOTE";

type ToothState = {
  status: ToothStatus;
  annotations?: string;
};

type PatientAnamnesisProps = {
  patientId: string;
  responseSetId?: string;
  odontogram?: {
    chartType: "PERMANENT" | "DECIDUOUS";
    entries: Array<{ toothNumber: string; status: ToothStatus; annotations?: string }>;
    notes?: string;
    status?: "OPEN" | "FINALIZED";
  };
};

export function PatientAnamnesis({ patientId, responseSetId, odontogram }: PatientAnamnesisProps) {
  const [pending, startTransition] = useTransition();
  const [chartType, setChartType] = useState<"PERMANENT" | "DECIDUOUS">(
    odontogram?.chartType ?? "PERMANENT",
  );
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [teeth, setTeeth] = useState<Record<string, ToothState>>(() => {
    const base: Record<string, ToothState> = {};
    odontogram?.entries.forEach((entry) => {
      base[entry.toothNumber] = {
        status: entry.status,
        annotations: entry.annotations,
      };
    });
    return base;
  });

  function handleSaveTooth({ annotations, status }: { annotations: string; status: ToothStatus }) {
    if (!selectedTooth) return;
    setTeeth((prev) => ({
      ...prev,
      [selectedTooth]: { annotations, status },
    }));
  }

  function handleRemoveTooth() {
    if (!selectedTooth) return;
    setTeeth((prev) => {
      const updated = { ...prev };
      delete updated[selectedTooth];
      return updated;
    });
    setSelectedTooth(null);
  }

  function handleSubmit(status: "OPEN" | "FINALIZED") {
    const payloadEntries = Object.entries(teeth).map(([toothNumber, value]) => ({
      toothNumber,
      annotations: value.annotations,
      status: value.status,
    }));

    startTransition(async () => {
      await createOrUpdateOdontogram({
        patientId,
        responseSetId,
        chartType,
        entries: payloadEntries,
        status,
      });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={chartType === "PERMANENT" ? "primary" : "outline"}
          onClick={() => setChartType("PERMANENT")}
        >
          Permanentes
        </Button>
        <Button
          type="button"
          variant={chartType === "DECIDUOUS" ? "primary" : "outline"}
          onClick={() => setChartType("DECIDUOUS")}
        >
          Decíduos
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_auto]">
        <ToothGrid
          teeth={teeth}
          selectedTooth={selectedTooth}
          onSelect={setSelectedTooth}
        />
        <ToothEditor
          toothNumber={selectedTooth}
          initialAnnotations={selectedTooth ? teeth[selectedTooth]?.annotations : ""}
          initialStatus={selectedTooth ? teeth[selectedTooth]?.status ?? "OPEN" : "OPEN"}
          onSave={handleSaveTooth}
          onRemove={handleRemoveTooth}
        />
      </div>

      <Card className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">Salvar anamnese</p>
          <p className="text-xs text-[color:rgb(var(--foreground-rgb)/0.6)]">
            Salve como rascunho (Aberto) ou finalize para consolidar o registro clínico.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => handleSubmit("OPEN")}
          >
            Salvar como aberto
          </Button>
          <Button type="button" disabled={pending} onClick={() => handleSubmit("FINALIZED")}>
            Finalizar
          </Button>
        </div>
      </Card>
    </div>
  );
}
