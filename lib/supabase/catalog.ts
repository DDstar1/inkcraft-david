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
  price: number;
  display_order: number;
  publicUrl: string;
};

export type DesignAsset = {
  id: string;
  name: string;
  slug: string;
  storage_path: string;
  display_order: number;
  publicUrl: string;
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
