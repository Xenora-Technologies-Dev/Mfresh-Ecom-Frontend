"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductFavoriteButton } from "@/components/products/product-favorite-button";
import { ProductShareButton } from "@/components/products/product-share-button";
import { ProductPriceBlock } from "@/components/products/product-price-block";
import { QuickQuoteModal } from "@/components/products/quick-quote-modal";
import { ProductCard } from "@/components/products/product-card";
import { LoginRequiredModal } from "@/components/shared/login-required-modal";
import { CountryFlagIcon } from "@/components/shared/country-flag-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import {
  hasAnySpec,
  parseProductSpecs,
} from "@/lib/product-specs";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

function SpecRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-sm">
      <span className="font-semibold text-dark-gray">{label}:</span>
      <span className="text-muted">{value}</span>
    </div>
  );
}

function SpecCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-light-gray/70 p-4 sm:p-5", className)}>
      <h3 className="mb-3 text-base font-bold text-dark-gray">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CountryFlag({ country }: { country?: string }) {
  if (!country) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <CountryFlagIcon country={country} size={18} />
      <span>{country}</span>
    </span>
  );
}

function countProductImages(product: Product): number {
  const display =
    product.displayImage || product.mainImage || product.images?.[0] || product.image;
  const additional =
    product.additionalImages?.length
      ? product.additionalImages
      : product.subImages?.length
        ? product.subImages
        : product.images && product.images.length > 1
          ? product.images.slice(1)
          : [];
  const gallery = [
    ...(display ? [display] : []),
    ...additional.filter((s) => s && s !== display),
  ];
  return gallery.length;
}

interface ProductDetailContentProps {
  product: Product;
  related: Product[];
}

