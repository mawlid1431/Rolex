import type { CmsBlock } from "./types"

/**
 * Convert a Contentstack `_content_type_uid` into the React export name
 * (`cover_parallax_fullscreen` → `CoverParallaxFullscreen`,
 * `article-simple` → `ArticleSimple`).
 */
export function contentTypeToExportName(uid: string): string {
  const camel = uid
    .trim()
    .replace(/[-_]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ""))
  if (!camel) return "Undefined"
  return camel[0]!.toUpperCase() + camel.slice(1)
}

type ModularGroup = Record<string, { component?: CmsBlock[] } | undefined>

/**
 * Flatten a CMS modular-block array: each group is `{ [groupName]: { component: [entry] } }`.
 */
export function parseModularBlock(block: unknown): CmsBlock[] {
  if (!Array.isArray(block)) return []
  return (block as ModularGroup[])
    .reduce<CmsBlock[]>((acc, group) => {
      for (const key of Object.values(group)) {
        const entry = key?.component?.[0]
        if (entry) acc.push(entry)
      }
      return acc
    }, [])
    .filter(Boolean)
}

/** Collect spacing class tokens from a `box_spacing` object. */
export function spacingClasses(box?: Record<string, string> | null): string[] {
  if (!box) return []
  return Object.values(box).filter(Boolean)
}

export function themeClass(theme: CmsBlock["theme"]): string | undefined {
  if (!theme) return undefined
  if (typeof theme === "string") return theme
  return theme.theme || "dark-theme"
}

export function hasGradient(gradient?: { colors?: unknown[] } | null): boolean {
  return Boolean(gradient?.colors && gradient.colors.length > 0)
}

/** Build the className string applied to each registered section (spacing + theme + gradients). */
export function blockClassName(block: CmsBlock, exportName: string): string {
  const parts = [
    exportName,
    ...spacingClasses(block.box_spacing),
    themeClass(block.theme),
    hasGradient(block.title_gradient) ? "GradientTitle" : null,
    hasGradient(block.chapo_gradient) ? "GradientChapo" : null,
    block.className,
  ]
  return parts.filter(Boolean).join(" ")
}
