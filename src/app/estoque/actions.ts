"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { returnPathForLocation } from "./stockLocations";

function getRequired(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório: ${key}`);
  return value;
}

function getOptional(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value ? value : null;
}

function getInt(formData: FormData, key: string, fallback = 0) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return fallback;
  const cleaned = raw.replace(/[^0-9-]/g, "");
  const parsed = Number.parseInt(cleaned, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}

function getOptionalFloat(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9,.-]/g, "");
  const normalized =
    cleaned.includes(",") && cleaned.includes(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) throw new Error(`Número inválido: ${key}`);
  return Math.max(0, parsed);
}

function parseCategory(raw: string) {
  if (raw === "USADO") return "USADO";
  if (raw === "DEFEITO_PARCIAL") return "DEFEITO_PARCIAL";
  return "NOVO";
}

function getLaunchType(formData: FormData) {
  const raw = String(formData.get("launchType") ?? "INITIAL").trim();
  return raw === "ENTRY" ? "ENTRY" : "INITIAL";
}

function getEntryDateRequired(formData: FormData) {
  const raw = String(formData.get("entryDate") ?? "").trim();
  if (!raw) throw new Error("Campo obrigatório: entryDate");
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error("Data inválida: entryDate");
  return date;
}

export async function createStockItem(formData: FormData) {
  const location = getRequired(formData, "location");
  const name = getRequired(formData, "name");
  const sku = getOptional(formData, "sku");
  const supplierSku = getOptional(formData, "supplierSku");
  const manufacturer = getOptional(formData, "manufacturer");
  const description = getOptional(formData, "description");
  const unit = getOptional(formData, "unit");
  const unitPrice = getOptionalFloat(formData, "unitPrice");
  const category = parseCategory(getRequired(formData, "category"));

  const entryDate = getEntryDateRequired(formData);
  const quantity = Math.max(0, getInt(formData, "quantity", 0));
  if (quantity <= 0) throw new Error("Quantidade inválida");

  const initialQuantity = quantity;
  const entriesQuantity = 0;
  const lastEntryAt = entryDate;

  const createdAt = new Date(`${String(formData.get("entryDate") ?? "").trim()}T12:00:00`);

  await prisma.stockItem.create({
    data: {
      name,
      sku,
      supplierSku,
      manufacturer,
      description,
      unit,
      unitPrice,
      category,
      itemQuantity: 0,
      initialQuantity,
      entriesQuantity,
      quantity,
      lastEntryAt,
      location,
      ...(Number.isNaN(createdAt.getTime()) ? {} : { createdAt }),
    },
  });

  revalidatePath("/estoque");
  revalidatePath(returnPathForLocation(location));
  redirect(returnPathForLocation(location));
}

export async function updateStockItem(id: string, formData: FormData) {
  const name = getRequired(formData, "name");
  const sku = getOptional(formData, "sku");
  const supplierSku = getOptional(formData, "supplierSku");
  const manufacturer = getOptional(formData, "manufacturer");
  const description = getOptional(formData, "description");
  const unit = getOptional(formData, "unit");
  const unitPrice = getOptionalFloat(formData, "unitPrice");
  const category = parseCategory(getRequired(formData, "category"));
  const itemQuantity = Math.max(0, getInt(formData, "itemQuantity", 0));
  const launchType = getLaunchType(formData);
  const launchQuantity = Math.max(0, getInt(formData, "launchQuantity", 0));
  const location = getRequired(formData, "location");
  const returnTo = String(formData.get("returnTo") ?? "").trim();

  const current = await prisma.stockItem.findUnique({ where: { id } });
  if (!current) throw new Error("Item não encontrado");

  const initialQuantity =
    launchType === "INITIAL" ? launchQuantity : current.initialQuantity;
  const entriesQuantity =
    launchType === "ENTRY"
      ? Math.max(0, current.entriesQuantity + launchQuantity)
      : current.entriesQuantity;
  const lastEntryAt =
    launchType === "ENTRY" ? getEntryDateRequired(formData) : undefined;

  const quantity = initialQuantity + entriesQuantity;

  await prisma.stockItem.update({
    where: { id },
    data: {
      name,
      sku,
      supplierSku,
      manufacturer,
      description,
      unit,
      unitPrice,
      category,
      itemQuantity,
      initialQuantity,
      entriesQuantity,
      quantity,
      lastEntryAt,
      location,
    },
  });

  const fallback = returnPathForLocation(location);
  const next = returnTo.startsWith("/") ? returnTo : fallback;

  revalidatePath("/estoque");
  revalidatePath(next);
  redirect(next);
}

export async function deleteStockItem(id: string, returnTo = "/estoque") {
  await prisma.stockItem.delete({ where: { id } });
  const next = returnTo.startsWith("/") ? returnTo : "/estoque";
  revalidatePath("/estoque");
  revalidatePath(next);
  redirect(next);
}

export async function registerStockExit(formData: FormData) {
  const itemId = getRequired(formData, "itemId");
  const quantity = Math.max(0, getInt(formData, "quantity", 0));
  const exitDateRaw = getRequired(formData, "exitDate");
  const type = getRequired(formData, "type") as "VENDA" | "APLICADO";
  const obra = getOptional(formData, "obra");
  const notes = getOptional(formData, "notes");

  if (quantity <= 0) throw new Error("Quantidade inválida");

  const exitDate = new Date(`${exitDateRaw}T00:00:00`);
  if (Number.isNaN(exitDate.getTime())) throw new Error("Data inválida: exitDate");

  const item = await prisma.stockItem.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("Item não encontrado");

  if (item.quantity < quantity) {
    throw new Error(
      `Quantidade insuficiente. Disponível: ${item.quantity}${item.unit ? ` ${item.unit}` : ""}`
    );
  }

  const newQuantity = item.quantity - quantity;

  // Use transaction to ensure both operations succeed or neither
  await prisma.$transaction(async (tx) => {
    // Register stock exit first
    await tx.stockExit.create({
      data: {
        itemId,
        quantity,
        type,
        obra,
        exitDate,
        notes,
      },
    });

    // Then update stock item quantity
    await tx.stockItem.update({
      where: { id: itemId },
      data: {
        quantity: newQuantity,
      },
    });
  });

  revalidatePath("/estoque");
  redirect("/estoque");
}