export function ProductDetailContent({ product, related }: ProductDetailContentProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const moq = Math.max(1, product.moq || 1);
  const { isSignedIn } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const specs = useMemo(
    () => parseProductSpecs(product.specifications),
    [product.specifications],
  );

  const imageCount = useMemo(() => countProductImages(product), [product]);
  // Few images → buy box sits beside gallery (higher). Many images → buy box below gallery.
  const buyBoxBesideGallery = imageCount <= 2;

  const unavailable = product.soldOut || product.isActive === false;

  const handleAddToCart = () => {
    if (!isSignedIn) {
      setLoginOpen(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      quantity: moq,
      moqUnit: product.unit,
      price: product.minPrice,
      currency: product.currency,
      image: product.image,
    });
    toast.success(`Added ${moq} ${product.unit} to cart`);
    openDrawer();
  };

  const buyBox = (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <ProductPriceBlock
        minPrice={product.minPrice}
        maxPrice={product.maxPrice}
        currency={product.currency}
        moq={product.moq}
        unit={product.unit}
      />

      <div className="mt-4 flex flex-col gap-2 sm:mt-5">
        {unavailable ? (
          <Button size="lg" disabled variant="outline" className="w-full">
            {product.soldOut ? "Sold Out" : "Unavailable"}
          </Button>
        ) : (
          <>
            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setQuoteOpen(true)}
            >
              Quick Quote
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const productDetails = (
    <>
      {hasAnySpec(specs, [
        "varietyName",
        "productCode",
        "cultivationType",
        "grade",
        "shelfLife",
      ]) || product.country ? (
        <SpecCard title="Product Details">
          <SpecRow label="Product Name" value={product.name} />
          <SpecRow label="Variety Name" value={specs.varietyName} />
          <SpecRow label="Product Code" value={specs.productCode} />
          <SpecRow label="Cultivation Type" value={specs.cultivationType} />
          <SpecRow label="Grade" value={specs.grade} />
          {product.country && (
            <div className="flex flex-wrap gap-x-2 text-sm">
              <span className="font-semibold text-dark-gray">Country of Origin:</span>
              <CountryFlag country={product.country} />
            </div>
          )}
          <SpecRow label="Shelf Life" value={specs.shelfLife} />
        </SpecCard>
      ) : null}

      {(specs.aboutVariety || product.description) && (
        <SpecCard title="About the Variety">
          <p className="text-sm leading-relaxed text-muted">
            {specs.aboutVariety || product.description}
          </p>
        </SpecCard>
      )}

      {hasAnySpec(specs, [
        "packagingType",
        "packagingWeight",
        "unitsPerPackaging",
        "packagingPerTon",
        "packagingPerContainer",
      ]) && (
        <SpecCard title="Stock Dimensions">
          <SpecRow label="Packaging Type" value={specs.packagingType} />
          <SpecRow label="Packaging Weight" value={specs.packagingWeight} />
          <SpecRow label="Units per Packaging Type" value={specs.unitsPerPackaging} />
          <SpecRow label="Packaging Type Qty per Ton" value={specs.packagingPerTon} />
          <SpecRow
            label="Packaging Type Qty per Container"
            value={specs.packagingPerContainer}
          />
        </SpecCard>
      )}

      {hasAnySpec(specs, [
        "pricePerKg",
        "pricePerPackaging",
        "sellingRange",
        "storage",
        "temperature",
        "halalStatus",
        "hasTechSpecSheet",
      ]) && (
        <SpecCard title="Quick Details">
          <SpecRow
            label="Price per Kg"
            value={specs.pricePerKg ? `$${specs.pricePerKg}/Kg` : undefined}
          />
          <SpecRow
            label="Price per Packaging Type"
            value={specs.pricePerPackaging ? `$${specs.pricePerPackaging}` : undefined}
          />
          <SpecRow label="Selling Range" value={specs.sellingRange} />
          <SpecRow label="Storage" value={specs.storage} />
          <SpecRow label="Temperature" value={specs.temperature} />
          <SpecRow label="Halal Status" value={specs.halalStatus} />
          <SpecRow
            label="Product Technical Specification Sheet"
            value={specs.hasTechSpecSheet}
          />
        </SpecCard>
      )}
    </>
  );

  const shippingAndExtra = (
    <>
      {hasAnySpec(specs, [
        "shippingFrom",
        "shippingMode",
        "port",
        "containerType",
        "incoterm",
        "leadTimeDays",
      ]) && (
        <SpecCard title="Shipping Information">
          {specs.shippingFrom && (
            <div className="flex flex-wrap gap-x-2 text-sm">
              <span className="font-semibold text-dark-gray">Shipping from:</span>
              <CountryFlag country={specs.shippingFrom} />
            </div>
          )}
          <SpecRow label="Shipping Mode" value={specs.shippingMode} />
          <SpecRow label="Port" value={specs.port} />
          <SpecRow label="Container type" value={specs.containerType} />
          <SpecRow label="Price Option (INCOTERM)" value={specs.incoterm} />
          <SpecRow label="Lead time of supply" value={specs.leadTimeDays} />
        </SpecCard>
      )}

      {hasAnySpec(specs, [
        "hsCode",
        "storageTemperature",
        "transportTemperature",
        "productType",
      ]) && (
        <SpecCard title="Additional Information">
          <SpecRow label="HS Code" value={specs.hsCode} />
          <SpecRow label="Storage Temperature" value={specs.storageTemperature} />
          <SpecRow
            label="Transportation Temperature"
            value={specs.transportTemperature}
          />
          <SpecRow label="Product Type" value={specs.productType} />
        </SpecCard>
      )}
    </>
  );

  return (
    <>
      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.featured && <Badge variant="secondary">Featured</Badge>}
            {product.soldOut && <Badge variant="secondary">Sold Out</Badge>}
            {product.isActive === false && (
              <Badge variant="outline">Unavailable</Badge>
            )}
          </div>
          <h1 className="pr-1 text-xl font-bold leading-snug text-dark-gray sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <ProductFavoriteButton productId={product.id} />
          <ProductShareButton product={product} />
        </div>
      </div>

      {buyBoxBesideGallery ? (
        <>
          {/* Few images: gallery + buy box side-by-side (buy box sits higher) */}
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:items-start lg:gap-6">
            <ProductImageGallery
              displayImage={product.displayImage}
              additionalImages={product.additionalImages}
              comingSoon={product.comingSoon}
              alt={product.name}
              className="max-w-none"
            />
            <div className="space-y-4 lg:sticky lg:top-24">
              {buyBox}
              <div className="hidden space-y-4 lg:block">{shippingAndExtra}</div>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">{productDetails}</div>
            <div className="space-y-4 lg:hidden">{shippingAndExtra}</div>
          </div>
        </>
      ) : (
        <>
          {/* Many images: full-width gallery, then specs | buy box lower */}
          <ProductImageGallery
            displayImage={product.displayImage}
            additionalImages={product.additionalImages}
            comingSoon={product.comingSoon}
            alt={product.name}
            className="mb-6 max-w-none"
          />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-4">{productDetails}</div>
            <div className="space-y-4 lg:sticky lg:top-24">
              {buyBox}
              {shippingAndExtra}
            </div>
          </div>
        </>
      )}

      {related.length > 0 && (
        <div className="mt-10 sm:mt-14">
          <h2 className="mb-4 text-lg font-bold text-dark-gray sm:mb-6 sm:text-xl lg:text-2xl">
            You might be interested in
          </h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <QuickQuoteModal
        product={product}
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />
      <LoginRequiredModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Login to add to cart"
        description={`Sign in as a buyer to add ${moq} ${product.unit} of “${product.name}” to your cart.`}
      />
    </>
  );
}
