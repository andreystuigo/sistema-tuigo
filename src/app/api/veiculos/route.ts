import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: [{ plate: "asc" }] });
  return NextResponse.json(vehicles);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    plate?: string | null;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    tag?: string | null;
    odometer?: number | null;
    notes?: string | null;
  };

  if (!body?.plate || !String(body.plate).trim()) {
    return NextResponse.json({ error: "Campo obrigatório: plate" }, { status: 400 });
  }

  const created = await prisma.vehicle.create({
    data: {
      plate: String(body.plate).trim().toUpperCase(),
      brand: body.brand ? String(body.brand).trim() : null,
      model: body.model ? String(body.model).trim() : null,
      year: body.year != null && Number.isFinite(body.year) ? Math.trunc(body.year) : null,
      tag: body.tag ? String(body.tag).trim() : null,
      odometer:
        body.odometer != null && Number.isFinite(body.odometer)
          ? Math.max(0, Math.trunc(body.odometer))
          : 0,
      notes: body.notes ? String(body.notes).trim() : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
