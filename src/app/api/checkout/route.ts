import { NextResponse } from "next/server";
import Stripe from "stripe";

// Create Stripe Checkout Session
export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "NZ", "IE", "DE", "FR", "ES", "IT"] },
      line_items: items.map((i: any) => ({
        price_data: {
          currency: "usd",
          unit_amount: i.price, // cents
          product_data: {
            name: i.name,
            images: i.image ? [i.image] : undefined,
          },
        },
        quantity: i.qty,
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("/api/checkout error", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}