"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type BarPoint = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  data: BarPoint[];
  color?: string;
};

export function SimpleBarChart({ data, color = "#2563eb" }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
        <Bar dataKey="value" fill={color} radius={[12, 12, 12, 12]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
