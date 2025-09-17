import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Shop Hair Removal</h1>
      <p className="text-muted-foreground mt-1">EPL and facial hair removal devices for women</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}