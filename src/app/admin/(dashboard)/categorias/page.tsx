"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, Loader2, ImageOff } from "lucide-react";
import { Category } from "@/types";

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("No se pudieron cargar las categorías");
      setCategories(await res.json());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleFile(slug: string, file: File) {
    setErrors((e) => ({ ...e, [slug]: "" }));
    setUploadingSlug(slug);
    try {
      const body = new FormData();
      body.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "No se pudo subir la imagen");

      const patchRes = await fetch(`/api/admin/categories/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadData.url }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || "No se pudo guardar la imagen");

      setCategories((cats) =>
        cats.map((c) => (c.slug === slug ? { ...c, image: uploadData.url } : c))
      );
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [slug]: err instanceof Error ? err.message : "No se pudo actualizar la imagen",
      }));
    } finally {
      setUploadingSlug(null);
      const input = fileInputs.current[slug];
      if (input) input.value = "";
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Categorías</h1>
        <p className="mt-1 text-sm text-muted">
          Sube la imagen que se muestra en la home dentro de &quot;Explora por categoría&quot; para
          cada una de estas categorías.
        </p>
      </div>

      {loadError && (
        <p className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {loadError}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando categorías...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const isUploading = uploadingSlug === cat.slug;
            const error = errors[cat.slug];
            return (
              <div
                key={cat.slug}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="relative aspect-[4/3] w-full bg-surface-2">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
                      <ImageOff className="h-6 w-6" />
                      <span className="text-xs">Sin imagen</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-display text-base font-semibold">{cat.name}</h2>

                  <input
                    ref={(el) => {
                      fileInputs.current[cat.slug] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(cat.slug, file);
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputs.current[cat.slug]?.click()}
                    className="mt-3 flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-surface-2 px-3 py-4 text-center text-xs text-muted transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <UploadCloud className="h-5 w-5" />
                    <span>
                      Arrastra o <span className="font-medium text-accent">selecciona una imagen</span>
                    </span>
                    <span className="text-[11px] text-muted">JPG, PNG, WEBP o GIF · máx. 5MB</span>
                  </button>

                  {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
