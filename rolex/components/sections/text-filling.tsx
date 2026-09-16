"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePreferences } from "@/components/providers/preferences"
import { gradientCss } from "@/lib/cms/gradient"
import type { GradientStop } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

type ParagraphBlock = { paragraph?: string; is_bold?: boolean }

type Props = {
  className?: string
  paragraph?: { block?: ParagraphBlock[] }
  color_gradient?: { colors?: GradientStop[]; angle?: number }
  box_spacing?: Record<string, string>
}

/**
 * Scroll-scrubbed gradient text fill.
 * Base grey text + overlay clipped by scroll progress.
 */
export function TextFilling({ className, paragraph, color_gradient }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const { reducedMotion } = usePreferences()
  const blocks = paragraph?.block ?? []
  const fill = gradientCss(color_gradient?.colors) ?? "rgb(27 39 87)"
  const solid = color_gradient?.colors?.[0]
    ? `rgb(${color_gradient.colors[0].color} / ${color_gradient.colors[0].opacity ?? 1})`
    : "rgb(27 39 87)"

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !fillRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            end: "bottom 35%",
            scrub: true,
          },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  if (!blocks.length) return null

  const content = blocks.map((block, i) => (
    <p key={i} className={cn("headline50", block.is_bold && "font-bold")}>
      {block.paragraph}
    </p>
  ))

  return (
    <section ref={rootRef} className={cn("text-filling relative full-grid", className)}>
      <div className="relative col-[main] m:col-[4/span_8]">
        <div className="relative headline50 w-full text-[rgb(var(--alternate-grey))]">{content}</div>
        <div
          ref={fillRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 headline50 w-full"
          style={{
            color: solid,
            backgroundImage: fill.includes("gradient") ? fill : undefined,
            WebkitBackgroundClip: fill.includes("gradient") ? "text" : undefined,
            backgroundClip: fill.includes("gradient") ? "text" : undefined,
            WebkitTextFillColor: fill.includes("gradient") ? "transparent" : undefined,
            clipPath: reducedMotion ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          }}
        >
          {content}
        </div>
      </div>
    </section>
  )
}
