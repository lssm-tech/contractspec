export async function dynamicImport(path: string): Promise<Record<string, unknown>> {
  const imported = await import(path);
  return imported as Record<string, unknown>;
}







