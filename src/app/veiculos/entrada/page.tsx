import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { registerVehicleEntry } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function VeiculosEntradaPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ plate: "asc" }],
    select: { id: true, plate: true, brand: true, model: true, odometer: true },
  });

  const today = todayISO();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Entrada de veículo</h1>
        <p className="text-sm text-zinc-700">Registre uma entrada.</p>
      </div>

      <form
        action={registerVehicleEntry}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Veículo *</span>
            <select
              name="vehicleId"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Selecione</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate}
                  {v.brand || v.model ? ` • ${[v.brand, v.model].filter(Boolean).join(" ")}` : ""}
                  {typeof v.odometer === "number" ? ` • Odômetro: ${v.odometer}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Data *</span>
            <input
              name="entryDate"
              type="date"
              required
              defaultValue={today}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Odômetro *</span>
            <input
              name="odometer"
              type="number"
              min={0}
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Motorista / Origem</span>
            <input
              name="destination"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Opcional"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Observações</span>
            <textarea
              name="notes"
              className="min-h-16 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Opcional"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Confirmar Entrada
          </button>
          <Link
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/veiculos"
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
