export const TOOL_LOCATIONS = [
  { slug: "tuigo", label: "Tuigo", value: "Tuigo" },
  { slug: "aparecida", label: "Aparecida", value: "Aparecida" },
] as const;

export type ToolLocationValue = (typeof TOOL_LOCATIONS)[number]["value"];
export type ToolLocationSlug = (typeof TOOL_LOCATIONS)[number]["slug"];

export function isToolLocation(value: string | null | undefined): value is ToolLocationValue {
  return TOOL_LOCATIONS.some((l) => l.value === value);
}

export function toolLocationFromSlug(
  slug: string | null | undefined,
): ToolLocationValue | null {
  if (!slug) return null;
  return TOOL_LOCATIONS.find((l) => l.slug === slug)?.value ?? null;
}

export function toolSlugFromLocation(
  value: string | null | undefined,
): ToolLocationSlug | null {
  if (!value) return null;
  return TOOL_LOCATIONS.find((l) => l.value === value)?.slug ?? null;
}
