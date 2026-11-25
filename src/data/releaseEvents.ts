/**
 * Blokees release calendar (/jadwal-rilis and the homepage "Rilis terdekat" section).
 *
 * `date` is "YYYY-MM-DD", or "YYYY-MM" when only the month is known. `confirmed: false`
 * marks dates that are estimates, TBC, or from leaks; the page labels them that way.
 * Products and posts are referenced by slug; missing or inactive products are skipped.
 * No em/en dashes in any text here (site writing rule).
 */

export type ReleaseKind = "rilis" | "event" | "film";

export interface ReleaseEvent {
  id: string;
  date: string;
  /** Last day of a multi-day event (expo, festival). */
  endDate?: string;
  title: string;
  kind: ReleaseKind;
  confirmed: boolean;
  note?: string;
  productSlugs?: string[];
  postSlug?: string;
}

export const RELEASE_EVENTS: ReleaseEvent[] = [
  // September 2026
  {
    id: "star-wars-cc-lite-02",
    date: "2026-09-22",
    title: "Star Wars Champion Class Lite 02 Evergreen Movie Series",
    kind: "rilis",
    confirmed: true,
    note: "Blind box 9 karakter era prekuel Star Wars, dengan secret B1 Battle Droid berkepala C-3PO emas.",
    productSlugs: ["star-wars-champion-class-lite-02-evergreen-movie-series"],
    postSlug: "blokees-star-wars-champion-class-lite-02-full-reveal",
  },
  {
    id: "marvel-cc-lite-02",
    date: "2026-09-23",
    title: "Marvel Champion Class Lite 02 Avengers Endgame",
    kind: "rilis",
    confirmed: true,
    note: "Blind box 9 karakter Avengers: Endgame, dari Iron Man Mark 85 sampai Thanos.",
    productSlugs: ["marvel-hero-cc-lite02-avengers-12"],
    postSlug: "blokees-marvel-champion-class-lite-02-lineup-endgame",
  },
  {
    id: "dc-cc05-cc06-hush",
    date: "2026-09-24",
    title: "DC Champion Class 05 Batman dan 06 Catwoman (Hush)",
    kind: "rilis",
    confirmed: true,
    note: "Dua figure dari komik Batman: Hush karya Jeph Loeb dan Jim Lee, dijual satuan.",
    productSlugs: ["dc-cc05-batman-hush-15", "dc-cc06-catwoman-hush"],
    postSlug: "blokees-dc-champion-class-wave-5-batman-catwoman-hush",
  },
  {
    id: "endgame-encore",
    date: "2026-09-25",
    title: "Avengers: Endgame Encore tayang ulang di bioskop",
    kind: "film",
    confirmed: true,
    note: "Pemanasan sebelum Avengers: Doomsday. Lineup Marvel Champion Class Lite 02 mengambil tema film ini.",
    productSlugs: ["marvel-hero-cc-lite02-avengers-12"],
    postSlug: "marvel-champion-class-lite-02-avengers-endgame",
  },

  // Oktober 2026
  {
    id: "wf-shanghai-2026",
    date: "2026-10-03",
    endDate: "2026-10-04",
    title: "Wonder Festival Shanghai 2026",
    kind: "event",
    confirmed: true,
    note: "Blokees memamerkan produk baru, termasuk Doctor Doom, DC Legend Edition The Flash, dan Terraventure TL01 T-Rex.",
    productSlugs: ["marvel-champion-class-cc17-doctor-doom-avengers-doomsday", "dc-legend-edition-01-the-flash", "jurassic-world-terraventure-tl01-tyrannosaurus-rex"],
    postSlug: "bocoran-dc-capcom-transformers-blokees-wfs2026",
  },
  {
    id: "saint-seiya-gv05",
    date: "2026-10-08",
    title: "Saint Seiya Galaxy Version 05 The Hades Invasion",
    kind: "rilis",
    confirmed: true,
    productSlugs: ["saint-seiya-galaxy-version-gv-05-the-hades-invasion-254"],
    postSlug: "blokees-saint-seiya-galaxy-version-05-hades-invasion",
  },
  {
    id: "wheels-ultraman-c04",
    date: "2026-10-12",
    title: "Blokees Wheels Ultraman C04 Fates Intertwined",
    kind: "rilis",
    confirmed: true,
    note: "Rilis di China. Blind box mobil 1:64 bertema Ultimate Zero melawan Arch Belial.",
    productSlugs: ["blokees-wheels-ultraman-c04-fates-intertwined"],
    postSlug: "blokees-wheels-ultraman-c04-lineup-lengkap",
  },
  {
    id: "transformers-cc28",
    date: "2026-10-15",
    title: "Transformers Champion Class 28 DX Starscream (Energon Universe)",
    kind: "rilis",
    confirmed: true,
    note: "153 part, lengkap dengan tank hitam dan joystick.",
    productSlugs: ["transformers-cc-28-energon-universe-13"],
    postSlug: "blokees-transformers-champion-class-28-dx-starscream-energon-universe",
  },
  {
    id: "transformers-sv06",
    date: "2026-10-15",
    title: "Transformers Shining Version 06",
    kind: "rilis",
    confirmed: true,
    note: "Blind box 6 karakter dengan secret Starscream Coronation Crown.",
    productSlugs: ["transformers-sv-06-shining-version-255"],
    postSlug: "blokees-transformers-shining-version-06-lineup",
  },
  {
    id: "transformers-cc29",
    date: "2026-10-19",
    title: "Transformers Champion Class 29 Optimus Prime (Energon Universe)",
    kind: "rilis",
    confirmed: true,
    note: "Pasangan duel CC-28 DX Starscream.",
    productSlugs: ["transformers-cc-29-energon-universe-14"],
    postSlug: "blokees-transformers-champion-class-29-optimus-prime-energon-universe",
  },
  {
    id: "china-toy-expo-2026",
    date: "2026-10-21",
    endDate: "2026-10-23",
    title: "China Toy Expo 2026, Shanghai",
    kind: "event",
    confirmed: true,
    note: "Preview Blokees: Megaman, Kamen Rider, Transformers, Ultraman, Marvel Avengers: Doomsday, dan Blokees Wheels.",
    productSlugs: ["marvel-champion-class-lite-03-avengers-doomsday-vol-1", "blokees-wheels-transformers-c05-spark-of-legacy", "blokees-wheels-transformers-ct04-ultra-magnus"],
    postSlug: "blokees-china-toy-expo-2026-preview-megaman-kamen-rider-transformers-ultraman",
  },
  {
    id: "terraventure-tc01-tc02",
    date: "2026-10-28",
    title: "Jurassic World Terraventure TC01 T-Rex dan TC02 Triceratops",
    kind: "rilis",
    confirmed: true,
    note: "Diorama satuan Terraventure TC Wave 1.",
    productSlugs: ["jurassic-world-terraventure-tc01-tyrannosaurus-rex", "jurassic-world-terraventure-tc02-triceratops"],
    postSlug: "blokees-terraventure-tc-wave-1-tc01-t-rex-tc02-triceratops",
  },
  {
    id: "ultraman-gvs04",
    date: "2026-10-29",
    title: "Ultraman Galaxy Version S04 Bond of Destiny",
    kind: "rilis",
    confirmed: true,
    note: "Blind box 9 figure dari semesta Ultraman Z dan Ultraman Orb, plus Ultraman Belial.",
    productSlugs: ["ultraman-gvs-04-bond-of-destiny-256"],
    postSlug: "blokees-ultraman-galaxy-s04-lineup-lengkap",
  },
  {
    id: "miku-ultra-kaiju-party",
    date: "2026-10-31",
    title: "Hatsune Miku DaaLaMode Ultra Miku Kaiju Party (pre-release)",
    kind: "rilis",
    confirmed: true,
    note: "Pre-release di konser Miku for you 2026. Harga belum diumumkan.",
    postSlug: "blokees-daalamode-ultra-miku-kaiju-party-gomora",
  },

  // November 2026
  {
    id: "dc-cc07-cc08-hush",
    date: "2026-11-09",
    title: "DC Champion Class 07 Joker dan 08 Superman (Hush)",
    kind: "rilis",
    confirmed: false,
    note: "Tanggal dari bocoran, belum dikonfirmasi resmi.",
    postSlug: "bocoran-blokees-dc-champion-class-07-joker-08-superman-hush",
  },
  {
    id: "wheels-transformers-c05",
    date: "2026-11-16",
    title: "Blokees Wheels Transformers C05 Spark of Legacy",
    kind: "rilis",
    confirmed: true,
    note: "Rilis global. Blind box mobil Transformers 1:64, lanjutan C04 Heart of the Ark.",
    productSlugs: ["blokees-wheels-transformers-c05-spark-of-legacy"],
    postSlug: "blokees-wheels-china-toy-expo-2026-transformers-c05-ct04-wheels-land",
  },
  {
    id: "marvel-cc-lite-03",
    date: "2026-11-16",
    title: "Marvel Champion Class Lite 03 Avengers: Doomsday Vol. 1",
    kind: "rilis",
    confirmed: true,
    note: "Foto resmi sudah keluar: Doctor Doom, Mr. Fantastic, Beast, dan Cyclops.",
    productSlugs: ["marvel-champion-class-lite-03-avengers-doomsday-vol-1"],
    postSlug: "blokees-marvel-champion-class-lite-03-avengers-doomsday-vol-1-cte-2026",
  },
  {
    id: "marvel-doomsday-wave",
    date: "2026-11-16",
    title: "Marvel Champion Class CC16 Cyclops dan CC17 Doctor Doom",
    kind: "rilis",
    confirmed: false,
    note: "Rilis global dijadwalkan 16 November 2026, masih TBC.",
    productSlugs: ["marvel-champion-class-cc17-doctor-doom-avengers-doomsday", "marvel-champion-class-cc16-cyclops-avengers-doomsday"],
    postSlug: "blokees-marvel-champion-class-doctor-doom-cyclops-avengers-doomsday",
  },
  {
    id: "dc-legend-flash",
    date: "2026-11-20",
    title: "DC Legend Edition 01 The Flash",
    kind: "rilis",
    confirmed: true,
    note: "Rilis global. Produk pertama lini Legend Edition DC.",
    productSlugs: ["dc-legend-edition-01-the-flash"],
  },
  {
    id: "wheels-ct04-ultra-magnus",
    date: "2026-11-23",
    title: "Blokees Wheels Transformers CT04 Ultra Magnus",
    kind: "rilis",
    confirmed: true,
    note: "Rilis global. Truk 1:64 dengan trailer pengangkut mobil, lanjutan CT01 sampai CT03.",
    productSlugs: ["blokees-wheels-transformers-ct04-ultra-magnus"],
    postSlug: "blokees-wheels-china-toy-expo-2026-transformers-c05-ct04-wheels-land",
  },
  {
    id: "terraventure-ts05",
    date: "2026-11-25",
    title: "Jurassic World Terraventure TS05",
    kind: "rilis",
    confirmed: true,
    note: "Blind box dengan anggota baru Quetzalcoatlus dan Therizinosaurus, plus Carnotaurus, Baryonyx, Dimetrodon, dan Little Dinosaurs.",
    productSlugs: ["jurassic-world-terraventure-ts05"],
    postSlug: "blokees-terraventure-ts05-lineup",
  },
  {
    id: "herospire-armor-wave-18",
    date: "2026-11-25",
    title: "HeroSpire Armor Version Wave 18: Li Bai dan Yang Jian",
    kind: "rilis",
    confirmed: true,
    note: "No.43 Li Bai dan No.44 Dharma Image Yang Jian. Harga belum diumumkan.",
    postSlug: "blokees-herospire-armor-version-wave-18-li-bai-yang-jian",
  },
  {
    id: "kamen-rider-classic-s02-kabuto",
    date: "2026-11-25",
    title: "Kamen Rider Classic Version S 02: Kabuto dan Kabuto Extender",
    kind: "rilis",
    confirmed: true,
    note: "Set Kamen Rider Kabuto Rider Form dengan motor Kabuto Extender, 99 yuan di China. Harga Indonesia masih estimasi.",
    productSlugs: ["kamen-rider-classic-version-s-02-kabuto"],
    postSlug: "blokees-kamen-rider-kabuto-classic-version-s02-kabuto-extender",
  },
  {
    id: "transformers-gv12",
    date: "2026-11-27",
    title: "Transformers Galaxy Version 12",
    kind: "rilis",
    confirmed: true,
    note: "Blind box dengan debut Optimus Prime dan Megatron versi komik IDW, 1 set isi 9.",
    productSlugs: ["transformers-galaxy-version-12"],
    postSlug: "blokees-transformers-galaxy-version-12-optimus-megatron-idw",
  },
  {
    id: "kamen-rider-gvs02",
    date: "2026-11-27",
    title: "Kamen Rider Galaxy Version S 02",
    kind: "rilis",
    confirmed: false,
    note: "Perkiraan rilis, tanggal resmi masih TBC. Debut Ohma Zi-O dan Zi-O.",
    productSlugs: ["kamen-rider-galaxy-version-s-02"],
    postSlug: "blokees-kamen-rider-galaxy-version-s02-ohma-zi-o-zi-o",
  },

  // Desember 2026
  {
    id: "avengers-doomsday-film",
    date: "2026-12-18",
    title: "Avengers: Doomsday tayang di bioskop",
    kind: "film",
    confirmed: true,
    note: "Tanggal tayang di Amerika Serikat. Jadwal bioskop Indonesia belum kami konfirmasi.",
    productSlugs: ["marvel-champion-class-cc17-doctor-doom-avengers-doomsday", "marvel-champion-class-cc16-cyclops-avengers-doomsday", "marvel-champion-class-lite-03-avengers-doomsday-vol-1"],
    postSlug: "blokees-marvel-avengers-doomsday-champion-class-lite-03-04-china-toy-expo-2026",
  },
  {
    id: "saint-seiya-shiryu-ex",
    date: "2026-12",
    title: "Saint Seiya Champion Class CC09 Dragon Shiryu EX",
    kind: "rilis",
    confirmed: false,
    note: "Rilis global dijadwalkan Desember 2026, tanggal belum diumumkan.",
    productSlugs: ["saint-seiya-champion-class-cc09-dragon-shiryu-ex"],
  },
];
