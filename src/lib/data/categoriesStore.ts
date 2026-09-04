// Almacén de categorías usado por el panel admin para actualizar la imagen
// de las tarjetas de "Explora por categoría" en la home.
//
// La LECTURA pública de categorías (para la tienda) vive en
// src/lib/repository.ts (getCategories/getCategoryBySlug). Este módulo es
// solo para el admin: lista las categorías con su estado actual y permite
// ESCRIBIR (actualizar image_url) — igual patrón que
// src/lib/data/productsStore.ts, pero la escritura solo tiene sentido con
// Supabase configurado (no hay "guardar en memoria" razonable para una
// imagen que la dueña sube una sola vez).
import { categories as seedCategories } from "@/lib/data/categories";
import { Category } from "@/types";
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  tagline: string | null;
  image_url: string | null;
  subcategories: string[] | null;
};

function rowToCategory(row: CategoryRow): Category {
  return {
    slug: row.slug as Category["slug"],
    name: row.name,
    description: row.description ?? "",
    tagline: row.tagline ?? undefined,
    image: row.image_url ?? "",
    subcategories: row.subcategories ?? [],
  };
}

export async function listAllCategories(): Promise<Category[]> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("categories")
      .select("slug, name, description, tagline, image_url, subcategories")
      .is("parent_id", null)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(rowToCategory);
  }
  return seedCategories;
}

export async function updateCategoryImage(slug: string, imageUrl: string): Promise<Category> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase no está configurado en este entorno, así que no se puede guardar la imagen de la categoría (no hay dónde persistirla de forma permanente)."
    );
  }
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("categories")
    .update({ image_url: imageUrl })
    .eq("slug", slug)
    .select("slug, name, description, tagline, image_url, subcategories")
    .single();
  if (error) throw error;
  return rowToCategory(data as CategoryRow);
}
