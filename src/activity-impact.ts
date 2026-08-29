/** Every impact, ascending by how much it matters, which is the order a surface offers them in. */
export const IMPACTS = ["debug", "info", "notice", "warning", "error"] as const;

/** How much one recorded activity matters, which is what a surface sorts, colours and filters by. */
export type Impact = (typeof IMPACTS)[number];

/**
 * Narrows an impact that arrived as a bare string.
 *
 * @remarks
 * Belongs at the seam where an untyped producer crosses into typed code, so exactly one narrowing
 * happens per producer. A consumer downstream of that seam takes {@link Impact} and never re-checks.
 *
 * @param value the impact as the producer named it
 * @returns whether it is one this ecosystem records
 */
export function isImpact(value: unknown): value is Impact {
  return typeof value === "string" && (IMPACTS as readonly string[]).includes(value);
}
