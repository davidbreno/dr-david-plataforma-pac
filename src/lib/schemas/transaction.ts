import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().optional().or(z.literal("")),
  appointmentId: z.string().optional().or(z.literal("")),
  type: z.enum(["INCOME", "EXPENSE"]),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  category: z.string().trim().min(1, "Informe a categoria"),
  description: z.string().optional().or(z.literal("")),
  amount: z
    .string({ required_error: "Informe o valor" })
    .or(z.number())
    .transform((value) => Number(value)),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? new Date(value).toISOString() : undefined)),
  paidAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? new Date(value).toISOString() : undefined)),
  notes: z.string().optional().or(z.literal("")),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
