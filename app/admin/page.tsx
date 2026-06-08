"use client";

import { useEffect, useState } from "react";

const STATS = [
  {
    icon: "pending_actions",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    label: "Pending Orders",
    value: "24",
    badge: "+12%",
    badgeColor: "text-secondary",
  },
  {
    icon: "print",
    iconBg: "bg-tertiary-container/20",
    iconColor: "text-tertiary",
    label: "Actively Printing",
    value: "08",
    badge: "Live",
    badgeColor: "text-primary",
  },
  {
    icon: "local_shipping",
    iconBg: "bg-secondary-container/20",
    iconColor: "text-secondary",
    label: "Ready for Pickup",
    value: "15",
    badge: "Today",
    badgeColor: "text-on-surface-variant",
  },
];

const ORDERS = [
  {
    initials: "EM",
    initialsColor: "text-primary",
    name: "Elena Moretti",
    id: "#IC-9921",
    item: "Heavyweight Hoodie",
    badge: "Pending",
    badgeBg: "bg-secondary-container",
    badgeText: "text-white",
  },
  {
    initials: "JS",
    initialsColor: "text-tertiary",
    name: "Julian Schmidt",
    id: "#IC-9920",
    item: "Premium Cotton Tee",
    badge: "Printed",
    badgeBg: "bg-primary/20",
    badgeText: "text-primary",
  },
];

const ASSETS = [
  {
    src: "https://lh3.googleusercontent.com/aida/AP1WRLuxdKVaAv-3YpNZHUwxugJh13AuXBwPv-eFEzyS4uQpsifFyEJVnTQDwwf60IaJTaWNAFgAEOfLVE2xpUul3LA3SeUkrkgrwoRENBvoQhAhjro-v6hT83R4oij3fAS_BxnlZYJlgoU1T8jw7vJiz6brQMOxccPfr65ub6viFzlatD7XY6LHl_NVm0ekdQTsKY9PsHco2YlFfw7-3II8DgOcltqmczD1q570qD_OY1Ok232YrVmy36KbTQdr",
    title: "Aura Abstract v.2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida/AP1WRLuUirhnXtryQqyWMUdlcrX-u8OCZcmrtWMItAtBzh6l9Cp8ox3_C9LTV5o-zjCqHX3_-Rc4au9Hgv2IhsJcreGCUtPvy1OwcFUz6_6sWSuUYylRToEGBemk4IT6IrRZ1uewRyXzqhYANdKHmLlGH5LFojYzzuweXevz9sN3n43mLPIWHbdhJuqvUf9KyWUKXKRnKEAaslw87kcyncjxWtBq-PKBgu_p1IkKaRJ6LkWEDot2-wnAZW3kNXKu",
    title: "Cyber Gold Monogram",
  },
  {
    src: "https://lh3.googleusercontent.com/aida/AP1WRLuZ3DCqRmFucExjD2JMQvpuS7zqo7z_lQSj53gNBmG3lAm89PlFGweFyAA8W8U7rtqP-vD1zygqDVjCgyk-u5yVkLaqQsVmTWVRkdEq5VrfO5LTTtzopGty8H8U7v9Tb272n86Bpc-sK2-lG138fMWE8XaNFZ3uPYTEAHqnfz7q7RXTw6fW7ZP15WjU8ROCp6seC7Ztt28g0dSwqHzVKgdjtXWO9Qkpr1OXuxJWimNGWYk4-UX6pC5R2F8",
    title: "Velvet Flow 04",
  },
];

