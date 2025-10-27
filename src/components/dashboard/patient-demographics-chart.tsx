"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type DemographicSlice = {
  label: string;
  value: number;
  color: string;
};

type PatientDemographicsChartProps = {
  data: DemographicSlice[];
};

const defaultColors = ["#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#7c3aed", "#0ea5e9"];

export function PatientDemographicsChart({ data }: PatientDemographicsChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color ?? defaultColors[index % defaultColors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={60} outerRadius={90}>
          {chartData.map((entry, index) => (
            <Cell key={`slice-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name) => [value, name]}
          contentStyle={{ borderRadius: 16, borderColor: "#cbd5f5", background: "white" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
