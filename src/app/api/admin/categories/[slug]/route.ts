import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { updateCategoryImage } from "@/lib/data/categoriesStore";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { slug } = await params;
  const body = await req.json();
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  if (!imageUrl) {
    return NextResponse.json({ error: "Falta la URL de la imagen" }, { status: 400 });
  }

  try {
    const category = await updateCategoryImage(slug, imageUrl);
    revalidatePath("/");
    revalidatePath(`/categoria/${slug}`);
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo actualizar la categoría" },
      { status: 500 }
    );
  }
}
