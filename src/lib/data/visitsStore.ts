// Contador simple de visitas a la tienda pública. Cada vez que alguien entra
// (una sola vez por sesión de navegador, ver StoreChrome.tsx) se guarda una
// fila en la tabla "visits" de Supabase. El admin usa el total, el desglose
// por país y el ranking de productos más vistos.
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function logVisit(path: string, country?: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  const db = getSupabaseAdmin();
  await db.from("visits").insert({ path, country: country ?? null });
}

export async function getVisitCount(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const db = getSupabaseAdmin();
  const { count, error } = await db
    .from("visits")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export type CountryStat = { country: string; count: number };

export async function getVisitsByCountry(limit = 5): Promise<CountryStat[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const db = getSupabaseAdmin();
  const { data, error } = await db.from("visits").select("country");
  if (error || !data) return [];
  const counts = new Map<string, number>();
  for (const row of data as { country: string | null }[]) {
    const key = row.country || "Desconocido";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type ProductViewStat = { slug: string; count: number };

// Cuenta visitas a páginas de producto (path = "/producto/<slug>") agrupadas
// por producto, para saber cuáles son los más vistos.
export async function getTopViewedProducts(limit = 5): Promise<ProductViewStat[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("visits")
    .select("path")
    .like("path", "/producto/%");
  if (error || !data) return [];
  const counts = new Map<string, number>();
  for (const row of data as { path: string }[]) {
    const slug = row.path.replace("/producto/", "").split("?")[0];
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
