"use client"

import { AutoplayVideo } from "@/components/media/autoplay-video"
import { Picture } from "@/components/media/picture"
import { RenderBlocks } from "@/components/cms/render-blocks"
import { parseModularBlock } from "@/lib/cms/parse"
import { pickMedia, posterMedia } from "@/lib/cms/media"
import type { ImageCld, VideoCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type BgSlot = { image_cld?: ImageCld; video_cld?: VideoCld; color?: { colors?: { color: string; opacity?: number }[]; angle?: number } }

type Props = {
  className?: string
  components?: unknown
  background?: BgSlot[]
  background_position?: "start" | "center" | "end"
}

function backgroundStyle(background?: BgSlot[]) {
  if (!background?.length) return undefined
  for (const slot of background) {
    if (slot.color?.colors?.length) {
      const stops = slot.color.colors.map((c) => `rgb(${c.color} / ${c.opacity ?? 1})`)
      if (stops.length === 1) return { background: stops[0] }
      const angle = slot.color.angle != null ? `${slot.color.angle}deg, ` : ""
      return { background: `linear-gradient(${angle}${stops.join(", ")})` }
    }
  }
  return undefined
}

const POS: Record<string, string> = {
  start: "object-top",
  center: "object-center",
  end: "object-bottom",
}

export function Fragainer({ className, components, background, background_position = "center" }: Props) {
  const blocks = parseModularBlock(components)
  const { image, video } = pickMedia(background)
  const style = backgroundStyle(background)
  const hasMedia = Boolean(image?.media || video?.media)

  return (
    <div className={cn("fragainer relative z-0 isolate", hasMedia && "min-h-[50vh]", className)} style={style}>
      {hasMedia && (
        <figure className="pointer-events-none absolute inset-0 -z-[1] size-full overflow-hidden">
          {image?.media && (
            <Picture
              media={image.media}
              alt={image.alt ?? ""}
              className="size-full"
              imgClassName={cn("size-full object-cover", POS[background_position])}
            />
          )}
          {video?.media && (
            <AutoplayVideo
              video={video.media}
              poster={posterMedia(video.poster)}
              alt={video.alt}
              noButton
              className="size-full"
              videoClassName={cn("!h-full object-cover", POS[background_position])}
            />
          )}
        </figure>
      )}
      {blocks.length > 0 ? <RenderBlocks blocks={blocks} /> : null}
    </div>
  )
}
