"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { SectionHeading } from "@/components/cms/text-blocks"
import { pickMedia, posterMedia } from "@/lib/cms/media"
import type { HeadingData, ImageCld, VideoCld } from "@/lib/cms/types"
import { usePreferences } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  media?: { image_cld?: ImageCld; video_cld?: VideoCld }[]
  horizontal_align?: string
  vertical_align?: string
  theme?: { theme?: string }
}

/**
 * Full-viewport cover with scroll-driven zoom.
 * Uses Framer Motion polyfill when View Timeline is unavailable; CSS view-timeline otherwise.
 */
export function CoverParallaxFullscreen({
  className,
  heading,
  media,
  horizontal_align = "start",
  vertical_align = "center",
}: Props) {
  const { image, video } = pickMedia(media)
  const mainRef = useRef<HTMLElement>(null)
  const { reducedMotion } = usePreferences()
  // Progress 0 at section top aligned to viewport top → 1 as section exits upward.
  const { scrollYProgress: Y } = useScroll({ target: mainRef, offset: ["start start", "end start"] })
  const scale = useTransform(Y, [0, 1], reducedMotion ? [1, 1] : [1, 1.2])

  return (
    <motion.section
      ref={mainRef}
      className={cn(
        "cover-parallax-fullscreen relative overflow-hidden full-grid min-h-[max(400px,calc(100svh-var(--nav-bar-height,3.5rem)))]",
        `hs-txt-h-align-${horizontal_align}`,
        className,
      )}
      style={
        {
          "--cv-txt-v-align": vertical_align,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative z-[1] col-[main] row-[1/-1] my-[16vh] text-center m:my-[8vw] m:text-start m:self-[var(--cv-txt-v-align)]",
          horizontal_align === "start" && "m:col-[2/span_4]",
          horizontal_align === "center" && "m:col-[6/span_4]",
          horizontal_align === "end" && "m:col-[10/span_4]",
        )}
      >
        <SectionHeading heading={heading} titleClassName="headline50" />
      </div>
      <motion.figure
        className="cover-parallax-media absolute inset-0 col-[doc] row-[1/-1] size-full origin-center will-change-transform"
        style={{ scale }}
      >
        {image?.media && (
          <Picture
            media={image.media}
            alt={image.alt ?? ""}
            priority
            className="contents"
            imgClassName="size-full object-cover"
          />
        )}
        {video?.media && (
          <AutoplayVideo
            video={video.media}
            poster={posterMedia(video.poster)}
            alt={video.alt}
            noButton
            priority
            className="size-full"
            videoClassName="!h-full object-cover"
          />
        )}
      </motion.figure>
    </motion.section>
  )
}
