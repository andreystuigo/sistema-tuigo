import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await prisma.stockItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    sku?: string | null;
    name?: string | null;
    supplier?: string | null;
    supplierSku?: string | null;
    manufacturer?: string | null;
    description?: string | null;
    unit?: string | null;
    unitPrice?: number | null;
    category?: "NOVO" | "USADO" | "DEFEITO_PARCIAL" | string | null;
    itemQuantity?: number | null;
    quantity?: number | null;
    initialQuantity?: number | null;
    entryQuantity?: number | null;
    entriesQuantity?: number | null;
    launchType?: "INITIAL" | "ENTRY" | string | null;
    launchQuantity?: number | null;
    entryDate?: string | null;
    minQuantity?: number | null;
    location?: string | null;
  };

  if (body?.name != null && !String(body.name).trim()) {
    return NextResponse.json(
      { error: "Campo inválido: name" },
      { status: 400 },
    );
  }

  const current = await prisma.stockItem.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const launchType = body.launchType === "ENTRY" ? "ENTRY" : body.launchType === "INITIAL" ? "INITIAL" : null;
  const launchQuantity = Number.isFinite(body.launchQuantity) ? Math.max(0, body.launchQuantity!) : 0;

  const nextInitialQuantity =
    launchType === "INITIAL"
      ? launchQuantity
      : body.initialQuantity != null
        ? Math.max(0, Number(body.initialQuantity) || 0)
        : current.initialQuantity;

  let nextEntriesQuantity = current.entriesQuantity;
  if (body.entriesQuantity != null) {
    nextEntriesQuantity = Math.max(0, Number(body.entriesQuantity) || 0);
  }
  if (launchType === "ENTRY") {
    nextEntriesQuantity = Math.max(0, nextEntriesQuantity + launchQuantity);
  } else if (body.entryQuantity != null) {
    nextEntriesQuantity = Math.max(0, nextEntriesQuantity + (Number(body.entryQuantity) || 0));
  }

  const nextQuantityFromParts = nextInitialQuantity + nextEntriesQuantity;
  const nextQuantity =
    body.quantity != null
      ? Math.max(0, Number(body.quantity) || 0)
      : nextQuantityFromParts;

  // If a total quantity is explicitly provided, adjust entries to keep total consistent.
  if (body.quantity != null) {
    nextEntriesQuantity = Math.max(0, nextQuantity - nextInitialQuantity);
  }

  const updated = await prisma.stockItem.update({
    where: { id },
    data: {
      name: body.name != null ? String(body.name).trim() : undefined,
      sku: body.sku != null ? (String(body.sku).trim() || null) : undefined,
      supplierSku:
        body.supplierSku != null
          ? String(body.supplierSku).trim() || null
          : body.supplier != null
            ? String(body.supplier).trim() || null
            : undefined,
      manufacturer:
        body.manufacturer != null
          ? String(body.manufacturer).trim() || null
          : undefined,
      description:
        body.description != null
          ? String(body.description).trim() || null
          : undefined,
      unit: body.unit != null ? String(body.unit).trim() || null : undefined,
      unitPrice:
        body.unitPrice != null
          ? Number.isFinite(body.unitPrice)
            ? Math.max(0, body.unitPrice)
            : null
          : undefined,
      category:
        body.category != null
          ? body.category === "USADO"
            ? "USADO"
            : body.category === "DEFEITO_PARCIAL"
              ? "DEFEITO_PARCIAL"
              : "NOVO"
          : undefined,
      itemQuantity:
        body.itemQuantity != null
          ? Math.max(0, Number(body.itemQuantity) || 0)
          : body.minQuantity != null
            ? Math.max(0, Number(body.minQuantity) || 0)
            : undefined,
      initialQuantity: body.initialQuantity != null ? nextInitialQuantity : undefined,
      entriesQuantity:
        body.entriesQuantity != null || body.entryQuantity != null || body.quantity != null || launchType != null
          ? nextEntriesQuantity
          : undefined,
      quantity:
        body.quantity != null || body.initialQuantity != null || body.entriesQuantity != null || body.entryQuantity != null || launchType != null
          ? nextQuantity
          : undefined,
      lastEntryAt:
        launchType === "ENTRY" && body.entryDate
          ? new Date(`${String(body.entryDate).trim()}T00:00:00`)
          : undefined,
      location:
        body.location != null ? String(body.location).trim() || null : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.stockItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
