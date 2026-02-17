import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ToolStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const tool = await prisma.toolEquipment.findUnique({ where: { id } });
  if (!tool) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tool);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    code?: string | null;
    name?: string | null;
    description?: string | null;
    serialNumber?: string | null;
    status?: ToolStatus | null;
    assignedTo?: string | null;
    notes?: string | null;
  };

  if (body?.name != null && !String(body.name).trim()) {
    return NextResponse.json({ error: "Campo inválido: name" }, { status: 400 });
  }

  const status =
    body.status != null
      ? Object.prototype.hasOwnProperty.call(ToolStatus, body.status)
        ? body.status
        : ToolStatus.AVAILABLE
      : undefined;

  const assignedTo =
    body.assignedTo != null ? String(body.assignedTo).trim() || null : undefined;

  const updated = await prisma.toolEquipment.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      code: body.code != null ? String(body.code).trim() || null : undefined,
      description:
        body.description != null
          ? String(body.description).trim() || null
          : undefined,
      serialNumber:
        body.serialNumber != null
          ? String(body.serialNumber).trim() || null
          : undefined,
      status,
      assignedTo,
      assignedAt: assignedTo === undefined ? undefined : assignedTo ? new Date() : null,
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
  await prisma.toolEquipment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
