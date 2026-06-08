"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCart, removeFromCart, cartTotal, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => setItems(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener("inkcraft_cart_change", refresh);
    return () => window.removeEventListener("inkcraft_cart_change", refresh);
  }, []);

  const total = cartTotal(items);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-margin-desktop h-16 w-full max-w-7xl mx-auto">
          <Link href="/" className="text-title-md font-bold text-primary">InkCraft by David</Link>
          <div className="hidden md:flex gap-lg items-center">
            <Link href="/" className="text-on-surface hover:text-primary transition-colors text-body-md">Shop</Link>
            <Link href="/design" className="text-on-surface hover:text-primary transition-colors text-body-md">Design</Link>
            <Link href="/admin" className="text-on-surface hover:text-primary transition-colors text-body-md">Admin</Link>
          </div>
          <Link href="/cart" className="text-primary material-symbols-outlined p-2">shopping_cart</Link>
        </div>
      </nav>

      <main className="pt-28 pb-xl px-margin-desktop max-w-3xl mx-auto">
        <h1 className="text-headline-lg text-on-surface mb-lg">Your Cart</h1>

        {items.length === 0 ? (
          <div className="glass-card rounded-xl p-xl text-center">
            <span className="material-symbols-outlined text-on-surface-variant block mb-md" style={{ fontSize: 64 }}>
              shopping_cart
            </span>
            <p className="text-body-lg text-on-surface-variant mb-lg">Your cart is empty.</p>
            <Link
              href="/"
              className="inline-block bg-primary-container text-on-primary text-label-md px-lg py-md rounded-lg hover:brightness-110 transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.garmentSlug} className="glass-card rounded-xl p-md flex items-center gap-md">
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-container-high">
                  <Image src={item.garmentImageUrl} alt={item.garmentName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title-md text-on-surface truncate">{item.garmentName}</h3>
                  <p className="text-body-md text-on-surface-variant mt-xs">Qty: {item.qty}</p>
                  <p className="text-primary font-bold mt-xs">${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-sm shrink-0">
                  <Link
                    href={`/design?garment=${item.garmentSlug}`}
                    className="text-label-md text-primary hover:underline"
                  >
                    Edit Design
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.garmentSlug)}
                    className="text-label-md text-secondary hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="glass-card rounded-xl p-md mt-lg">
              <div className="flex justify-between items-center mb-md">
                <span className="text-body-md text-on-surface-variant">Subtotal</span>
                <span className="text-body-md text-on-surface">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-lg">
                <span className="text-body-md text-on-surface-variant">Shipping</span>
                <span className="text-body-md text-primary">{total >= 75 ? "Free" : "$9.99"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-md">
                <span className="text-title-md text-on-surface font-bold">Total</span>
                <span className="text-title-md text-primary font-bold">
                  ${(total >= 75 ? total : total + 9.99).toFixed(2)}
                </span>
              </div>
              <button className="w-full mt-lg bg-primary-container text-on-primary text-label-md py-md rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
