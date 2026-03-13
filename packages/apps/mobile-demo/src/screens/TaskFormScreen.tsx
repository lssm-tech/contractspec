import React, { useState } from 'react';
import { View } from 'react-native';
import * as Burnt from 'burnt';
import { useRouter } from 'expo-router';
import { useForm } from '@contractspec/lib.ui-kit/ui/form';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Input } from '@contractspec/lib.ui-kit/ui/input';
import { Label } from '@contractspec/lib.ui-kit/ui/label';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { taskRegistry } from '@/handlers';

const ctx = { actor: 'anonymous' as const, channel: 'mobile' as const };

interface FormValues {
  title: string;
}

export function TaskFormScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { title: '' },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const title = values.title?.trim();
    if (!title) {
      form.setError('title', { message: 'Title is required' });
      return;
    }
    if (title.length > 500) {
      form.setError('title', { message: 'Title must be 1–500 characters' });
      return;
    }
    try {
      await taskRegistry.execute('task.create', '1.0.0', { title }, ctx);
      Burnt.toast({ title: 'Task added', preset: 'done' });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  });

  return (
    <View className="flex-1 p-6">
      <VStack className="gap-4">
        <View className="gap-2">
          <Label nativeID="task-title">Title</Label>
          <Input
            placeholder="Enter task title"
            value={form.watch('title')}
            onChangeText={(text) => form.setValue('title', text)}
            accessibilityLabelledBy="task-title"
          />
          {form.formState.errors.title && (
            <Text className="text-destructive text-sm">
              {form.formState.errors.title.message}
            </Text>
          )}
        </View>

        {error && <Text className="text-destructive text-sm">{error}</Text>}

        <Button onPress={onSubmit} disabled={form.formState.isSubmitting}>
          <Text>{form.formState.isSubmitting ? 'Saving...' : 'Save'}</Text>
        </Button>
      </VStack>
    </View>
  );
}
