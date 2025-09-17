/* Service Worker for yourduuka: local cart & orders storage */

const ORDERS_CACHE = "orders-v1";
const CART_CACHE = "cart-v1";

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};
  if (!type) return;

  if (type === "SAVE_ORDER") {
    event.waitUntil(saveOrder(payload));
  }
  if (type === "SYNC_CART") {
    event.waitUntil(saveCart(payload));
  }
});

async function saveOrder(order) {
  try {
    const cache = await caches.open(ORDERS_CACHE);
    const id = order?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const url = new URL(`/__orders/${id}`, self.location.origin).toString();
    await cache.put(
      url,
      new Response(JSON.stringify(order), {
        headers: { "Content-Type": "application/json", "X-Yourduuka": "order" },
      })
    );
  } catch (e) {
    // no-op
  }
}

async function saveCart(cart) {
  try {
    const cache = await caches.open(CART_CACHE);
    const url = new URL(`/__cart/current`, self.location.origin).toString();
    await cache.put(
      url,
      new Response(JSON.stringify(cart || {}), {
        headers: { "Content-Type": "application/json", "X-Yourduuka": "cart" },
      })
    );
  } catch (e) {
    // no-op
  }
}