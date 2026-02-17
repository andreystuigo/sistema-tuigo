import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VehicleStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    plate?: string | null;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    odometer?: number | null;
    status?: VehicleStatus | null;
    notes?: string | null;
  };

  if (body?.plate != null && !String(body.plate).trim()) {
    return NextResponse.json({ error: "Campo inválido: plate" }, { status: 400 });
  }

  const status =
    body.status != null
      ? Object.prototype.hasOwnProperty.call(VehicleStatus, body.status)
        ? body.status
        : VehicleStatus.AVAILABLE
      : undefined;

  const updated = await prisma.vehicle.update({
    where: { id },
    data: {
      plate:
        body.plate != null ? String(body.plate).trim().toUpperCase() : undefined,
      brand: body.brand != null ? String(body.brand).trim() || null : undefined,
      model: body.model != null ? String(body.model).trim() || null : undefined,
      year:
        body.year != null && Number.isFinite(body.year)
          ? Math.trunc(body.year)
          : body.year === null
            ? null
            : undefined,
      odometer:
        body.odometer != null && Number.isFinite(body.odometer)
          ? Math.max(0, Math.trunc(body.odometer))
          : body.odometer === null
            ? 0
            : undefined,
      status,
      notes: body.notes != null ? String(body.notes).trim() || null : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
