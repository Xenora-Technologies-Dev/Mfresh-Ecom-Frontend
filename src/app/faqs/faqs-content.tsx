"use client";

import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/lib/api/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Skeleton } from "@/components/shared/skeletons";

export function FAQsContent() {
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
  });

  if (isLoading) {
    return (
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main mx-auto max-w-3xl space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </AnimatedSection>
    );
  }

  if (!isLoading && faqs.length === 0) {
    return (
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main mx-auto max-w-3xl text-center text-muted">
          <p>FAQs will appear here once configured in the admin portal settings.</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="py-14 sm:py-20">
      <div className="container-main">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AnimatedSection>
  );
}
