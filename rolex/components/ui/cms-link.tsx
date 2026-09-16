import Link from "next/link"
import type { ReactNode } from "react"
import { Icon, type IconName } from "@/components/icons/icon"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"

const STYLE_CLASSES: Record<string, string> = {
  text: "btn btn-text",
  filled: "btn btn-filled",
  icon: "btn btn-icon",
  inline: "btn btn-inline",
  green: "btn-green",
  "opaque-green": "btn-opaque-green",
  "opaque-white": "btn-opaque-white",
  "translucent-dark": "btn-translucent-dark",
  "translucent-light": "btn-translucent-light",
  small: "legend100 !px-[1.5625rem]",
  "dark-theme": "[--text:rgb(var(--pure-white))]",
  "light-theme": "[--text:rgb(var(--light-black))]",
}

/** Maps a button style string ("filled opaque-green", "inline green"…) to utility classes. */
export function buttonClasses(style = "inline green") {
  return style
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => STYLE_CLASSES[token] ?? token)
    .join(" ")
}

export type CmsLinkProps = {
  href?: string
  external?: string
  label?: ReactNode
  ariaLabel?: string
  style?: string
  icon?: IconName | "none"
  className?: string
  children?: ReactNode
  onClick?: () => void
  describedBy?: string
  download?: boolean
}

export function CmsLink({
  href,
  external,
  label,
  ariaLabel,
  style,
  icon,
  className,
  children,
  onClick,
  describedBy,
  download,
}: CmsLinkProps) {
  const target = resolveHref(external ?? href)
  const iconType = icon ?? (external ? "externalLink" : "chevron")
  const trailing = iconType === "chevron" || iconType === "externalLink"
  const content = (
    <>
      {iconType !== "none" && !trailing && <Icon type={iconType} />}
      {label ?? children}
      {iconType !== "none" && trailing && <Icon type={iconType} />}
    </>
  )
  const classes = cn(buttonClasses(style), className)

  if (target.external || download) {
    return (
      <a
        href={target.href}
        className={classes}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        download={download || undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={target.href} className={classes} aria-label={ariaLabel} aria-describedby={describedBy} onClick={onClick}>
      {content}
    </Link>
  )
}
