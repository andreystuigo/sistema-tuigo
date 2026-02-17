"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleStatus } from "@prisma/client";

function requiredText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório: ${key}`);
  return value;
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value ? value : null;
}

function parseIntField(formData: FormData, key: string, fallback: number) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseStatus(formData: FormData) {
  const raw = String(formData.get("status") ?? "").trim();
  if (raw in VehicleStatus) return raw as VehicleStatus;
  return VehicleStatus.AVAILABLE;
}

export async function createVehicle(formData: FormData) {
  const plate = requiredText(formData, "plate").toUpperCase();
  const brand = optionalText(formData, "brand");
  const model = optionalText(formData, "model");
  const yearRaw = optionalText(formData, "year");
  const year = yearRaw ? Number.parseInt(yearRaw, 10) : null;
  const odometer = Math.max(0, parseIntField(formData, "odometer", 0));
  const status = parseStatus(formData);
  const notes = optionalText(formData, "notes");

  await prisma.vehicle.create({
    data: {
      plate,
      brand,
      model,
      year: year && Number.isFinite(year) ? year : null,
      odometer,
      status,
      notes,
    },
  });

  revalidatePath("/veiculos");
  redirect("/veiculos");
}

export async function updateVehicle(id: string, formData: FormData) {
  const plate = requiredText(formData, "plate").toUpperCase();
  const brand = optionalText(formData, "brand");
  const model = optionalText(formData, "model");
  const yearRaw = optionalText(formData, "year");
  const year = yearRaw ? Number.parseInt(yearRaw, 10) : null;
  const odometer = Math.max(0, parseIntField(formData, "odometer", 0));
  const status = parseStatus(formData);
  const notes = optionalText(formData, "notes");

  await prisma.vehicle.update({
    where: { id },
    data: {
      plate,
      brand,
      model,
      year: year && Number.isFinite(year) ? year : null,
      odometer,
      status,
      notes,
    },
  });

  revalidatePath("/veiculos");
  redirect("/veiculos");
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/veiculos");
  redirect("/veiculos");
}
