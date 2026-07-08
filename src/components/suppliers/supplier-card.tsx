"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Supplier } from "@/types";
import { cn } from "@/lib/utils";

interface SupplierCardProps {
  supplier: Supplier;
  index?: number;
  className?: string;
}

export function SupplierCard({ supplier, index = 0, className }: SupplierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn("group", className)}
    >
      <Link href={`/suppliers?supplier=${supplier.slug}`}>
        <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/5">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100">
              <Image
                src={supplier.logo}
                alt={supplier.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-base font-semibold text-dark-gray group-hover:text-primary transition-colors">
                  {supplier.name}
                </h3>
                {supplier.verified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted">{supplier.country}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{supplier.rating}</span>
                <span className="text-xs text-muted">
                  · {supplier.productCount} products
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted leading-relaxed">
            {supplier.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {supplier.specialties.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
