import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@contractspec/lib.ui-kit-web/ui/carousel';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';

export interface FeatureSlide {
  title: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
}

export function FeatureCarousel({
  slides,
  className,
}: {
  slides: FeatureSlide[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Carousel>
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold">{s.title}</div>
                    {s.description && (
                      <div className="text-muted-foreground text-base">
                        {s.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {s.media}
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
