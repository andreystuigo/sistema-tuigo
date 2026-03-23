"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

function requiredId(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatório: ${key}`);
  return value;
}

function getDateRequired(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) throw new Error(`Campo obrigatório: ${key}`);
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error(`Data inválida: ${key}`);
  return date;
}

export async function createVehicle(formData: FormData) {
  const plate = requiredText(formData, "plate").toUpperCase();
  const brand = optionalText(formData, "brand");
  const model = optionalText(formData, "model");
  const yearRaw = optionalText(formData, "year");
  const year = yearRaw ? Number.parseInt(yearRaw, 10) : null;
  const tag = optionalText(formData, "tag");
  const odometer = Math.max(0, parseIntField(formData, "odometer", 0));
  const notes = optionalText(formData, "notes");

  await prisma.vehicle.create({
    data: {
      plate,
      brand,
      model,
      year: year && Number.isFinite(year) ? year : null,
      tag,
      odometer,
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
  const tag = optionalText(formData, "tag");
  const odometer = Math.max(0, parseIntField(formData, "odometer", 0));
  const notes = optionalText(formData, "notes");

  await prisma.vehicle.update({
    where: { id },
    data: {
      plate,
      brand,
      model,
      year: year && Number.isFinite(year) ? year : null,
      tag,
      odometer,
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

export async function registerVehicleExit(formData: FormData) {
  const vehicleId = requiredId(formData, "vehicleId");
  const exitDate = getDateRequired(formData, "exitDate");
  const odometer = Math.max(0, parseIntField(formData, "odometer", -1));
  const destination = optionalText(formData, "destination");
  const notes = optionalText(formData, "notes");

  if (odometer < 0) throw new Error("Campo obrigatório: odometer");

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new Error("Veículo não encontrado");
  if (odometer < vehicle.odometer) {
    throw new Error(`Odômetro não pode ser menor que o atual (${vehicle.odometer}).`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.vehicleExit.create({
      data: {
        vehicleId,
        odometer,
        destination,
        exitDate,
        notes,
      },
    });

    await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        odometer,
      },
    });
  });

  revalidatePath("/veiculos");
  redirect("/veiculos");
}

export async function registerVehicleEntry(formData: FormData) {
  const vehicleId = requiredId(formData, "vehicleId");
  const entryDate = getDateRequired(formData, "entryDate");
  const odometer = Math.max(0, parseIntField(formData, "odometer", -1));
  const destination = optionalText(formData, "destination");
  const notes = optionalText(formData, "notes");

  if (odometer < 0) throw new Error("Campo obrigatório: odometer");

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new Error("Veículo não encontrado");
  if (odometer < vehicle.odometer) {
    throw new Error(`Odômetro não pode ser menor que o atual (${vehicle.odometer}).`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.vehicleEntry.create({
      data: {
        vehicleId,
        odometer,
        destination,
        entryDate,
        notes,
      },
    });

    await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        odometer,
      },
    });
  });

  revalidatePath("/veiculos");
  redirect("/veiculos");
}
