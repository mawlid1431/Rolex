"use client"

import { Reveal } from "@/components/cms/reveal"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { gradientCss } from "@/lib/cms/gradient"
import type { CmsLinkData, GradientStop, HeadingData } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  paragraph_block?: { text?: string } | { paragraph?: { text?: string } }[]
  link?: CmsLinkData
  reverse_order?: boolean
  title_gradient?: { colors?: GradientStop[] }
}

function paragraphText(block?: Props["paragraph_block"]) {
  if (!block) return undefined
  if (Array.isArray(block)) {
    return block
      .map((b) => ("paragraph" in b ? b.paragraph?.text : (b as { text?: string }).text))
      .filter(Boolean)
      .join("<br/><br/>")
  }
  return (block as { text?: string }).text
}

export function Skyline({ className, heading, paragraph_block, link, reverse_order, title_gradient }: Props) {
  const titleGrad = gradientCss(title_gradient?.colors)
  const body = paragraphText(paragraph_block)

  return (
    <section className={cn("skyline full-grid py-[var(--m-h-space)]", className)}>
      <Reveal
        className={cn(
          "col-[main] grid gap-8 m:grid-cols-2 m:items-center",
          reverse_order && "[&>*:first-child]:m:order-2",
        )}
      >
        <div>
          {heading?.kicker && <span className="surtitle70 block mb-2">{heading.kicker}</span>}
          <Html
            as="h2"
            html={heading?.title}
            className={cn("headline50 font-bold", titleGrad && "text-gradient")}
            style={titleGrad ? ({ backgroundImage: titleGrad } as React.CSSProperties) : undefined}
          />
        </div>
        <div>
          {body && <Html as="div" html={body} className="body100 font-light" />}
          {link && (
            <CmsLink
              href={link.href}
              external={link.external}
              label={link.label}
              ariaLabel={link.aria_label}
              style={link.style ?? "inline green"}
              className="mt-4"
            />
          )}
        </div>
      </Reveal>
    </section>
  )
}
