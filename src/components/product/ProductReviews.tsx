"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ImagePlus } from "lucide-react";
import { Review } from "@/types";

export default function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const [list, setList] = useState(reviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || rating < 1) {
      setError("Escribe tu nombre y elige una calificación");
      return;
    }
    setSubmitting(true);
    try {
      let photoUrl = "";
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append("file", photoFile);
        const uploadRes = await fetch("/api/reviews/upload", {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          photoUrl = uploadJson.url;
        }
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          customerName: name,
          rating: rating,
          comment: comment,
          photoUrl: photoUrl,
        }),
      });
      if (!res.ok) throw new Error("fallo");

      const newReview: Review = {
        id: "temp-" + Date.now(),
        productId: productId,
        customerName: name,
        rating: rating,
        comment: comment || null,
        photoUrl: photoUrl || null,
        createdAt: new Date().toISOString(),
      };
      setList([newReview].concat(list));
      setName("");
      setRating(0);
      setComment("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setSuccess(true);
    } catch {
      setError("No pudimos guardar tu reseña, intenta de nuevo");
    } finally {
      setSubmitting(false);
    }
  }

  const average = list.length > 0 ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
  const stars = [1, 2, 3, 4, 5];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Reseñas de clientes</h2>

      {list.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <div className="flex items-center gap-1">
            {stars.map((i) => (
              <Star key={i} className={"h-4 w-4 " + (i <= Math.round(average) ? "fill-accent text-accent" : "text-border")} />
            ))}
          </div>
          <span className="font-semibold text-foreground">{average.toFixed(1)}</span>
          <span>({list.length} {list.length === 1 ? "reseña" : "reseñas"})</span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {list.length === 0 ? (
            <p className="text-sm text-muted">Todavía no hay reseñas para este producto. Sé el primero en dejar la tuya.</p>
          ) : (
            list.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{r.customerName}</p>
                  <div className="flex items-center gap-0.5">
                    {stars.map((i) => (
                      <Star key={i} className={"h-3.5 w-3.5 " + (i <= r.rating ? "fill-accent text-accent" : "text-border")} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="mt-2 text-sm text-muted">{r.comment}</p>}
                {r.photoUrl && (
                  <div className="relative mt-3 h-32 w-32 overflow-hidden rounded-xl bg-surface-2">
                    <Image src={r.photoUrl} alt={"Foto de " + r.customerName} fill className="object-cover" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold">Deja tu reseña</p>

          <div className="mt-3 flex items-center gap-1">
            {stars.map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)} aria-label={"Calificar con " + i + " estrellas"}>
                <Star className={"h-6 w-6 " + (i <= rating ? "fill-accent text-accent" : "text-border")} />
              </button>
            ))}
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos qué te pareció (opcional)"
            rows={3}
            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />

          <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted hover:border-accent/50">
            <ImagePlus className="h-4 w-4" />
            {photoFile ? photoFile.name : "Agregar una foto (opcional)"}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
          </label>

          {photoPreview && (
            <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-xl bg-surface-2">
              <Image src={photoPreview} alt="Vista previa" fill className="object-cover" />
            </div>
          )}

          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          {success && <p className="mt-2 text-xs text-accent">¡Gracias por tu reseña!</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-[#1a1408] disabled:opacity-60"
          >
            {submitting ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>
      </div>
    </section>
  );
}
