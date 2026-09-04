"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power, Search } from "lucide-react";
import { Product, Category } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  async function handleToggle(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "PATCH" });
    load();
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setModalOpen(true);
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Productos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a1408]"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-muted" colSpan={6}>Cargando...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td className="px-4 py-6 text-muted" colSpan={6}>No hay productos.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      p.active ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                    )}
                  >
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleToggle(p.id)} className="rounded-lg p-2 hover:bg-surface-2" title="Activar/Desactivar">
                      <Power className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEdit(p)} className="rounded-lg p-2 hover:bg-surface-2" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 hover:bg-surface-2 hover:text-red-400" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
