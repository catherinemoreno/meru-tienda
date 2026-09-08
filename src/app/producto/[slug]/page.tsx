import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, getProductReviews } from "@/lib/repository";
import { products } from "@/lib/data/products";
import ProductDetail from "@/components/product/ProductDetail";
import ProductReviews from "@/components/product/ProductReviews";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";

export const revalidate = 60;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images,
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const reviews = await getProductReviews(product.id);

  return (
    <div>
      <ProductDetail product={product} />
      <ProductReviews productId={product.id} reviews={reviews} />
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <SectionHeader title="También te puede interesar" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
