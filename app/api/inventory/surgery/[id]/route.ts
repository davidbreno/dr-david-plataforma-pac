import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const { name, quantity, notes } = body ?? {};
  const updated = await prisma.surgeryItem.update({
    where: { id: params.id },
    data: {
      ...(name != null ? { name: String(name) } : {}),
      ...(quantity != null ? { quantity: Number(quantity) } : {}),
      ...(notes != null ? { notes: String(notes) } : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.surgeryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
