import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

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

    if (!productId || !customerName || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Datos de resena incompletos" }, { status: 400 });
    }

    const db = getSupabaseAdmin();

    const insertResult = await db.from("product_reviews").insert({
      product_id: productId,
      customer_name: customerName,
      rating: rating,
      comment: comment || null,
    });
    if (insertResult.error) throw insertResult.error;

    const readResult = await db
      .from("product_reviews")
      .select("rating")
      .eq("product_id", productId);
    if (readResult.error) throw readResult.error;

    const allRows = readResult.data ?? [];
    const ratings = allRows.map((r) => Number(r.rating));
    const count = ratings.length;
    const sum = ratings.reduce((a, b) => a + b, 0);
    const average = count > 0 ? sum / count : 0;
    const roundedAverage = Math.round(average * 10) / 10;

    await db
      .from("products")
      .update({ rating: roundedAverage, reviews_count: count })
      .eq("id", productId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No pudimos guardar tu resena" }, { status: 500 });
  }
}
