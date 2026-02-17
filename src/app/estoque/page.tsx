import StockList from "./_components/StockList";
import { STOCK_LOCATIONS } from "./stockLocations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EstoqueIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ loc?: string; produto?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const locParam = params?.loc;
  const produtoParam = params?.produto;
  const categoriaParam = params?.categoria;
  const selectedLocation = STOCK_LOCATIONS.find(
    (loc) => loc.value === locParam || loc.slug === locParam,
  )?.value;

  return (
    <StockList
      title="Controle de Estoque"
      location={selectedLocation}
      produto={produtoParam}
      categoria={categoriaParam}
      showFilter
    />
  );
}
