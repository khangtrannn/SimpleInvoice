export function getUserInitials(fullname: string | null | undefined): string {
  const normalizedName = fullname?.trim();

  if (!normalizedName) {
    return '?';
  }

  const initials = normalizedName
    .split(/\s+/)
    .map((namePart) => namePart[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return initials || '?';
}
