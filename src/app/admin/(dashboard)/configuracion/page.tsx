"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Settings = {
  whatsappNumber: string;
  tiktok: string;
  instagram: string;
  facebook: string;
  city: string;
};

export default function AdminConfiguracionPage() {
  const [form, setForm] = useState<Settings>({
    whatsappNumber: "",
    tiktok: "",
    instagram: "",
    facebook: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setForm(await res.json());
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm(await res.json());
      setMessage("Guardado. Los cambios ya se ven en la tienda.");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No pudimos guardar los cambios.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent";

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Configuración</h1>
      <p className="mt-1 text-muted">
        Datos de contacto y redes sociales que se muestran en la tienda. Tu correo NO se muestra
        públicamente; solo se usa internamente para que te lleguen los pedidos.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Número de WhatsApp</label>
          <input
            className={inputClass}
            placeholder="573001234567 (sin espacios ni +)"
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Link de TikTok</label>
          <input
            className={inputClass}
            placeholder="https://tiktok.com/@tuusuario"
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Link de Instagram</label>
          <input
            className={inputClass}
            placeholder="https://instagram.com/tuusuario"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Link de Facebook</label>
          <input
            className={inputClass}
            placeholder="https://facebook.com/tupagina"
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ciudad (se muestra en el pie de página)</label>
          <input
            className={inputClass}
            placeholder="Bogotá, Colombia"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#1a1408] disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
