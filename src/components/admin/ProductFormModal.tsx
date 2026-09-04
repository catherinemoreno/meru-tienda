"use client";

import { useRef, useState } from "react";
import { X, UploadCloud, Loader2, ImagePlus, Link2 } from "lucide-react";
import { Product, ProductTag, Category, ProductVariant } from "@/types";

const allTags: ProductTag[] = ["nuevo", "masVendido", "oferta"];

export default function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? categories[0]?.slug ?? "",
    subcategory: product?.subcategory ?? categories[0]?.subcategories[0] ?? "",
    price: product?.price?.toString() ?? "",
    previousPrice: product?.previousPrice?.toString() ?? "",
    description: product?.description ?? "",
    images: product?.images ?? [],
    stock: product?.stock?.toString() ?? "10",
    tags: product?.tags ?? [],
    active: product?.active ?? true,
    colors: (product?.variants?.find((v) => v.type === "color")?.options ?? []).join(", "),
    tallas: (product?.variants?.find((v) => v.type === "talla")?.options ?? []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find((c) => c.slug === form.category);

  function addImage(url: string) {
    setForm((f) => ({ ...f, images: [...f.images, url] }));
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const list = Array.from(files);
    const tempIds = list.map((file) => `${file.name}-${Date.now()}-${Math.random()}`);
    setUploading((u) => [...u, ...tempIds]);

    await Promise.all(
      list.map(async (file, idx) => {
        const tempId = tempIds[idx];
        try {
          const body = new FormData();
          body.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "No se pudo subir la imagen");
          }
          addImage(data.url);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "No se pudo subir la imagen");
        } finally {
          setUploading((u) => u.filter((id) => id !== tempId));
        }
      })
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleAddManualUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    addImage(url);
    setManualUrl("");
  }

  function toggleTag(tag: ProductTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const variants: ProductVariant[] = [];
    const colorOptions = form.colors.split(",").map((s) => s.trim()).filter(Boolean);
    const tallaOptions = form.tallas.split(",").map((s) => s.trim()).filter(Boolean);
    if (colorOptions.length > 0) variants.push({ type: "color", options: colorOptions });
    if (tallaOptions.length > 0) variants.push({ type: "talla", options: tallaOptions });

    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      price: Number(form.price),
      previousPrice: form.previousPrice ? Number(form.previousPrice) : undefined,
      // La "descripción corta" ya no se pide en el formulario: se genera sola
      // a partir de la descripción completa (se usa solo para SEO, no se
      // muestra en la tienda).
      shortDescription: form.description.slice(0, 160),
      description: form.description,
      images: form.images,
      stock: Number(form.stock),
      tags: form.tags,
      active: form.active,
      variants: variants.length > 0 ? variants : undefined,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) onSaved();
    else setError("No pudimos guardar el producto");
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Nombre del producto"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Precio"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio anterior (opcional)"
            className={inputClass}
            value={form.previousPrice}
            onChange={(e) => setForm({ ...form, previousPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            className={inputClass}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => {
              const cat = categories.find((c) => c.slug === e.target.value);
              setForm({
                ...form,
                category: e.target.value as Product["category"],
                subcategory: cat?.subcategories[0] ?? "",
              });
            }}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            className={inputClass}
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          >
            {selectedCategory?.subcategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Descripción completa"
          className={`${inputClass} mt-3`}
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="mt-3">
          <p className="mb-2 text-sm font-medium text-muted">Fotos del producto</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-2 px-4 py-6 text-center text-sm text-muted transition hover:border-accent hover:text-foreground"
          >
            <UploadCloud className="h-6 w-6" />
            <span>
              Arrastra o <span className="font-medium text-accent">selecciona imágenes</span> desde tu computador
            </span>
            <span className="text-xs text-muted">JPG, PNG, WEBP o GIF · máx. 5MB por foto</span>
          </button>

          {uploadError && <p className="mt-2 text-sm text-red-400">{uploadError}</p>}

          {(form.images.length > 0 || uploading.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={url + i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {uploading.map((id) => (
                <div key={id} className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-surface-2">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 shrink-0 text-muted" />
            <input
              placeholder="O pega la URL de una imagen externa (opcional)"
              className={inputClass}
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddManualUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-2.5 text-xs text-muted hover:text-foreground"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Agregar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted">
            Variantes (opcional — deja vacío si el producto no las necesita)
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted">
                Colores (separados por coma)
              </label>
              <input
                placeholder="Ej: Negro, Blanco, Gris"
                className={inputClass}
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">
                Tallas (separadas por coma)
              </label>
              <input
                placeholder="Ej: S, M, L, XL"
                className={inputClass}
                value={form.tallas}
                onChange={(e) => setForm({ ...form, tallas: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                form.tags.includes(tag) ? "border-accent bg-accent text-[#1a1408]" : "border-border text-muted"
              }`}
            >
              {tag === "nuevo" ? "Nuevo" : tag === "masVendido" ? "Más vendido" : "Oferta"}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Producto activo (visible en la tienda)
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a1408] disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
