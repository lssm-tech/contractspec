import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@contractspec/lib.ui-kit/ui/button';
import { Checkbox } from '@contractspec/lib.ui-kit/ui/checkbox';
import { EmptyState } from '@contractspec/lib.ui-kit/ui/empty-state';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { Plus } from 'lucide-react-native';
import { taskRegistry } from '@/handlers';
import type { Task } from '@/handlers';

const ctx = { actor: 'anonymous' as const, channel: 'mobile' as const };

export function TaskListScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = (await taskRegistry.execute(
        'task.list',
        '1.0.0',
        {},
        ctx
      )) as { tasks: Task[] };
      setTasks(result.tasks);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks])
  );

  const toggleDone = useCallback(
    async (task: Task) => {
      if (togglingId !== null) return;
      setTogglingId(task.id);
      const prevDone = task.done;
      setTasks((p) =>
        p.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
      );
      try {
        await taskRegistry.execute(
          'task.updateStatus',
          '1.0.0',
          { id: task.id, done: !prevDone },
          ctx
        );
      } catch (_err) {
        setTasks((p) =>
          p.map((t) => (t.id === task.id ? { ...t, done: prevDone } : t))
        );
      } finally {
        setTogglingId(null);
      }
    },
    [togglingId]
  );

  if (error && tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-destructive mb-4 text-center">{error}</Text>
        <Button
          onPress={() => void loadTasks()}
          accessibilityLabel="Retry"
          accessibilityRole="button"
          accessibilityHint="Retry loading the task list"
        >
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center p-6">
          <EmptyState
            title="No tasks yet"
            description="Add your first task to get started."
            primaryAction={
              <Button
                onPress={() => router.push('/add')}
                accessibilityLabel="Add task"
                accessibilityRole="button"
                accessibilityHint="Opens the form to create a new task"
              >
                <Plus className="mr-2 h-4 w-4" />
                <Text>Add task</Text>
              </Button>
            }
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1">
      {error && tasks.length > 0 && (
        <View className="border-destructive/20 bg-destructive/10 border-b px-4 py-3">
          <Text className="text-destructive text-sm">
            Could not refresh. Pull to try again.
          </Text>
        </View>
      )}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTasks} />
        }
        accessibilityLabel="Task list"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleDone(item)}
            disabled={togglingId === item.id}
            className="border-input bg-background flex-row items-center gap-3 rounded-lg border p-4"
            accessibilityLabel={
              item.done
                ? `Mark ${item.title} as not done`
                : `Mark ${item.title} as done`
            }
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.done }}
            accessibilityHint="Double tap to toggle"
          >
            <Checkbox
              checked={item.done}
              onCheckedChange={() => void toggleDone(item)}
            />
            <Text
              className={`flex-1 text-base ${item.done ? 'text-muted-foreground line-through' : ''}`}
            >
              {item.title}
            </Text>
          </Pressable>
        )}
      />
      <View className="border-input border-t p-4">
        <Button
          onPress={() => router.push('/add')}
          className="w-full"
          accessibilityLabel="Add task"
          accessibilityRole="button"
          accessibilityHint="Opens the form to create a new task"
        >
          <Plus className="mr-2 h-4 w-4" />
          <Text>Add task</Text>
        </Button>
      </View>
    </View>
  );
}
