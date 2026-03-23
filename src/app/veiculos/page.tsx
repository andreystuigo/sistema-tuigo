import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteVehicle } from "./actions";
import type { Vehicle } from "@prisma/client";

export default async function VeiculosPage() {
  const vehicles: Vehicle[] = await prisma.vehicle.findMany({
    orderBy: [{ plate: "asc" }],
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Veículos</h1>
          <p className="text-sm text-zinc-700">
            Cadastro básico de veículos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/veiculos/saida"
          >
            Saída
          </Link>

          <Link
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/veiculos/entrada"
          >
            Entrada
          </Link>

          <Link
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/veiculos/novo"
          >
            Novo veículo
          </Link>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
          <div className="text-base font-medium">Nenhum veículo ainda</div>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastre o primeiro veículo.
          </p>
          <Link
            className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/veiculos/novo"
          >
            Cadastrar veículo
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-700">
              <tr>
                <th className="px-4 py-3 font-medium">Placa</th>
                <th className="px-4 py-3 font-medium">Veículo</th>
                <th className="px-4 py-3 font-medium">Tag Veicular</th>
                <th className="px-4 py-3 font-medium">Odômetro</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    {vehicle.plate}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {vehicle.brand || vehicle.model ? (
                      <span>
                        {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                        {vehicle.year ? ` (${vehicle.year})` : ""}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{vehicle.tag ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {vehicle.odometer}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                        href={`/veiculos/${vehicle.id}/editar`}
                      >
                        Editar
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteVehicle(vehicle.id);
                        }}
                      >
                        <button
                          className="rounded-md px-2 py-1 text-sm text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                          type="submit"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
