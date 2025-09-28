"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data/products";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash_on_delivery'>('mobile_money');
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "+256",
    district: "",
    landmark: "",
  });
  const router = useRouter();
  const { success, error, info } = useToast();

  const validUGPhone = /^\+256\d{9}$/; // e.g. +2567XXXXXXXX

  const handleMobileMoneyPayment = async () => {
    try {
      info("Processing payment...", "Please wait while we initiate your mobile money payment.");
      
      const tx_ref = `yourduuka-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: form.phone.replace('+', ''),
          amount: subtotal,
          email: form.email,
          customer_name: form.name,
          tx_ref: tx_ref,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(
          "Payment initiated!", 
          "Please complete the payment on your mobile device. You will be redirected shortly."
        );
        // Redirect to Flutterwave payment page
        if (data.redirect_url) {
          setTimeout(() => {
            window.location.href = data.redirect_url;
          }, 2000);
        }
      } else {
        throw new Error(data.error || 'Payment initiation failed');
      }
    } catch (err: any) {
      error("Payment failed", err.message || "Unable to process mobile money payment. Please try again.");
    }
  };

  const onPay = async () => {
    setMessage("");
    if (!validUGPhone.test(form.phone)) {
      setMessage("Enter a valid Ugandan phone number in +256 format (e.g., +2567XXXXXXXX)");
      error("Invalid phone number", "Please enter a valid Ugandan phone number");
      return;
    }
    if (!form.name || !form.email || !form.district || !form.landmark) {
      setMessage("Please fill in all required fields");
      error("Missing information", "Please fill in all required fields");
      return;
    }
    
    if (paymentMethod === 'mobile_money') {
      await handleMobileMoneyPayment();
      return;
    }

    try {
      setProcessing(true);
      const customer = {
        name: form.name.trim(),
        email: form.email,
        phone: form.phone,
        address: {
          line1: form.landmark, // Delivery address is the nearest landmark
          district: form.district,
          landmark: form.landmark,
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        // Let external checkout handle redirect
        window.location.href = data.url;
        return;
      }

      // Fallback: locally persist order via Service Worker and localStorage
      const order = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        items,
        subtotal,
        customer,
        status: "placed",
      };
      try {
        if (navigator?.serviceWorker?.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "SAVE_ORDER", payload: order });
        }
      } catch {}
      try {
        const prev = JSON.parse(localStorage.getItem("orders") || "[]");
        localStorage.setItem("orders", JSON.stringify([order, ...prev]));
      } catch {}

      clear();
      success("Order placed!", "Your order has been placed successfully. You will receive a confirmation shortly.");
      router.push("/success");
    } catch (e) {
      setMessage("Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        {message ? (
          <div className="rounded border bg-amber-50 text-amber-900 px-3 py-2 text-sm">{message}</div>
        ) : null}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            className="sm:col-span-2 rounded border bg-background px-3 py-2"
            placeholder="Phone (Uganda +2567XXXXXXXX)"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <input
            className="rounded border bg-background px-3 py-2"
            placeholder="District"
            required
            value={form.district}
            onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
          />
          <input
            className="rounded border bg-background px-3 py-2"
            placeholder="Nearest landmark (Delivery address)"
            required
            value={form.landmark}
            onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
          />
        </form>
        
        {/* Payment Method Selection */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_money"
                checked={paymentMethod === 'mobile_money'}
                onChange={(e) => setPaymentMethod(e.target.value as 'mobile_money')}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium text-sm">Uganda Mobile Money</div>
                <div className="text-xs text-muted-foreground">Pay with MTN Money or Airtel Money</div>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash_on_delivery')}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium text-sm">Cash on Delivery</div>
                <div className="text-xs text-muted-foreground">Pay when your order is delivered</div>
              </div>
            </label>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border p-4">
        <h2 className="font-medium">Order Summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          disabled={processing || items.length === 0}
          onClick={onPay}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-foreground text-background px-4 py-2 hover:opacity-90 disabled:opacity-60"
        >
          {processing ? "Processing..." : paymentMethod === 'mobile_money' ? "Pay with Mobile Money" : "Place Order"}
        </button>
        <p className="text-xs text-muted-foreground mt-2">No account required. Your order is saved securely on this device.</p>
        <Link className="mt-3 inline-block text-sm underline" href="/cart">Back to cart</Link>
      </aside>
    </main>
  );
}