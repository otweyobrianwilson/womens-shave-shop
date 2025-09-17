"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 flex items-center justify-between">
        {/* Brand Section - Logo + Text */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 font-semibold hover:opacity-80 transition-opacity min-w-0">
          <Image 
            src="https://cdn.dribbble.com/userupload/17039932/file/original-983633d1f6de58f5d871f174ff34f057.jpg?format=webp&resize=1000x750&vertical=center" 
            alt="yourduuka logo" 
            width={140} 
            height={42}
            className="h-6 sm:h-8 w-auto flex-shrink-0"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
            yourduuka
          </span>
        </Link>
        
        {/* Navigation Section */}
        <nav className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm flex-shrink-0">
          <Link href="/products" className="hover:underline whitespace-nowrap">Products</Link>
          {/* Admin link hidden as requested */}
          <Link href="/orders" className="hover:underline whitespace-nowrap">Orders</Link>
          <Link href="/cart" className="relative hover:underline whitespace-nowrap">
            Cart
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1 text-xs">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}