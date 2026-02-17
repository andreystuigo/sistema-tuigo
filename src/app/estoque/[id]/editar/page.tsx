import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateStockItem } from "../../actions";
import { slugFromValue, STOCK_LOCATIONS } from "../../stockLocations";
import StockLaunchFields from "../../_components/StockLaunchFields";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function EditarItemEstoquePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { returnTo?: string };
}) {
  const { id } = params;

  const returnToRaw = searchParams?.returnTo;
  const returnTo = typeof returnToRaw === "string" && returnToRaw.startsWith("/estoque") ? returnToRaw : undefined;

  const item = await prisma.stockItem.findUnique({ where: { id } });
  if (!item) notFound();

  const defaultLocation =
    item.location && STOCK_LOCATIONS.some((l) => l.value === item.location) ? item.location : "Tuigo";
  const backHref = returnTo ?? `/estoque/${slugFromValue(defaultLocation)}`;
  const totalQuantity = item.initialQuantity + item.entriesQuantity;
  const totalText = `Total atual: ${totalQuantity}${item.unit ? ` ${item.unit}` : ""}.`;

  async function action(formData: FormData) {
    "use server";
    await updateStockItem(id, formData);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Editar item</h1>
        <p className="text-sm text-zinc-700">Atualize os dados do item.</p>
      </div>

      <form action={action} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="space-y-1">
            <span className="text-sm font-medium">Localização *</span>
            <select
              name="location"
              required
              defaultValue={defaultLocation}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              {STOCK_LOCATIONS.map((loc) => (
                <option key={loc.slug} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </label>

          <StockLaunchFields
            defaultType="ENTRY"
            defaultQuantity={0}
            defaultDate={item.lastEntryAt ? item.lastEntryAt.toISOString().slice(0, 10) : undefined}
            showCurrentTotal={totalText}
          />

          <div className="grid gap-4 sm:col-span-4 sm:grid-cols-5">
            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium">Produto *</span>
              <input
                name="name"
                required
                defaultValue={item.name}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">SKU Tuigo</span>
              <input
                name="sku"
                defaultValue={item.sku ?? ""}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">SKU Fornecedor</span>
              <input
                name="supplierSku"
                defaultValue={item.supplierSku ?? ""}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Preço Unitário</span>
              <input
                name="unitPrice"
                type="text"
                inputMode="decimal"
                defaultValue={item.unitPrice == null ? "" : currencyFormatter.format(item.unitPrice)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="R$ 0,00"
              />
            </label>
          </div>

          <label className="space-y-1">
            <span className="text-sm font-medium">Categoria</span>
            <select
              name="category"
              defaultValue={item.category}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="NOVO">Novo</option>
              <option value="USADO">Usado</option>
              <option value="DEFEITO_PARCIAL">Defeito parcial</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Quantidade</span>
            <input
              name="itemQuantity"
              type="text"
              inputMode="numeric"
              defaultValue={item.itemQuantity}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Unidade</span>
            <input
              name="unit"
              defaultValue={item.unit ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Fabricante</span>
            <input
              name="manufacturer"
              defaultValue={item.manufacturer ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
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
            href={backHref}
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
