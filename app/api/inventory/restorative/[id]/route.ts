import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const { name, quantity, color, notes } = body ?? {};
  const updated = await prisma.restorativeItem.update({
    where: { id: params.id },
    data: {
      ...(name != null ? { name: String(name) } : {}),
      ...(quantity != null ? { quantity: Number(quantity) } : {}),
      ...(color != null ? { color: String(color) } : {}),
      ...(notes != null ? { notes: String(notes) } : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.restorativeItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
