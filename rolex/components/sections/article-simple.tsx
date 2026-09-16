"use client"

import { Reveal } from "@/components/cms/reveal"
import { TextBlocks } from "@/components/cms/text-blocks"
import { gradientCss } from "@/lib/cms/gradient"
import type { GradientStop } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  texts?: unknown[]
  horizontal_align?: { align?: string }
  text_width?: { width?: string }
  text_justify?: string
  title_gradient?: { colors?: GradientStop[]; angle?: number }
  chapo_gradient?: { colors?: GradientStop[]; angle?: number }
  transition_gradient?: { top_color?: string; bottom_color?: string }
  background?: unknown
}

function alignClass(align?: string, width?: string) {
  const a = align ?? "start"
  const w = width ?? "s"
  return `txt-${a}-${w}`
}

export function ArticleSimple({
  className,
  texts,
  horizontal_align,
  text_width,
  text_justify = "start",
  title_gradient,
  chapo_gradient,
  transition_gradient,
}: Props) {
  const titleGrad = gradientCss(title_gradient?.colors)
  const chapoGrad = gradientCss(chapo_gradient?.colors)

  return (
    <section
      className={cn(
        "article-simple relative full-grid",
        alignClass(horizontal_align?.align, text_width?.width),
        `txt-justify-${text_justify}`,
        className,
      )}
      style={
        {
          "--title-gradient": titleGrad,
          "--chapo-gradient": chapoGrad,
          "--top-color": transition_gradient?.top_color,
          "--bot-color": transition_gradient?.bottom_color,
        } as React.CSSProperties
      }
    >
      <Reveal
        className={cn(
          "z-[1] flex flex-col col-[main]",
          "m:col-[var(--txt-start,col_1)/var(--txt-width,span_6)]",
        )}
      >
        <TextBlocks
          texts={texts}
          className={cn(
            "[&_.Heading_h2]:headline50 [&_.Heading_h2]:font-bold",
            titleGrad && "GradientTitle [&_.Heading_h2]:text-gradient [&_.Heading_h2]:[background-image:var(--title-gradient)]",
            chapoGrad && "GradientChapo [&_.Chapo]:text-gradient [&_.Chapo]:[background-image:var(--chapo-gradient)]",
            text_justify === "center" && "text-center items-center",
            text_justify === "end" && "text-end items-end",
          )}
        />
      </Reveal>
    </section>
  )
}
