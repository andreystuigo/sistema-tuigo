import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTool } from "../../actions";
import { TOOL_LOCATIONS, isToolLocation } from "../../toolLocations";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function EditarFerramentaPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const tool = await prisma.toolEquipment.findUnique({ where: { id } });
  if (!tool) notFound();

  const defaultLocation = isToolLocation(tool.location) ? tool.location : "Tuigo";

  const defaultDate = tool.lastEntryAt
    ? new Date(tool.lastEntryAt).toISOString().slice(0, 10)
    : new Date(tool.createdAt).toISOString().slice(0, 10);

  async function action(formData: FormData) {
    "use server";
    await updateTool(id, formData);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Editar ferramenta</h1>
        <p className="text-sm text-zinc-700">Atualize os dados.</p>
      </div>

      <form
        action={action}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <label className="space-y-1 sm:col-span-3">
              <span className="text-sm font-medium">Produto *</span>
              <input
                name="name"
                required
                defaultValue={tool.name}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Fabricante</span>
              <input
                name="manufacturer"
                defaultValue={tool.manufacturer ?? ""}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
                placeholder="Opcional"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-sm font-medium">Data *</span>
              <input
                name="entryDate"
                type="date"
                required
                defaultValue={defaultDate}
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
                defaultValue={tool.quantity ?? 0}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Valor</span>
              <input
                name="unitPrice"
                type="text"
                inputMode="decimal"
                defaultValue={tool.unitPrice == null ? "" : currencyFormatter.format(tool.unitPrice)}
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
                defaultValue={tool.code ?? ""}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">SKU Fornecedor</span>
              <input
                name="supplierSku"
                defaultValue={tool.supplierSku ?? ""}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Localização *</span>
              <select
                name="location"
                required
                defaultValue={defaultLocation}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              >
                {TOOL_LOCATIONS.map((l) => (
                  <option key={l.slug} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Categoria</span>
              <select
                name="category"
                defaultValue={tool.category ?? "NOVO"}
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
            href="/ferramentas"
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
