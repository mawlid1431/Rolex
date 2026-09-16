import type { SVGProps } from "react"
import { cn } from "@/lib/utils"
import { paths, points } from "./icon-paths"

export type IconName = keyof typeof paths | keyof typeof points

const MIRRORED_IN_RTL = new Set(["play", "chevron", "externalLink", "reset", "arrowRight", "arrowLeft", "restart", "share"])

type IconProps = Omit<SVGProps<SVGSVGElement>, "type"> & {
  type: IconName
  size?: number | string
}

/** Icon set of the reference design system, drawn on a 15×15 grid. */
export function Icon({ type, size = 15, className, ...rest }: IconProps) {
  const polygon = points[type]
  return (
    <svg
      viewBox="0 0 15 15"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none fill-current", MIRRORED_IN_RTL.has(type) && "rtl:-scale-x-100", className)}
      {...rest}
    >
      {polygon ? <polygon points={polygon} /> : <path d={paths[type]} />}
    </svg>
  )
}
