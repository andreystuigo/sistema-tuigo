"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STOCK_LOCATIONS } from "../stockLocations";

const CATEGORIES = ["NOVO", "USADO", "DEFEITO_PARCIAL"] as const;
const CATEGORY_LABELS = {
  NOVO: "Novo",
  USADO: "Usado",
  DEFEITO_PARCIAL: "Defeito parcial",
};

export default function StockFilters({
  selectedLocation,
  selectedProduto,
  selectedCategoria,
}: {
  selectedLocation?: string;
  selectedProduto?: string;
  selectedCategoria?: string;
}) {
  const router = useRouter();
  const [local, setLocal] = useState(selectedLocation ?? "");
  const [produto, setProduto] = useState(selectedProduto ?? "");
  const [categoria, setCategoria] = useState(selectedCategoria ?? "");

  function buildUrl() {
    const params = new URLSearchParams();
    if (local) params.set("loc", local);
    if (produto) params.set("produto", produto);
    if (categoria) params.set("categoria", categoria);

    const query = params.toString();
    return query ? `/estoque?${query}` : "/estoque";
  }

  function handleChange() {
    router.push(buildUrl());
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="space-y-1">
        <span className="text-xs font-medium text-zinc-600">Local</span>
        <select
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            const newParams = new URLSearchParams();
            if (e.target.value) newParams.set("loc", e.target.value);
            if (produto) newParams.set("produto", produto);
            if (categoria) newParams.set("categoria", categoria);
            const query = newParams.toString();
            router.push(query ? `/estoque?${query}` : "/estoque");
          }}
          className="w-full min-w-[140px] rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="">Todos</option>
          {STOCK_LOCATIONS.map((loc) => (
            <option key={loc.slug} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-medium text-zinc-600">Categoria</span>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            const newParams = new URLSearchParams();
            if (local) newParams.set("loc", local);
            if (produto) newParams.set("produto", produto);
            if (e.target.value) newParams.set("categoria", e.target.value);
            const query = newParams.toString();
            router.push(query ? `/estoque?${query}` : "/estoque");
          }}
          className="w-full min-w-[140px] rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="">Todas</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-medium text-zinc-600">Produto</span>
        <input
          type="text"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleChange();
          }}
          placeholder="Buscar..."
          className="w-full min-w-[140px] rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </label>

      <button
        onClick={handleChange}
        className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Pesquisar
      </button>
    </div>
  );
}
