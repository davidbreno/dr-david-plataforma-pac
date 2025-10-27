"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { patientSchema } from "@/lib/schemas/patient";
import { getCurrentUser } from "@/lib/auth/session";

function extractPatientPayload(formData: FormData) {
  const base = {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: formData.get("email")?.toString() ?? undefined,
    phone: formData.get("phone")?.toString() ?? undefined,
    status: (formData.get("status") ?? "ACTIVE").toString(),
    gender: (formData.get("gender") ?? "UNDISCLOSED").toString(),
    birthDate: formData.get("birthDate")?.toString(),
    documentNumber: formData.get("documentNumber")?.toString(),
    notes: formData.get("notes")?.toString(),
    address: formData.get("address")?.toString(),
  };

  let address: Record<string, unknown> | undefined;
  if (base.address) {
    try {
      address = JSON.parse(base.address);
    } catch (error) {
      console.error("Erro ao converter endereço", error);
    }
  }

  return patientSchema.parse({ ...base, address });
}

export async function createPatientAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  const payload = extractPatientPayload(formData);

  const patient = await prisma.patient.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      status: payload.status,
      gender: payload.gender,
      birthDate: payload.birthDate ? new Date(payload.birthDate) : undefined,
      documentNumber: payload.documentNumber,
      notes: payload.notes,
      address: payload.address
        ? (payload.address as Prisma.InputJsonValue)
        : undefined,
    },
  });

  revalidatePath("/patients");
  revalidatePath(`/patients/${patient.id}`);

  return { success: true, patientId: patient.id };
}

export async function updatePatientAction(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  const payload = extractPatientPayload(formData);

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      status: payload.status,
      gender: payload.gender,
      birthDate: payload.birthDate ? new Date(payload.birthDate) : undefined,
      documentNumber: payload.documentNumber,
      notes: payload.notes,
      address: payload.address
        ? (payload.address as Prisma.InputJsonValue)
        : undefined,
    },
  });

  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);

  return { success: true, patientId: patient.id };
}

export async function deletePatientAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado");
  }

  await prisma.patient.delete({ where: { id } });

  revalidatePath("/patients");
  return { success: true };
}
