import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.restorativeItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, quantity, color, notes } = body ?? {};
  if (!name || quantity == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = await prisma.restorativeItem.create({
    data: {
      name: String(name),
      quantity: Number(quantity) || 0,
      color: color ? String(color) : null,
      notes: notes ? String(notes) : null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
