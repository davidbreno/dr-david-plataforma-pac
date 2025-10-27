import { z } from "zod";

export const appointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string({ required_error: "Selecione um paciente" }),
  providerId: z.string({ required_error: "Selecione um profissional" }),
  title: z.string().trim().min(1, "Informe o título da sessão"),
  description: z.string().optional().or(z.literal("")),
  status: z
    .enum(["SCHEDULED", "COMPLETED", "CANCELLED", "MISSED"])
    .default("SCHEDULED"),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIAL"]).default("UNPAID"),
  fee: z
    .string()
    .or(z.number())
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  paidAmount: z
    .string()
    .or(z.number())
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  startAt: z
    .string({ required_error: "Informe data e horário" })
    .transform((value) => new Date(value).toISOString()),
  endAt: z
    .string({ required_error: "Informe o término" })
    .transform((value) => new Date(value).toISOString()),
  location: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
