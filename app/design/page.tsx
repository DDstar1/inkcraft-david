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
import { addToCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";

const CANVAS_SIZE = 900;

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function exportDesignToPng(
  garmentUrl: string | null,
  design: SideDesign,
  side: Side,
  garmentName: string
) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d")!;

  // background
  ctx.fillStyle = "#1a3a50";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // garment
  if (garmentUrl) {
    try {
      const gImg = await loadImg(garmentUrl);
      ctx.drawImage(gImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } catch {
      // garment image failed CORS — skip silently
    }
  }

  // graphic overlay
  if (design.asset) {
    try {
      const aImg = await loadImg(design.asset.publicUrl);
      const size = 160 * (design.scale / 100);
      const cx = CANVAS_SIZE / 2 + design.pos.x * (CANVAS_SIZE / 500);
      const cy = CANVAS_SIZE / 2 + design.pos.y * (CANVAS_SIZE / 500);
      ctx.save();
      ctx.globalAlpha = design.opacity / 100;
      ctx.translate(cx, cy);
      ctx.rotate((design.rotation * Math.PI) / 180);
      const drawSize = size * (CANVAS_SIZE / 500);
      ctx.drawImage(aImg, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
    } catch {
      // asset image failed — skip silently
    }
  }

  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inkcraft-${garmentName.toLowerCase().replace(/\s+/g, "-")}-${side}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

type Tab = "assets" | "controls" | "garment";
type Side = "front" | "back";

type ActiveAsset = {
  id: string;
  name: string;
  publicUrl: string;
};

type SideDesign = {
  asset: ActiveAsset | null;
  pos: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
};

const DEFAULT_SIDE: SideDesign = {
  asset: null,
  pos: { x: 0, y: 0 },
  scale: 100,
  rotation: 0,
  opacity: 100,
};

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

function DesignEditor() {
  const searchParams = useSearchParams();
  const garmentSlug = searchParams.get("garment");

  // --- Catalog ---
  const [garments, setGarments] = useState<Garment[]>([]);
  const [designAssets, setDesignAssets] = useState<DesignAsset[]>([]);
  const [activeGarment, setActiveGarment] = useState<Garment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGarments(), fetchDesignAssets()])
      .then(([g, a]) => {
        setGarments(g);
        setDesignAssets(a);
        const preselected = garmentSlug ? g.find((x) => x.slug === garmentSlug) : null;
        setActiveGarment(preselected ?? g[0] ?? null);
        if (a.length) {
          setDesigns((d) => ({
            front: { ...d.front, asset: a[0] },
            back: { ...d.back, asset: a[0] },
          }));
        }
      })
      .finally(() => setLoading(false));
  }, [garmentSlug]);

  // --- Front / back designs ---
  const [side, setSide] = useState<Side>("front");
  const [designs, setDesigns] = useState<{ front: SideDesign; back: SideDesign }>({
    front: { ...DEFAULT_SIDE },
    back: { ...DEFAULT_SIDE },
  });

  const cur = designs[side];

  const patchSide = (patch: Partial<SideDesign>) =>
    setDesigns((d) => ({ ...d, [side]: { ...d[side], ...patch } }));

  // --- Editor controls ---
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [selectedColor, setSelectedColor] = useState(0);

  // --- Drag state ---
  const isDragging = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const startDrag = (clientX: number, clientY: number) => {
    isDragging.current = true;
    dragOrigin.current = { mx: clientX, my: clientY, px: cur.pos.x, py: cur.pos.y };
  };
  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    patchSide({
      pos: {
        x: dragOrigin.current.px + (clientX - dragOrigin.current.mx),
        y: dragOrigin.current.py + (clientY - dragOrigin.current.my),
      },
    });
  };
  const endDrag = () => { isDragging.current = false; };

  // --- Upload ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    patchSide({ asset: { id: `upload-${Date.now()}`, name: file.name, publicUrl: url } });
    e.target.value = "";
  };

  // --- Export ---
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    await exportDesignToPng(
      side === "back" && activeGarment?.publicUrlBack
        ? activeGarment.publicUrlBack
        : (activeGarment?.publicUrl ?? null),
      cur,
      side,
      activeGarment?.name ?? "design"
    );
    setExporting(false);
  };

  // --- Cart ---
  const [cartAdded, setCartAdded] = useState(false);

  const handleAddToCart = () => {
    if (!activeGarment) return;
    addToCart({
      garmentSlug: activeGarment.slug,
      garmentName: activeGarment.name,
      garmentImageUrl: activeGarment.publicUrl,
      price: activeGarment.price,
    });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1500);
  };

  const graphicStyle = (d: SideDesign): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 160,
    height: 160,
    transform: `translate(calc(-50% + ${d.pos.x}px), calc(-50% + ${d.pos.y}px)) scale(${d.scale / 100}) rotate(${d.rotation}deg)`,
    opacity: d.opacity / 100,
    cursor: isDragging.current ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none",
    zIndex: 20,
  });

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen flex flex-col">
      <Navbar />

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
          {/* Front/Back toggle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-surface-container/70 backdrop-blur-md rounded-full border border-white/10 z-30 overflow-hidden shadow-lg">
            {(["front", "back"] as Side[]).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`px-md py-xs text-label-md capitalize transition-all ${
                  side === s
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Mockup + graphic container */}
          <div className="relative w-full h-full max-w-md">
            {/* Garment mockup */}
            {activeGarment ? (
              <Image
                src={
                  side === "back" && activeGarment.publicUrlBack
                    ? activeGarment.publicUrlBack
                    : activeGarment.publicUrl
                }
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

            {/* Side label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-xs text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 pointer-events-none">
              <span className="material-symbols-outlined text-[14px]">
                {side === "front" ? "front_hand" : "back_hand"}
              </span>
              {side}
            </div>

            {/* Print area guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: "8%" }}>
              <div className="w-[46%] h-[52%] border-2 border-dashed border-primary/30 rounded-sm relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-primary text-[8px] uppercase tracking-[0.2em] opacity-50 whitespace-nowrap">
                  Print Area
                </span>
              </div>
            </div>

            {/* Draggable graphic — only visible on current side */}
            {cur.asset && (
              <div
                style={graphicStyle(cur)}
                onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
                onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
              >
                <Image
                  src={cur.asset.publicUrl}
                  alt={cur.asset.name}
                  fill
                  className="object-contain drop-shadow-lg pointer-events-none"
                  unoptimized={cur.asset.id.startsWith("upload-")}
                />
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-base bg-surface-container/60 backdrop-blur-md p-1 rounded-full border border-white/5">
            <button
              onClick={() => patchSide({ scale: Math.min(200, cur.scale + 10) })}
              className="p-2 hover:bg-primary-container hover:text-on-primary rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-sm">zoom_in</span>
            </button>
            <button
              onClick={() => patchSide({ scale: Math.max(10, cur.scale - 10) })}
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
                        onClick={() => patchSide({ asset })}
                        className={`aspect-square glass-panel rounded-lg flex items-center justify-center cursor-pointer transition-all group overflow-hidden ${
                          cur.asset?.id === asset.id
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
                      <span className="text-xs text-primary">{cur.scale}%</span>
                    </div>
                    <input type="range" min={10} max={200} value={cur.scale}
                      onChange={(e) => patchSide({ scale: Number(e.target.value) })}
                      className="w-full touch-none" />
                  </div>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-label-md text-on-surface-variant">Rotation</label>
                      <span className="text-xs text-primary">{cur.rotation}°</span>
                    </div>
                    <input type="range" min={-180} max={180} value={cur.rotation}
                      onChange={(e) => patchSide({ rotation: Number(e.target.value) })}
                      className="w-full touch-none" />
                  </div>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-label-md text-on-surface-variant">Opacity</label>
                      <span className="text-xs text-primary">{cur.opacity}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={cur.opacity}
                      onChange={(e) => patchSide({ opacity: Number(e.target.value) })}
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
                          if (i === 0) patchSide({ pos: { ...cur.pos, x: -80 } });
                          if (i === 1) patchSide({ pos: { ...cur.pos, x: 0 } });
                          if (i === 2) patchSide({ pos: { ...cur.pos, x: 80 } });
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
          <div className="flex items-center gap-sm flex-1 justify-end">
            <p className="text-primary text-body-lg font-bold mr-sm hidden sm:block">
              {activeGarment ? `$${activeGarment.price.toFixed(2)}` : ""}
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              title="Export current side as PNG"
              className="flex items-center gap-xs text-label-md px-md py-3 rounded-lg border border-white/20 text-on-surface hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {exporting ? "hourglass_top" : "download"}
              </span>
              <span className="hidden sm:inline">{exporting ? "Saving…" : "Export"}</span>
            </button>
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
