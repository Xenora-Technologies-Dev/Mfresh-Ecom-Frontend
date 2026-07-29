import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { ProductDetailContent } from "@/components/products/product-detail-content";
import { CategoryBreadcrumbs } from "@/components/shared/category-breadcrumbs";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(product.categorySlug
      ? [{ label: product.categoryName, href: `/categories/${product.categorySlug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <section className="border-b border-gray-100 bg-light-gray/30 py-2.5">
        <div className="container-main">
          <CategoryBreadcrumbs items={breadcrumbItems} />
        </div>
      </section>

      <section className="pb-6 pt-3 sm:pb-12 sm:pt-4">
        <div className="container-main">
          <ProductDetailContent product={product} related={related} />
        </div>
      </section>
    </>
  );
}
