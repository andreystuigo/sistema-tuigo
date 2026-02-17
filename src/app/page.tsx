import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    stockTotal,
    toolsTotal,
    toolsInUse,
    toolsMaintenance,
    vehiclesTotal,
    vehiclesInUse,
    vehiclesMaintenance,
  ] = await Promise.all([
    prisma.stockItem.count(),
    prisma.toolEquipment.count(),
    prisma.toolEquipment.count({ where: { status: "IN_USE" } }),
    prisma.toolEquipment.count({ where: { status: "MAINTENANCE" } }),
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "IN_USE" } }),
    prisma.vehicle.count({ where: { status: "MAINTENANCE" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sistema de Controle
        </h1>
        <p className="max-w-2xl text-sm text-zinc-700">
          Esboço básico para controle de estoque, equipamentos/ferramentas e
          veículos. Estrutura pensada para ser simples, consistente e fácil de
          evoluir.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-700">Estoque</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {stockTotal}
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Itens cadastrados
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-700">Ferramentas</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {toolsTotal}
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            {toolsInUse} em uso • {toolsMaintenance} em manutenção
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-700">Veículos</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {vehiclesTotal}
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            {vehiclesInUse} em uso • {vehiclesMaintenance} em manutenção
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-700">Atalhos</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              href="/estoque/novo"
            >
              Novo item
            </Link>
            <Link
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              href="/ferramentas/novo"
            >
              Nova ferramenta
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Módulos">
        <Link
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/estoque"
        >
          <div className="text-base font-medium">Estoque</div>
          <div className="mt-1 text-sm text-zinc-600">
            Itens, lançamentos, categoria e localização.
          </div>
        </Link>

        <Link
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/ferramentas"
        >
          <div className="text-base font-medium">Ferramentas</div>
          <div className="mt-1 text-sm text-zinc-600">
            Status, responsável e observações.
          </div>
        </Link>

        <Link
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/veiculos"
        >
          <div className="text-base font-medium">Veículos</div>
          <div className="mt-1 text-sm text-zinc-600">
            Placa, status, odômetro e anotações.
          </div>
        </Link>
      </section>
    </div>
  );
}
