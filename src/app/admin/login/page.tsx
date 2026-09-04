"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storeConfig } from "@/config/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al iniciar sesión");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold">
          {storeConfig.name} <span className="text-accent">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Ingresa tus credenciales para continuar.</p>

        <div className="mt-6 flex flex-col gap-4">
          <input
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-[#1a1408] disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          Usuario y contraseña por defecto: admin / meru2024
        </p>
      </form>
    </div>
  );
}
