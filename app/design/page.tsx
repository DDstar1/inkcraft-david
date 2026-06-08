"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  fetchGarments,
  fetchDesignAssets,
  type Garment,
  type DesignAsset,
} from "@/lib/supabase/catalog";

type Tab = "assets" | "controls" | "garment";

const ICON_ASSETS = ["eco", "diamond", "auto_awesome", "architecture"];

const ALIGN_BUTTONS = [
  { icon: "align_horizontal_left" },
  { icon: "align_horizontal_center" },
  { icon: "align_horizontal_right" },
];

const GARMENT_COLORS = [
  { bg: "#ffffff", label: "White" },
  { bg: "#18181b", label: "Black" },
  { bg: "#0D2B3E", label: "Navy" },
  { bg: "#8B1A1A", label: "Crimson" },
];

// A design asset entry that can be a Supabase asset or a local upload
type ActiveAsset = {
  id: string;
  name: string;
  publicUrl: string;
};

function DesignEditor() {
  const searchParams = useSearchParams();
  const garmentSlug = searchParams.get("garment");

  // --- Catalog from Supabase ---
  const [garments, setGarments] = useState<Garment[]>([]);
  const [designAssets, setDesignAssets] = useState<DesignAsset[]>([]);
  const [activeGarment, setActiveGarment] = useState<Garment | null>(null);
  const [activeAsset, setActiveAsset] = useState<ActiveAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGarments(), fetchDesignAssets()])
      .then(([g, a]) => {
        setGarments(g);
        setDesignAssets(a);
        const preselected = garmentSlug ? g.find((x) => x.slug === garmentSlug) : null;
        setActiveGarment(preselected ?? g[0] ?? null);
        if (a.length) setActiveAsset(a[0]);
      })
      .finally(() => setLoading(false));
  }, [garmentSlug]);

  // --- Editor controls ---
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [selectedColor, setSelectedColor] = useState(0);

  // --- Drag state ---
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const startDrag = (clientX: number, clientY: number) => {
    isDragging.current = true;
    dragOrigin.current = { mx: clientX, my: clientY, px: pos.x, py: pos.y };
  };
  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    setPos({
      x: dragOrigin.current.px + (clientX - dragOrigin.current.mx),
      y: dragOrigin.current.py + (clientY - dragOrigin.current.my),
    });
  };
  const endDrag = () => { isDragging.current = false; };

  // Reset position when asset changes
  useEffect(() => { setPos({ x: 0, y: 0 }); }, [activeAsset?.id]);

  // --- Upload ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setActiveAsset({ id: `upload-${Date.now()}`, name: file.name, publicUrl: url });
    // Reset file input so the same file can be re-uploaded
    e.target.value = "";
  };

  // --- Cart ---
  const [cartCount, setCartCount] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const handleAddToCart = () => {
    setCartCount((n) => n + 1);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1500);
  };

  const graphicStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 160,
    height: 160,
    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale / 100}) rotate(${rotation}deg)`,
    opacity: opacity / 100,
    cursor: isDragging.current ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none",
    zIndex: 20,
  };

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile h-16 w-full max-w-7xl mx-auto">
          <div className="text-body-lg font-bold text-primary truncate max-w-[150px] sm:max-w-none">
            InkCraft by David
          </div>
          <div className="flex items-center gap-base">
            <button className="p-2 text-on-surface hover:text-primary transition-all md:hidden">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <nav className="hidden md:flex gap-md mr-md">
              <a href="/" className="text-on-surface hover:text-primary transition-colors duration-200 text-body-md">Shop</a>
              <a href="/design" className="text-primary font-bold border-b-2 border-primary pb-1 text-body-md">Design</a>
              <a href="/admin" className="text-on-surface hover:text-primary transition-colors duration-200 text-body-md">Admin</a>
            </nav>
            <button className="p-2 text-on-surface hover:text-primary transition-all relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2 text-on-surface hover:text-primary transition-all hidden sm:block">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Workspace */}
      <main className="flex-1 mt-16 mb-20 flex flex-col overflow-hidden">
        {/* Canvas */}
        <section
          className="flex-1 canvas-bg flex items-center justify-center relative p-md overflow-hidden min-h-[300px]"
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchEnd={endDrag}
        >
          {/* Mockup + graphic container */}
          <div className="relative w-full h-full max-w-md">
            {/* Garment mockup */}
            {activeGarment ? (
              <Image
                src={activeGarment.publicUrl}
                alt={activeGarment.name}
                fill
                className="object-contain pointer-events-none drop-shadow-2xl brightness-95"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-caption">
                {loading ? "Loading…" : "No garment selected"}
              </div>
            )}

            {/* Print area guide — pointer-events-none so it doesn't block drag */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: "8%" }}>
              <div className="w-[46%] h-[52%] border-2 border-dashed border-primary/30 rounded-sm relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-primary text-[8px] uppercase tracking-[0.2em] opacity-50 whitespace-nowrap">
                  Print Area
                </span>
              </div>
            </div>

            {/* Draggable graphic */}
            {activeAsset && (
              <div
                style={graphicStyle}
                onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
                onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
              >
                <Image
                  src={activeAsset.publicUrl}
                  alt={activeAsset.name}
                  fill
                  className="object-contain drop-shadow-lg pointer-events-none"
                  unoptimized={activeAsset.id.startsWith("upload-")}
                />
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-base bg-surface-container/60 backdrop-blur-md p-1 rounded-full border border-white/5">
            <button
              onClick={() => setScale((s) => Math.min(200, s + 10))}
              className="p-2 hover:bg-primary-container hover:text-on-primary rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>
            <button
              onClick={() => setScale((s) => Math.max(10, s - 10))}
              className="p-2 hover:bg-primary-container hover:text-on-primary rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-sm">zoom_out</span>
            </button>
          </div>
        </section>

        {/* Bottom Tabbed Panel */}
        <div className="h-1/2 sm:h-1/3 bg-surface-container-low border-t border-white/10 flex flex-col z-20">
          {/* Tab Headers */}
          <div className="flex border-b border-white/5 shrink-0">
            {(
              [
                { id: "assets", icon: "grid_view", label: "Assets" },
                { id: "controls", icon: "tune", label: "Edit" },
                { id: "garment", icon: "apparel", label: "Garment" },
              ] as { id: Tab; icon: string; label: string }[]
            ).map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-4 text-label-md text-on-surface-variant flex items-center justify-center gap-2 ${
                  activeTab === id ? "tab-active" : ""
                }`}
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar">

            {/* Assets Tab */}
            {activeTab === "assets" && (
              <div className="p-md space-y-md">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary-container text-on-primary text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined">upload</span>
                  Upload Graphic
                </button>

                {loading ? (
                  <p className="text-caption text-on-surface-variant text-center py-md">Loading assets…</p>
                ) : (
                  <div className="grid grid-cols-4 gap-sm">
                    {designAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => setActiveAsset(asset)}
                        className={`aspect-square glass-panel rounded-lg flex items-center justify-center cursor-pointer transition-all group overflow-hidden ${
                          activeAsset?.id === asset.id
                            ? "border border-primary/60 bg-white/10"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="relative w-10 h-10">
                          <Image
                            src={asset.publicUrl}
                            alt={asset.name}
                            fill
                            className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    ))}
                    {ICON_ASSETS.map((icon) => (
                      <div
                        key={icon}
                        className="aspect-square glass-panel rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
                      >
                        <span className="material-symbols-outlined text-2xl text-on-surface-variant">{icon}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Controls Tab */}
            {activeTab === "controls" && (
              <div className="p-md space-y-lg">
                <div className="space-y-md">
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-label-md text-on-surface-variant">Scale</label>
                      <span className="text-xs text-primary">{scale}%</span>
                    </div>
                    <input type="range" min={10} max={200} value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full touch-none" />
                  </div>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-label-md text-on-surface-variant">Rotation</label>
                      <span className="text-xs text-primary">{rotation}°</span>
                    </div>
                    <input type="range" min={-180} max={180} value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full touch-none" />
                  </div>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-label-md text-on-surface-variant">Opacity</label>
                      <span className="text-xs text-primary">{opacity}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full touch-none" />
                  </div>
                </div>
                <div className="space-y-sm">
                  <label className="text-label-md text-on-surface-variant">Alignment</label>
                  <div className="grid grid-cols-3 gap-sm">
                    {ALIGN_BUTTONS.map(({ icon }, i) => (
                      <button
                        key={icon}
                        onClick={() => {
                          if (i === 0) setPos((p) => ({ ...p, x: -80 }));
                          if (i === 1) setPos((p) => ({ ...p, x: 0 }));
                          if (i === 2) setPos((p) => ({ ...p, x: 80 }));
                        }}
                        className="h-12 rounded flex items-center justify-center glass-panel hover:bg-white/10 transition-colors"
                      >
                        <span className="material-symbols-outlined">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Garment Tab */}
            {activeTab === "garment" && (
              <div className="p-md space-y-md">
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-md">Color</label>
                  <div className="flex gap-md flex-wrap">
                    {GARMENT_COLORS.map(({ bg, label }, i) => (
                      <button
                        key={label}
                        aria-label={label}
                        onClick={() => setSelectedColor(i)}
                        className={`w-12 h-12 rounded-full cursor-pointer transition-all ${
                          selectedColor === i
                            ? "border-2 border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
                            : "border border-white/10"
                        }`}
                        style={{ backgroundColor: bg }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-sm">Garment Type</label>
                  {loading ? (
                    <p className="text-caption text-on-surface-variant">Loading…</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-sm">
                      {garments.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setActiveGarment(g)}
                          className={`flex flex-col items-center gap-xs p-sm rounded-lg transition-all glass-panel ${
                            activeGarment?.id === g.id
                              ? "border border-primary/60 bg-white/10"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="relative w-14 h-14">
                            <Image src={g.publicUrl} alt={g.name} fill className="object-contain" />
                          </div>
                          <span className="text-[10px] text-on-surface-variant text-center leading-tight line-clamp-2">{g.name}</span>
                          <span className="text-[10px] text-primary font-bold">${g.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="fixed bottom-0 w-full z-50 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
        <div className="flex justify-between items-center px-margin-mobile h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-surface rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
              {activeGarment && (
                <Image src={activeGarment.publicUrl} alt={activeGarment.name} fill className="object-cover" />
              )}
            </div>
            <div className="hidden sm:block">
              <h4 className="text-xs font-bold text-on-surface">{activeGarment?.name ?? "Select garment"}</h4>
              <p className="text-on-surface-variant text-[10px]">
                {activeGarment ? `$${activeGarment.price.toFixed(2)}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-md flex-1 justify-end">
            <p className="text-primary text-body-lg font-bold mr-sm">
              {activeGarment ? `$${activeGarment.price.toFixed(2)}` : ""}
            </p>
            <button
              onClick={handleAddToCart}
              className={`text-label-md px-lg py-3 rounded-lg transition-all shadow-lg ${
                cartAdded
                  ? "bg-primary text-on-primary scale-95"
                  : "bg-primary-container text-on-primary hover:brightness-110 active:scale-95 shadow-primary/20"
              }`}
            >
              {cartAdded ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-background" />}>
      <DesignEditor />
    </Suspense>
  );
}
