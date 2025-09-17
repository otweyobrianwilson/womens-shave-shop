"use client";

import { useEffect } from "react";

export const ServiceWorkerRegistrar = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          if (navigator.serviceWorker.controller) {
            try {
              const cartRaw = localStorage.getItem("cart");
              if (cartRaw) {
                navigator.serviceWorker.controller.postMessage({
                  type: "SYNC_CART",
                  payload: JSON.parse(cartRaw),
                });
              }
            } catch {}
          }
        })
        .catch(() => {});

      // Optionally listen for updates
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (!event?.data) return;
        // Handle messages from SW if needed
      });
    }
  }, []);

  return null;
};