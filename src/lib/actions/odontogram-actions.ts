"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export type OdontogramEntryInput = {
  toothNumber: string;
  region?: string;
  annotations?: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "NOTE";
};

export type OdontogramPayload = {
  patientId: string;
  responseSetId?: string;
  chartType?: "PERMANENT" | "DECIDUOUS";
  entries: OdontogramEntryInput[];
  notes?: string;
  status?: "OPEN" | "FINALIZED";
};

export async function createOrUpdateOdontogram(payload: OdontogramPayload) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Nao autorizado");
  }

  const template = await prisma.anamnesisTemplate.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!template) {
    throw new Error("Nenhum modelo de anamnese encontrado");
  }

  const result = await prisma.$transaction(async (tx) => {
    const chartType = payload.chartType ?? "PERMANENT";
    let responseSet;

    if (payload.responseSetId) {
      responseSet = await tx.anamnesisResponseSet.update({
        where: { id: payload.responseSetId },
        data: {
          status: payload.status ?? "OPEN",
          notes: payload.notes,
          odontogram: {
            upsert: {
              create: {
                patientId: payload.patientId,
                chartType,
                notes: payload.notes,
              },
              update: {
                chartType,
                notes: payload.notes,
              },
            },
          },
        },
        include: { odontogram: true },
      });
    } else {
      responseSet = await tx.anamnesisResponseSet.create({
        data: {
          patientId: payload.patientId,
          templateId: template.id,
          filledById: user.id,
          status: payload.status ?? "OPEN",
          notes: payload.notes,
          odontogram: {
            create: {
              patientId: payload.patientId,
              chartType,
              notes: payload.notes,
            },
          },
        },
        include: { odontogram: true },
      });
    }

    if (!responseSet.odontogram) {
      responseSet = await tx.anamnesisResponseSet.update({
        where: { id: responseSet.id },
        data: {
          odontogram: {
            create: {
              patientId: payload.patientId,
              chartType,
              notes: payload.notes,
            },
          },
        },
        include: { odontogram: true },
      });
    }

    await tx.odontogramEntry.deleteMany({
      where: { odontogramId: responseSet.odontogram!.id },
    });

    if (payload.entries.length > 0) {
      await tx.odontogramEntry.createMany({
        data: payload.entries.map((entry) => ({
          odontogramId: responseSet.odontogram!.id,
          toothNumber: entry.toothNumber,
          region: entry.region,
          annotations: entry.annotations,
          status: entry.status,
          authorId: user.id,
        })),
      });
    }

    return responseSet;
  });

  revalidatePath(`/patients/${payload.patientId}`);
  return { success: true, responseSetId: result.id };
}

export async function getLatestOdontogram(patientId: string) {
  return prisma.odontogramRecord.findFirst({
    where: { patientId },
    orderBy: { updatedAt: "desc" },
    include: {
      entries: {
        orderBy: { toothNumber: "asc" },
      },
    },
  });
}
