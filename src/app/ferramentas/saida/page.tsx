import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkoutTool } from "../actions";
import { toolLocationFromSlug, toolSlugFromLocation, TOOL_LOCATIONS } from "../toolLocations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FerramentasSaidaPage({
  searchParams,
}: {
  searchParams?: Promise<{ loc?: string }>;
}) {
  const params = await searchParams;
  const selectedLocation = toolLocationFromSlug(params?.loc) ?? "Tuigo";
  const selectedSlug = toolSlugFromLocation(selectedLocation) ?? "tuigo";

  const ferramentas = await prisma.toolEquipment.findMany({
    where: { location: selectedLocation, quantity: { gt: 0 } },
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, code: true, quantity: true, unit: true },
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Saída de ferramenta</h1>
        <p className="text-sm text-zinc-700">Retire do estoque Tuigo (baixa a quantidade).</p>
        <div className="text-sm text-zinc-700">
          Localização: <span className="font-medium">{selectedLocation}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {TOOL_LOCATIONS.map((l) => (
            <Link
              key={l.slug}
              href={`/ferramentas/saida?loc=${l.slug}`}
              className={
                l.slug === selectedSlug
                  ? "inline-flex items-center justify-center rounded-md bg-zinc-900 px-2 py-1 text-sm font-medium text-white"
                  : "inline-flex items-center justify-center rounded-md border border-zinc-300 px-2 py-1 text-sm font-medium hover:bg-zinc-100"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <form
        action={checkoutTool}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <input type="hidden" name="location" value={selectedLocation} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Ferramenta *</span>
            <select
              name="toolId"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Selecione</option>
              {ferramentas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                  {f.code ? ` • SKU: ${f.code}` : ""}
                  {typeof f.quantity === "number"
                    ? ` • Disponível: ${f.quantity}${f.unit ? ` ${f.unit}` : ""}`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Quantidade *</span>
            <input
              name="quantity"
              required
              type="text"
              inputMode="numeric"
              defaultValue={1}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Data *</span>
            <input
              name="exitDate"
              type="date"
              required
              defaultValue={today}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Destino / Para onde vai *</span>
            <input
              name="destination"
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
              placeholder="Ex.: Obra Centro / Equipe X"
            />
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
            href="/ferramentas"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {ferramentas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
          <div className="text-base font-medium">Nenhuma ferramenta disponível</div>
          <p className="mt-1 text-sm text-zinc-600">Cadastre ferramentas ou devolva quantidades.</p>
        </div>
      ) : null}
    </div>
  );
}
