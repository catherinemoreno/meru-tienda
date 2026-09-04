import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HallazgosSection from "@/components/home/HallazgosSection";
import TrustBar from "@/components/home/TrustBar";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";
import {
  getNewProducts,
  getBestSellers,
  getOffers,
  getHallazgos,
  getFeaturedProducts,
  getCategories,
} from "@/lib/repository";

export const revalidate = 60;

export default async function Home() {
  const [newProducts, bestSellers, offers, hallazgos, featured, categories] = await Promise.all([
    getNewProducts(8),
    getBestSellers(8),
    getOffers(8),
    getHallazgos(8),
    getFeaturedProducts(1),
    getCategories(),
  ]);

  return (
    <>
      <Hero featured={featured[0]} />

      <CategoryShowcase categories={categories} />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="Recién llegados" title="Novedades" href="/tienda?filtro=nuevo" />
        <ProductGrid products={newProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="Los favoritos" title="Más vendidos" href="/tienda?filtro=masVendido" />
        <ProductGrid products={bestSellers} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="Por tiempo limitado" title="Ofertas destacadas" href="/tienda?filtro=oferta" />
        <ProductGrid products={offers} />
      </section>

      <HallazgosSection products={hallazgos} />

      <TrustBar />
    </>
  );
}
