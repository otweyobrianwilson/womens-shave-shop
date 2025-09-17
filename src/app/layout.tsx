import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "yourduuka — Hair & Beauty Devices",
  description: "Shop at-home EPL and facial hair removal devices. Gentle, effective, and designed for silky smooth confidence.",
  keywords: "hair removal, EPL devices, facial hair remover, women's beauty, smooth skin, at-home beauty",
  authors: [{ name: "yourduuka" }],
  creator: "yourduuka",
  publisher: "yourduuka",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "yourduuka — Hair & Beauty Devices",
    description: "Shop premium EPL and facial hair removal devices for silky smooth confidence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "yourduuka — Hair & Beauty Devices",
    description: "Shop premium EPL and facial hair removal devices for silky smooth confidence",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CartProvider>
          <Header />
          {/* Register SW for local cart & orders storage */}
          <ServiceWorkerRegistrar />
          {children}
        </CartProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}