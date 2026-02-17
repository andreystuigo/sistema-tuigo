"use client";

import { useMemo, useState } from "react";

type LaunchType = "INITIAL" | "ENTRY";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function StockLaunchFields({
  defaultType = "INITIAL",
  defaultQuantity = 0,
  defaultDate,
  showCurrentTotal,
}: {
  defaultType?: LaunchType;
  defaultQuantity?: number;
  defaultDate?: string;
  showCurrentTotal?: string;
}) {
  const [type, setType] = useState<LaunchType>(defaultType);

  const dateDefaultValue = useMemo(() => {
    if (defaultDate) return defaultDate;
    return todayISO();
  }, [defaultDate]);

  return (
    <>
      <label className="space-y-1">
        <span className="text-sm font-medium">Lançamentos</span>
        <select
          name="launchType"
          value={type}
          onChange={(e) => setType(e.target.value as LaunchType)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="INITIAL">Estoque inicial</option>
          <option value="ENTRY">Entrada</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium">Quantidade (lançamento)</span>
        <input
          name="launchQuantity"
          type="text"
          inputMode="numeric"
          defaultValue={defaultQuantity}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium">Data de entrada</span>
        <input
          name="entryDate"
          type="date"
          defaultValue={dateDefaultValue}
          required={type === "ENTRY"}
          disabled={type !== "ENTRY"}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-500"
        />
        <span className="text-xs text-zinc-600">
          {type === "ENTRY"
            ? "Obrigatório para Entrada."
            : "Opcional para Estoque inicial."}
          {showCurrentTotal ? ` ${showCurrentTotal}` : ""}
        </span>
      </label>
    </>
  );
}
