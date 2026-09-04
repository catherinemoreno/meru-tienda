// Almacén de productos usado por el panel admin para crear/editar/eliminar/
// activar productos.
//
// Si Supabase está configurado (ver src/lib/supabase/admin.ts), estas
// funciones leen/escriben la tabla "products" usando la service_role key
// (solo desde servidor: API routes / Server Components).
//
// Si NO está configurado, usa un array mutable en memoria inicializado con
// los datos de demostración — comportamiento idéntico al actual.
import { products as seedProducts } from "@/lib/data/products";
import { Product } from "@/types";
import { isSupabaseAdminConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

type GlobalWithStore = typeof globalThis & { __productsStore?: Product[] };
const g = globalThis as GlobalWithStore;

if (!g.__productsStore) {
  g.__productsStore = seedProducts.map((p) => ({ ...p }));
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_slug: Product["category"];
  subcategory: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  images: string[] | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  is_offer: boolean | null;
  variants: Product["variants"] | null;
  rating: number | null;
  reviews_count: number | null;
  stock: number | null;
  active: boolean | null;
  features: string[] | null;
};

function rowToProduct(row: ProductRow): Product {
  const tags: Product["tags"] = [];
  if (row.is_new) tags.push("nuevo");
  if (row.is_bestseller) tags.push("masVendido");
  if (row.is_offer) tags.push("oferta");
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    category: row.category_slug,
    subcategory: row.subcategory ?? "",
    price: Number(row.price),
    previousPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    sku: row.sku ?? "",
    images: row.images ?? [],
    tags,
    variants: row.variants ?? undefined,
    rating: row.rating ?? undefined,
    reviewsCount: row.reviews_count ?? undefined,
    stock: row.stock ?? 0,
    active: row.active ?? true,
    features: row.features ?? undefined,
  };
}

function productToRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.shortDescription ?? null,
    description: product.description ?? null,
    category_slug: product.category,
    subcategory: product.subcategory ?? null,
    price: product.price,
    compare_at_price: product.previousPrice ?? null,
    sku: product.sku ?? null,
    images: product.images ?? [],
    is_new: product.tags.includes("nuevo"),
    is_bestseller: product.tags.includes("masVendido"),
    is_offer: product.tags.includes("oferta"),
    variants: product.variants ?? null,
    rating: product.rating ?? null,
    reviews_count: product.reviewsCount ?? null,
    stock: product.stock,
    active: product.active,
    features: product.features ?? null,
  };
}

export async function listAllProducts(): Promise<Product[]> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return g.__productsStore!;
}

export async function findProduct(id: string): Promise<Product | undefined> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data as ProductRow) : undefined;
  }
  return g.__productsStore!.find((p) => p.id === id);
}

export async function upsertProduct(product: Product): Promise<Product> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("products")
      .upsert(productToRow(product), { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return rowToProduct(data as ProductRow);
  }
  const store = g.__productsStore!;
  const idx = store.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    store[idx] = product;
  } else {
    store.unshift(product);
  }
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseAdminConfigured()) {
    const db = getSupabaseAdmin();
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  g.__productsStore = g.__productsStore!.filter((p) => p.id !== id);
}

export async function toggleProductActive(id: string): Promise<Product | undefined> {
  if (isSupabaseAdminConfigured()) {
    const existing = await findProduct(id);
    if (!existing) return undefined;
    return upsertProduct({ ...existing, active: !existing.active });
  }
  const p = g.__productsStore!.find((p) => p.id === id);
  if (p) p.active = !p.active;
  return p;
}
