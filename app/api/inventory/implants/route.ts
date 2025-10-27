import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.implantItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, lengthMm, diameterMm, quantity, brand, imageUrl } = body ?? {};

  if (!type || quantity == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await prisma.implantItem.create({
    data: {
      type: String(type),
      lengthMm: lengthMm ? Number(lengthMm) : null,
      diameterMm: diameterMm != null ? Number(diameterMm) : null,
      quantity: Number(quantity) || 0,
      brand: brand ? String(brand) : null,
      imageUrl: imageUrl ? String(imageUrl) : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
