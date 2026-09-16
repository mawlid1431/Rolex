"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { gradientCss } from "@/lib/cms/gradient"
import type { GradientStop, HeadingData, ImageCld } from "@/lib/cms/types"
import { usePreferences } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type Props = {
  className?: string
  heading?: HeadingData
  paragraph?: { text?: string }
  background_image?: ImageCld[] | ImageCld
  horizontal_align?: string
  vertical_align?: string
  vertical_align_padding?: string
  title_gradient?: { colors?: GradientStop[] }
}

function resolveBg(bg?: ImageCld[] | ImageCld): ImageCld | undefined {
  if (!bg) return undefined
  return Array.isArray(bg) ? bg[0] : bg
}

/**
 * Sticky scrolling article over a pinned background.
 * Desktop pins content; mobile uses tall padding. GSAP scrub when motion is allowed.
 */
export function ArticleImageScrolling({
  className,
  heading,
  paragraph,
  background_image,
  horizontal_align = "start",
  vertical_align = "start",
  vertical_align_padding = "m",
  title_gradient,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLElement>(null)
  const { reducedMotion } = usePreferences()
  const bg = resolveBg(background_image)
  const titleGrad = gradientCss(title_gradient?.colors)

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !bgRef.current) return
    const mm = window.matchMedia("(min-width: 48rem)")
    if (!mm.matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={rootRef}
      className={cn(
        "article-image-scrolling relative z-[1] grid min-h-[max(300px,100svh)]",
        `ais-txt-h-align-${horizontal_align}`,
        `ais-txt-v-align-${vertical_align}`,
        className,
      )}
    >
      <div
        className={cn(
          "relative z-[1] full-grid col-[1/-1] row-[1/-1] box-border self-start",
          vertical_align === "start" && "pt-[7vh]",
          vertical_align === "end" && "pb-[7vh]",
          vertical_align === "start" && vertical_align_padding === "s" && "pb-[220vw] m:pb-0",
          vertical_align === "start" && vertical_align_padding === "m" && "pb-[80vw] m:pb-0",
          vertical_align === "start" && vertical_align_padding === "l" && "pb-[120vw] m:pb-0",
          vertical_align === "end" && vertical_align_padding === "s" && "pt-[220vw] m:pt-0",
          vertical_align === "end" && vertical_align_padding === "m" && "pt-[80vw] m:pt-0",
          vertical_align === "end" && vertical_align_padding === "l" && "pt-[120vw] m:pt-0",
          "m:sticky m:top-0 m:min-h-[max(400px,100svh)] m:items-center m:pt-0 m:pb-0",
        )}
      >
        <hgroup
          className={cn(
            "relative col-[main] m:my-[5vw]",
            horizontal_align === "start" && "m:col-[2/span_7] l:col-[3/span_6]",
            horizontal_align === "end" && "m:col-[7/span_7] l:col-[7/span_6]",
          )}
          style={{ "--title-gradient": titleGrad } as React.CSSProperties}
        >
          {heading?.kicker && <span className="surtitle70 block mb-2">{heading.kicker}</span>}
          <Html
            as="h2"
            html={heading?.title}
            className={cn(
              "headline50 font-bold",
              titleGrad && "text-gradient [background-image:var(--title-gradient)]",
            )}
          />
          {paragraph?.text && <Html as="p" html={paragraph.text} className="body50 mt-[30px] font-light" />}
        </hgroup>
      </div>
      <figure
        ref={bgRef}
        className={cn(
          "relative col-[1/-1] row-[1/-1] w-full overflow-hidden -mt-[60vw] m:mt-0",
          vertical_align === "start" && "self-end",
          vertical_align === "end" && "self-start",
        )}
      >
        {bg?.media && (
          <Picture media={bg.media} alt={bg.alt ?? ""} className="block size-full" imgClassName="size-full object-cover" />
        )}
      </figure>
    </section>
  )
}
