"use client"

import { useRef, useState } from "react"
import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { pickMedia, posterMedia } from "@/lib/cms/media"
import type { CmsLinkData, HeadingData, ImageCld, VideoCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Card = {
  _content_type_uid?: string
  heading?: HeadingData
  media?: { image_cld?: ImageCld; video_cld?: VideoCld }[]
  cta?: { link?: CmsLinkData }[]
  theme?: { theme?: string }
  button?: unknown
}

type Column = { card?: Card[] }

type Props = {
  className?: string
  column?: Column[]
  dual_mobile?: boolean
  video_mobile?: boolean
  theme?: { theme?: string }
}

function DualCard({ card }: { card: Card }) {
  const { image, video } = pickMedia(card.media)
  const link = card.cta?.[0]?.link
  return (
    <article className={cn("relative grid min-h-0 overflow-hidden", card.theme?.theme)}>
      <div className="relative col-start-1 row-start-1 min-h-[60vw] m:min-h-[70vh]">
        {video?.media ? (
          <AutoplayVideo
            video={video.media}
            poster={posterMedia(video.poster)}
            alt={video.alt ?? image?.alt}
            noButton
            className="size-full"
            videoClassName="!h-full object-cover"
          />
        ) : image?.media ? (
          <Picture media={image.media} alt={image.alt ?? ""} className="size-full" imgClassName="size-full object-cover" />
        ) : null}
      </div>
      <div className="relative z-[1] col-start-1 row-start-1 flex flex-col justify-end gap-3 p-[clamp(1.25rem,2vw,2.5rem)]">
        {card.heading?.title && <Html as="h3" html={card.heading.title} className="headline50 font-bold" />}
        {link && (
          <CmsLink
            href={link.href}
            external={link.external}
            label={link.label}
            ariaLabel={link.aria_label}
            style={link.style ?? "inline"}
            className="self-start"
          />
        )}
      </div>
    </article>
  )
}

export function DualGrid({ className, column = [], dual_mobile }: Props) {
  const cards = column.flatMap((col) => col.card ?? []).filter(Boolean)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)

  if (!cards.length) return null

  const dual = cards.length >= 2

  return (
    <section className={cn("dual-grid", className)}>
      <div
        className={cn(
          "relative grid overflow-hidden p-[calc(var(--outer-margin)-1vw)]",
          dual && dual_mobile ? "grid-cols-1 m:grid-cols-2 m:p-[1vw]" : dual ? "grid-cols-1 m:grid-cols-2 m:gap-[1vw] m:p-[1vw]" : "grid-cols-1",
        )}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null || dual_mobile === false) return
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
          if (Math.abs(dx) > 40) setIndex((i) => (dx < 0 ? Math.min(i + 1, cards.length - 1) : Math.max(i - 1, 0)))
          touchX.current = null
        }}
      >
        {dual && !dual_mobile ? (
          <>
            <div className="m:hidden">
              <DualCard card={cards[index]!} />
              <div className="mt-3 flex justify-center gap-2">
                {cards.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show card ${i + 1}`}
                    className={cn("size-2 rounded-full", i === index ? "bg-green" : "bg-grey")}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
            <div className="hidden m:contents">
              {cards.map((card, i) => (
                <DualCard key={i} card={card} />
              ))}
            </div>
          </>
        ) : (
          cards.map((card, i) => <DualCard key={i} card={card} />)
        )}
      </div>
    </section>
  )
}

export function DualGridCard(props: Card & { className?: string }) {
  return (
    <div className={props.className}>
      <DualCard card={props} />
    </div>
  )
}
