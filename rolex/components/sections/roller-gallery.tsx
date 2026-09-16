"use client"

import { useRef } from "react"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import type { CmsLinkData, HeadingData, ImageCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Card = {
  heading?: HeadingData
  image_cld?: ImageCld
  media?: { image_cld?: ImageCld }[]
  link?: CmsLinkData
  caption?: string
  fig_caption?: { text?: string }
  image?: {
    beautyshot?: ImageCld & { alt?: string }
    imagecld?: ImageCld
    theme?: string
  }
}

type Props = {
  className?: string
  cards?: Card[]
  roller_with_caption?: boolean
  background_color?: { colors?: { color: string; opacity?: number }[] }
}

function cardImage(card: Card): ImageCld | undefined {
  return (
    card.image?.beautyshot ??
    card.image?.imagecld ??
    card.image_cld ??
    card.media?.[0]?.image_cld
  )
}

export function RollerGallery({ className, cards = [], roller_with_caption, background_color }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const bg = background_color?.colors?.[0]
    ? `rgb(${background_color.colors[0].color} / ${background_color.colors[0].opacity ?? 1})`
    : undefined

  return (
    <section className={cn("roller-gallery relative py-[var(--m-h-space)]", className)} style={{ background: bg }}>
      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto px-[var(--outer-margin)] pb-4 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {cards.map((card, i) => {
          const image = cardImage(card)
          return (
            <figure
              key={i}
              className="relative w-[min(72vw,28rem)] shrink-0 snap-center m:w-[min(40vw,32rem)]"
            >
              {image?.media && (
                <Picture media={image.media} alt={image.alt ?? ""} className="block w-full" imgClassName="w-full object-cover" />
              )}
              {(roller_with_caption || card.caption || card.fig_caption?.text || card.heading?.title) && (
                <figcaption className="mt-3 legend100 text-dark-grey">
                  <Html html={card.fig_caption?.text ?? card.caption ?? card.heading?.title} />
                </figcaption>
              )}
              {card.link && (
                <CmsLink
                  href={card.link.href}
                  external={card.link.external}
                  label={card.link.label}
                  ariaLabel={card.link.aria_label}
                  style={card.link.style ?? "inline green"}
                  className="mt-2"
                />
              )}
            </figure>
          )
        })}
      </div>
    </section>
  )
}
