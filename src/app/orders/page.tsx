"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/data/products";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  customer?: any;
  status?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orders");
      const parsed: Order[] = raw ? JSON.parse(raw) : [];
      setOrders(parsed);
    } catch {
      setOrders([]);
    }
  }, []);

  if (orders === null) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Your orders</h1>
        <div className="mt-6 text-sm text-muted-foreground">Loading orders…</div>
      </main>
    );
  }

  const hasOrders = orders.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your orders</h1>
        <Link href="/products" className="text-sm underline">Continue shopping</Link>
      </div>

      {!hasOrders ? (
        <div className="mt-8 rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No orders yet. When you place an order, it will appear here.</p>
          <Link href="/products" className="mt-4 inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90">Shop products</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">
                    Placed on {new Date(order.date).toLocaleString()}
                    {order.status ? ` • ${order.status}` : null}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(order.subtotal)}</div>
                  <div className="text-xs text-muted-foreground">{order.items.reduce((n, i) => n + i.qty, 0)} item(s)</div>
                </div>
              </div>

              <div className="mt-4 divide-y">
                {order.items.map((i) => (
                  <div key={i.id} className="py-2 flex items-center justify-between text-sm">
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>

              {order.customer?.address?.line1 || order.customer?.address?.district ? (
                <div className="mt-4 rounded bg-secondary p-3 text-xs text-muted-foreground">
                  <div><span className="text-foreground">Delivery:</span> {order.customer?.address?.line1}</div>
                  {order.customer?.address?.district ? (
                    <div>District: {order.customer.address.district}</div>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-muted-foreground">Orders are stored on this device. Clearing site data will remove order history.</p>
    </main>
  );
}