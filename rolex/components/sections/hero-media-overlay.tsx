"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Sticky track length in viewport heights.
 * Long enough that the full Padellone film can scrub before the roller cards enter.
 */
const HERO_SCROLL_VH = 340

/** Progress phases within the sticky track (0 → 1). */
const PHASE = {
  /** Title stays fully visible until here. */
  fadeStart: 0.58,
  /** Title + CTA fully gone; dark overlay fully on. */
  fadeEnd: 0.74,
  /** Roller cards appear only after the film has finished scrubbing. */
  cardsEnter: 0.78,
  /** Hide cards again when scrolling back up past this point. */
  cardsReset: 0.7,
  /** Film reaches its last frame here (before cards). */
  scrubEnd: 0.72,
} as const

export type HeroRollerItem = {
  id: string
  href: string
  kicker: string
  title: string
  image: string
  imageAlt: string
}

export type HeroMediaOverlayProps = {
  className?: string
  kicker?: string
  title: string
  ctaLabel?: string
  ctaHref?: string
  videoSrc: string
  videoPortraitSrc?: string
  posterSrc: string
  posterPortraitSrc?: string
  items: HeroRollerItem[]
}

/**
 * Homepage hero.
 * Sticky film scrubbed by scroll → title fades → dark overlay → featured roller cards.
 * Cards must not appear until the watch film has completed.
 */
export function HeroMediaOverlay({
  className,
  kicker = "WHEN TIMES ALIGN",
  title,
  ctaLabel = "Discover more",
  ctaHref = "/watches/new-watches/perpetual-padellone",
  videoSrc,
  videoPortraitSrc,
  posterSrc,
  posterPortraitSrc,
  items,
}: HeroMediaOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [installationVisible, setInstallationVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  })

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, PHASE.fadeStart, PHASE.fadeEnd, 1],
    [0, 0, 1, 1],
  )
  const textOpacity = useTransform(
    scrollYProgress,
    [0, PHASE.fadeStart, PHASE.fadeEnd, 1],
    [1, 1, 0, 0],
  )

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reducedMotion) return

    setInstallationVisible((prev) => {
      if (!prev && p >= PHASE.cardsEnter) return true
      if (prev && p <= PHASE.cardsReset) return false
      return prev
    })

    const video = videoRef.current
    if (!video) return
    const duration = video.duration
    if (!Number.isFinite(duration) || duration <= 0) return

    // Full film plays across 0 → scrubEnd; cards only after that.
    const scrub = Math.min(1, Math.max(0, p / PHASE.scrubEnd))
    const next = scrub * duration
    if (Math.abs(video.currentTime - next) > 0.033) {
      try {
        video.currentTime = next
      } catch {
        /* ignore seek before metadata */
      }
    }
    if (!video.paused) video.pause()
  })

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 80)
    return () => window.clearTimeout(t)
  }, [])

  // Keep the film paused — scroll drives currentTime (down opens, up reverses).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const lock = () => {
      video.pause()
    }
    video.addEventListener("play", lock)
    lock()
    return () => video.removeEventListener("play", lock)
  }, [ready])

  const cta = resolveHref(ctaHref)
  const showInstall = reducedMotion ? false : installationVisible

  const onMediaClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return
    const el = document.querySelector<HTMLAnchorElement>("[data-hero-cta]")
    el?.click()
  }, [])

  return (
    <div
      ref={rootRef}
      id="hero"
      className={cn(
        "hero-media-overlay relative dark-theme full-grid -mt-[calc(var(--nav-bar-height,3.5rem)-1px)]",
        className,
      )}
      style={{ height: `${HERO_SCROLL_VH}vh` }}
    >
      {ready && (
        <div
          className="sticky top-0 col-[doc] row-start-1 h-[100svh] w-full overflow-hidden"
          onClick={onMediaClick}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            aria-label={title}
          >
            {videoPortraitSrc && (
              <source media="(max-width: 767px)" src={videoPortraitSrc} type="video/mp4" />
            )}
            <source src={videoSrc} type="video/mp4" />
          </video>
          <picture className="pointer-events-none absolute inset-0 -z-[1]">
            {posterPortraitSrc && (
              <source media="(max-width: 767px)" srcSet={posterPortraitSrc} />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterSrc} alt="" className="size-full object-cover" />
          </picture>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] bg-black/80 backdrop-blur-[5px]"
            style={{ opacity: reducedMotion ? 0 : overlayOpacity }}
            aria-hidden
          />
        </div>
      )}

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] full-grid h-[100svh]"
        style={{ opacity: reducedMotion ? 1 : textOpacity }}
      >
        <div
          className={cn(
            "col-[main] flex h-[calc(100svh-var(--nav-bar-height,3.5rem))] flex-col items-center justify-end gap-4 pb-24 text-center text-white",
            "m:col-[col_3/span_8] m:gap-5 m:pb-20",
          )}
          data-isinteractive={!showInstall ? "true" : "false"}
        >
          <hgroup className="grid gap-2 px-2 m:gap-2.5">
            {kicker && (
              <p className="surtitle70 tracking-[0.06em] uppercase [text-shadow:0_0_12px_rgba(0,0,0,0.05)]">
                {kicker}
              </p>
            )}
            <h2 className="headline100 text-balance [text-shadow:0_0_12px_rgba(0,0,0,0.05)] max-m:text-[clamp(1.75rem,8vw,2.5rem)]">
              {title}
            </h2>
          </hgroup>
          {ctaLabel && (
            <div className={cn("pointer-events-auto", showInstall && "pointer-events-none")}>
              <Link
                data-hero-cta
                href={cta.href}
                {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="btn btn-filled inline-flex min-h-11 items-center rounded-full bg-white/15 px-6 text-sm text-white backdrop-blur-sm"
                aria-label={`${ctaLabel} - ${title}`}
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      <div
        className="pointer-events-none sticky top-0 z-[3] col-[doc] row-start-1 flex h-[100svh] items-center overflow-hidden"
        style={{ pointerEvents: showInstall ? "auto" : "none" }}
        aria-hidden={!showInstall}
      >
        <nav
          id="featured"
          className={cn(
            "mx-auto w-full max-w-[1920px] px-[clamp(1rem,4vw,5rem)] transition-opacity duration-500",
            showInstall ? "opacity-100" : "opacity-0",
          )}
          aria-label="Featured"
        >
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 m:grid m:grid-cols-3 m:gap-6 m:overflow-visible">
            {items.map((item) => {
              const link = resolveHref(item.href)
              return (
                <li key={item.id} className="min-w-[78%] shrink-0 snap-center m:min-w-0">
                  <Link
                    href={link.href.startsWith("#") ? link.href : link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative block overflow-hidden rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] m:aspect-[3/4]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-start text-white">
                      <p className="surtitle70 mb-1 uppercase opacity-90">{item.kicker}</p>
                      <h3 className="headline50 text-balance">{item.title}</h3>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-[4] -translate-x-1/2 text-white"
        aria-hidden
        style={{ opacity: showInstall ? 0 : 1 }}
      >
        <span className="block h-2 w-2 rotate-45 border-b border-r border-white/80" />
      </div>
    </div>
  )
}
