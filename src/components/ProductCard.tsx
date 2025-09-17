"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const img0 = product.images?.[0] || "";
  const isDirectImage = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(img0);
  return (
    <div className="group rounded-lg border bg-card hover:shadow-md transition overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {isDirectImage ? (
            <img
              src={img0}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-xs text-muted-foreground">
              Image preview unavailable
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-medium flex items-start justify-between gap-2">
            <span className="line-clamp-2">{product.name}</span>
          </div>
          <div className="text-muted-foreground text-sm mt-1">{formatPrice(product.price)}</div>
          <div className="mt-2 text-xs uppercase tracking-wide text-foreground/60">
            {product.category === "epl" ? "EPL Device" : "Facial Hair"}
          </div>
        </div>
      </Link>
    </div>
  );
}