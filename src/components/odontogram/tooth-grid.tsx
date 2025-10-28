"use client";

import { cn } from "@/lib/utils";

type ToothStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "NOTE";

type ToothGridProps = {
  teeth?: Record<string, { status: ToothStatus; annotations?: string }>;
  onSelect?: (toothNumber: string) => void;
  selectedTooth?: string | null;
};

const PERMANENT_TEETH: string[][] = [
  ["18", "17", "16", "15", "14", "13", "12", "11"],
  ["21", "22", "23", "24", "25", "26", "27", "28"],
  ["48", "47", "46", "45", "44", "43", "42", "41"],
  ["31", "32", "33", "34", "35", "36", "37", "38"],
];

export function ToothGrid({ teeth = {}, onSelect, selectedTooth }: ToothGridProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-3">
      {PERMANENT_TEETH.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center gap-2">
          {row.map((toothNumber) => {
            const state = teeth[toothNumber];
            const status = state?.status ?? "OPEN";

            return (
              <button
                key={toothNumber}
                type="button"
                onClick={() => onSelect?.(toothNumber)}
                className={cn(
                  "flex h-12 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition",
                  selectedTooth === toothNumber && "ring-2 ring-primary",
                  status === "OPEN" && "border-[var(--border)] bg-surface text-[var(--foreground)]",
                  status === "IN_PROGRESS" && "border-warning/60 bg-warning/10 text-warning",
                  status === "COMPLETED" && "border-success/60 bg-success/10 text-success",
                  status === "NOTE" && "border-accent/60 bg-accent/10 text-accent",
                )}
              >
                {toothNumber}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
