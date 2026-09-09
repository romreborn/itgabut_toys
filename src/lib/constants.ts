export const WA_NUMBER = "6285111043518";
export const WA_DISPLAY = "0851 1104 3518";
export const INSTAGRAM_URL = "https://instagram.com/itgabut.hobby";
export const INSTAGRAM_HANDLE = "@itgabut.hobby";
export const SHOPEE_URL = "https://shopee.co.id/itgabut";
export const SITE_NAME = "ITGabut Toys";
export const SITE_URL = "https://itgabuttoys.com";
export const MALLS = [
  "Mall Alam Sutera",
  "Mall Living World",
  "Mall Summarecon Serpong",
  "Mall Ciputra Tangerang",
];

export function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
