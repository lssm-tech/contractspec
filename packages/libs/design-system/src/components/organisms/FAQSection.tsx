import * as React from 'react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@contractspec/lib.ui-kit-web/ui/accordion';

export interface FAQItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export function FAQSection({
  title,
  subtitle,
  children,
  className,
  items,
  accordionType = 'single',
  collapsible = true,
  defaultOpenIndex = 0,
  accordionClassName,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode; // custom content (deprecated in favor of items)
  className?: string;
  items?: FAQItem[]; // when provided, renders an accordion list
  accordionType?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultOpenIndex?: number; // for 'single' type
  accordionClassName?: string;
}) {
  const hasItems = Array.isArray(items) && items.length > 0;

  const defaultValue = React.useMemo(() => {
    if (!hasItems) return undefined;
    if (accordionType === 'multiple') return undefined; // let UI kit default
    return `item-${Math.max(0, Math.min((items?.length ?? 1) - 1, defaultOpenIndex))}`;
  }, [hasItems, accordionType, defaultOpenIndex, items]);

  return (
    <section className={`py-12 sm:py-16 lg:py-24 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <VStack className="gap-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="text-muted-foreground mx-auto max-w-2xl text-base">
              {subtitle}
            </p>
          ) : null}
        </VStack>
        <div className="mx-auto mt-8 max-w-3xl">
          {hasItems ? (
            <VStack className="mt-8">
              <Accordion
                type={accordionType}
                collapsible={collapsible}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                defaultValue={defaultValue as any}
                className={accordionClassName}
              >
                {items?.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-6">
                      <span className="text-foreground text-lg font-medium">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </VStack>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}
