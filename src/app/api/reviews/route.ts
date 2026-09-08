import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/auth";

async function recomputeProductRating(productId: string) {
  const db = getSupabaseAdmin();
  const readResult = await db.from("product_reviews").select("rating").eq("product_id", productId);
  const allRows = readResult.data ?? [];
  const ratings = allRows.map((r) => Number(r.rating));
  const count = ratings.length;
  const sum = ratings.reduce((a, b) => a + b, 0);
  const average = count > 0 ? sum / count : 0;
  const roundedAverage = Math.round(average * 10) / 10;
  await db.from("products").update({ rating: roundedAverage, reviews_count: count }).eq("id", productId);
}

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json({ error: "Resenas no disponibles" }, { status: 503 });
    }
    const body = await req.json();
    const productId = typeof body.productId === "string" ? body.productId : "";
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const rating = Number(body.rating);
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl.trim() : "";

    if (!productId || !customerName || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Datos de resena incompletos" }, { status: 400 });
    }

    const db = getSupabaseAdmin();

    const insertResult = await db.from("product_reviews").insert({
      product_id: productId,
      customer_name: customerName,
      rating: rating,
      comment: comment || null,
      photo_url: photoUrl || null,
    });
    if (insertResult.error) throw insertResult.error;

    await recomputeProductRating(productId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No pudimos guardar tu resena" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json([]);
  }
  const db = getSupabaseAdmin();
  const result = await db
    .from("product_reviews")
    .select("id, product_id, customer_name, rating, comment, photo_url, created_at, products(name)")
    .order("created_at", { ascending: false });

  if (result.error) {
    return NextResponse.json({ error: "No pudimos cargar las resenas" }, { status: 500 });
  }

  type Row = {
    id: string;
    product_id: string;
    customer_name: string;
    rating: number;
    comment: string | null;
    photo_url: string | null;
    created_at: string;
    products: { name: string } | { name: string }[] | null;
  };

  const rows = (result.data ?? []) as Row[];
  const mapped = rows.map((r) => {
    const productInfo = Array.isArray(r.products) ? r.products[0] : r.products;
    return {
      id: r.id,
      productId: r.product_id,
      productName: productInfo ? productInfo.name : "",
      customerName: r.customer_name,
      rating: r.rating,
      comment: r.comment,
      photoUrl: r.photo_url,
      createdAt: r.created_at,
    };
  });

  return NextResponse.json(mapped);
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "No disponible" }, { status: 501 });
  }

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  const productId = typeof body.productId === "string" ? body.productId : "";

  if (!id || !productId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const deleteResult = await db.from("product_reviews").delete().eq("id", id);
  if (deleteResult.error) {
    return NextResponse.json({ error: "No pudimos eliminar la resena" }, { status: 500 });
  }

  await recomputeProductRating(productId);

  return NextResponse.json({ ok: true });
}
