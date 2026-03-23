import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTool } from "./actions";
import ToolFilters from "./ToolFilters";
import { toolLocationFromSlug, toolSlugFromLocation } from "./toolLocations";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function FerramentasPage({
  searchParams,
}: {
  searchParams?: Promise<{ produto?: string; loc?: string }>;
}) {
  const params = await searchParams;

  const where: Prisma.ToolEquipmentWhereInput = {};

  // Filtro por produto
  if (params?.produto) {
    where.name = { contains: params.produto };
  }

  const selectedLocation = toolLocationFromSlug(params?.loc) ?? "Tuigo";
  const selectedSlug = toolSlugFromLocation(selectedLocation) ?? "tuigo";
  where.location = selectedLocation;
  where.quantity = { gt: 0 };

  const tools = await prisma.toolEquipment.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, code: true, createdAt: true, quantity: true, unit: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Ferramentas — Estoque {selectedLocation}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href={`/ferramentas/saida?loc=${selectedSlug}`}
          >
            Saída
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href={`/ferramentas/devolucao?loc=${selectedSlug}`}
          >
            Devolução
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/ferramentas/novo"
          >
            Nova ferramenta
          </Link>
        </div>
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
                <th className="px-4 py-3 font-medium">SKU Tuigo</th>
                <th className="px-4 py-3 font-medium">Quantidade</th>
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

                    <div className="mt-0.5 flex justify-end">
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-600">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-zinc-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4" />
                          <path d="M8 2v4" />
                          <path d="M3 10h18" />
                        </svg>
                        <span title="Data de entrada no sistema">
                          {dateFormatter.format(new Date(tool.createdAt))}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{tool.code ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {typeof tool.quantity === "number" ? tool.quantity : "—"}
                    {tool.unit ? ` ${tool.unit}` : ""}
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
