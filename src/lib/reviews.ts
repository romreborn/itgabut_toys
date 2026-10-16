/**
 * Buyer reviews from the ITGabut Toys Shopee store, transcribed from screenshots
 * (originals kept outside public/). Usernames are masked, and product names are cut
 * where Shopee truncates them, so nothing here goes beyond what the screenshots show.
 *
 * Deliberately NOT emitted as Review/AggregateRating structured data: Google treats
 * reviews of your own business, and reviews copied from another site, as ineligible.
 */
export interface ShopeeReview {
  /** Masked Shopee username, e.g. "di***e". */
  name: string;
  rating: number;
  text?: string;
  /** Omitted when the screenshot does not show the product name. */
  product?: string;
  variant?: string;
  /** dd-mm-yyyy as shown on Shopee. */
  date: string;
}

export const SHOPEE_RATING = { score: "5.0", count: 31, asOf: "Oktober 2026" };

export const SHOPEE_REVIEWS: ShopeeReview[] = [
  { name: "di***e", rating: 5, text: "Trusted", product: "Figure Ultraman GVS01 Prologue of Hero", variant: "Corona, Bemular", date: "16-07-2026" },
  { name: "yo***e", rating: 5, text: "Terima kasih sudah di bantu 🙏 Kualitas: Good. Tampilan: Good.", product: "Figure Ultraman GVS01 Prologue of Hero", variant: "Suit Zero", date: "21-06-2026" },
  { name: "su***a", rating: 5, text: "Keren", product: "Blokees Transformers Classic Class 23", date: "27-07-2026" },
  { name: "ka***8", rating: 5, text: "Terbaik pokonya", variant: "Figure5k", date: "" },
  { name: "_t***v", rating: 5, text: "Bagus", product: "Blokees Pokemon Classic Edition", variant: "Greninja", date: "30-07-2026" },
  { name: "na***k", rating: 5, product: "Figure Naruto GV04 Blokees Selected OFC", variant: "Sasuke", date: "02-10-2026" },
  { name: "ma***7", rating: 5, product: "Figure Saint Seiya GV04 Gold Zodiac Blokees", variant: "Pisces Aphrodite", date: "01-10-2026" },
  { name: "ab***i", rating: 5, product: "Figure Ultraman Shining S01 Blokees Menyala", variant: "Trigger Sky", date: "10-09-2026" },
  { name: "l8***o", rating: 5, product: "Figure Ultraman Blokees GVS02", variant: "Kyrieloid", date: "20-07-2026" },
  { name: "rm***a", rating: 5, product: "Figure Ultraman GVS01 Prologue of Hero", variant: "Ace Suit", date: "18-07-2026" },
];

/** Blurred screenshots of the Shopee review page, used as proof on /tentang. */
export const SHOPEE_REVIEW_SHOTS = [1, 2, 3, 4].map((n) => `/review/shopee-review-${n}.webp`);
