"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ToolStatus } from "@prisma/client";

function requiredText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório: ${key}`);
  return value;
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value ? value : null;
}

function parseStatus(formData: FormData) {
  const raw = String(formData.get("status") ?? "").trim();
  if (raw in ToolStatus) return raw as ToolStatus;
  return ToolStatus.AVAILABLE;
}

export async function createTool(formData: FormData) {
  const name = requiredText(formData, "name");
  const code = optionalText(formData, "code");
  const description = optionalText(formData, "description");
  const serialNumber = optionalText(formData, "serialNumber");
  const status = parseStatus(formData);
  const assignedTo = optionalText(formData, "assignedTo");
  const notes = optionalText(formData, "notes");

  await prisma.toolEquipment.create({
    data: {
      name,
      code,
      description,
      serialNumber,
      status,
      assignedTo,
      assignedAt: assignedTo ? new Date() : null,
      notes,
    },
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

export async function updateTool(id: string, formData: FormData) {
  const name = requiredText(formData, "name");
  const code = optionalText(formData, "code");
  const description = optionalText(formData, "description");
  const serialNumber = optionalText(formData, "serialNumber");
  const status = parseStatus(formData);
  const assignedTo = optionalText(formData, "assignedTo");
  const notes = optionalText(formData, "notes");

  await prisma.toolEquipment.update({
    where: { id },
    data: {
      name,
      code,
      description,
      serialNumber,
      status,
      assignedTo,
      assignedAt: assignedTo ? new Date() : null,
      notes,
    },
  });

  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}

export async function deleteTool(id: string) {
  await prisma.toolEquipment.delete({ where: { id } });
  revalidatePath("/ferramentas");
  redirect("/ferramentas");
}
