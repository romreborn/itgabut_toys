import type { Product } from "@/lib/productShared";

/**
 * Catalog categories = the product `ip` field, one crawlable page each at /katalog/[seri].
 * These pages exist so every product has a plain <a href> from a server-rendered page
 * (the homepage grid paginates client-side and only links 12 products in its HTML).
 *
 * No Supabase import here: client components (ProductDetail, Footer) use categorySlug().
 */

interface CategoryCopy {
  /** Display name used in the H1, titles and links. */
  label: string;
  /** Hand-written intro, facts only (names come from the live catalog). */
  intro?: string;
  /** Blog posts whose title matches this regex are listed as related articles. */
  posts?: RegExp;
}

/** Slugs that should not just be the slugified ip. */
const SLUG_OVERRIDE: Record<string, string> = {
  Hero: "hero-infinity",
};

const COPY: Record<string, CategoryCopy> = {
  Transformers: {
    label: "Blokees Transformers",
    intro:
      "Blokees Transformers adalah figure rakit berlisensi resmi Hasbro, dari Optimus Prime, Megatron, dan Bumblebee sampai Dinobot. Pilihannya mulai dari blind box Defender Version (Galaxy Shining, sekitar 5,5 cm), Galaxy Version, dan Shining Version, sampai Champion Class dan Action Edition yang dijual satuan.",
    posts: /transformers/i,
  },
  Marvel: {
    label: "Blokees Marvel",
    intro:
      "Blokees Marvel berisi figure rakit karakter Marvel seperti Iron Man, Thor, Captain America, Spider-Man, Wolverine, dan Deadpool. Ada blind box Galaxy Version seri Infinity Saga dan Champion Class Lite, serta Champion Class satuan untuk satu karakter.",
    posts: /marvel|avengers/i,
  },
  Hero: {
    label: "Blokees Hero Infinity (HeroSpire)",
    intro:
      "Hero Infinity (英雄无限, juga disebut HeroSpire) adalah lini original Blokees bertema tokoh legenda dan sejarah China, seperti Sun Wukong, Nezha, Guan Yu, Zhang Fei, Lu Bu, dan Zhuge Liang. Ada Armor Version (AMV) satuan, seri GVT dan WV, serta Champion Class.",
    posts: /hero\s?infinity|herospire/i,
  },
  Pokemon: {
    label: "Blokees Pokemon",
    intro:
      "Blokees Pokemon menghadirkan Pokemon seperti Pikachu, Eevee, Charmander, Bulbasaur, Squirtle, dan Charizard dalam bentuk figure rakit. Ada Classic Edition ukuran S dan L, serta Fantastics Series seperti Machamp dan Nidoking.",
    posts: /pok[eé]mon/i,
  },
  "Saint Seiya": {
    label: "Blokees Saint Seiya",
    intro:
      "Blokees Saint Seiya berisi Bronze Saint dan Gold Saint, dari Pegasus Seiya, Andromeda Shun, dan Phoenix Ikki sampai Aries Mu dan Virgo Shaka. Tersedia Champion Class satuan dan blind box Galaxy Version.",
    posts: /saint\s?seiya/i,
  },
  Ultraman: {
    label: "Blokees Ultraman",
    intro:
      "Blokees Ultraman berisi Ultraman dan kaiju dari berbagai era dalam bentuk figure rakit. Pilihannya ada blind box Galaxy Version dan Galaxy Version S, Shining Version, Classic Theme Version, Legend Edition, sampai MOJIPOD.",
    posts: /ultraman/i,
  },
  "Star Wars": {
    label: "Blokees Star Wars",
    intro:
      "Blokees Star Wars berisi figure rakit dari The Mandalorian sampai trilogi prekuel, seperti Darth Vader, Stormtrooper, Obi-Wan Kenobi, Anakin Skywalker, dan Commander Cody. Ada Champion Class satuan, Champion Class Lite, dan blind box Galaxy Version.",
    posts: /star\s?wars/i,
  },
  "Blokees Wheels": {
    label: "Blokees Wheels",
    intro:
      "Blokees Wheels adalah lini mobil rakit Blokees dengan tema Transformers, Ultraman, Batman, dan Wheelsland. Ada blind box seri C dan E, serta seri CT berisi satu karakter seperti Optimus Prime dan Motormaster.",
    posts: /wheels/i,
  },
  Evangelion: {
    label: "Blokees Evangelion",
    intro:
      "Blokees Evangelion berisi Unit Eva dan pilotnya dari Neon Genesis Evangelion, seperti Rei Ayanami, Asuka Langley, dan Mari Makinami. Ada Action Edition untuk Unit Eva, Miracle Edition versi cockpit, Fantastics Series, dan DaaLaMode.",
    posts: /evangelion/i,
  },
  "Hatsune Miku": {
    label: "Blokees Hatsune Miku",
    intro:
      "Blokees Hatsune Miku berisi Miku dalam berbagai tema, dari Sakura Miku dan Miku With You sampai festival musik. Ada Fantastics Edition, DaaLaMode, MOJIPOD, dan blind box.",
    posts: /miku/i,
  },
  Minions: {
    label: "Blokees Minions",
    intro:
      "Blokees Minions berisi figure Minions dari seri Mokoo dan preCOOL, seperti Bob, Kevin, Stuart, Otto, Carl, dan Phil dengan berbagai kostum.",
    posts: /minions/i,
  },
  DC: {
    label: "Blokees DC",
    intro:
      "Blokees DC berisi Batman dan karakter DC lain seperti Superman, Nightwing, Harley Quinn, Catwoman, dan Justice League. Ada Champion Class satuan, termasuk seri Batman: Hush, dan blind box Defender Version.",
    posts: /\bdc\b|batman/i,
  },
  Naruto: {
    label: "Blokees Naruto",
    intro:
      "Blokees Naruto berisi Naruto Uzumaki, Sasuke Uchiha, Minato Namikaze, Madara Uchiha, sampai Kurama dalam bentuk figure rakit. Ada Champion Class satuan, Action Edition Kurama, dan blind box Galaxy Version.",
    posts: /naruto/i,
  },
  "Jurassic World": {
    label: "Blokees Jurassic World Terraventure",
    intro:
      "Blokees Jurassic World Terraventure berisi dinosaurus dari Jurassic Park dan Jurassic World. Ada blind box TS berisi dinosaurus kecil, serta diorama TC seperti TC01 T-Rex dan TC02 Triceratops yang dijual satuan.",
    posts: /terraventure|jurassic/i,
  },
  "Toy Story": { label: "Blokees Toy Story", posts: /toy\s?story/i },
  Megaman: { label: "Blokees Mega Man", posts: /mega\s?man/i },
  "Astral Rally": { label: "Blokees Astral Rally", posts: /astral\s?rally/i },
  "Magic Blocks": { label: "Blokees Magic Blocks" },
};

export function categorySlug(ip: string): string {
  if (SLUG_OVERRIDE[ip]) return SLUG_OVERRIDE[ip];
  return ip
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryLabel(ip: string): string {
  return COPY[ip]?.label ?? (/^blokees\b/i.test(ip) ? ip : `Blokees ${ip}`);
}

export function categoryIntro(ip: string): string | undefined {
  return COPY[ip]?.intro;
}

export function categoryPostMatcher(ip: string): RegExp {
  return COPY[ip]?.posts ?? new RegExp(ip.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

export interface Category {
  ip: string;
  slug: string;
  label: string;
  products: Product[];
}

/** Active products grouped by ip, biggest category first. Keeps the input order inside each group. */
export function groupByCategory(products: Product[]): Category[] {
  const by = new Map<string, Product[]>();
  for (const p of products) by.set(p.ip, [...(by.get(p.ip) ?? []), p]);
  return [...by.entries()]
    .map(([ip, list]) => ({ ip, slug: categorySlug(ip), label: categoryLabel(ip), products: list }))
    .sort((a, b) => b.products.length - a.products.length || a.label.localeCompare(b.label));
}
