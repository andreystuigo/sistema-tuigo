"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "AVAILABLE", label: "Disponível" },
  { value: "IN_USE", label: "Em uso" },
  { value: "MAINTENANCE", label: "Manutenção" },
  { value: "LOST", label: "Perdida" },
];

export default function ToolFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [produto, setProduto] = useState(searchParams.get("produto") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const params = new URLSearchParams();
    if (produto) params.set("produto", produto);
    if (newStatus) params.set("status", newStatus);
    router.push(`/ferramentas${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleProdutoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePesquisar();
    }
  };

  const handlePesquisar = () => {
    const params = new URLSearchParams();
    if (produto) params.set("produto", produto);
    if (status) params.set("status", status);
    router.push(`/ferramentas${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-end gap-4">
        <label className="flex-1 space-y-1">
          <span className="text-sm font-medium">Produto</span>
          <input
            type="text"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            onKeyDown={handleProdutoKeyDown}
            placeholder="Digite o nome do produto"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </label>

        <label className="flex-1 space-y-1">
          <span className="text-sm font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handlePesquisar}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
}
