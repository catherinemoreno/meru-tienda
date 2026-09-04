import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listAllCategories } from "@/lib/data/categoriesStore";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await listAllCategories());
}
