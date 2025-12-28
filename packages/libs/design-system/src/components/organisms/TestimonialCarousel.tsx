import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@contractspec/lib.ui-kit-web/ui/carousel';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';

export interface Testimonial {
  quote: React.ReactNode;
  author: React.ReactNode;
  role?: React.ReactNode;
  avatar?: React.ReactNode;
}

export function TestimonialCarousel({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Carousel>
        <CarouselContent>
          {testimonials.map((t, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="p-6">
                  <div className="text-lg">{t.quote}</div>
                  <div className="mt-4 flex items-center gap-3">
                    {t.avatar}
                    <div className="text-base">
                      <div className="font-medium">{t.author}</div>
                      {t.role && (
                        <div className="text-muted-foreground">{t.role}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
