/** Stable en-US formatting so server and client markup match. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
