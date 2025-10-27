import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(date: Date | string, pattern = "dd/MM/yyyy HH:mm") {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return format(parsed, pattern);
}
