// Capa de acceso a datos (repository/adapter pattern).
//
// Si NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY están definidas
// (ver src/lib/supabase/client.ts → isSupabaseConfigured()), estas funciones
// consultan las tablas reales en Supabase (ver supabase/schema.sql).
//
// Si NO están definidas (fase actual / desarrollo local sin configurar),
// siguen leyendo de los mocks en src/lib/data/* exactamente igual que antes
// — cero regresión. La firma pública (nombres, parámetros, tipos de retorno)
// es la misma en ambos casos, así que nada que consuma este módulo necesita
// cambiar.
import { products as mockProducts } from "@/lib/data/products";
import { categories as mockCategories } from "@/lib/data/categories";
import { Product, Category, CategorySlug } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Simula latencia de red mínima para comportarse como una llamada real.
function delay<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

// ---------------------------------------------------------------------------
// Mapeo entre filas de Supabase (snake_case, según supabase/schema.sql) y los
// tipos de dominio de la app (camelCase, ver src/types/index.ts).
// ---------------------------------------------------------------------------

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_slug: CategorySlug;
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

type CategoryRow = {
  slug: CategorySlug;
  name: string;
  description: string | null;
  tagline: string | null;
  image_url: string | null;
  subcategories: string[] | null;
};

function rowToCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    tagline: row.tagline ?? undefined,
    image: row.image_url ?? "",
    subcategories: row.subcategories ?? [],
  };
}

// Selecciona los mismos campos de "products" en todas las consultas.
const PRODUCT_SELECT =
  "id, slug, name, short_description, description, category_slug, subcategory, price, compare_at_price, sku, images, is_new, is_bestseller, is_offer, variants, rating, reviews_count, stock, active, features";

export async function getProducts(filters?: {
  category?: CategorySlug;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevancia" | "precio-asc" | "precio-desc" | "nuevo";
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    let query = supabase!.from("products").select(PRODUCT_SELECT).eq("active", true);
    if (filters?.category) query = query.eq("category_slug", filters.category);
    if (filters?.subcategory) query = query.eq("subcategory", filters.subcategory);
    if (filters?.minPrice !== undefined) query = query.gte("price", filters.minPrice);
    if (filters?.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
    if (filters?.sort === "precio-asc") query = query.order("price", { ascending: true });
    if (filters?.sort === "precio-desc") query = query.order("price", { ascending: false });
    if (filters?.sort === "nuevo") query = query.order("is_new", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }

  let result = mockProducts.filter((p) => p.active);

  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.subcategory) {
    result = result.filter((p) => p.subcategory === filters.subcategory);
  }
  if (filters?.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  switch (filters?.sort) {
    case "precio-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "nuevo":
      result = [...result].sort((a, b) =>
        a.tags.includes("nuevo") === b.tags.includes("nuevo") ? 0 : a.tags.includes("nuevo") ? -1 : 1
      );
      break;
    default:
      break;
  }

  return delay(result);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data as ProductRow) : undefined;
  }
  return delay(mockProducts.find((p) => p.slug === slug && p.active));
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("categories")
      .select("slug, name, description, tagline, image_url, subcategories")
      .eq("active", true)
      .is("parent_id", null)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as CategoryRow[]).map(rowToCategory);
  }
  return delay(mockCategories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("categories")
      .select("slug, name, description, tagline, image_url, subcategories")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToCategory(data as CategoryRow) : undefined;
  }
  return delay(mockCategories.find((c) => c.slug === slug));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .or("is_bestseller.eq.true,is_new.eq.true")
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  const featured = mockProducts.filter(
    (p) => p.active && (p.tags.includes("masVendido") || p.tags.includes("nuevo"))
  );
  return delay(featured.slice(0, limit));
}

export async function getNewProducts(limit = 8): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_new", true)
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return delay(mockProducts.filter((p) => p.active && p.tags.includes("nuevo")).slice(0, limit));
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_bestseller", true)
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return delay(
    mockProducts.filter((p) => p.active && p.tags.includes("masVendido")).slice(0, limit)
  );
}

export async function getOffers(limit = 8): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("is_offer", true)
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return delay(mockProducts.filter((p) => p.active && p.tags.includes("oferta")).slice(0, limit));
}

export async function getHallazgos(limit = 8): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("category_slug", "hallazgos")
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return delay(
    mockProducts.filter((p) => p.active && p.category === "hallazgos").slice(0, limit)
  );
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .eq("category_slug", product.category)
      .neq("id", product.id)
      .limit(limit);
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return delay(
    mockProducts
      .filter((p) => p.active && p.category === product.category && p.id !== product.id)
      .slice(0, limit)
  );
}
