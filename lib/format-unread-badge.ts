/** Unread badge label: 1…cap, then `${cap}+`. */
export function formatUnreadBadge(count: number, cap = 4): string | null {
  if (count <= 0) return null;
  if (count > cap) return `${cap}+`;
  return String(count);
}
