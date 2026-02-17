"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function StockLocationFilter({
  locations,
  selected,
  basePath = "/estoque",
}: {
  locations: { slug: string; label: string; value: string }[];
  selected?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(selected ?? "");

  useEffect(() => {
    setValue(selected ?? "");
  }, [selected]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = event.target.value;
    setValue(newValue);

    if (newValue) {
      router.push(`${basePath}?loc=${encodeURIComponent(newValue)}`);
    } else {
      router.push(basePath);
    }
  }

  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-zinc-600">Filtrar por local</span>
      <select
        value={value}
        onChange={handleChange}
        className="w-full min-w-[180px] rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
      >
        <option value="">Todos</option>
        {locations.map((loc) => (
          <option key={loc.slug} value={loc.value}>
            {loc.label}
          </option>
        ))}
      </select>
    </label>
  );
}
