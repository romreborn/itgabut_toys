export const WA_NUMBER = "6285111043518";
export const WA_DISPLAY = "0851 1104 3518";
export const INSTAGRAM_URL = "https://instagram.com/itgabut.hobby";
export const INSTAGRAM_HANDLE = "@itgabut.hobby";
export const SHOPEE_URL = "https://shopee.co.id/itgabut";
export const SITE_NAME = "ITGabut Toys";
// The www host is primary on Vercel (the bare domain 308-redirects to it), so canonicals,
// the sitemap and schema URLs must use www or every one of them points at a redirect.
export const SITE_URL = "https://www.itgabuttoys.com";
/** 1200x630 share image for pages without their own photo (home, /blog, /games, products without a picture). */
export const DEFAULT_OG_IMAGE = "/og-default.jpg";
export const GA_MEASUREMENT_ID = "G-SC2KRC6E9F";
export const MALLS = [
  "Mall Alam Sutera",
  "Mall Living World",
  "Mall Summarecon Serpong",
  "Mall Ciputra Tangerang",
];

export function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