export default function AdminPage() {
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({
    backgroundColor: "#0d1b2a",
    backgroundImage:
      "radial-gradient(circle at 0% 0%, rgba(232,160,32,0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(142,28,28,0.05) 0%, transparent 50%)",
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setBgStyle({
        backgroundColor: "#0d1b2a",
        backgroundImage: `
          radial-gradient(circle at ${x}% ${y}%, rgba(232,160,32,0.08) 0%, transparent 40%),
          radial-gradient(circle at 0% 0%, rgba(232,160,32,0.05) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(142,28,28,0.05) 0%, transparent 50%)
        `,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="text-on-surface min-h-screen flex" style={bgStyle}>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-surface-container border-b border-white/5 flex items-center justify-between px-md z-50">
        <div className="flex items-center gap-sm">
          <h1 className="text-title-md text-primary font-bold">InkCraft</h1>
        </div>
        <div className="flex items-center gap-md">
          <a href="/" className="text-on-surface hover:text-primary transition-colors text-body-md text-sm">Shop</a>
          <a href="/design" className="text-on-surface hover:text-primary transition-colors text-body-md text-sm">Design</a>
          <a href="/admin" className="text-primary font-bold border-b-2 border-primary pb-0.5 text-body-md text-sm">Admin</a>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida/AP1WRLujTISuzMFgy_kA9pnNhVWNvF15RKYx8My7j5hC61egsHtNytb_m_H2elpGkZdnXSOpL_omb3C9QGJWBQsd5M0gsQYic2oV7G3mmLBnOybk9sC7UdB405zUM-AR0NflQccHTzffjQfP5AS7kXjEAHwxeNSH25pBfd1uizbU-Z11xcrPapjQODBpvROYsFYej4DZXy75lLF_4C-4T-0gCtJkvUHpBleA-RdDfN5FRS5DW2WB8ul4wtYvaUva"
            alt="Admin User Profile"
            className="object-cover w-full h-full"
          />
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 p-md pt-20 max-w-3xl mx-auto w-full">
        {/* Page Header */}
        <header className="flex flex-col gap-md mb-lg">
          <div>
            <h2 className="text-headline-lg text-on-surface">Production Overview</h2>
            <p className="text-body-md text-on-surface-variant">
              Tracking your craftsmanship across 12 active print queues.
            </p>
          </div>
          <div className="flex gap-base">
            <button className="bg-surface-container-high text-on-surface text-label-md px-md py-sm rounded-lg flex items-center gap-xs hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="bg-primary text-on-primary text-label-md px-md py-sm rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
              + New Batch
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-sm mb-xl">
          {STATS.map(({ icon, iconBg, iconColor, label, value, badge, badgeColor }) => (
            <div key={label} className="glass-card p-sm rounded-xl">
              <div className="flex justify-between items-start mb-base">
                <span className={`p-xs ${iconBg} rounded-lg`}>
                  <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                </span>
                <span className={`${badgeColor} text-label-md`}>{badge}</span>
              </div>
              <p className="text-label-md text-on-surface-variant">{label}</p>
              <h3 className="text-headline-lg text-primary">{value}</h3>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <section className="glass-card rounded-xl overflow-hidden shadow-2xl">
          {/* Section Header */}
          <div className="px-md py-md border-b border-white/5 flex items-center justify-between">
            <h4 className="text-title-md text-on-surface">Recent Orders</h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-surface-container-low border border-white/10 rounded-full pl-10 pr-md py-xs text-sm focus:border-primary outline-none transition-colors w-64"
              />
            </div>
          </div>

          {/* Order Rows */}
          <div className="p-md space-y-md">
            {ORDERS.map((order) => (
              <div key={order.id} className="glass-card rounded-xl p-md">
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex items-center gap-sm">
                    <div
                      className={`w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold ${order.initialsColor}`}
                    >
                      {order.initials}
                    </div>
                    <div>
                      <p className="text-label-md text-on-surface">{order.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{order.id}</p>
                    </div>
                  </div>
                  <span
                    className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase ${order.badgeBg} ${order.badgeText}`}
                  >
                    {order.badge}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-on-surface-variant">{order.item}</p>
                  <button className="text-primary text-sm text-label-md hover:underline">
                    View/Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-md py-md bg-white/5 flex items-center justify-between">
            <span className="text-caption text-on-surface-variant">
              Showing 4 of 1,248 orders
            </span>
            <div className="flex gap-sm">
              <button className="p-xs hover:bg-white/10 rounded transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-xs hover:bg-white/10 rounded transition-colors text-on-surface">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Trending Design Assets */}
        <section className="mt-xl">
          <h4 className="text-title-md text-on-surface mb-md">Trending Design Assets</h4>
          <div className="grid grid-cols-2 gap-sm">
            {ASSETS.map(({ src, title }) => (
              <div
                key={title}
                className="col-span-1 h-40 glass-card rounded-xl relative overflow-hidden group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-label-md text-primary">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-lg mt-xl border-t border-white/5 flex flex-col items-center gap-base">
          <p className="text-body-lg text-primary font-bold">InkCraft by David</p>
          <div className="flex gap-md flex-wrap justify-center">
            {["Terms of Service", "Contact Us", "Privacy Policy", "Shipping"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-caption text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-caption text-on-surface-variant mt-sm">
            © 2024 InkCraft by David. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
