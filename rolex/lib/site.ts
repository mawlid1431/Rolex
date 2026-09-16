import { WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

export const LOCALE = "en-sg"
export const SITE_NAME = "Rolex"

/** App routes keyed by path (without locale). */
export const ROUTES = {
  padellone: "/watches/new-watches/perpetual-padellone",
  watchmaking: "/watchmaking/a-unique-approach",
  sustainability: "/about-rolex/sustainable-development",
  wishlist: "/wishlist",
  yachtMasterII: "/watches/yacht-master-ii/m126688-0001",
  cart: "/cart",
  getInTouch: "/get-in-touch",
} as const

export type ResolvedLink = {
  href: string
  external: boolean
}

const OFFICIAL_HOST =
  /(?:^https?:\/\/)?(?:www\.)?(?:rolex\.com|rolex\.org|rolex\.cn|newsroom\.rolex\.com|media\.rolex\.com)\b/i

function isOfficialUrl(href: string) {
  return OFFICIAL_HOST.test(href)
}

const KNOWN = new Set<string>([
  ...Object.values(ROUTES),
  ...WATCH_COLLECTIONS.map((w) => watchPath(w.slug)),
])

/**
 * Resolve CMS hrefs to stay inside this app.
 * Official Rolex / Rolex.org / media hosts are neutralized to `#`.
 * Other absolute URLs (mailto, tel, third-party) stay as-is.
 */
export function resolveHref(href?: string | null): ResolvedLink {
  if (!href || href === "#") return { href: "#", external: false }
  if (href.startsWith("#")) return { href, external: false }

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    if (isOfficialUrl(href)) return { href: "#", external: false }
    return { href, external: !href.startsWith("mailto:") && !href.startsWith("tel:") }
  }

  const path = href.replace(/^\/en-sg(?=\/|$)/, "") || "/"
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/"

  if (clean === "/") {
    return { href: path.startsWith("/en-sg") ? path : "/", external: false }
  }

  // Prefer known rebuilt routes; still keep unknown paths local so the menu stays in-app.
  void KNOWN
  return { href: `/${LOCALE}${path.startsWith("/") ? path : `/${path}`}`, external: false }
}

export function localPath(path: string) {
  return `/${LOCALE}${path.startsWith("/") ? path : `/${path}`}`
}
