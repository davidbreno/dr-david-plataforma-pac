import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const { type, lengthMm, diameterMm, quantity, brand, imageUrl } = body ?? {};

  const updated = await prisma.implantItem.update({
    where: { id: params.id },
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

export async function DELETE(_request: Request, { params }: Params) {
  await prisma.implantItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
