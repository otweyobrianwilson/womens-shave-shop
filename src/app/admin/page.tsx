"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = { id: string; name: string; price: number; qty: number };

type Order = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  status?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      district?: string;
      postal?: string;
      landmark?: string;
    };
  };
};

const ORDERS_CACHE = "orders-v1";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const collected: Order[] = [];

      // 1) From Cache Storage (service worker persisted)
      if (typeof window !== "undefined" && "caches" in window) {
        try {
          const cache = await caches.open(ORDERS_CACHE);
          const keys = await cache.keys();
          for (const req of keys) {
            try {
              const res = await cache.match(req);
              if (!res) continue;
              const data = (await res.json()) as Order;
              if (data && data.id) collected.push(data);
            } catch {}
          }
        } catch {}
      }

      // 2) From localStorage fallback
      try {
        const ls = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
        for (const o of ls) {
          if (!collected.find((c) => c.id === o.id)) collected.push(o);
        }
      } catch {}

      // Sort newest first
      collected.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(collected);
    } catch (e) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadOrders();
    }
  }, [authed]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Friday#123") {
      setAuthed(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold">Admin — Orders</h1>
        {error ? (
          <div className="mt-3 rounded border bg-amber-50 text-amber-900 px-3 py-2 text-sm">{error}</div>
        ) : null}
        <form onSubmit={handleAuth} className="mt-6 space-y-3">
          <input
            type="password"
            autoComplete="off"
            className="w-full rounded border bg-background px-3 py-2"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90" type="submit">
            Enter
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex items-center gap-2">
          <button onClick={loadOrders} className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-foreground/5">
            Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading...</p> : null}
      {error && !loading ? (
        <div className="mt-3 rounded border bg-amber-50 text-amber-900 px-3 py-2 text-sm">{error}</div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4">
        {orders.length === 0 && !loading ? (
          <div className="rounded border bg-card p-4 text-sm text-muted-foreground">No orders found.</div>
        ) : null}

        {orders.map((o) => (
          <div key={o.id} className="rounded border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">Order #{o.id.slice(0, 8)}</div>
              <div className="text-muted-foreground">{new Date(o.date).toLocaleString()}</div>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Customer</div>
                <div>{o.customer?.name || "-"}</div>
                <div className="text-muted-foreground">{o.customer?.email || "-"}</div>
                <div className="text-muted-foreground">{o.customer?.phone || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Delivery Address</div>
                <div>{o.customer?.address?.line1 || "-"}</div>
                <div className="text-muted-foreground">
                  {[o.customer?.address?.city, o.customer?.address?.district, o.customer?.address?.postal].filter(Boolean).join(", ") || "-"}
                </div>
                {o.customer?.address?.landmark ? (
                  <div className="text-muted-foreground">Landmark: {o.customer.address.landmark}</div>
                ) : null}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Summary</div>
                <div>Items: {o.items?.reduce((n, i) => n + (i.qty || 0), 0)}</div>
                <div>Subtotal: UGX {o.subtotal?.toLocaleString("en-UG")}</div>
                <div className="text-muted-foreground">Status: {o.status || "placed"}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Items</div>
              <ul className="mt-1 text-sm list-disc pl-5">
                {o.items?.map((i) => (
                  <li key={i.id}>
                    {i.name} × {i.qty} — UGX {(i.price * i.qty).toLocaleString("en-UG")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}