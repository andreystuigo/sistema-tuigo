import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateVehicle } from "../../actions";

export default async function EditarVeiculoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateVehicle(id, formData);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Editar veículo</h1>
        <p className="text-sm text-zinc-700">Atualize os dados.</p>
      </div>

      <form
        action={action}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Placa *</span>
            <input
              name="plate"
              required
              defaultValue={vehicle.plate}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm uppercase outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Status</span>
            <select
              name="status"
              defaultValue={vehicle.status}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value={VehicleStatus.AVAILABLE}>Disponível</option>
              <option value={VehicleStatus.IN_USE}>Em uso</option>
              <option value={VehicleStatus.MAINTENANCE}>Manutenção</option>
              <option value={VehicleStatus.INACTIVE}>Inativo</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Marca</span>
            <input
              name="brand"
              defaultValue={vehicle.brand ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Modelo</span>
            <input
              name="model"
              defaultValue={vehicle.model ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Ano</span>
            <input
              name="year"
              inputMode="numeric"
              defaultValue={vehicle.year ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Odômetro</span>
            <input
              name="odometer"
              type="number"
              min={0}
              defaultValue={vehicle.odometer}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Observações</span>
            <textarea
              name="notes"
              defaultValue={vehicle.notes ?? ""}
              className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Salvar
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
