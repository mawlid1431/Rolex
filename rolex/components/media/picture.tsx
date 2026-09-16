import { cn } from "@/lib/utils"
import { mediaPortraitSrc, mediaSrc, type Media } from "@/lib/media"

type PictureProps = {
  media?: Media | null
  alt?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
}

/**
 * Art-directed image (portrait source below 768px), mirroring the reference ImageCLD
 * <picture> markup. Assets are pre-encoded AVIF/WebP 
 * optimisation is needed.
 */
export function Picture({ media, alt = "", className, imgClassName, priority, sizes = "100vw", style }: PictureProps) {
  const src = mediaSrc(media)
  if (!src) return null
  const portrait = mediaPortraitSrc(media)
  return (
    <picture className={className} style={style}>
      {portrait && portrait !== src && <source media="(max-width: 767px)" srcSet={portrait} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        width={media?.width}
        height={media?.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("block", imgClassName)}
      />
    </picture>
  )
}
