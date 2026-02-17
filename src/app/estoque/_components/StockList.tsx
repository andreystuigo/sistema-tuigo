import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteStockItem } from "../actions";
import type { StockItem } from "@prisma/client";
import { returnPathForLocation, STOCK_LOCATIONS } from "../stockLocations";
import StockFilters from "./StockFilters";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function StockList({
  title,
  location,
  produto,
  categoria,
  showFilter = false,
}: {
  title: string;
  location?: string;
  produto?: string;
  categoria?: string;
  showFilter?: boolean;
}) {
  const where: any = {};

  if (location) where.location = location;
  if (produto) where.name = { contains: produto };
  if (categoria) where.category = categoria;

  const items: StockItem[] = await prisma.stockItem.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ name: "asc" }],
  });

  // Get total exits for each item
  const exits = await prisma.stockExit.groupBy({
    by: ["itemId"],
    _sum: {
      quantity: true,
    },
  });

  const exitMap = new Map(exits.map((e) => [e.itemId, e._sum.quantity || 0]));

  const returnTo = showFilter
    ? `/estoque?loc=${encodeURIComponent(location ?? "")}${produto ? `&produto=${encodeURIComponent(produto)}` : ""}${categoria ? `&categoria=${encodeURIComponent(categoria)}` : ""}`.replace(/\?$/, "")
    : location
      ? returnPathForLocation(location)
      : "/estoque";
  const locSlug = STOCK_LOCATIONS.find((l) => l.value === location)?.slug;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/estoque/saidas"
          >
            Relatórios de Saída
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/estoque/saida"
          >
            Saída
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href={locSlug ? `/estoque/novo?loc=${locSlug}` : "/estoque/novo"}
          >
            Novo item
          </Link>
        </div>
      </div>

      {showFilter ? (
        <StockFilters
          selectedLocation={location}
          selectedProduto={produto}
          selectedCategoria={categoria}
        />
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
          <div className="text-base font-medium">Nenhum item aqui ainda</div>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastre o primeiro item para este local.
          </p>
          <Link
            className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href={locSlug ? `/estoque/novo?loc=${locSlug}` : "/estoque/novo"}
          >
            Cadastrar item
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-700">
              <tr>
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Preço Unit.</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Inicial</th>
                <th className="px-4 py-3 font-medium">Entradas</th>
                <th className="px-4 py-3 font-medium">Saída</th>
                <th className="px-4 py-3 font-medium">Total</th>
                {!location ? (
                  <th className="px-4 py-3 font-medium">Local</th>
                ) : null}
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {items.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-950">{item.name}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{item.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-700">
                      {item.unitPrice == null
                        ? "—"
                        : currencyFormatter.format(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {item.category === "USADO"
                        ? "Usado"
                        : (item.category as any) === "DEFEITO_PARCIAL"
                          ? "Defeito parcial"
                          : "Novo"}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {item.initialQuantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {item.entriesQuantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {exitMap.get(item.id) || 0}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-900">
                        {item.quantity}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>
                    </td>
                    {!location ? (
                      <td className="px-4 py-3 text-zinc-700">{item.location ?? "—"}</td>
                    ) : null}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                          href={`/estoque/${item.id}/editar?returnTo=${encodeURIComponent(returnTo)}`}
                        >
                          Editar
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteStockItem(item.id, returnTo);
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-zinc-600">Dica: use o filtro acima para ver por local.</div>
    </div>
  );
}
