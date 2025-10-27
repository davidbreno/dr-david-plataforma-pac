"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/schemas/appointment";
import { getCurrentUser } from "@/lib/auth/session";

function extractAppointmentPayload(formData: FormData) {
  const parsed = appointmentSchema.parse({
    id: formData.get("id")?.toString(),
    patientId: formData.get("patientId")?.toString(),
    providerId: formData.get("providerId")?.toString(),
    title: formData.get("title")?.toString(),
    description: formData.get("description")?.toString(),
    status: formData.get("status")?.toString(),
    paymentStatus: formData.get("paymentStatus")?.toString(),
    fee: formData.get("fee")?.toString(),
    paidAmount: formData.get("paidAmount")?.toString(),
    startAt: formData.get("startAt")?.toString(),
    endAt: formData.get("endAt")?.toString(),
    location: formData.get("location")?.toString(),
    color: formData.get("color")?.toString(),
  });

  return parsed;
}

export async function upsertAppointmentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  const payload = extractAppointmentPayload(formData);
  const data = {
    patientId: payload.patientId,
    providerId: payload.providerId,
    title: payload.title,
    description: payload.description,
    status: payload.status,
    paymentStatus: payload.paymentStatus,
    fee: payload.fee != null ? Number(payload.fee) : undefined,
    paidAmount: payload.paidAmount != null ? Number(payload.paidAmount) : undefined,
    startAt: new Date(payload.startAt),
    endAt: new Date(payload.endAt),
    location: payload.location,
    color: payload.color,
  };

  const appointment = payload.id
    ? await prisma.appointment.update({
        where: { id: payload.id },
        data,
      })
    : await prisma.appointment.create({ data });

  revalidatePath("/dashboard");
  revalidatePath("/schedule");
  revalidatePath(`/patients/${appointment.patientId}`);

  return { success: true, appointmentId: appointment.id };
}

export async function deleteAppointmentAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  await prisma.appointment.delete({ where: { id } });
  revalidatePath("/schedule");
  return { success: true };
}
