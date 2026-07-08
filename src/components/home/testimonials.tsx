"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/lib/api/content";
import { PLACEHOLDER_IMAGE } from "@/lib/api/client";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/shared/skeletons";

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <AnimatedSection className="py-14 sm:py-20 bg-gradient-to-b from-light-gray/50 to-white">
      <div className="container-main">
        <SectionHeader
          title="Trusted by Industry Leaders"
          subtitle="What our buyers and suppliers say about MFresh"
          align="center"
        />
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary-muted">
                    {item.avatar && item.avatar !== PLACEHOLDER_IMAGE ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-gray">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted">
                      {item.role}
                      {item.company ? `, ${item.company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
