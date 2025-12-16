export function toKebabCase(str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

export function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}



