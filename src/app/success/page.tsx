"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    // Clear cart locally after returning from Stripe
    try {
      clear();
    } catch {}
  }, [clear]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold">Thank you for your purchase!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been received. A confirmation email will be sent shortly.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90">
            Continue shopping
          </Link>
          <Link href="/orders" className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-foreground/5">
            View orders
          </Link>
        </div>
      </div>
    </main>
  );
}