"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Icon } from "@/components/icons/icon"
import { usePreferences } from "@/components/providers/preferences"
import { mediaPortraitSrc, mediaSrc, type Media } from "@/lib/media"
import { cn } from "@/lib/utils"

export type AutoplayVideoHandle = {
  play: () => void
  pause: () => void
  readonly element: HTMLVideoElement | null
}

type AutoplayVideoProps = {
  video?: Media | null
  poster?: Media | null
  alt?: string
  className?: string
  videoClassName?: string
  loop?: boolean
  /** Hide the play/pause control. */
  noButton?: boolean
  /** Visibility ratio that starts playback. */
  threshold?: number
  /** Let the parent drive playback instead of the viewport observer. */
  manual?: boolean
  priority?: boolean
}

/**
 * Muted, looping, inline autoplay video that plays while ≥20% visible and honours
 * the reduced-motion preference.
 */
export const AutoplayVideo = forwardRef<AutoplayVideoHandle, AutoplayVideoProps>(function AutoplayVideo(
  { video, poster, alt = "", className, videoClassName, loop = true, noButton = true, threshold = 0.2, manual, priority },
  handle,
) {
  const ref = useRef<HTMLVideoElement>(null)
  const { reducedMotion } = usePreferences()
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const src = mediaSrc(video)
  const posterSrc = mediaSrc(poster) ?? undefined
  const portraitPoster = mediaPortraitSrc(poster) ?? posterSrc

  useImperativeHandle(handle, () => ({
    play: () => {
      if (!reducedMotion) ref.current?.play().catch(() => {})
    },
    pause: () => ref.current?.pause(),
    get element() {
      return ref.current
    },
  }))

  useEffect(() => {
    const node = ref.current
    if (!node || manual) return
    if (reducedMotion || userPaused) {
      node.pause()
      return
    }

    const tryPlay = () => {
      if (!userPaused && !reducedMotion) node.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Prefer isIntersecting — ratio-only checks miss mid-scroll callbacks in some browsers.
        if (entry.isIntersecting && entry.intersectionRatio >= Math.min(threshold, 0.05)) tryPlay()
        else if (!entry.isIntersecting) node.pause()
      },
      { threshold: [0, 0.05, 0.2, 0.5, 1], rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(node)
    node.addEventListener("loadeddata", tryPlay)
    requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect()
      const visible = rect.bottom > 0 && rect.top < window.innerHeight
      if (visible) tryPlay()
    })

    return () => {
      observer.disconnect()
      node.removeEventListener("loadeddata", tryPlay)
    }
  }, [manual, reducedMotion, threshold, userPaused])

  if (!src) {
    if (!posterSrc) return null
    return (
      <picture className={className}>
        {portraitPoster !== posterSrc && <source media="(max-width: 767px)" srcSet={portraitPoster} />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterSrc} alt={alt} className={cn("block size-full object-cover", videoClassName)} loading={priority ? "eager" : "lazy"} />
      </picture>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <video
        ref={ref}
        className={cn("block size-full object-cover", videoClassName)}
        src={src}
        poster={posterSrc}
        muted
        loop={loop}
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt || undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!noButton && (
        <button
          type="button"
          className="btn btn-icon btn-translucent-dark absolute end-[clamp(1.25rem,1.56vw+0.63rem,2.5rem)] bottom-[clamp(1.25rem,1.56vw+0.63rem,2.5rem)] z-[1]"
          aria-label={playing ? "Pause the video" : "Play the video"}
          onClick={() => {
            const node = ref.current
            if (!node) return
            if (node.paused) {
              setUserPaused(false)
              node.play().catch(() => {})
            } else {
              setUserPaused(true)
              node.pause()
            }
          }}
        >
          <Icon type={playing ? "pause" : "play"} />
        </button>
      )}
    </div>
  )
})
