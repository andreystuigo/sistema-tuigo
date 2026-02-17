import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ToolStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const tools = await prisma.toolEquipment.findMany({
    orderBy: [{ name: "asc" }],
  });
  return NextResponse.json(tools);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    code?: string | null;
    name?: string | null;
    description?: string | null;
    serialNumber?: string | null;
    status?: ToolStatus | null;
    assignedTo?: string | null;
    notes?: string | null;
  };

  if (!body?.name || !String(body.name).trim()) {
    return NextResponse.json({ error: "Campo obrigatório: name" }, { status: 400 });
  }

  const status =
    body.status && Object.prototype.hasOwnProperty.call(ToolStatus, body.status)
      ? body.status
      : ToolStatus.AVAILABLE;

  const created = await prisma.toolEquipment.create({
    data: {
      name: String(body.name).trim(),
      code: body.code ? String(body.code).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      serialNumber: body.serialNumber ? String(body.serialNumber).trim() : null,
      status,
      assignedTo: body.assignedTo ? String(body.assignedTo).trim() : null,
      assignedAt: body.assignedTo ? new Date() : null,
      notes: body.notes ? String(body.notes).trim() : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
