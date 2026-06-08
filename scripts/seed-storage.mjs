/**
 * Seeds Supabase storage with predefined InkCraft garments and design assets.
 * Run once: node scripts/seed-storage.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://hjhvtnvffpppzpdzozbq.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// ---------------------------------------------------------------------------
// Predefined catalog data
// ---------------------------------------------------------------------------

const GARMENTS = [
  {
    name: "White Essential Tee",
    slug: "white-essential-tee",
    price: 34.00,
    display_order: 1,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLuG-NYDFZaMtDAQtoYsn7hZBLgRm1JDE2nI_U4slEIjXLvoGmV_L7H-UP5QgRCyj2_alaH5LD8hU3KTcmZxSBWkN2RVYlL8dD3Es1WMgZprdyhKVnzd9YNWdBBspbsyzeKkR3YmzNH1JRpW1TQsOwC2sjYnGhbN005E74vDUxYvKqOyMl4ziZdZAcmSs6z6P5AJCd_HLv4FyM246yOClWwx4JmVLrp9t8SjGZAR94yEX9E61qWpa5NwV-Dq",
  },
  {
    name: "Artisan Heavy Hoodie",
    slug: "artisan-heavy-hoodie",
    price: 58.00,
    display_order: 2,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLuRROPOVPvTU8xskuZQOIFrTVUldbw1rKyR9k86JHfUxk9YfoEHzyMNmAVE2vM2MhKCmUK_6-NAp6vLroLuiwSq7TYbnUEce3CrNn7uq0smEotUKxjtPZw8IHZnFzb8yWNuAoF5GjiNXJFj5VzVJ9iAmLcACW7_DUY6V_Ww4VosJFBL7QRNwazYDP38kEqxCm5jusXAjmKpXUa7oBjbvuLkqKuQBbFRS4BRDroh3IWzolyJ_89wj9qrJgr9",
  },
  {
    name: "Signature Crewneck",
    slug: "signature-crewneck",
    price: 42.00,
    display_order: 3,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLvkhORFab1pV-ig6iOeFydThQlZwIZFLy0GxCiJ8VNxfudVxe87VHGwaDI10nvLjUBVZxMR4USfmpISrCyCdN0oT3wA02ebeuTqIvOttk2VzjdChnlCnhF3mfIrKw7Na45Uon5kZ6FubI6-kmVBX6H5_WLwlM_rHi4yCDr1KlQFlBDjVZECJ-bd0G5rYM7C1OlkmYeRd_5wGsgd238xL1SbituaTApFaSgTWSSrSQLBerw8CHqN9SSmJSs",
  },
  {
    name: "Essential Boxy Tee",
    slug: "essential-boxy-tee",
    price: 34.00,
    display_order: 4,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLs24fxUmY7vt4i_xqFGgv01Y6WuQufEZy1tNJyKYJHlczqkAWoGfivZnqG2ljB9An5nQZ-KKL5mXAwrggLVp7GpkIEUQbyvgUPza5afLNh90Djw5PUyfFtY4U-rrWo_QjdJvftDO049M9B1bO1kGdEYR3Mb_BluIH9e1i-F31lpPrlBAhKzsEZYBSFH6m-2H8fD7ooR5Jfs1iasXjFvKL-VqzzooycgFPQKwl_i1aj6l0pGFfBBX4pwFkE",
  },
  {
    name: "Classic Zip Hoodie",
    slug: "classic-zip-hoodie",
    price: 64.00,
    display_order: 5,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLtgd5GkpB5ZFa-cNpTQaZsQNTAH3Ka5A9-urLzGR77VYjUPPnmW29wdIIQBwSG5jDLehTINZ23YrSc26sd8AaRirf5c68Zgo48b6XIyu-XMjg4DUZKlE8Zng5my2RTlR4fMPSickAte2rJtqiyadpImOpFHZm9iopF2e2b-PsLhOvdZ2Baw8cuSjJUK42AQh_n_77VnjYE3MxB1I0C06cAWPy18w4vvkYnc8Wt4WSoHavuKRKaMcBNQY_8",
  },
  {
    name: "Heritage Pocket Tee",
    slug: "heritage-pocket-tee",
    price: 38.00,
    display_order: 6,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLsLA-0ArF2j0cphSm0LQT-M0YA8MxX_1tlF41AV83HMR_nR4s1ltjCuO9JLhlAjBNPzq-WsmPzcYFrJtd8lcthNDmh2DsQBMUu1vJ6lXoiqvg6rgua9NSCM1dUFiO0Cc2M1x7GlDh5Tf-bUohJRhcPWM2v6UXluDVQcLQt78uscJfzr3lwrzUqmZFxbeWIJDLAz2SYVVw5T3x8nVTibPtHfL2ElpX-2I9oHyk8bQsAndMFxr_LCCa8kwD97",
  },
];

const DESIGN_ASSETS = [
  {
    name: "Abstract Logo Alpha",
    slug: "abstract-logo-alpha",
    display_order: 1,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLty7V-31qrLPE59VpZV4M3Hn2GCmIFLYXwGZ9sAkcoH2xIgJbzn0dgNvIb7lmpNOFpEcoByZhQW6njKyBx2bjkNPpnQERnf2l63P_yN215KYv2Ov4Bthot6qU7BC-02kT2L4bvFsZSdCG_kNfuqC7nXdfNX1AQBK6a8c5iWlv1887Cf-4wfsGIUx3YLDKZ3UQb-WzZcLomi4QCsOsq0YFgvvzOjldUskp-1QA9MG1Nm8LEOYE0pdQhEjLY",
  },
  {
    name: "Geometric Crest",
    slug: "geometric-crest",
    display_order: 2,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLtSYek42DYRXegOiq12ukUGT6BnfUEe3bKy68GMrUucqIospEStF9jJuXMDCoQafSAawaLUdTi8d1REWFovhL-k688buNovrhhVpwldAA-PPm0x2cGCkIdnvvRQVQ_Q_Cs1bJMiQQL6_JtRw2Ejbf0TaWfgB-vxPTtgF_klkKMsLJDpEayje0M3TnUXb3opwN0wzsEcZz68DQOtDB5R5z7UeLSG-4J0c7bocmrMCt_dnynTK5QasQKUBG6O",
  },
  {
    name: "Wave Pattern",
    slug: "wave-pattern",
    display_order: 3,
    url: "https://lh3.googleusercontent.com/aida/AP1WRLvFZvV-uQ-qwGZnu99DsZ_ANCjz3CsUQt-Woca_F7im3da3JQuDSvKw57-yQ2liTFCGD7dN_QAkqNgyt9YN6Wb6kMpQF0E7fQok3UJKZvcJ6OLQW8us4z3FM7x01RX3Zk0e9RoqJgDbUohtmjsusPvmr8wX8v0wACbKVpTvdhp79xs9_yYxc2WRTnr_YbsR32wXdDXmRt_k8L_eOs3Mo17aNoYA7PvMBHG6SYIwo8Uk7mSvVJC_p3LR0mHS",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchImageBlob(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; InkCraft-Seed/1.0)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.blob();
}

async function uploadToStorage(bucket, path, url) {
  console.log(`  Uploading ${path} …`);
  const blob = await fetchImageBlob(url);
  const { error } = await sb.storage.from(bucket).upload(path, blob, {
    contentType: blob.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function upsertRow(table, row) {
  const { error } = await sb.from(table).upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== InkCraft Storage Seed ===\n");

  // --- Garments ---
  console.log("Uploading garments…");
  for (const g of GARMENTS) {
    try {
      const storagePath = `${g.slug}.jpg`;
      const publicUrl = await uploadToStorage("garments", storagePath, g.url);
      await upsertRow("ic_garments", {
        name: g.name,
        slug: g.slug,
        storage_path: storagePath,
        price: g.price,
        display_order: g.display_order,
      });
      console.log(`  ✓ ${g.name} → ${publicUrl}`);
    } catch (err) {
      console.error(`  ✗ ${g.name}: ${err.message}`);
    }
  }

  // --- Design Assets ---
  console.log("\nUploading design assets…");
  for (const a of DESIGN_ASSETS) {
    try {
      const storagePath = `${a.slug}.png`;
      const publicUrl = await uploadToStorage("design-assets", storagePath, a.url);
      await upsertRow("ic_design_assets", {
        name: a.name,
        slug: a.slug,
        storage_path: storagePath,
        display_order: a.display_order,
      });
      console.log(`  ✓ ${a.name} → ${publicUrl}`);
    } catch (err) {
      console.error(`  ✗ ${a.name}: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

main().catch(console.error);
