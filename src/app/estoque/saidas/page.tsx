import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SaidasFilters from "./SaidasFilters";
import { ExitType, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SaidasReportPage({
  searchParams,
}: {
  searchParams?: Promise<{
    produto?: string;
    dataInicio?: string;
    dataFim?: string;
    obra?: string;
    tipo?: string;
  }>;
}) {
  const params = await searchParams;

  const where: Prisma.StockExitWhereInput = {};

  // Filtro por produto (itemId)
  if (params?.produto) {
    where.itemId = params.produto;
  }

  // Filtro por data início
  const exitDate: Prisma.DateTimeFilter = {};
  if (params?.dataInicio) {
    exitDate.gte = new Date(`${params.dataInicio}T00:00:00`);
  }

  // Filtro por data fim
  if (params?.dataFim) {
    exitDate.lte = new Date(`${params.dataFim}T23:59:59`);
  }

  if (exitDate.gte || exitDate.lte) {
    where.exitDate = exitDate;
  }

  // Filtro por obra
  if (params?.obra) {
    where.obra = { contains: params.obra };
  }

  // Filtro por tipo
  if (params?.tipo) {
    if (params.tipo === ExitType.VENDA || params.tipo === ExitType.APLICADO) {
      where.type = params.tipo;
    }
  }

  const saidas = await prisma.stockExit.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: {
      item: {
        select: { name: true, unit: true },
      },
    },
    orderBy: { exitDate: "desc" },
  });

  // Get all produtos for filter
  const produtos = await prisma.stockItem.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const typeLabels: Record<string, string> = {
    VENDA: "Venda",
    APLICADO: "Aplicado",
  };

  const typeColors: Record<string, string> = {
    VENDA: "bg-blue-100 text-blue-800",
    APLICADO: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Histórico de Saídas</h1>
        <p className="text-sm text-zinc-700">Visualize todas as saídas registradas no sistema com filtros.</p>
      </div>

      <SaidasFilters produtos={produtos} />

      {saidas.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Nenhuma saída encontrada com esses filtros.</p>
          <Link
            href="/estoque/saida"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Registrar Saída
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">Produto</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">Data</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">Qtd</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">Obra</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-700">Observações</th>
                </tr>
              </thead>
              <tbody>
                {saidas.map((saida) => (
                  <tr key={saida.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900">{saida.item?.name}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {dateFormatter.format(new Date(saida.exitDate))}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {saida.quantity}
                      {saida.item?.unit && <span className="text-zinc-500 ml-1">{saida.item.unit}</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {saida.obra || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          typeColors[saida.type] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {typeLabels[saida.type] || saida.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 max-w-xs truncate">
                      {saida.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-200 text-sm text-zinc-600">
            Total de saídas: <strong>{saidas.length}</strong>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Link
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/estoque/saida"
        >
          Nova Saída
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/estoque"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
