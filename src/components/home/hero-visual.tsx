"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const HERO_PERSON_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[420px]">
        <Image
          src={HERO_PERSON_IMAGE}
          alt="Business buyer sourcing fresh wholesale food"
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          unoptimized
        />

        <div className="absolute bottom-4 right-0 w-[55%] max-w-[280px] sm:bottom-8 sm:right-4">
          <div className="relative rounded-[2rem] border-[6px] border-gray-800 bg-gray-900 p-1.5 shadow-2xl sm:border-8 sm:rounded-[2.5rem]">
            <div className="overflow-hidden rounded-[1.4rem] bg-primary sm:rounded-[1.8rem]">
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-10">
                <p className="text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                  Freshness
                </p>
                <p className="mt-1 text-lg font-extrabold uppercase tracking-wide text-white sm:text-xl">
                  Guaranteed
                </p>
                <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 sm:h-20 sm:w-20">
                  <ShieldCheck className="h-10 w-10 text-white sm:h-12 sm:w-12" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
