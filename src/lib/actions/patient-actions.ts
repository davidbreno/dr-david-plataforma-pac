"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { patientSchema } from "@/lib/schemas/patient";
import { getCurrentUser } from "@/lib/auth/session";

/** Por que: evita espaços duplos e lida com valores vazios */
function computeFullName(first?: string, last?: string) {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ").trim();
}

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
    throw new Error("Nao autorizado");
  }

  const payload = extractPatientPayload(formData);

  if (payload.email) {
    const existing = await prisma.patient.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });
    if (existing) {
      return { success: false, error: "EMAIL_ALREADY_EXISTS" } as const;
    }
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        fullName: computeFullName(payload.firstName, payload.lastName),
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
    // removido: revalidatePath(/patients/) -> inválido; regex aqui quebra parse

    return { success: true, patientId: patient.id } as const;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, error: "EMAIL_ALREADY_EXISTS" } as const;
    }
    throw error;
  }
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
      fullName: computeFullName(payload.firstName, payload.lastName),
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
