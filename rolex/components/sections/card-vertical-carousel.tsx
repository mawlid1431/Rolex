"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { gradientCss } from "@/lib/cms/gradient"
import { pickMedia, posterMedia } from "@/lib/cms/media"
import type { GradientStop, HeadingData, ImageCld, VideoCld } from "@/lib/cms/types"
import { usePreferences } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type Card = {
  heading?: HeadingData
  paragraph?: { text?: string }
  media?: { image_cld?: ImageCld; video_cld?: VideoCld }[]
  image_cld?: ImageCld
  background_image?: ImageCld
}

type Props = {
  className?: string
  heading?: HeadingData
  card?: Card[]
  background_image?: ImageCld | ImageCld[]
  title_gradient?: { colors?: GradientStop[] }
  reveal?: boolean
}

export function CardVerticalCarousel({ className, heading, card = [], background_image, title_gradient }: Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { reducedMotion } = usePreferences()
  const titleGrad = gradientCss(title_gradient?.colors)
  const bg = Array.isArray(background_image) ? background_image[0] : background_image

  useEffect(() => {
    if (reducedMotion || !root.current || card.length < 2) return
    const panels = root.current.querySelectorAll<HTMLElement>("[data-cvc-card]")
    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [card.length, reducedMotion])

  return (
    <section ref={root} className={cn("card-vertical-carousel relative", className)}>
      {bg?.media && (
        <figure className="pointer-events-none absolute inset-0 -z-[1]">
          <Picture media={bg.media} alt={bg.alt ?? ""} className="size-full" imgClassName="size-full object-cover" />
        </figure>
      )}
      {heading?.title && (
        <hgroup className="full-grid py-[var(--m-h-space)] text-center" style={{ "--title-gradient": titleGrad } as React.CSSProperties}>
          <Html
            as="h2"
            html={heading.title}
            className={cn("headline50 col-[main] font-bold", titleGrad && "text-gradient [background-image:var(--title-gradient)]")}
          />
        </hgroup>
      )}
      <div className="relative">
        {card.map((item, i) => {
          const { image, video } = pickMedia(item.media)
          const still = item.image_cld ?? image ?? item.background_image
          return (
            <article
              key={i}
              data-cvc-card
              className={cn(
                "full-grid min-h-[70vh] items-center gap-y-6 py-[var(--m-h-space)] transition-opacity duration-500",
                i === active ? "opacity-100" : "opacity-60",
              )}
            >
              <div className="col-[main] m:col-[col_2/span_5]">
                {item.heading?.kicker && <p className="surtitle70 mb-2">{item.heading.kicker}</p>}
                {item.heading?.title && <Html as="h3" html={item.heading.title} className="headline50 font-bold" />}
                {item.paragraph?.text && <Html as="p" html={item.paragraph.text} className="body100 mt-4 font-light" />}
              </div>
              <figure className="col-[main] m:col-[col_7/span_5]">
                {video?.media ? (
                  <AutoplayVideo
                    video={video.media}
                    poster={posterMedia(video.poster) ?? still?.media}
                    alt={video.alt ?? still?.alt ?? item.heading?.title}
                    noButton
                    className="w-full"
                    videoClassName="w-full !h-auto object-cover"
                  />
                ) : still?.media ? (
                  <Picture media={still.media} alt={still.alt ?? ""} className="block w-full" imgClassName="w-full object-cover" />
                ) : null}
              </figure>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function CardVerticalCarouselCard(props: Card & { className?: string }) {
  const { image, video } = pickMedia(props.media)
  const still = props.image_cld ?? image
  return (
    <article className={cn("full-grid py-8", props.className)}>
      <div className="col-[main]">
        {props.heading?.title && <Html as="h3" html={props.heading.title} className="headline50 font-bold" />}
        {video?.media ? (
          <AutoplayVideo video={video.media} poster={posterMedia(video.poster)} alt={video.alt} className="mt-4 w-full" />
        ) : still?.media ? (
          <Picture media={still.media} alt={still.alt ?? ""} className="mt-4 block w-full" imgClassName="w-full" />
        ) : null}
      </div>
    </article>
  )
}
