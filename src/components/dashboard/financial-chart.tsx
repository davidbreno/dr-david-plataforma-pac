"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export type FinancialPoint = {
  label: string;
  income: number;
  expense: number;
};

type DashboardFinancialChartProps = {
  data: FinancialPoint[];
};

export function DashboardFinancialChart({ data }: DashboardFinancialChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: 8, right: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickFormatter={(value) => formatCurrency(Number(value)).replace("R$", "")}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
          formatter={(value: number, name) => [formatCurrency(value), name === "income" ? "Receitas" : "Despesas"]}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#16a34a"
          fillOpacity={1}
          fill="url(#income)"
          name="Receitas"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#expense)"
          name="Despesas"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
