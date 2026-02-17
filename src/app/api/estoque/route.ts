import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.stockItem.findMany({ orderBy: [{ name: "asc" }] });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
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

  if (!body?.name || !String(body.name).trim()) {
    return NextResponse.json(
      { error: "Campo obrigatório: name" },
      { status: 400 },
    );
  }

  const category =
    body.category === "USADO"
      ? "USADO"
      : body.category === "DEFEITO_PARCIAL"
        ? "DEFEITO_PARCIAL"
        : "NOVO";
  const itemQuantity = Number.isFinite(body.itemQuantity)
    ? Math.max(0, body.itemQuantity!)
    : Number.isFinite(body.minQuantity)
      ? Math.max(0, body.minQuantity!)
      : 0;

  const launchType = body.launchType === "ENTRY" ? "ENTRY" : body.launchType === "INITIAL" ? "INITIAL" : null;
  const launchQuantity = Number.isFinite(body.launchQuantity) ? Math.max(0, body.launchQuantity!) : 0;

  const initialQuantity = launchType
    ? launchType === "INITIAL"
      ? launchQuantity
      : 0
    : Number.isFinite(body.initialQuantity)
      ? Math.max(0, body.initialQuantity!)
      : Number.isFinite(body.quantity)
        ? Math.max(0, body.quantity!)
        : 0;

  const entriesQuantity = launchType
    ? launchType === "ENTRY"
      ? launchQuantity
      : 0
    : Number.isFinite(body.entryQuantity)
      ? Math.max(0, body.entryQuantity!)
      : Number.isFinite(body.entriesQuantity)
        ? Math.max(0, body.entriesQuantity!)
        : 0;

  const lastEntryAt =
    launchType === "ENTRY" && body.entryDate
      ? new Date(`${String(body.entryDate).trim()}T00:00:00`)
      : null;

  const quantity = initialQuantity + entriesQuantity;

  const unitPrice = Number.isFinite(body.unitPrice)
    ? Math.max(0, body.unitPrice!)
    : null;

  const created = await prisma.stockItem.create({
    data: {
      name: String(body.name).trim(),
      sku: body.sku ? String(body.sku).trim() : null,
      supplierSku: body.supplierSku
        ? String(body.supplierSku).trim()
        : body.supplier
          ? String(body.supplier).trim()
          : null,
      manufacturer: body.manufacturer ? String(body.manufacturer).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      unit: body.unit ? String(body.unit).trim() : null,
      unitPrice,
      category,
      itemQuantity,
      initialQuantity,
      entriesQuantity,
      quantity,
      lastEntryAt: lastEntryAt && Number.isNaN(lastEntryAt.getTime()) ? null : lastEntryAt,
      location: body.location ? String(body.location).trim() : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
