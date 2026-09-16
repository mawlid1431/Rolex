"use client"

import { Picture } from "@/components/media/picture"
import { Reveal } from "@/components/cms/reveal"
import { Html, TextBlocks } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { resolveImageCld } from "@/lib/cms/media"
import type { CmsLinkData, HeadingData, ImageCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Card = {
  heading?: HeadingData
  image_cld?: ImageCld
  image?: unknown
  media?: { image_cld?: ImageCld }[]
  link?: CmsLinkData
  href?: string
  label?: string
  paragraph?: { text?: string }
  alt?: string
  legend?: string
}

type Props = {
  className?: string
  cards?: Card[]
  texts?: unknown[]
  column_width?: string
  text_layout?: string
  theme?: { theme?: string }
  is_bold?: boolean
  start_column?: number
}

function cardImage(card: Card): ImageCld | undefined {
  if (card.image_cld) return resolveImageCld(card.image_cld, card.alt ?? "")
  if (Array.isArray(card.image)) return resolveImageCld(card.image[0], card.alt ?? "")
  if (card.image) return resolveImageCld(card.image, card.alt ?? "")
  return resolveImageCld(card.media?.[0]?.image_cld, card.alt ?? "")
}

export function RollerRef({ className, cards = [], texts, is_bold }: Props) {
  return (
    <section className={cn("roller-ref relative py-[var(--m-h-space)]", className)}>
      {texts?.length ? (
        <Reveal className="full-grid mb-[var(--s-h-space)]">
          <TextBlocks texts={texts} className={cn("col-[main]", is_bold && "[&_.Chapo]:font-bold")} />
        </Reveal>
      ) : null}
      <div className="flex gap-3 overflow-x-auto px-[var(--outer-margin)] pb-4 snap-x snap-mandatory">
        {cards.map((card, i) => {
          const image = cardImage(card)
          const href = card.link?.href ?? card.href
          return (
            <article key={i} className="w-[min(70vw,22rem)] shrink-0 snap-start m:w-[min(28vw,20rem)]">
              {image?.media && (
                <Picture media={image.media} alt={image.alt ?? card.alt ?? ""} className="mb-3 block w-full" imgClassName="w-full object-cover" />
              )}
              {card.heading?.kicker && <p className="surtitle70 mb-1">{card.heading.kicker}</p>}
              {card.heading?.title && <Html as="h3" html={card.heading.title} className="headline70 font-bold" />}
              {card.legend && <p className="legend100 mt-2 text-dark-grey">{card.legend}</p>}
              {card.paragraph?.text && <Html as="p" html={card.paragraph.text} className="body100 mt-2 font-light" />}
              {(href || card.link) && (
                <CmsLink
                  href={href}
                  external={card.link?.external}
                  label={card.link?.label ?? card.label ?? "Discover"}
                  ariaLabel={card.link?.aria_label}
                  style={card.link?.style ?? "inline green"}
                  className="mt-3"
                />
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
