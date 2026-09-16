import type { GradientStop } from "./types"

/** Build a CSS color-stop list for `linear-gradient(...)` from CMS gradient stops. */
export function gradientStops(colors?: GradientStop[] | null): string | undefined {
  if (!colors?.length) return undefined
  return colors
    .map(({ color, opacity = 1 }) => `rgb(${color} / ${opacity})`)
    .join(", ")
}

export function gradientCss(colors?: GradientStop[] | null, angle = "0.45turn"): string | undefined {
  const stops = gradientStops(colors)
  if (!stops) return undefined
  return `linear-gradient(${angle}, ${stops})`
}
