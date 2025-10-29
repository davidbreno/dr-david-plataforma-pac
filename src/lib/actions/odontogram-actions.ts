"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import {
  Prisma,
  ToothStatus,
  OdontogramChartType,
  AnamnesisStatus,
} from "@prisma/client";

export type OdontogramEntryInput = {
  toothNumber: string;
  region?: string;
  annotations?: string;
  status: ToothStatus; // "OPEN" | "IN_PROGRESS" | "COMPLETED" | "NOTE"
};

export type OdontogramPayload = {
  patientId: string;
  responseSetId?: string;
  chartType?: OdontogramChartType; // "PERMANENT" | "DECIDUOUS"
  entries: OdontogramEntryInput[];
  notes?: string;
  status?: AnamnesisStatus; // "OPEN" | "FINALIZED"
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
    const chartType: OdontogramChartType =
      payload.chartType ?? OdontogramChartType.PERMANENT;
    let responseSet;

    if (payload.responseSetId) {
      // UPDATE existing Response Set
      responseSet = await tx.anamnesisResponseSet.update({
        where: { id: payload.responseSetId },
        data: {
          // status exists in your schema; keep it strongly typed
          status: payload.status ?? AnamnesisStatus.OPEN,
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
      // CREATE new Response Set
      responseSet = await tx.anamnesisResponseSet.create({
        data: {
          patientId: payload.patientId,
          templateId: template.id,
          filledById: user.id,
          status: payload.status ?? AnamnesisStatus.OPEN,
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

    // Ensure odontogram record exists
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

    // Replace all entries for this odontogram
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
