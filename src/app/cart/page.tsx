"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, products } from "@/lib/data/products";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 text-muted-foreground">
          Your cart is empty. <Link className="underline" href="/products">Shop products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => {
              const p = getProduct(i.productId)!;
              return (
                <div key={i.id} className="flex gap-4 rounded-lg border p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="h-24 w-24 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(i.price)}</div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <label htmlFor={`qty-${i.id}`} className="text-muted-foreground">Qty</label>
                      <input
                        id={`qty-${i.id}`}
                        type="number"
                        min={1}
                        value={i.qty}
                        onChange={(e) => updateQty(i.productId, Math.max(1, Number(e.target.value)))}
                        className="w-16 rounded border bg-background px-2 py-1"
                      />
                      <button className="ml-auto text-red-600 hover:underline" onClick={() => removeItem(i.productId)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button className="text-sm underline text-muted-foreground" onClick={clear}>Clear cart</button>
          </div>

          <aside className="rounded-lg border p-4 h-fit">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Taxes and shipping calculated at checkout.</p>
            <Link href="/checkout" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90">Checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}