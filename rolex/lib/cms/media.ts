import type { ImageCld, VideoCld } from "./types"
import type { Media } from "@/lib/media"
import { mediaSrc } from "@/lib/media"

type MediaSlot = { image_cld?: ImageCld; video_cld?: VideoCld; color?: unknown }

/** First image_cld / video_cld found in a CMS media array. */
export function pickMedia(slots?: MediaSlot[] | null) {
  if (!slots?.length) return { image: undefined as ImageCld | undefined, video: undefined as VideoCld | undefined }
  let image: ImageCld | undefined
  let video: VideoCld | undefined
  for (const slot of slots) {
    if (!image && slot.image_cld) image = slot.image_cld
    if (!video && slot.video_cld) video = slot.video_cld
  }
  return { image, video }
}

export function asMedia(value: unknown): Media | null {
  if (!value || typeof value !== "object") return null
  const m = value as Media
  if (typeof m.id === "string" || typeof m.src === "string" || m.src === null) return m
  return null
}

type CldUpload = {
  public_id?: string
  secure_url?: string
  width?: number
  height?: number
}

/** Map a raw Cloudinary upload / ImageCld / Media into a usable ImageCld for Picture. */
export function resolveImageCld(input: unknown, alt = ""): ImageCld | undefined {
  if (!input || typeof input !== "object") return undefined
  const obj = input as Record<string, unknown>

  if ("media" in obj) {
    const image = obj as ImageCld
    if (image.media && mediaSrc(image.media)) return image
    if (image.media) {
      return {
        alt: image.alt ?? alt,
        media: {
          ...image.media,
          src: image.media.src ?? publicIdToLocal(image.media.id),
          portraitSrc: image.media.portraitSrc ?? image.media.src ?? publicIdToLocal(image.media.id),
        },
      }
    }
  }

  const upload = obj as CldUpload
  if (upload.public_id) {
    const basename = upload.public_id.split("/").pop() ?? upload.public_id
    const src = `/images/${basename}.avif`
    return {
      alt,
      media: {
        id: upload.public_id,
        src,
        portraitSrc: src,
        width: upload.width,
        height: upload.height,
      },
    }
  }

  return undefined
}

function publicIdToLocal(id?: string | null) {
  if (!id) return null
  const basename = id.split("/").pop() ?? id
  return `/images/${basename}.avif`
}

/** Unwrap poster/fallback that may be Media or ImageCld. */
export function posterMedia(value?: Media | ImageCld | null): Media | null {
  if (!value) return null
  if ("media" in value) return value.media ?? null
  return value as Media
}
