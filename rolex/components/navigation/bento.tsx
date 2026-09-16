"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { bentoGrids, type Bento as BentoData, type BentoItem } from "@/lib/navigation"
import { mediaPortraitSrc, mediaSrc } from "@/lib/media"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"

function BentoCell({ item, onNavigate }: { item: BentoItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const target = resolveHref(item.href)
  const active = !target.external && pathname === target.href
  const src = mediaSrc(item.media)
  const portrait = mediaPortraitSrc(item.media) ?? src
  const inner = (
    <figure className="bento-figure">
      {src && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bento-asset bento-asset-landscape" src={src} alt="" loading="lazy" decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bento-asset bento-asset-portrait" src={portrait ?? src} alt="" loading="lazy" decoding="async" />
        </>
      )}
      {!src && <span className="bento-asset bento-asset-empty" />}
      <figcaption className={cn("bento-caption", item.theme ?? "dark-theme")}>{item.label}</figcaption>
    </figure>
  )
  const props = {
    className: cn("bento-cell", active && "active"),
    "aria-label": item.ariaLabel,
    "aria-current": active ? ("page" as const) : undefined,
  }
  return (
    <li>
      {target.external ? (
        <a href={target.href} target="_blank" rel="noopener noreferrer" {...props}>
          {inner}
        </a>
      ) : (
        <Link href={target.href} onClick={onNavigate} {...props}>
          {inner}
        </Link>
      )}
    </li>
  )
}

type BentoProps = {
  bento: BentoData
  /** Stack grids vertically from 768px (menu pane) instead of a carousel (sub navigation). */
  mayBeVertical?: boolean
  onNavigate?: () => void
  className?: string
}

/** Image-card grids of the navigation. */
export function Bento({ bento, mayBeVertical = true, onNavigate, className }: BentoProps) {
  const grids = bentoGrids(bento)
  const deck = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const node = deck.current
    if (!node) return
    const onScroll = () => {
      const width = node.clientWidth || 1
      setIndex(Math.round(node.scrollLeft / width))
    }
    node.addEventListener("scroll", onScroll, { passive: true })
    return () => node.removeEventListener("scroll", onScroll)
  }, [])

  const go = (next: number) => {
    const node = deck.current
    if (!node) return
    const clamped = Math.max(0, Math.min(grids.length - 1, next))
    const slide = node.children[clamped] as HTMLElement | undefined
    node.scrollTo({ left: slide ? slide.offsetLeft - node.offsetLeft : clamped * node.clientWidth, behavior: "smooth" })
  }

  return (
    <div className={cn("bento-container", className)} data-may-be-vertical={mayBeVertical} data-slides={grids.length}>
      <div ref={deck} className="bento-deck" tabIndex={-1}>
        {grids.map((grid, i) => (
          <ul key={i} className="bento-grid" data-pattern={grid.pattern} aria-hidden={false}>
            {grid.items.map((item) => (
              <BentoCell key={item.href + item.label} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        ))}
      </div>
      {grids.length > 1 && (
        <nav className="bento-nav" aria-label="Carousel navigation">
          <ul>
            {grids.map((_, i) => (
              <li key={i}>
                <button type="button" aria-label={`Show slide ${i + 1}`} aria-current={index === i} onClick={() => go(i)}>
                  <span className="bento-dot" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="bento-arrow" data-dir="-1" aria-label="Previous" disabled={index === 0} onClick={() => go(index - 1)} />
          <button
            type="button"
            className="bento-arrow"
            data-dir="1"
            aria-label="Next"
            disabled={index >= grids.length - 1}
            onClick={() => go(index + 1)}
          />
        </nav>
      )}
    </div>
  )
}
