import * as React from 'react';
import { VStack } from '../stack';
import { Text } from '../text';

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
      <Text className="text-lg font-semibold">{title}</Text>
      {body && <Text className="text-muted-foreground text-base">{body}</Text>}
      {outcome && (
        <Text className="text-base">
          <Text className="font-medium">Outcome:</Text> {outcome}
        </Text>
      )}
    </VStack>
  );
}
