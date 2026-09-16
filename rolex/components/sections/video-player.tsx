"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion"
import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { pickMedia, posterMedia as unwrapPoster } from "@/lib/cms/media"
import type { ImageCld, VideoCld } from "@/lib/cms/types"
import { mediaSrc, type Media } from "@/lib/media"
import { usePreferences } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  width?: string
  poster?: { image_cld?: ImageCld; video_cld?: VideoCld }[]
  video_player_cld?: VideoCld & { launcher_label?: string; aria_label?: string; alt?: string }
  background_color?: { colors?: { color: string; opacity?: number }[] }
}

const WIDTH: Record<string, string> = {
  xl: "col-[doc]",
  l: "col-[main] m:col-[col_1/span_12]",
  m: "col-[main] m:col-[col_2/span_10]",
  s: "col-[main] m:col-[col_4/span_6]",
  xs: "col-[main] m:col-[col_5/span_4]",
}

function pickPlayable(...candidates: Array<Media | null | undefined>) {
  for (const candidate of candidates) {
    if (candidate && mediaSrc(candidate)) return candidate
  }
  return null
}

function PlayerSurface({
  className,
  width = "l",
  poster,
  video_player_cld,
  fillViewport,
}: Props & { fillViewport?: boolean }) {
  const fromPoster = pickMedia(poster)
  const video = pickPlayable(fromPoster.video?.media, video_player_cld?.media)
  const image = fromPoster.image
  const posterFrame =
    unwrapPoster(fromPoster.video?.poster) ?? unwrapPoster(video_player_cld?.poster) ?? image?.media

  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-[rgb(var(--light-black))]",
        fillViewport ? "size-full" : cn("aspect-video", WIDTH[width] ?? WIDTH.l),
        className,
      )}
    >
      {video ? (
        <AutoplayVideo
          video={video}
          poster={posterFrame}
          alt={video_player_cld?.alt ?? fromPoster.video?.alt ?? image?.alt}
          noButton={false}
          className="size-full"
          videoClassName="size-full object-cover"
        />
      ) : image?.media || posterFrame ? (
        <Picture
          media={image?.media ?? posterFrame}
          alt={image?.alt ?? ""}
          className="block size-full"
          imgClassName="size-full object-cover"
        />
      ) : null}
    </figure>
  )
}

export function VideoPlayer({ className, width = "l", poster, video_player_cld }: Props) {
  return (
    <section className={cn("video-player relative full-grid py-[clamp(1.5rem,4vw,3rem)]", className)}>
      <PlayerSurface width={width} poster={poster} video_player_cld={video_player_cld} />
    </section>
  )
}

/**
 * Sticky 200vh expand.
 * Mask stays `sticky; top: 0; height: 100vh` while clip-path insets from ~20% → 0.
 */
export function VideoPlayerExpand({
  className,
  poster,
  video_player_cld,
  background_color,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const { reducedMotion } = usePreferences()
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] })
  const percv = useTransform(scrollYProgress, [0, 0.8], reducedMotion ? [0, 0] : [20, 0])
  const perch = useTransform(scrollYProgress, [0, 0.8], reducedMotion ? [0, 0] : [20, 0])
  const inset = useMotionTemplate`inset(${percv}% ${perch}%)`
  const bg = background_color?.colors?.[0]
    ? `rgb(${background_color.colors[0].color} / ${background_color.colors[0].opacity ?? 1})`
    : undefined

  return (
    <section
      ref={rootRef}
      className={cn("video-player-expand relative h-[200vh]", className)}
      style={{ background: bg }}
    >
      <motion.div className="sticky top-0 h-[100svh] w-full overflow-hidden" style={{ clipPath: inset }}>
        <PlayerSurface
          width="xl"
          poster={poster}
          video_player_cld={video_player_cld}
          fillViewport
          className="!col-auto size-full !aspect-auto"
        />
      </motion.div>
    </section>
  )
}
