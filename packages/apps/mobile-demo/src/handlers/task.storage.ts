import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from './task.types';

const KEY = 'expo-demo-tasks';

export async function loadTasksFromStorage(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Task =>
        t != null &&
        typeof t === 'object' &&
        typeof (t as Task).id === 'string' &&
        typeof (t as Task).title === 'string' &&
        typeof (t as Task).done === 'boolean'
    );
  } catch {
    return [];
  }
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // Persistence is best-effort; app continues without it
  }
}
