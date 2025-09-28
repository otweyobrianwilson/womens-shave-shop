"use client";

import { products, formatPrice } from "@/lib/data/products";
import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import ImageGallery from "@/components/ImageGallery";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const { addItem } = useCart();

  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <ImageGallery 
          images={product.images} 
          productName={product.name} 
        />
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold flex-1">{product.name}</h1>
        </div>
        <div className="text-lg mt-2">{formatPrice(product.price)}</div>
        <p className="text-muted-foreground mt-4">{product.shortDescription}</p>

        <button
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90"
          onClick={() => addItem(product, 1)}
        >
          Add to cart
        </button>

        <div className="mt-8">
          <h2 className="font-medium">Specifications</h2>
          <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {product.specs.map((s) => (
              <div key={s.label} className="border rounded p-3 bg-card">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="text-sm">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8">
          <h2 className="font-medium">Description</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/80">{product.description}</p>
        </div>
      </div>
    </main>
  );
}