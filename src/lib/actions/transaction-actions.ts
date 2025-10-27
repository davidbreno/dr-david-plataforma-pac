"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/schemas/transaction";
import { getCurrentUser } from "@/lib/auth/session";

function extractTransactionPayload(formData: FormData) {
  const parsed = transactionSchema.parse({
    id: formData.get("id")?.toString(),
    patientId: formData.get("patientId")?.toString(),
    appointmentId: formData.get("appointmentId")?.toString(),
    type: formData.get("type")?.toString(),
    status: formData.get("status")?.toString(),
    category: formData.get("category")?.toString(),
    description: formData.get("description")?.toString(),
    amount: formData.get("amount")?.toString(),
    dueDate: formData.get("dueDate")?.toString(),
    paidAt: formData.get("paidAt")?.toString(),
    notes: formData.get("notes")?.toString(),
  });

  return parsed;
}

export async function upsertTransactionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  const payload = extractTransactionPayload(formData);
  const data = {
    patientId: payload.patientId || undefined,
    appointmentId: payload.appointmentId || undefined,
    type: payload.type,
    status: payload.status,
    category: payload.category,
    description: payload.description,
    amount: payload.amount,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    paidAt: payload.paidAt ? new Date(payload.paidAt) : undefined,
    notes: payload.notes,
  };

  const transaction = payload.id
    ? await prisma.financialTransaction.update({
        where: { id: payload.id },
        data,
      })
    : await prisma.financialTransaction.create({
        data,
      });

  revalidatePath("/dashboard");
  revalidatePath("/finance");

  return { success: true, transactionId: transaction.id };
}

export async function deleteTransactionAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }
  await prisma.financialTransaction.delete({ where: { id } });
  revalidatePath("/finance");
  return { success: true };
}
