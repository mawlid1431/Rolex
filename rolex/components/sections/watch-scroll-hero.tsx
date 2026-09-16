"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"
import { usePreferences } from "@/components/providers/preferences"
import { createVideoScrubber } from "@/lib/animations/video-scrub"

type Props = {
  className?: string
  kicker?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  onSecondaryClick?: () => void
  secondaryPressed?: boolean
  image: string
  portraitImage?: string
  videoSrc?: string
  videoPortraitSrc?: string
  posterSrc?: string
  priority?: boolean
}

/**
 * Shared watch / collection scroll hero.
 * Sticky 280vh: clip-path expands while scroll scrubs optional film (down / up).
 * Long enough that the story finishes before leaving the scene.
 */
export function WatchScrollHero({
  className,
  kicker,
  title,
  subtitle,
  ctaLabel = "Discover more",
  ctaHref = "#",
  secondaryLabel,
  onSecondaryClick,
  secondaryPressed,
  image,
  portraitImage,
  videoSrc,
  videoPortraitSrc,
  posterSrc,
  priority = true,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { reducedMotion } = usePreferences()

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  })

  const inset = useTransform(scrollYProgress, [0, 0.7], reducedMotion ? [0, 0] : [18, 0])
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}%)`
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.55, 0.78], [1, 1, 0.4, 0])
  const scale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1.08, 1])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion || !videoSrc) return
    const scrubber = createVideoScrubber(video)
    const update = (p: number) => scrubber.seek(p / 0.72)
    update(scrollYProgress.get())
    const unsubscribe = scrollYProgress.on("change", update)
    return () => { unsubscribe(); scrubber.dispose() }
  }, [videoSrc, reducedMotion, scrollYProgress])

  const cta = resolveHref(ctaHref)

  return (
    <section
      ref={rootRef}
      className={cn("watch-scroll-hero relative bg-[rgb(var(--light-black))]", reducedMotion ? "h-[100svh]" : "h-[280svh]", className)}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <motion.div className="absolute inset-0 origin-center" style={{ clipPath, scale }}>
          {videoSrc && !reducedMotion ? (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              muted
              playsInline
              preload={priority ? "auto" : "none"}
              poster={posterSrc ?? image}
              aria-hidden
            >
              {videoPortraitSrc && (
                <source media="(max-width: 767px)" src={videoPortraitSrc} type="video/mp4" />
              )}
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
          <picture className={cn("absolute inset-0", videoSrc && !reducedMotion && "pointer-events-none -z-[1]")}>
            {portraitImage && <source media="(max-width: 767px)" srcSet={portraitImage} />}
            <img src={image} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" className="size-full object-cover" />
          </picture>
        </motion.div>

        <motion.div
          className="relative z-[1] flex h-full flex-col items-center justify-end px-[var(--outer-margin)] pb-20 text-center text-white m:pb-24"
          style={{ opacity: reducedMotion ? 1 : textOpacity }}
        >
          {kicker && (
            <p className="surtitle70 mb-2 tracking-[0.06em] uppercase [text-shadow:0_0_12px_rgba(0,0,0,0.2)]">
              {kicker}
            </p>
          )}
          <h1 className="headline50 mb-3 max-w-[18ch] text-balance [text-shadow:0_0_12px_rgba(0,0,0,0.2)] m:headline100">
            {title}
          </h1>
          {subtitle && <p className="body100 mb-6 max-w-md font-light opacity-90">{subtitle}</p>}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ctaLabel && (
              <Link
                href={cta.href}
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="btn btn-filled inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm text-black"
              >
                {ctaLabel}
              </Link>
            )}
            {secondaryLabel && onSecondaryClick && (
              <button
                type="button"
                className="btn inline-flex min-h-11 items-center rounded-full border border-white/70 bg-transparent px-6 text-sm text-white"
                aria-pressed={secondaryPressed}
                onClick={onSecondaryClick}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
