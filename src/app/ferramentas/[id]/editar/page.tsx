import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateTool } from "../../actions";

export default async function EditarFerramentaPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const tool = await prisma.toolEquipment.findUnique({ where: { id } });
  if (!tool) notFound();

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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Produto *</span>
            <input
              name="name"
              required
              defaultValue={tool.name}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Código</span>
            <input
              name="code"
              defaultValue={tool.code ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Descrição</span>
            <textarea
              name="description"
              defaultValue={tool.description ?? ""}
              className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Nº de série</span>
            <input
              name="serialNumber"
              defaultValue={tool.serialNumber ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Status</span>
            <select
              name="status"
              defaultValue={tool.status}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value={ToolStatus.AVAILABLE}>Disponível</option>
              <option value={ToolStatus.IN_USE}>Em uso</option>
              <option value={ToolStatus.MAINTENANCE}>Manutenção</option>
              <option value={ToolStatus.LOST}>Perdida</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Responsável</span>
            <input
              name="assignedTo"
              defaultValue={tool.assignedTo ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium">Observações</span>
            <textarea
              name="notes"
              defaultValue={tool.notes ?? ""}
              className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
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
            href="/ferramentas"
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
