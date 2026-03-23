import { createStockItem } from "../actions";
import Link from "next/link";
import { locationFromSlug, slugFromValue, STOCK_LOCATIONS } from "../stockLocations";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NovoItemEstoquePage({
  searchParams,
}: {
  searchParams?: { loc?: string };
}) {
  const preselected = locationFromSlug(searchParams?.loc) ?? "Tuigo";
  const cancelHref = `/estoque/${slugFromValue(preselected)}`;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Novo item</h1>
        <p className="text-sm text-zinc-700">Cadastro de material.</p>
      </div>

      <form action={createStockItem} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="space-y-1 sm:col-span-3">
              <span className="text-sm font-medium">Produto *</span>
              <input
                name="name"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Ex.: Parafuso 10mm"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Fabricante</span>
              <input
                name="manufacturer"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Opcional"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="space-y-1">
              <span className="text-sm font-medium">Data *</span>
              <input
                name="entryDate"
                type="date"
                required
                defaultValue={todayISO()}
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
                defaultValue={1}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Unidade</span>
              <input
                name="unit"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Ex.: un, kg"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Valor</span>
              <input
                name="unitPrice"
                type="text"
                inputMode="decimal"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="R$ 0,00"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">SKU Tuigo</span>
              <input
                name="sku"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Opcional"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">SKU Fornecedor</span>
              <input
                name="supplierSku"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Opcional"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Localização *</span>
              <select
                name="location"
                required
                defaultValue={preselected}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              >
                {STOCK_LOCATIONS.map((loc) => (
                  <option key={loc.slug} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Categoria</span>
              <select
                name="category"
                defaultValue="NOVO"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              >
                <option value="NOVO">Novo</option>
                <option value="USADO">Usado</option>
                <option value="DEFEITO_PARCIAL">Defeito parcial</option>
              </select>
            </label>
          </div>
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
            href={cancelHref}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
