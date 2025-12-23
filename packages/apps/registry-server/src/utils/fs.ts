import { readFile } from 'node:fs/promises';

export async function readJsonFile<T>(absolutePath: string): Promise<T> {
  const raw = await readFile(absolutePath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function readTextFile(absolutePath: string): Promise<string> {
  return await readFile(absolutePath, 'utf8');
}
