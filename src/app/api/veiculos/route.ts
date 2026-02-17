import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VehicleStatus } from "@prisma/client";

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
    odometer?: number | null;
    status?: VehicleStatus | null;
    notes?: string | null;
  };

  if (!body?.plate || !String(body.plate).trim()) {
    return NextResponse.json({ error: "Campo obrigatório: plate" }, { status: 400 });
  }

  const status =
    body.status && Object.prototype.hasOwnProperty.call(VehicleStatus, body.status)
      ? body.status
      : VehicleStatus.AVAILABLE;

  const created = await prisma.vehicle.create({
    data: {
      plate: String(body.plate).trim().toUpperCase(),
      brand: body.brand ? String(body.brand).trim() : null,
      model: body.model ? String(body.model).trim() : null,
      year: body.year != null && Number.isFinite(body.year) ? Math.trunc(body.year) : null,
      odometer:
        body.odometer != null && Number.isFinite(body.odometer)
          ? Math.max(0, Math.trunc(body.odometer))
          : 0,
      status,
      notes: body.notes ? String(body.notes).trim() : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
