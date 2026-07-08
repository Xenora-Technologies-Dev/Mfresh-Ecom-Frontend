import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/products/product-card";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductFavoriteButton } from "@/components/products/product-favorite-button";
import { ProductPriceBlock } from "@/components/products/product-price-block";

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

  return (
    <>
      <section className="border-b border-gray-100 bg-light-gray/30 py-8">
        <div className="container-main">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductImageGallery
              images={
                product.images.length > 0 ? product.images : [product.image]
              }
              alt={product.name}
            />

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {product.isNew && <Badge variant="new">New</Badge>}
                {product.featured && <Badge variant="secondary">Featured</Badge>}
                <Badge variant="outline">{product.categoryName}</Badge>
              </div>

              <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.country}
                </span>
                <Link
                  href={`/suppliers?supplier=${product.supplierId}`}
                  className="hover:text-primary transition-colors"
                >
                  by {product.supplierName}
                </Link>
              </div>

              <p className="text-base leading-relaxed text-muted">
                {product.description}
              </p>

              <ProductPriceBlock
                price={product.price}
                currency={product.currency}
                moq={product.moq}
                moqUnit={product.moqUnit}
              />

              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/contact">Request Quote</Link>
                </Button>
                <ProductFavoriteButton productId={product.id} />
              </div>

              {product.specifications && (
                <div className="rounded-2xl border border-gray-100 p-6">
                  <h3 className="mb-4 font-semibold text-dark-gray">
                    Specifications
                  </h3>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-xs uppercase tracking-wide text-muted">
                          {key}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-dark-gray">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-8 text-2xl font-bold text-dark-gray">
                Related Products
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
