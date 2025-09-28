"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data/products";

export default function HomePage() {
  const featured = products.slice(0, 3);
  return (
    <main>
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop"
          alt="Woman with smooth skin"
          className="h-[52vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-6xl px-4 py-10 w-full">
            <h1 className="text-3xl sm:text-4xl font-semibold">Silky smooth confidence, at home</h1>
            <p className="mt-2 text-muted-foreground max-w-xl">Shop premium EPL and facial hair removal devices designed for gentle, effective results on all your glow-up days.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90">Shop now</Link>
              <a href="#featured" className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-foreground/5">See featured</a>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured devices</h2>
            <p className="text-muted-foreground mt-1">Handpicked bestsellers customers love</p>
          </div>
          <Link href="/products" className="text-sm underline">Browse all</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 border-t border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium">EPL Hair Removal</h3>
            <p className="text-sm text-muted-foreground mt-1">Long-term reduction with comfortable at-home sessions.</p>
          </div>
          <div>
            <h3 className="font-medium">Facial Hair Solutions</h3>
            <p className="text-sm text-muted-foreground mt-1">Gentle peach-fuzz removal for makeup-ready skin.</p>
          </div>
          <div>
            <h3 className="font-medium">Free Shipping $50+</h3>
            <p className="text-sm text-muted-foreground mt-1">Fast delivery and 30-day returns on all devices.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Shop by category</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/products?category=epl" className="group relative overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://sc04.alicdn.com/kf/Hb7ed575a369a426caf2bd6104ce48980k.jpg" alt="EPL devices" className="h-64 w-full object-contain object-center bg-white group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 font-medium">EPL Devices</div>
          </Link>
          <Link href="/products?category=facial" className="group relative overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1400&auto=format&fit=crop" alt="Facial hair removal" className="h-64 w-full object-contain object-center bg-white group-hover:scale-[1.02] transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-4 left-4 font-medium">Facial Hair</div>
          </Link>
        </div>
      </section>
    </main>
  );
}