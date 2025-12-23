import * as React from 'react';
import { Card, CardContent } from './card';
import { HStack, VStack } from './stack';

export interface StatItem {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: 'blue' | 'green' | 'amber';
}

function toneClasses(tone?: StatItem['tone']) {
  switch (tone) {
    case 'green':
      return 'bg-green-50 text-green-800';
    case 'amber':
      return 'bg-amber-50 text-amber-800';
    case 'blue':
    default:
      return 'bg-blue-50 text-blue-800';
  }
}

export function StatCardGroup({
  items,
  className,
}: {
  items: StatItem[];
  className?: string;
}) {
  return (
    <HStack className={className + ' w-full flex-wrap gap-3'}>
      {items.map((it, idx) => (
        <Card key={idx} className="border-none shadow-2xs">
          <CardContent className="px-4 py-3">
            <VStack className="gap-1">
              <div
                className={`w-fit rounded-xs px-2 py-0.5 text-sm ${toneClasses(it.tone)}`}
              >
                {it.label}
              </div>
              <div className="text-xl font-semibold">{it.value}</div>
            </VStack>
          </CardContent>
        </Card>
      ))}
    </HStack>
  );
}
