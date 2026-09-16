"use client"

import { useRef, useState } from "react"
import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import type { HeadingData, ImageCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  text?: { text?: string } | string
  image?: ImageCld | ImageCld[]
  labels?: { left?: string; right?: string; drag?: string }
}

/**
 * Drag-to-compare / explore watch image (simplified port of WatchDrag).
 * Horizontal drag shifts the image; labels hint interaction.
 */
export function WatchDrag({ className, heading, text, image, labels }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const img = Array.isArray(image) ? image[0] : image
  const body = typeof text === "string" ? text : text?.text

  function onPointerDown(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const start = offset
    const width = el.clientWidth
    const target = el

    function move(ev: PointerEvent) {
      const dx = ev.clientX - startX
      const next = Math.max(-0.35, Math.min(0.35, start + dx / width))
      setOffset(next)
    }
    function up(ev: PointerEvent) {
      target.releasePointerCapture(ev.pointerId)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  return (
    <section className={cn("watch-drag full-grid py-[var(--m-h-space)]", className)}>
      <div className="col-[main] m:col-[col_3/span_8] text-center">
        {heading?.title && <Html as="h2" html={heading.title} className="headline50 font-bold" />}
        {body && <Html as="p" html={body} className="body100 mt-4 font-light" />}
      </div>
      <div
        ref={ref}
        className="relative col-[doc] mt-8 cursor-grab touch-pan-y active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
      >
        {img?.media && (
          <Picture
            media={img.media}
            alt={img.alt ?? ""}
            className="block w-full"
            imgClassName="w-full max-w-none object-contain transition-transform duration-75"
            style={{ transform: `translateX(${offset * 100}%)` }}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-between px-[var(--outer-margin)] legend100 text-dark-grey">
          <span>{labels?.left ?? ""}</span>
          <span>{labels?.drag ?? "Drag"}</span>
          <span>{labels?.right ?? ""}</span>
        </div>
      </div>
    </section>
  )
}
