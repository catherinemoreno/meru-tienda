import { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meru.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/tienda", "/carrito", "/checkout"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/categoria/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
