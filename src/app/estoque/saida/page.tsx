import { registerStockExit } from "../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SaidaEstoquePage() {
  const produtos = await prisma.stockItem.findMany({
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, quantity: true, unit: true },
  });

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Saída de Materiais</h1>
        <p className="text-sm text-zinc-700">Registre uma saída/retirada de item.</p>
      </div>
      <form action={registerStockExit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Produto *</span>
            <select
              name="itemId"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Disponível: {p.quantity}{p.unit ? ` ${p.unit}` : ""})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Data *</span>
            <input
              name="exitDate"
              type="date"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Quantidade *</span>
            <input
              name="quantity"
              type="text"
              inputMode="numeric"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Ex.: 5"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Obra</span>
            <input
              name="obra"
              type="text"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Ex.: Obra Centro"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Tipo *</span>
            <select
              name="type"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Selecione um tipo</option>
              <option value="VENDA">Venda</option>
              <option value="APLICADO">Aplicado</option>
            </select>
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
            Confirmar Saída
          </button>
          <Link
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            href="/estoque"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
