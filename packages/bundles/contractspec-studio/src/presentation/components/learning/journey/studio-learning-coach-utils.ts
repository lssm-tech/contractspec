export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  if (Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

export function getPayloadFilter(
  value: unknown
): Record<string, unknown> | undefined {
  const record = asRecord(value);
  return asRecord(record?.payloadFilter);
}

export function getActiveProjectSlug(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'studio') return null;
  const maybe = parts[1];
  if (!maybe) return null;
  if (maybe === 'projects' || maybe === 'learning' || maybe === 'teams')
    return null;
  if (maybe === 'features' || maybe === 'pricing' || maybe === 'docs')
    return null;
  return maybe;
}

export function getStepHref(
  stepKey: string,
  activeProjectSlug: string | null
): string {
  switch (stepKey) {
    case 'choose_template':
      return '/studio/projects';
    case 'edit_spec':
      return activeProjectSlug
        ? `/studio/${activeProjectSlug}/specs`
        : '/studio/projects';
    case 'regenerate_app':
      return activeProjectSlug
        ? `/studio/${activeProjectSlug}/deploy`
        : '/studio/projects';
    case 'open_canvas':
      return activeProjectSlug
        ? `/studio/${activeProjectSlug}/canvas`
        : '/studio/projects';
    case 'try_evolution_mode':
      return activeProjectSlug
        ? `/studio/${activeProjectSlug}/evolution`
        : '/studio/projects';
    default:
      return '/studio/learning';
  }
}



