"use server";

import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function uploadAttachmentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Nao autorizado");
  }

  const file = formData.get("file");
  const patientId = formData.get("patientId")?.toString();
  const appointmentId = formData.get("appointmentId")?.toString();
  const responseSetId = formData.get("responseSetId")?.toString();

  if (!(file instanceof File) || !patientId) {
    throw new Error("Arquivo invalido ou paciente ausente");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Token BLOB_READ_WRITE_TOKEN nao configurado");
  }

  const blob = await put(`attachments/${patientId}/${randomUUID()}-${file.name}`, file, {
    access: "public",
  });

  await prisma.attachment.create({
    data: {
      patientId,
      appointmentId: appointmentId || undefined,
      responseSetId: responseSetId || undefined,
      uploadedById: user.id,
      name: file.name,
      url: blob.url,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  });

  revalidatePath(`/patients/${patientId}`);
  return { success: true, url: blob.url };
}

export async function deleteAttachmentAction(id: string, patientId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Nao autorizado");
  }

  await prisma.attachment.delete({ where: { id } });
  revalidatePath(`/patients/${patientId}`);
  return { success: true };
}
