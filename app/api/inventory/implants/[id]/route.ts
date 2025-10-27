import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await request.json();
  const { type, lengthMm, diameterMm, quantity, brand, imageUrl } = body ?? {};

  const updated = await prisma.implantItem.update({
    where: { id },
    data: {
      ...(type != null ? { type: String(type) } : {}),
      ...(lengthMm != null ? { lengthMm: Number(lengthMm) } : {}),
      ...(diameterMm != null ? { diameterMm: Number(diameterMm) } : {}),
      ...(quantity != null ? { quantity: Number(quantity) } : {}),
      ...(brand != null ? { brand: String(brand) } : {}),
      ...(imageUrl != null ? { imageUrl: String(imageUrl) } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  await prisma.implantItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
