import { z } from "zod";

export const anamnesisQuestionSchema = z.object({
  question: z.string().trim().min(3),
  type: z.enum(["TEXT", "BOOLEAN", "MULTIPLE_CHOICE", "NUMBER"]),
  helperText: z.string().optional().or(z.literal("")),
  alertLabel: z.string().optional().or(z.literal("")),
  alertLevel: z.enum(["NONE", "INFO", "WARNING", "CRITICAL"]).default("NONE"),
  order: z.number().optional(),
  isRequired: z.boolean().optional().default(false),
  options: z.array(z.string()).optional(),
});

export const anamnesisTemplateSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  isDefault: z.boolean().optional().default(false),
  questions: z.array(anamnesisQuestionSchema).min(1),
});

export const anamnesisResponseSchema = z.object({
  templateId: z.string(),
  patientId: z.string(),
  appointmentId: z.string().optional().or(z.literal("")),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIAL"]).default("UNPAID"),
  amountDue: z
    .string()
    .or(z.number())
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  amountPaid: z
    .string()
    .or(z.number())
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  notes: z.string().optional().or(z.literal("")),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        valueText: z.string().optional().or(z.literal("")),
        valueBoolean: z.boolean().optional(),
        valueNumber: z
          .string()
          .or(z.number())
          .optional()
          .transform((value) => (value ? Number(value) : undefined)),
        valueOptions: z.array(z.string()).optional(),
      }),
    )
    .min(1),
});

export type AnamnesisTemplateSchema = z.infer<typeof anamnesisTemplateSchema>;
export type AnamnesisResponseSchema = z.infer<typeof anamnesisResponseSchema>;
