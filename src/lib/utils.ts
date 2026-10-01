/**
 * Minimal className combiner — joins truthy class fragments with a space.
 * Keeps the dependency surface small while supporting conditional classes.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
