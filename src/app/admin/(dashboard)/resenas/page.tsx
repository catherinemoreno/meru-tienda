"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Review } from "@/types";

export default function AdminResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleDelete(id: string, productId: string) {
    const ok = window.confirm("Eliminar esta resena? Esta accion no se puede deshacer.");
    if (!ok) return;
    await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, productId: productId }),
    });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Resenas</h1>
      <p className="mt-1 text-muted">
        Todas las resenas dejadas por clientes en tus productos. Puedes eliminar cualquiera que sea ofensiva o inapropiada.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Cargando...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          Todavia no hay resenas.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-1 gap-4">
                {r.photoUrl && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                    <Image src={r.photoUrl} alt="Foto de la resena" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-wide text-accent">{r.productName}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-semibold">{r.customerName}</p>
                    <div className="flex items-center gap-0.5">
                      {stars.map((i) => (
                        <Star key={i} className={"h-3.5 w-3.5 " + (i <= r.rating ? "fill-accent text-accent" : "text-border")} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
                </div>
              </div>

              <button
                onClick={() => handleDelete(r.id, r.productId)}
                className="flex shrink-0 items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
