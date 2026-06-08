import { supabase } from "./client";

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function storageUrl(bucket: string, path: string) {
  return `${BASE}/storage/v1/object/public/${bucket}/${path}`;
}

export type Garment = {
  id: string;
  name: string;
  slug: string;
  storage_path: string;
  storage_path_back: string | null;
  price: number;
  display_order: number;
  publicUrl: string;
  publicUrlBack: string | null;
};

export type DesignAsset = {
  id: string;
  name: string;
  slug: string;
  storage_path: string;
  display_order: number;
  publicUrl: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  garment_slug: string;
  garment_name: string;
  qty: number;
  price: number;
  status: "pending" | "printing" | "shipped" | "delivered" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchGarments(): Promise<Garment[]> {
  const { data, error } = await supabase
    .from("ic_garments")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((g) => ({
    ...g,
    publicUrl: storageUrl("garments", g.storage_path),
    publicUrlBack: g.storage_path_back
      ? storageUrl("garments", g.storage_path_back)
      : null,
  }));
}

export async function fetchDesignAssets(): Promise<DesignAsset[]> {
  const { data, error } = await supabase
    .from("ic_design_assets")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((a) => ({
    ...a,
    publicUrl: storageUrl("design-assets", a.storage_path),
  }));
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("ic_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const { error } = await supabase
    .from("ic_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function uploadGarmentImage(
  file: File,
  slug: string,
  side: "front" | "back"
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}-${side}.${ext}`;
  const { error } = await supabase.storage
    .from("garments")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return path;
}

export async function uploadDesignAsset(file: File, slug: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${slug}.${ext}`;
  const { error } = await supabase.storage
    .from("design-assets")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return path;
}

export async function upsertGarment(
  garment: Omit<Garment, "publicUrl" | "publicUrlBack">
): Promise<void> {
  const { error } = await supabase
    .from("ic_garments")
    .upsert(garment, { onConflict: "id" });
  if (error) throw error;
}

export async function upsertDesignAsset(
  asset: Omit<DesignAsset, "publicUrl">
): Promise<void> {
  const { error } = await supabase
    .from("ic_design_assets")
    .upsert(asset, { onConflict: "id" });
  if (error) throw error;
}
