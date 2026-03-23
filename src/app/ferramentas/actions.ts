"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ToolStatus } from "@prisma/client";
import { isToolLocation } from "./toolLocations";

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

function getEntryDateRequired(formData: FormData) {
  const raw = String(formData.get("entryDate") ?? "").trim();
  if (!raw) throw new Error("Campo obrigatório: entryDate");
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error("Data inválida: entryDate");
  return date;
}

function getEntryDateOptional(formData: FormData) {
  const raw = String(formData.get("entryDate") ?? "").trim();
  if (!raw) return null;
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error("Data inválida: entryDate");
  return date;
}

function getToolLocationRequired(formData: FormData) {
  const raw = String(formData.get("location") ?? "").trim();
  if (!raw) throw new Error("Campo obrigatório: location");
  if (!isToolLocation(raw)) throw new Error("Localização inválida");
  return raw;
}

export async function createTool(formData: FormData) {
  const location = getToolLocationRequired(formData);
  const name = getRequired(formData, "name");
  const code = getOptional(formData, "sku");
  const supplierSku = getOptional(formData, "supplierSku");
  const manufacturer = getOptional(formData, "manufacturer");
  const unitPrice = getOptionalFloat(formData, "unitPrice");
  const category = parseCategory(getRequired(formData, "category"));

  const entryDate = getEntryDateRequired(formData);
  const quantity = Math.max(0, getInt(formData, "quantity", 0));
  if (quantity <= 0) throw new Error("Quantidade inválida");

  const initialQuantity = quantity;
  const entriesQuantity = 0;
  const lastEntryAt = entryDate;

  const createdAt = new Date(`${String(formData.get("entryDate") ?? "").trim()}T12:00:00`);

  // Cadastro entra sempre como Disponível (estoque Tuigo)
  const status = ToolStatus.AVAILABLE;

  await prisma.toolEquipment.create({
    data: {
      name,
      code,
      status,
      inUseWhere: null,
      assignedTo: null,
      assignedAt: null,
      notes: null,
      supplierSku,
      manufacturer,
      unitPrice,
      category,
      initialQuantity,
      entriesQuantity,
      quantity,
      lastEntryAt,
      location,
      ...(Number.isNaN(createdAt.getTime()) ? {} : { createdAt }),
    },
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

export async function updateTool(id: string, formData: FormData) {
  const location = getToolLocationRequired(formData);
  const name = getRequired(formData, "name");
  const code = getOptional(formData, "sku");
  const supplierSku = getOptional(formData, "supplierSku");
  const manufacturer = getOptional(formData, "manufacturer");
  const unitPrice = getOptionalFloat(formData, "unitPrice");
  const category = parseCategory(getRequired(formData, "category"));

  const current = await prisma.toolEquipment.findUnique({ where: { id } });
  if (!current) throw new Error("Ferramenta não encontrada");

  const entryDate = getEntryDateOptional(formData);
  const quantity = Math.max(0, getInt(formData, "quantity", current.quantity ?? 0));
  if (quantity < 0) throw new Error("Quantidade inválida");

  const initialQuantity = quantity;
  const entriesQuantity = 0;
  const lastEntryAt = entryDate ?? undefined;

  await prisma.toolEquipment.update({
    where: { id },
    data: {
      name,
      code,
      supplierSku,
      manufacturer,
      unitPrice,
      category,
      initialQuantity,
      entriesQuantity,
      quantity,
      lastEntryAt,
      location,
    },
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

function requiredId(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório: ${key}`);
  return value;
}

export async function checkoutTool(formData: FormData) {
  const location = getToolLocationRequired(formData);
  const toolId = requiredId(formData, "toolId");
  const destination = getRequired(formData, "destination");
  const quantity = Math.max(0, getInt(formData, "quantity", 0));
  const exitDateRaw = getRequired(formData, "exitDate");
  const notes = getOptional(formData, "notes");

  if (quantity <= 0) throw new Error("Quantidade inválida");

  const exitDate = new Date(`${exitDateRaw}T00:00:00`);
  if (Number.isNaN(exitDate.getTime())) throw new Error("Data inválida: exitDate");

  const tool = await prisma.toolEquipment.findUnique({ where: { id: toolId } });
  if (!tool) throw new Error("Ferramenta não encontrada");
  if (tool.location !== location) {
    throw new Error("Esta ferramenta não pertence à localização selecionada");
  }
  const currentQty = tool.quantity ?? 0;
  if (currentQty < quantity) {
    throw new Error(`Quantidade insuficiente. Disponível: ${currentQty}${tool.unit ? ` ${tool.unit}` : ""}`);
  }

  const newQuantity = currentQty - quantity;

  await prisma.$transaction(async (tx) => {
    await tx.toolExit.create({
      data: {
        toolId,
        quantity,
        destination,
        exitDate,
        notes,
      },
    });

    await tx.toolEquipment.update({
      where: { id: toolId },
      data: {
        quantity: newQuantity,
        status: ToolStatus.AVAILABLE,
      },
    });
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

export async function returnTool(formData: FormData) {
  const location = getToolLocationRequired(formData);
  const toolId = requiredId(formData, "toolId");
  const quantity = Math.max(0, getInt(formData, "quantity", 0));
  const returnDateRaw = getRequired(formData, "returnDate");
  const notes = getOptional(formData, "notes");

  if (quantity <= 0) throw new Error("Quantidade inválida");

  const returnDate = new Date(`${returnDateRaw}T00:00:00`);
  if (Number.isNaN(returnDate.getTime())) throw new Error("Data inválida: returnDate");

  const tool = await prisma.toolEquipment.findUnique({ where: { id: toolId } });
  if (!tool) throw new Error("Ferramenta não encontrada");
  if (tool.location !== location) {
    throw new Error("Esta ferramenta não pertence à localização selecionada");
  }
  const currentQty = tool.quantity ?? 0;
  const newQuantity = currentQty + quantity;

  await prisma.$transaction(async (tx) => {
    await tx.toolReturn.create({
      data: {
        toolId,
        quantity,
        returnDate,
        notes,
      },
    });

    await tx.toolEquipment.update({
      where: { id: toolId },
      data: {
        quantity: newQuantity,
        status: ToolStatus.AVAILABLE,
      },
    });
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

export async function deleteTool(id: string) {
  await prisma.toolEquipment.delete({ where: { id } });
  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}
