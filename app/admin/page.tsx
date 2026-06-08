"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  fetchGarments,
  fetchDesignAssets,
  fetchOrders,
  updateOrderStatus,
  uploadGarmentImage,
  uploadDesignAsset,
  upsertGarment,
  upsertDesignAsset,
  type Garment,
  type DesignAsset,
  type Order,
} from "@/lib/supabase/catalog";

type AdminTab = "orders" | "garments" | "assets";

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "printing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-secondary-container text-white",
  printing: "bg-primary/20 text-primary",
  shipped: "bg-tertiary-container/40 text-tertiary",
  delivered: "bg-green-900/40 text-green-400",
  cancelled: "bg-red-900/30 text-red-400",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  // --- Catalog data ---
  const [garments, setGarments] = useState<Garment[]>([]);
  const [designAssets, setDesignAssets] = useState<DesignAsset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    Promise.all([fetchGarments(), fetchDesignAssets(), fetchOrders()])
      .then(([g, a, o]) => { setGarments(g); setDesignAssets(a); setOrders(o); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  // --- Atmospheric bg ---
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({
    backgroundColor: "#0d1b2a",
    backgroundImage:
      "radial-gradient(circle at 0% 0%, rgba(232,160,32,0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(142,28,28,0.05) 0%, transparent 50%)",
  });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setBgStyle({
        backgroundColor: "#0d1b2a",
        backgroundImage: `
          radial-gradient(circle at ${x}% ${y}%, rgba(232,160,32,0.08) 0%, transparent 40%),
          radial-gradient(circle at 0% 0%, rgba(232,160,32,0.05) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(142,28,28,0.05) 0%, transparent 50%)`,
      });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ---- Orders ----
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const handleStatusChange = async (id: string, status: Order["status"]) => {
    setUpdatingOrder(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ---- Garment upload ----
  const [uploadingGarment, setUploadingGarment] = useState<string | null>(null);
  const frontInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const backInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleGarmentImageUpload = async (
    garment: Garment,
    file: File,
    side: "front" | "back"
  ) => {
    setUploadingGarment(`${garment.id}-${side}`);
    try {
      const path = await uploadGarmentImage(file, garment.slug, side);
      await upsertGarment({
        ...garment,
        storage_path: side === "front" ? path : garment.storage_path,
        storage_path_back: side === "back" ? path : garment.storage_path_back,
      });
      reload();
    } finally {
      setUploadingGarment(null);
    }
  };

  // ---- New garment form ----
  const [showNewGarment, setShowNewGarment] = useState(false);
  const [newGarment, setNewGarment] = useState({ name: "", slug: "", price: "" });
  const [newGarmentFront, setNewGarmentFront] = useState<File | null>(null);
  const [newGarmentBack, setNewGarmentBack] = useState<File | null>(null);
  const [savingGarment, setSavingGarment] = useState(false);

  const handleAddGarment = async () => {
    if (!newGarment.name || !newGarment.slug || !newGarment.price || !newGarmentFront) return;
    setSavingGarment(true);
    try {
      const frontPath = await uploadGarmentImage(newGarmentFront, newGarment.slug, "front");
      const backPath = newGarmentBack
        ? await uploadGarmentImage(newGarmentBack, newGarment.slug, "back")
        : null;
      await upsertGarment({
        id: crypto.randomUUID(),
        name: newGarment.name,
        slug: newGarment.slug,
        storage_path: frontPath,
        storage_path_back: backPath,
        price: parseFloat(newGarment.price),
        display_order: garments.length,
      });
      setNewGarment({ name: "", slug: "", price: "" });
      setNewGarmentFront(null);
      setNewGarmentBack(null);
      setShowNewGarment(false);
      reload();
    } finally {
      setSavingGarment(false);
    }
  };

  // ---- New design asset form ----
  const [showNewAsset, setShowNewAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: "", slug: "" });
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [savingAsset, setSavingAsset] = useState(false);

  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.slug || !newAssetFile) return;
    setSavingAsset(true);
    try {
      const path = await uploadDesignAsset(newAssetFile, newAsset.slug);
      await upsertDesignAsset({
        id: crypto.randomUUID(),
        name: newAsset.name,
        slug: newAsset.slug,
        storage_path: path,
        display_order: designAssets.length,
      });
      setNewAsset({ name: "", slug: "" });
      setNewAssetFile(null);
      setShowNewAsset(false);
      reload();
    } finally {
      setSavingAsset(false);
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const printingCount = orders.filter((o) => o.status === "printing").length;

  return (
    <div className="text-on-surface min-h-screen flex flex-col" style={bgStyle}>
      <Navbar />

      <main className="flex-1 p-md pt-20 max-w-5xl mx-auto w-full">
        <header className="flex flex-col gap-md mb-lg">
          <div>
            <h2 className="text-headline-lg text-on-surface">Production Overview</h2>
            <p className="text-body-md text-on-surface-variant">
              {loading ? "Loading…" : `${orders.length} orders · ${garments.length} garments · ${designAssets.length} assets`}
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm mb-xl">
          {[
            { icon: "pending_actions", bg: "bg-secondary-container/20", color: "text-secondary", label: "Pending", value: pendingCount },
            { icon: "print", bg: "bg-primary-container/20", color: "text-primary", label: "Printing", value: printingCount },
            { icon: "checkroom", bg: "bg-tertiary-container/20", color: "text-tertiary", label: "Garments", value: garments.length },
            { icon: "brush", bg: "bg-secondary-container/20", color: "text-secondary", label: "Assets", value: designAssets.length },
          ].map(({ icon, bg, color, label, value }) => (
            <div key={label} className="glass-card p-sm rounded-xl">
              <div className="flex justify-between items-start mb-base">
                <span className={`p-xs ${bg} rounded-lg`}>
                  <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                </span>
              </div>
              <p className="text-label-md text-on-surface-variant">{label}</p>
              <h3 className="text-headline-lg text-primary">
                {loading ? "…" : String(value).padStart(2, "0")}
              </h3>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 mb-lg">
          {([
            { id: "orders", icon: "receipt_long", label: "Orders" },
            { id: "garments", icon: "checkroom", label: "Garments" },
            { id: "assets", icon: "brush", label: "Design Assets" },
          ] as { id: AdminTab; icon: string; label: string }[]).map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-xs px-md py-sm text-label-md transition-colors ${
                activeTab === id ? "tab-active" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <section className="glass-card rounded-xl overflow-hidden shadow-2xl">
            <div className="px-md py-md border-b border-white/5 flex items-center justify-between">
              <h4 className="text-title-md text-on-surface">Orders</h4>
              <span className="text-caption text-on-surface-variant">{orders.length} total</span>
            </div>
            {loading ? (
              <div className="p-xl text-center text-on-surface-variant text-body-md">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="p-xl text-center text-on-surface-variant text-body-md">No orders yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {orders.map((order) => (
                  <div key={order.id} className="p-md flex flex-col sm:flex-row sm:items-center gap-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-sm mb-xs">
                        <p className="text-label-md text-on-surface font-bold truncate">{order.customer_name}</p>
                        <span className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase shrink-0 ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">{order.customer_email}</p>
                      <p className="text-sm text-on-surface-variant mt-xs">
                        {order.garment_name} × {order.qty} — <span className="text-primary">${(order.price * order.qty).toFixed(2)}</span>
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-xs">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <select
                        value={order.status}
                        disabled={updatingOrder === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="bg-surface-container border border-white/10 rounded-lg px-sm py-xs text-sm text-on-surface focus:border-primary outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── GARMENTS TAB ── */}
        {activeTab === "garments" && (
          <section>
            <div className="flex justify-between items-center mb-md">
              <h4 className="text-title-md text-on-surface">Garment Catalog</h4>
              <button
                onClick={() => setShowNewGarment((v) => !v)}
                className="flex items-center gap-xs text-label-md px-md py-sm bg-primary-container text-on-primary rounded-lg hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Garment
              </button>
            </div>

            {/* New garment form */}
            {showNewGarment && (
              <div className="glass-card rounded-xl p-md mb-lg space-y-md">
                <h5 className="text-title-md text-on-surface">New Garment</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <input
                    placeholder="Name"
                    value={newGarment.name}
                    onChange={(e) => setNewGarment((p) => ({ ...p, name: e.target.value }))}
                    className="bg-surface-container border border-white/10 rounded-lg px-md py-sm text-on-surface text-sm focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Slug (e.g. classic-tee)"
                    value={newGarment.slug}
                    onChange={(e) => setNewGarment((p) => ({ ...p, slug: e.target.value }))}
                    className="bg-surface-container border border-white/10 rounded-lg px-md py-sm text-on-surface text-sm focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Price (e.g. 34.99)"
                    type="number"
                    value={newGarment.price}
                    onChange={(e) => setNewGarment((p) => ({ ...p, price: e.target.value }))}
                    className="bg-surface-container border border-white/10 rounded-lg px-md py-sm text-on-surface text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <label className="flex flex-col gap-xs cursor-pointer">
                    <span className="text-label-md text-on-surface-variant">Front Image *</span>
                    <div className="border border-dashed border-white/20 rounded-lg p-md text-center hover:border-primary transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewGarmentFront(e.target.files?.[0] ?? null)} />
                      <span className="material-symbols-outlined text-on-surface-variant block mb-xs">upload</span>
                      <p className="text-[11px] text-on-surface-variant">{newGarmentFront?.name ?? "Click to upload"}</p>
                    </div>
                  </label>
                  <label className="flex flex-col gap-xs cursor-pointer">
                    <span className="text-label-md text-on-surface-variant">Back Image (optional)</span>
                    <div className="border border-dashed border-white/20 rounded-lg p-md text-center hover:border-primary transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewGarmentBack(e.target.files?.[0] ?? null)} />
                      <span className="material-symbols-outlined text-on-surface-variant block mb-xs">upload</span>
                      <p className="text-[11px] text-on-surface-variant">{newGarmentBack?.name ?? "Click to upload"}</p>
                    </div>
                  </label>
                </div>
                <div className="flex gap-md justify-end">
                  <button onClick={() => setShowNewGarment(false)} className="text-on-surface-variant text-label-md px-md py-sm hover:text-on-surface transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGarment}
                    disabled={savingGarment || !newGarment.name || !newGarment.slug || !newGarment.price || !newGarmentFront}
                    className="bg-primary-container text-on-primary text-label-md px-lg py-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {savingGarment ? "Saving…" : "Save Garment"}
                  </button>
                </div>
              </div>
            )}

            {/* Garment list */}
            {loading ? (
              <div className="grid grid-cols-2 gap-md">
                {[...Array(4)].map((_, i) => <div key={i} className="h-56 glass-card rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
                {garments.map((g) => (
                  <div key={g.id} className="glass-card rounded-xl overflow-hidden">
                    {/* Front / Back image row */}
                    <div className="grid grid-cols-2 h-36">
                      {/* Front */}
                      <div className="relative bg-surface-container-high group">
                        {g.storage_path ? (
                          <Image src={g.publicUrl} alt={`${g.name} front`} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-[10px]">No front</div>
                        )}
                        <button
                          onClick={() => frontInputRefs.current[g.id]?.click()}
                          disabled={uploadingGarment === `${g.id}-front`}
                          className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Replace front image"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {uploadingGarment === `${g.id}-front` ? "hourglass_top" : "upload"}
                          </span>
                        </button>
                        <input
                          type="file" accept="image/*" className="hidden"
                          ref={(el) => { frontInputRefs.current[g.id] = el; }}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleGarmentImageUpload(g, f, "front"); e.target.value = ""; }}
                        />
                        <span className="absolute top-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded">FRONT</span>
                      </div>
                      {/* Back */}
                      <div className="relative bg-surface-container-highest group">
                        {g.publicUrlBack ? (
                          <Image src={g.publicUrlBack} alt={`${g.name} back`} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-[10px]">No back</div>
                        )}
                        <button
                          onClick={() => backInputRefs.current[g.id]?.click()}
                          disabled={uploadingGarment === `${g.id}-back`}
                          className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Upload back image"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {uploadingGarment === `${g.id}-back` ? "hourglass_top" : "upload"}
                          </span>
                        </button>
                        <input
                          type="file" accept="image/*" className="hidden"
                          ref={(el) => { backInputRefs.current[g.id] = el; }}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleGarmentImageUpload(g, f, "back"); e.target.value = ""; }}
                        />
                        <span className="absolute top-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded">BACK</span>
                      </div>
                    </div>
                    <div className="p-sm">
                      <p className="text-label-md text-on-surface font-bold truncate">{g.name}</p>
                      <p className="text-[11px] text-primary">${g.price.toFixed(2)}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{g.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── DESIGN ASSETS TAB ── */}
        {activeTab === "assets" && (
          <section>
            <div className="flex justify-between items-center mb-md">
              <h4 className="text-title-md text-on-surface">Design Assets</h4>
              <button
                onClick={() => setShowNewAsset((v) => !v)}
                className="flex items-center gap-xs text-label-md px-md py-sm bg-primary-container text-on-primary rounded-lg hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Asset
              </button>
            </div>

            {/* New asset form */}
            {showNewAsset && (
              <div className="glass-card rounded-xl p-md mb-lg space-y-md">
                <h5 className="text-title-md text-on-surface">New Design Asset</h5>
                <div className="grid grid-cols-2 gap-md">
                  <input
                    placeholder="Name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset((p) => ({ ...p, name: e.target.value }))}
                    className="bg-surface-container border border-white/10 rounded-lg px-md py-sm text-on-surface text-sm focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Slug (e.g. star-burst)"
                    value={newAsset.slug}
                    onChange={(e) => setNewAsset((p) => ({ ...p, slug: e.target.value }))}
                    className="bg-surface-container border border-white/10 rounded-lg px-md py-sm text-on-surface text-sm focus:border-primary outline-none"
                  />
                </div>
                <label className="flex flex-col gap-xs cursor-pointer">
                  <span className="text-label-md text-on-surface-variant">Image File *</span>
                  <div className="border border-dashed border-white/20 rounded-lg p-md text-center hover:border-primary transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewAssetFile(e.target.files?.[0] ?? null)} />
                    <span className="material-symbols-outlined text-on-surface-variant block mb-xs">upload</span>
                    <p className="text-[11px] text-on-surface-variant">{newAssetFile?.name ?? "Click to upload (PNG with transparency recommended)"}</p>
                  </div>
                </label>
                <div className="flex gap-md justify-end">
                  <button onClick={() => setShowNewAsset(false)} className="text-on-surface-variant text-label-md px-md py-sm hover:text-on-surface">Cancel</button>
                  <button
                    onClick={handleAddAsset}
                    disabled={savingAsset || !newAsset.name || !newAsset.slug || !newAssetFile}
                    className="bg-primary-container text-on-primary text-label-md px-lg py-sm rounded-lg hover:brightness-110 disabled:opacity-50"
                  >
                    {savingAsset ? "Saving…" : "Save Asset"}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-md">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-square glass-card rounded-xl animate-pulse" />)}
              </div>
            ) : designAssets.length === 0 ? (
              <p className="text-on-surface-variant text-body-md">No design assets yet.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-md">
                {designAssets.map((a) => (
                  <div key={a.id} className="glass-card rounded-xl overflow-hidden">
                    <div className="relative aspect-square bg-surface-container-high">
                      <Image src={a.publicUrl} alt={a.name} fill className="object-contain p-2" unoptimized />
                    </div>
                    <div className="px-sm pb-sm">
                      <p className="text-[11px] text-on-surface truncate">{a.name}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{a.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="w-full py-lg mt-xl border-t border-white/5 flex flex-col items-center gap-base">
          <p className="text-body-lg text-primary font-bold">InkCraft by David</p>
          <p className="text-caption text-on-surface-variant">© 2024 InkCraft by David. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
