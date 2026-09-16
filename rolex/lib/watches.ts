/** Collection watches shown in the menu and homepage. */

export type WatchCollection = {
  slug: string
  name: string
  kicker: string
  tagline: string
  description: string
  image: string
  portraitImage?: string
  /** Optional local film for scroll scrub (falls back to image expand). */
  videoSrc?: string
  videoPortraitSrc?: string
  posterSrc?: string
  rmc?: string
  family: "classic" | "professional" | "new"
}

export const WATCH_COLLECTIONS: WatchCollection[] = [
  {
    slug: "new-watches",
    name: "New watches 2026",
    kicker: "Where a new world begins",
    tagline: "Perpetual Padellone and more",
    description:
      "Discover the latest Rolex creations, led by the Perpetual Padellone with its complete annual calendar and moonphase display.",
    image: "/images/new-watches-2026-perpetual-padellone-navigation_m53505-0003_2608stj_0005.avif",
    portraitImage: "/images/new-watches-2026-perpetual-padellone-navigation_m53505-0003_2608stj_0005-portrait.avif",
    videoSrc: "/videos/rolex-new-watches-2026-padellone-m53505-0003-film.mp4",
    videoPortraitSrc: "/videos/rolex-new-watches-2026-padellone-m53505-0003-film-portrait.mp4",
    posterSrc: "/images/homepage/film-posterframe.avif",
    rmc: "m53505-0003",
    family: "new",
  },
  {
    slug: "land-dweller",
    name: "Land-Dweller",
    kicker: "Classic watches",
    tagline: "A new chapter in elegance",
    description: "The Land-Dweller combines contemporary design with Rolex expertise in materials and precision.",
    image: "/images/classic-watches-land-dweller-naviguation-square.avif",
    rmc: "land-dweller",
    family: "classic",
  },
  {
    slug: "day-date",
    name: "Day-Date",
    kicker: "Classic watches",
    tagline: "The prestige watch of Rolex",
    description: "A symbol of excellence, the Day-Date was the first wristwatch to indicate the date and day of the week.",
    image: "/images/classic-watches-day-date-naviguation-square.avif",
    rmc: "day-date",
    family: "classic",
  },
  {
    slug: "sky-dweller",
    name: "Sky-Dweller",
    kicker: "Classic watches",
    tagline: "Dual time zones, annual calendar",
    description: "The Sky-Dweller is designed for those who travel the world and is distinguished by its annual calendar.",
    image: "/images/classic-watches-sky-dweller-navigation-square.avif",
    rmc: "sky-dweller",
    family: "classic",
  },
  {
    slug: "lady-datejust",
    name: "Lady-Datejust",
    kicker: "Classic watches",
    tagline: "Feminine elegance",
    description: "The Lady-Datejust is the feminine interpretation of the classic Rolex Datejust.",
    image: "/images/classic-watches-lady-datejust-navigation-square.avif",
    rmc: "lady-datejust",
    family: "classic",
  },
  {
    slug: "datejust",
    name: "Datejust",
    kicker: "Classic watches",
    tagline: "A classic for all time",
    description: "The Datejust is the archetypal Rolex watch, combining style and function since 1945.",
    image: "/images/classic-watches-datejust-navigation-portrait.avif",
    rmc: "datejust",
    family: "classic",
  },
  {
    slug: "oyster-perpetual",
    name: "Oyster Perpetual",
    kicker: "Classic watches",
    tagline: "The essence of the Oyster",
    description: "The Oyster Perpetual is the purest expression of the Rolex Oyster.",
    image: "/images/classic-watches-oyster-perpetual-naviguation-portrait.avif",
    rmc: "oyster-perpetual",
    family: "classic",
  },
  {
    slug: "cosmograph-daytona",
    name: "Cosmograph Daytona",
    kicker: "Professional watches",
    tagline: "Born to race",
    description: "The Cosmograph Daytona was designed to meet the needs of professional racing drivers.",
    image: "/images/professional-watches-cosmograph-daytona-naviguation-square.avif",
    rmc: "cosmograph-daytona",
    family: "professional",
  },
  {
    slug: "submariner",
    name: "Submariner",
    kicker: "Professional watches",
    tagline: "The reference among divers’ watches",
    description: "The Submariner is the archetype of the divers’ watch and one of Rolex’s most iconic models.",
    image: "/images/professional-watches-submariner-navigation-square.avif",
    rmc: "submariner",
    family: "professional",
  },
  {
    slug: "sea-dweller",
    name: "Sea-Dweller",
    kicker: "Professional watches",
    tagline: "The ultimate deep-sea exploration watch",
    description: "The Sea-Dweller was designed for professional saturation diving.",
    image: "/images/professional-watches-sea-dweller-navigation-square.avif",
    rmc: "sea-dweller",
    family: "professional",
  },
  {
    slug: "deepsea",
    name: "Deepsea",
    kicker: "Professional watches",
    tagline: "Extreme depths",
    description: "The Rolex Deepsea is designed for diving to extreme depths.",
    image: "/images/professional-watches-deepsea-navigation-square.avif",
    rmc: "deepsea",
    family: "professional",
  },
  {
    slug: "gmt-master-ii",
    name: "GMT-Master II",
    kicker: "Professional watches",
    tagline: "The cosmopolitan watch",
    description: "The GMT-Master II is designed for those who navigate across time zones.",
    image: "/images/professional-watches-gmt-master-ii-navigation-square.avif",
    rmc: "gmt-master-ii",
    family: "professional",
  },
  {
    slug: "yacht-master",
    name: "Yacht-Master",
    kicker: "Professional watches",
    tagline: "The watch of the open seas",
    description: "The Yacht-Master is a maritime watch that combines functionality with elegance.",
    image: "/images/professional-watches-yacht-master-navigation-square.avif",
    rmc: "yacht-master",
    family: "professional",
  },
  {
    slug: "yacht-master-ii",
    name: "Yacht-Master II",
    kicker: "Professional watches",
    tagline: "A yacht racing chronograph",
    description: "The Yacht-Master II is designed for yacht racing with a programmable countdown.",
    image: "/images/professional-watches-yacht-master-ii-navigation-portrait.avif",
    rmc: "m126688-0001",
    family: "professional",
  },
  {
    slug: "explorer",
    name: "Explorer",
    kicker: "Professional watches",
    tagline: "The call of the peaks",
    description: "The Explorer was designed for mountain expeditions and extreme environments.",
    image: "/images/professional-watches-explorer-navigation-square.avif",
    rmc: "explorer",
    family: "professional",
  },
  {
    slug: "explorer-ii",
    name: "Explorer II",
    kicker: "Professional watches",
    tagline: "For cave explorers and polar adventurers",
    description: "The Explorer II is designed for explorers of the most remote places on Earth.",
    image: "/images/professional-watches-explorer-ii-navigation-square.avif",
    rmc: "explorer-ii",
    family: "professional",
  },
  {
    slug: "air-king",
    name: "Air-King",
    kicker: "Professional watches",
    tagline: "A tribute to aviation",
    description: "The Air-King pays tribute to the pioneers of aviation and Rolex’s aviation heritage.",
    image: "/images/m124060-0001.avif",
    rmc: "air-king",
    family: "professional",
  },
  {
    slug: "1908",
    name: "1908",
    kicker: "Classic watches",
    tagline: "A new expression of elegance",
    description: "The 1908 is an elegant timepiece that revisits Rolex’s classic watchmaking heritage.",
    image: "/images/classic-watches-datejust-navigation-portrait.avif",
    rmc: "1908",
    family: "classic",
  },
]

const bySlug = new Map(WATCH_COLLECTIONS.map((w) => [w.slug, w]))

export function getWatch(slug: string) {
  return bySlug.get(slug)
}

export function watchPath(slug: string) {
  return `/watches/${slug}`
}
