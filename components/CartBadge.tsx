"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, cartCount } from "@/lib/cart";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(getCart()));
    const sync = () => setCount(cartCount(getCart()));
    window.addEventListener("inkcraft_cart_change", sync);
    return () => window.removeEventListener("inkcraft_cart_change", sync);
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex p-2 text-on-surface hover:text-primary transition-all active:opacity-80">
      <span className="material-symbols-outlined">shopping_cart</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
