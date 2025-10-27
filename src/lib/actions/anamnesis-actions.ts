"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  anamnesisTemplateSchema,
  anamnesisResponseSchema,
} from "@/lib/schemas/anamnesis";
import { getCurrentUser } from "@/lib/auth/session";

export async function createAnamnesisTemplateAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Nao autorizado");
  }

  const rawQuestions = formData.get("questions");
  const questions = rawQuestions ? JSON.parse(String(rawQuestions)) : [];

  const payload = anamnesisTemplateSchema.parse({
    name: formData.get("name")?.toString(),
    description: formData.get("description")?.toString(),
    category: formData.get("category")?.toString(),
    isDefault: formData.get("isDefault") === "true",
    questions,
  });

  const template = await prisma.anamnesisTemplate.create({
    data: {
      name: payload.name,
      description: payload.description,
      category: payload.category,
      isDefault: payload.isDefault,
      questions: {
        create: payload.questions.map((question, index) => ({
          question: question.question,
          type: question.type,
          helperText: question.helperText,
          alertLabel: question.alertLabel,
          alertLevel: question.alertLevel,
          order: question.order ?? index,
          isRequired: question.isRequired ?? false,
          options: question.options ? { values: question.options } : undefined,
        })),
      },
    },
  });

  revalidatePath("/anamnesis");
  return { success: true, templateId: template.id };
}

export async function recordAnamnesisResponseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Nao autorizado");
  }

  const answersRaw = formData.get("answers");
  const answers = answersRaw ? JSON.parse(String(answersRaw)) : [];

  const payload = anamnesisResponseSchema.parse({
    templateId: formData.get("templateId")?.toString(),
    patientId: formData.get("patientId")?.toString(),
    appointmentId: formData.get("appointmentId")?.toString(),
    paymentStatus: formData.get("paymentStatus")?.toString(),
    amountDue: formData.get("amountDue")?.toString(),
    amountPaid: formData.get("amountPaid")?.toString(),
    notes: formData.get("notes")?.toString(),
    answers,
  });

  const response = await prisma.$transaction(async (tx) => {
    const responseSet = await tx.anamnesisResponseSet.create({
      data: {
        templateId: payload.templateId,
        patientId: payload.patientId,
        appointmentId: payload.appointmentId || undefined,
        filledById: user.id,
        paymentStatus: payload.paymentStatus,
        amountDue: payload.amountDue != null ? payload.amountDue : undefined,
        amountPaid: payload.amountPaid != null ? payload.amountPaid : undefined,
        notes: payload.notes,
      },
    });

    await tx.anamnesisAnswer.createMany({
      data: payload.answers.map((answer) => ({
        questionId: answer.questionId,
        responseSetId: responseSet.id,
        valueText: answer.valueText,
        valueBoolean: answer.valueBoolean ?? null,
        valueNumber:
          answer.valueNumber != null ? new Prisma.Decimal(answer.valueNumber) : null,
        valueOptions: answer.valueOptions ? { values: answer.valueOptions } : undefined,
      })),
    });

    return responseSet;
  });

  revalidatePath(`/patients/${payload.patientId}`);
  revalidatePath("/dashboard");

  return { success: true, responseId: response.id };
}
