import type { Media } from "@/lib/media"

/** A flattened CMS modular-block entry (one component). */
export type CmsBlock = {
  _content_type_uid: string
  uid?: string | number
  className?: string
  box_spacing?: Record<string, string>
  theme?: { theme?: string } | string
  title_gradient?: { colors?: GradientStop[]; angle?: number }
  chapo_gradient?: { colors?: GradientStop[]; angle?: number }
  [key: string]: unknown
}

export type GradientStop = { color: string; opacity?: number | string }

export type ImageCld = {
  alt?: string
  media?: Media | null
}

export type VideoCld = {
  alt?: string
  media?: Media | null
  /** Either a bare Media or an ImageCld-shaped `{ alt, media }`. */
  poster?: Media | ImageCld | null
  fallback?: Media | ImageCld | null
  has_audio?: boolean
  loop?: boolean
}

export type CmsLinkData = {
  label?: string
  href?: string
  external?: string
  aria_label?: string
  icon?: string
  style?: string
}

export type HeadingData = {
  kicker?: string
  title?: string
  subtitle?: string
}

export type PageMeta = {
  title?: string
  description?: string
  title_og?: string
  description_og?: string
  noindexing?: boolean
}

export type CmsPageData = {
  uid?: string
  url?: string
  title?: string
  breadcrumb?: { title: string; href: string }[]
  /** Modular-block groups; JSON inference is too wide, so keep this loose. */
  components?: unknown
  meta?: PageMeta
  sub_navigation?: unknown
  nofooter?: boolean
}
