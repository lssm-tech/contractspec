import * as React from 'react';
import { VStack } from '../stack';

export function UserStoryCard({
  title,
  body,
  outcome,
}: {
  title: string;
  body?: string;
  outcome?: string;
}) {
  return (
    <VStack className="rounded-lg border p-4" gap="sm">
      <div className="text-lg font-semibold">{title}</div>
      {body && <div className="text-muted-foreground text-base">{body}</div>}
      {outcome && (
        <div className="text-base">
          <span className="font-medium">Outcome:</span> {outcome}
        </div>
      )}
    </VStack>
  );
}
