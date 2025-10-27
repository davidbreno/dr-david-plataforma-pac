import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, "Informe o primeiro nome"),
  lastName: z.string().trim().min(1, "Informe o sobrenome"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value.toLowerCase() : undefined)),
  phone: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "WAITING", "DISCHARGED"]).default("ACTIVE"),
  gender: z.enum(["FEMALE", "MALE", "NON_BINARY", "UNDISCLOSED"]).default("UNDISCLOSED"),
  birthDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? new Date(value).toISOString() : undefined)),
  documentNumber: z.string().trim().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  address: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .partial()
    .optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;
