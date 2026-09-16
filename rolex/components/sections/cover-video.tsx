"use client"

import { AutoplayVideo } from "@/components/media/autoplay-video"
import { SectionHeading } from "@/components/cms/text-blocks"
import { posterMedia } from "@/lib/cms/media"
import type { HeadingData, VideoCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  video_cld?: VideoCld
}

export function CoverVideo({ className, heading, video_cld }: Props) {
  return (
    <section
      className={cn(
        "relative full-grid min-h-[max(400px,calc(100svh-var(--nav-bar-height,3.5rem)))] overflow-hidden",
        className,
      )}
    >
      <div className="relative z-[1] col-[main] row-[1/-1] flex items-center justify-center text-center m:justify-start m:text-start">
        <SectionHeading heading={heading} className="my-[16vh] m:my-[8vw]" />
      </div>
      <figure className="absolute inset-0 col-[doc] row-[1/-1]">
        {video_cld?.media && (
          <AutoplayVideo
            video={video_cld.media}
            poster={posterMedia(video_cld.poster) ?? posterMedia(video_cld.fallback)}
            alt={video_cld.alt}
            priority
            noButton
            className="size-full"
            videoClassName="!h-full object-cover"
          />
        )}
      </figure>
    </section>
  )
}
