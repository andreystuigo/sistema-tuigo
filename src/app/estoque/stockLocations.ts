export const STOCK_LOCATIONS = [
  { slug: "tuigo", label: "Tuigo", value: "Tuigo" },
  { slug: "qualilan", label: "Qualilan", value: "Qualilan" },
  { slug: "aparecida", label: "Aparecida", value: "Aparecida" },
  { slug: "uniformes", label: "Uniformes", value: "Uniformes" },
] as const;

export type StockLocationSlug = (typeof STOCK_LOCATIONS)[number]["slug"];
export type StockLocationValue = (typeof STOCK_LOCATIONS)[number]["value"];

export function locationFromSlug(
  slug: string | null | undefined,
): StockLocationValue | null {
  if (!slug) return null;
  return STOCK_LOCATIONS.find((l) => l.slug === slug)?.value ?? null;
}

export function slugFromValue(
  value: string | null | undefined,
): StockLocationSlug | null {
  if (!value) return null;
  return STOCK_LOCATIONS.find((l) => l.value === value)?.slug ?? null;
}

export function returnPathForLocation(value: string | null | undefined) {
  const slug = slugFromValue(value);
  return slug ? `/estoque/${slug}` : "/estoque/todos";
}
