import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTool } from "./actions";
import type { ToolEquipment } from "@prisma/client";
import ToolFilters from "./ToolFilters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function statusLabel(status: ToolEquipment["status"]) {
  switch (status) {
    case "AVAILABLE":
      return "Disponível";
    case "IN_USE":
      return "Em uso";
    case "MAINTENANCE":
      return "Manutenção";
    case "LOST":
      return "Perdida";
    default:
      return status;
  }
}

export default async function FerramentasPage({
  searchParams,
}: {
  searchParams?: Promise<{ produto?: string; status?: string }>;
}) {
  const params = await searchParams;

  const where: any = {};

  // Filtro por produto
  if (params?.produto) {
    where.name = { contains: params.produto };
  }

  // Filtro por status
  if (params?.status) {
    where.status = params.status;
  }

  const tools: ToolEquipment[] = await prisma.toolEquipment.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ name: "asc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Ferramentas / Equipamentos
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          href="/ferramentas/novo"
        >
          Nova ferramenta
        </Link>
      </div>

      <ToolFilters />

      {tools.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
          <div className="text-base font-medium">Nenhuma ferramenta ainda</div>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastre o primeiro equipamento/ferramenta.
          </p>
          <Link
            className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/ferramentas/novo"
          >
            Cadastrar ferramenta
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-700">
              <tr>
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Responsável</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-950">{tool.name}</div>
                    {tool.serialNumber ? (
                      <div className="mt-0.5 text-xs text-zinc-600">
                        Série: {tool.serialNumber}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{tool.code ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {statusLabel(tool.status)}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {tool.assignedTo ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                        href={`/ferramentas/${tool.id}/editar`}
                      >
                        Editar
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTool(tool.id);
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
