import type { ReactNode } from "react"
import { CmsLink } from "@/components/ui/cms-link"
import type { CmsLinkData, HeadingData } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

/** Render CMS HTML strings safely into a host element. */
export function Html({
  html,
  as: Tag = "div",
  className,
  style,
}: {
  html?: string | null
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: React.CSSProperties
}) {
  if (!html) return null
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Article / modular text blocks (`heading`, `chapo`, `paragraph`, `cta`…). */
export function TextBlocks({ texts, className }: { texts?: unknown[] | null; className?: string }) {
  if (!texts?.length) return null
  return (
    <div className={cn("modular-texts flex flex-col", className)}>
      {texts.map((block, index) => {
        if (!block || typeof block !== "object") return null
        const entry = block as Record<string, unknown>
        if ("heading" in entry) {
          const heading = entry.heading as HeadingData
          return (
            <div key={index} className="Heading">
              {heading.kicker && <p className="surtitle70 mb-2">{heading.kicker}</p>}
              <Html as="h2" html={heading.title} className="headline50 font-bold" />
              {heading.subtitle && <p className="headline50 mt-2 font-light">{heading.subtitle}</p>}
            </div>
          )
        }
        if ("chapo" in entry) {
          const chapo = entry.chapo as { text?: string }
          return <Html key={index} as="p" html={chapo.text} className="Chapo body100 font-bold" />
        }
        if ("paragraph" in entry) {
          const paragraph = entry.paragraph as { text?: string }
          return <Html key={index} as="div" html={paragraph.text?.replace(/\n/g, "<br/>")} className="Paragraph body100 font-light whitespace-pre-line" />
        }
        if ("cta" in entry || "link" in entry) {
          const link = (entry.cta as { link?: CmsLinkData } | undefined)?.link ?? (entry.link as CmsLinkData | undefined)
          if (!link) return null
          return (
            <CmsLink
              key={index}
              href={link.href}
              external={link.external}
              label={link.label}
              ariaLabel={link.aria_label}
              style={link.style ?? "inline green"}
              className="mt-2"
            />
          )
        }
        return null
      })}
    </div>
  )
}

export function SectionHeading({
  heading,
  className,
  titleClassName,
}: {
  heading?: HeadingData | null
  className?: string
  titleClassName?: string
}) {
  if (!heading) return null
  return (
    <hgroup className={className}>
      {heading.kicker && <span className="surtitle70 block">{heading.kicker}</span>}
      <Html as="h1" html={heading.title} className={cn("headline50", titleClassName)} />
      {heading.subtitle && <p className="headline50 mt-2">{heading.subtitle}</p>}
    </hgroup>
  )
}

export function childrenOrNull(children: ReactNode) {
  return children ?? null
}
