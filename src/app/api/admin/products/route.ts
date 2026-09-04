import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { listAllProducts, upsertProduct } from "@/lib/data/productsStore";
import { slugify } from "@/lib/utils";

function revalidateStoreProduct(categorySlug?: string, productSlug?: string) {
  revalidatePath("/");
  revalidatePath("/tienda");
  if (categorySlug) revalidatePath(`/categoria/${categorySlug}`);
  if (productSlug) revalidatePath(`/producto/${productSlug}`);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await listAllProducts());
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const id = `p${Date.now()}`;
  const product = await upsertProduct({
    id,
    slug: body.slug || slugify(body.name),
    name: body.name,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    category: body.category,
    subcategory: body.subcategory,
    price: Number(body.price) || 0,
    previousPrice: body.previousPrice ? Number(body.previousPrice) : undefined,
    sku: body.sku || id.toUpperCase(),
    images: body.images?.length ? body.images : ["https://picsum.photos/seed/" + id + "/800/800"],
    tags: body.tags || [],
    stock: Number(body.stock) || 0,
    active: body.active ?? true,
    variants: body.variants ?? undefined,
  });

  revalidateStoreProduct(product.category, product.slug);
  return NextResponse.json(product, { status: 201 });
}
