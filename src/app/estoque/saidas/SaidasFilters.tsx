"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SaidasFilters({ produtos }: { produtos: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [produto, setProduto] = useState(searchParams.get("produto") || "");
  const [dataInicio, setDataInicio] = useState(searchParams.get("dataInicio") || "");
  const [dataFim, setDataFim] = useState(searchParams.get("dataFim") || "");
  const [obra, setObra] = useState(searchParams.get("obra") || "");
  const [tipo, setTipo] = useState(searchParams.get("tipo") || "");

  const handlePesquisar = () => {
    const params = new URLSearchParams();
    if (produto) params.set("produto", produto);
    if (dataInicio) params.set("dataInicio", dataInicio);
    if (dataFim) params.set("dataFim", dataFim);
    if (obra) params.set("obra", obra);
    if (tipo) params.set("tipo", tipo);

    const url = `/estoque/saidas${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  };

  const handleLimpar = () => {
    setProduto("");
    setDataInicio("");
    setDataFim("");
    setObra("");
    setTipo("");
    router.push("/estoque/saidas");
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-5">
        <label className="space-y-1">
          <span className="text-sm font-medium">Produto</span>
          <select
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Todos</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Data Início</span>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Data Fim</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Obra</span>
          <input
            type="text"
            value={obra}
            onChange={(e) => setObra(e.target.value)}
            placeholder="Ex.: Obra Centro"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Tipo</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Todos</option>
            <option value="VENDA">Venda</option>
            <option value="APLICADO">Aplicado</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePesquisar}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Pesquisar
        </button>
        <button
          onClick={handleLimpar}
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}
