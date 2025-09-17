"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold text-lg">yourduuka</Link>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">Products</Link>
          {/* Admin link hidden as requested */}
          <Link href="/orders" className="hover:underline">Orders</Link>
          <Link href="/cart" className="relative hover:underline">
            Cart
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1 text-xs">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}