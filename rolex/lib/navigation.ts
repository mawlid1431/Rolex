import header from "@/lib/data/header.json"
import type { Media } from "@/lib/media"
import { getWatch, watchPath } from "@/lib/watches"

export type Theme = "dark-theme" | "light-theme" | undefined

export type NavLink = { label: string; href: string; ariaLabel?: string }

export type BentoItem = {
  label: string
  href: string
  ariaLabel?: string
  theme: Theme
  alt?: string
  media?: Media | null
}

export type Bento = { patterns: string[]; items: BentoItem[] }

export type MenuSection = { label: string; bento: Bento; actions: NavLink[]; patterns: string[] }

type RawItem = {
  item: {
    label?: string
    href: string
    aria_label?: string
    theme?: { theme?: string }
    assets?: { alt?: string; media?: Media }
  }
}
type RawBento = { grids?: { grid: { pattern: string } }[]; items?: RawItem[] }
type RawAction = { label: string; href: string; aria_label?: string }
type RawTool = { action?: RawAction; shortcut?: RawAction }

export function toBento(reference?: RawBento | null): Bento {
  return {
    patterns: (reference?.grids ?? []).map((g) => g.grid.pattern),
    items: (reference?.items ?? []).map(({ item }) => ({
      label: item.label?.trim() ?? item.assets?.alt?.trim() ?? "",
      href: item.href,
      ariaLabel: item.aria_label,
      theme: item.theme?.theme as Theme,
      alt: item.assets?.alt,
      media: item.assets?.media ?? null,
    })),
  }
}

const CELLS: Record<string, number> = { xxxx: 1, xyxy: 2, xxyy: 2, xyxz: 3, xyzy: 3, xxyz: 3, xyzz: 3, xyza: 4 }
const FALLBACK: Record<number, string> = { 1: "xxxx", 2: "xyxy", 3: "xyxz", 4: "xyza" }

/** Split bento items into grids following the CMS patterns. */
export function bentoGrids(bento: Bento) {
  const grids: { pattern: string; items: BentoItem[] }[] = []
  let cursor = 0
  for (const requested of bento.patterns) {
    if (cursor >= bento.items.length) break
    const cells = CELLS[requested] ?? 4
    const items = bento.items.slice(cursor, cursor + cells)
    cursor += items.length
    grids.push({
      pattern: CELLS[requested] === items.length ? requested : (FALLBACK[items.length] ?? "xxxx"),
      items,
    })
  }
  while (cursor < bento.items.length) {
    const items = bento.items.slice(cursor, cursor + 3)
    cursor += items.length
    grids.push({ pattern: FALLBACK[items.length], items })
  }
  return grids
}

type RawSection = {
  section?: {
    label: string
    child_page_patterns?: string[]
    items: ({ bento: { reference: RawBento[] } } | { action: RawAction })[]
  }
  shortcut?: RawAction
}

const raw = header.menu as RawSection[]

function isWatchHref(href: string) {
  const match = href.replace(/^\/en-sg/, "").match(/^\/watches\/([^/#?]+)/)
  return Boolean(match && getWatch(match[1]!))
}

/** Keep only the watches menu — drop Featured, Watchmaking, About, Sports, Buying, etc. */
export const menuSections: MenuSection[] = raw
  .filter((entry) => entry.section?.label === "Rolex watches and accessories")
  .map(({ section }) => {
    const items = section!.items
    const bentoEntry = items.find((i): i is { bento: { reference: RawBento[] } } => "bento" in i)
    const bento = toBento(bentoEntry?.bento.reference[0])
    return {
      label: "Rolex watches",
      patterns: ["/watches", "/watches/{*}"],
      bento: {
        patterns: bento.patterns,
        items: bento.items.filter((item) => isWatchHref(item.href)),
      },
      actions: [
        { label: "Get in touch", href: "/get-in-touch", ariaLabel: "Get in touch" },
        { label: "Your cart", href: "/cart", ariaLabel: "Your cart" },
      ],
    }
  })

export const menuShortcuts: NavLink[] = [
  { label: "Get in touch", href: "/get-in-touch", ariaLabel: "Get in touch" },
  { label: "Cart", href: "/cart", ariaLabel: "Your cart" },
]

const watchSearchFromCms = (header.tools as RawTool[])
  .filter((t) => t.action)
  .map(({ action }) => ({
    label: action!.label,
    href: action!.href,
    ariaLabel: action!.aria_label,
  }))
  .filter((link) => isWatchHref(link.href))

export const searchShortcuts: NavLink[] = [
  ...(watchSearchFromCms.length > 0
    ? watchSearchFromCms
    : [
        { label: "Submariner", href: watchPath("submariner") },
        { label: "Cosmograph Daytona", href: watchPath("cosmograph-daytona") },
        { label: "GMT-Master II", href: watchPath("gmt-master-ii") },
        { label: "Datejust", href: watchPath("datejust") },
      ]),
  { label: "Get in touch", href: "/get-in-touch", ariaLabel: "Get in touch" },
  { label: "Your cart", href: "/cart", ariaLabel: "Your cart" },
]

/** Section whose child page patterns match the current path. */
export function sectionForPath(pathname: string) {
  const path = pathname.replace(/^\/en-sg/, "")
  const index = menuSections.findIndex((section) =>
    section.patterns.some((pattern) => {
      const base = pattern.replace(/\{.*\}$/, "")
      return path === base || path.startsWith(`${base}/`)
    }),
  )
  return index
}
