"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { pickMedia, posterMedia } from "@/lib/cms/media"
import type { CmsLinkData, HeadingData, ImageCld, VideoCld } from "@/lib/cms/types"
import { usePreferences } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  paragraph?: { text?: string } | string
  link?: CmsLinkData
  poster?: { image_cld?: ImageCld; video_cld?: VideoCld }[]
  image_cld?: ImageCld
  video_cld?: VideoCld
  text_width?: { width?: string } | string
  marie_louise?: boolean
  marie_louise_biggie?: boolean
  parallax?: boolean
  aria_label?: string
}

export function Push({
  className,
  heading,
  paragraph,
  link,
  poster,
  image_cld,
  video_cld,
  marie_louise_biggie,
  parallax,
  aria_label,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const { reducedMotion } = usePreferences()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], parallax && !reducedMotion ? ["-8%", "8%"] : ["0%", "0%"])
  const scale = parallax && !reducedMotion ? 1.15 : 1

  const fromPoster = pickMedia(poster)
  const video = video_cld ?? fromPoster.video
  const image = image_cld ?? fromPoster.image
  const body = typeof paragraph === "string" ? paragraph : paragraph?.text

  function onClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("a, button")) return
    const a = e.currentTarget.querySelector<HTMLAnchorElement>("a[href]")
    a?.click()
  }

  const media = (
    <motion.figure className="absolute inset-0 overflow-hidden" style={{ y }}>
      <div className="size-full" style={{ transform: `scale(${scale})` }}>
        {video?.media ? (
          <AutoplayVideo
            video={video.media}
            poster={posterMedia(video.poster) ?? image?.media}
            alt={video.alt ?? image?.alt}
            noButton
            className="size-full"
            videoClassName="!h-full object-cover"
          />
        ) : image?.media ? (
          <Picture media={image.media} alt={image.alt ?? ""} className="size-full" imgClassName="size-full object-cover" />
        ) : null}
      </div>
    </motion.figure>
  )

  const content = (
    <div className="relative z-[1] flex min-h-[70vw] flex-col items-center justify-end gap-3 p-[clamp(1.5rem,4vw,3rem)] text-center m:min-h-[36vw]">
      {heading?.kicker && <span className="surtitle70">{heading.kicker}</span>}
      {heading?.title && <Html as="h2" html={heading.title} className="headline50 font-bold" />}
      {body && <Html as="p" html={body} className="body100 max-w-prose font-light" />}
      {link && (
        <CmsLink
          href={link.href}
          external={link.external}
          label={link.label}
          ariaLabel={link.aria_label ?? aria_label}
          style={link.style ?? "filled opaque-white"}
        />
      )}
    </div>
  )

  return (
    <aside
      ref={ref}
      aria-label={aria_label ?? heading?.title}
      className={cn("push relative cursor-pointer overflow-hidden", marie_louise_biggie && "full-grid", className)}
      onClick={onClick}
    >
      {marie_louise_biggie ? (
        <div className="relative col-[main] my-[var(--outer-margin)] overflow-hidden">
          {media}
          {content}
        </div>
      ) : (
        <>
          {media}
          {content}
        </>
      )}
    </aside>
  )
}
