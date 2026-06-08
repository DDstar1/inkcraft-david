"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartBadge from "./CartBadge";

const NAV_LINKS = [
  { href: "/", label: "Shop" },
  { href: "/design", label: "Design" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const path = usePathname();

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-margin-desktop h-16 w-full max-w-7xl mx-auto">
        <Link href="/" className="text-title-md font-bold text-primary whitespace-nowrap">
          InkCraft by David
        </Link>
        <div className="hidden md:flex gap-lg items-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                isActive(href)
                  ? "text-primary font-bold border-b-2 border-primary pb-1 text-body-md"
                  : "text-on-surface hover:text-primary transition-colors duration-200 text-body-md"
              }
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-md">
          <CartBadge />
          <button className="material-symbols-outlined text-on-surface hover:text-primary transition-all active:opacity-80">
            account_circle
          </button>
        </div>
      </div>
    </nav>
  );
}
