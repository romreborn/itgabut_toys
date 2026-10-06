export function rupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

/**
 * Store-wide discount, baked into every selling price: the catalog shows the list price struck
 * through next to the sale price, and the cart and checkout charge the sale price.
 */
export const DISCOUNT_RATE = 0.1;
export const DISCOUNT_LABEL = `-${Math.round(DISCOUNT_RATE * 100)}%`;

export function salePrice(price: number): number {
  return Math.round(price * (1 - DISCOUNT_RATE));
}
