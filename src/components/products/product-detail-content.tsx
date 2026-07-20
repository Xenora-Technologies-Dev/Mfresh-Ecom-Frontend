"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
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

interface ProductDetailContentProps {
  product: Product;
  related: Product[];
}

export function ProductDetailContent({ product, related }: ProductDetailContentProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const moq = Math.max(1, product.moq || 1);
  const [quantity, setQuantity] = useState(moq);
  const { isSignedIn } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const specs = useMemo(
    () => parseProductSpecs(product.specifications),
    [product.specifications],
  );

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
      quantity,
      moqUnit: product.moqUnit,
      price: product.price,
      currency: product.currency,
      image: product.image,
    });
    toast.success(`Added ${quantity} ${product.moqUnit} to cart`);
    openDrawer();
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.featured && <Badge variant="secondary">Featured</Badge>}
            {product.soldOut && <Badge variant="secondary">Sold Out</Badge>}
            {product.isActive === false && (
              <Badge variant="outline">Unavailable</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl">
            {product.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ProductFavoriteButton productId={product.id} />
          <ProductShareButton product={product} />
        </div>
      </div>

      <ProductImageGallery
        mainImage={product.mainImage}
        subImages={product.subImages}
        alt={product.name}
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <ProductPriceBlock
              price={product.price}
              currency={product.currency}
              moq={product.moq}
              moqUnit={product.moqUnit}
            />

            {!unavailable && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted">
                  Quantity ({product.moqUnit || "units"})
                </p>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-xl border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex h-10 w-10 items-center justify-center text-dark-gray hover:bg-light-gray disabled:opacity-40"
                      disabled={quantity <= moq}
                      onClick={() => setQuantity((q) => Math.max(moq, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[3.5rem] text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="flex h-10 w-10 items-center justify-center text-dark-gray hover:bg-light-gray"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted">{product.moqUnit}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted">
                  Minimum order: {moq} {product.moqUnit}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {unavailable ? (
                <Button size="lg" disabled variant="outline">
                  {product.soldOut ? "Sold Out" : "Unavailable"}
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setQuoteOpen(true)}
                  >
                    Quick Quote
                  </Button>
                </>
              )}
            </div>
          </div>

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
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-dark-gray sm:text-2xl">
            You might be interested in
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {related.map((p, i) => (
              <div key={p.id} className="w-[220px] shrink-0 sm:w-[240px]">
                <ProductCard product={p} index={i} />
              </div>
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
        description={`Sign in as a buyer to add ${quantity} ${product.moqUnit} of “${product.name}” to your cart.`}
      />
    </>
  );
}
