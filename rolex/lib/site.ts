import { WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

export const LOCALE = "en-sg"
export const SITE_NAME = "Rolex"

/** App routes keyed by path (without locale). */
export const ROUTES = {
  wishlist: "/wishlist",
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

const WATCH_PATHS = new Set(WATCH_COLLECTIONS.map((w) => watchPath(w.slug)))

const APP_PATHS = new Set<string>([
  ...Object.values(ROUTES),
  ...WATCH_PATHS,
  "/watches",
])

/**
 * Resolve CMS hrefs to stay inside this app.
 * Only known app routes (watches, cart, get-in-touch, wishlist) stay live.
 * Official Rolex / Rolex.org / media hosts and unknown CMS paths → `#`.
 */
export function resolveHref(href?: string | null): ResolvedLink {
  if (!href || href === "#") return { href: "#", external: false }
  if (href.startsWith("#")) return { href, external: false }

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    if (isOfficialUrl(href)) return { href: "#", external: false }
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return { href, external: false }
    }
    return { href: "#", external: false }
  }

  const path = href.replace(/^\/en-sg(?=\/|$)/, "") || "/"
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/"

  if (clean === "/") {
    return { href: "/", external: false }
  }

  // Collection watch → local watch page
  const watchMatch = clean.match(/^\/watches\/([^/]+)/)
  if (watchMatch) {
    const slug = watchMatch[1]!
    if (WATCH_PATHS.has(watchPath(slug))) {
      return { href: localPath(watchPath(slug)), external: false }
    }
    return { href: "#", external: false }
  }

  if (APP_PATHS.has(clean)) {
    return { href: localPath(clean), external: false }
  }

  return { href: "#", external: false }
}

export function localPath(path: string) {
  return `/${LOCALE}${path.startsWith("/") ? path : `/${path}`}`
}
