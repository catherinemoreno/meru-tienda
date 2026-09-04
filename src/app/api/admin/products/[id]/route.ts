import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { deleteProduct, findProduct, toggleProductActive, upsertProduct } from "@/lib/data/productsStore";

function revalidateStoreProduct(categorySlug?: string, productSlug?: string) {
  revalidatePath("/");
  revalidatePath("/tienda");
  if (categorySlug) revalidatePath(`/categoria/${categorySlug}`);
  if (productSlug) revalidatePath(`/producto/${productSlug}`);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await findProduct(id);
  if (!existing) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const body = await req.json();
  const updated = await upsertProduct({
    ...existing,
    ...body,
    id,
    price: Number(body.price ?? existing.price),
    previousPrice: body.previousPrice ? Number(body.previousPrice) : undefined,
    stock: Number(body.stock ?? existing.stock),
  });

  revalidateStoreProduct(existing.category, existing.slug);
  revalidateStoreProduct(updated.category, updated.slug);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await findProduct(id);
  await deleteProduct(id);
  revalidateStoreProduct(existing?.category, existing?.slug);
  return NextResponse.json({ ok: true });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const product = await toggleProductActive(id);
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  revalidateStoreProduct(product.category, product.slug);
  return NextResponse.json(product);
}
