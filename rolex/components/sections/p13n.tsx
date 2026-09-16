import type { ReactNode } from "react"
import { RenderBlocks } from "@/components/cms/render-blocks"
import { parseModularBlock } from "@/lib/cms/parse"
import type { CmsBlock } from "@/lib/cms/types"

type Props = {
  className?: string
  variations?: unknown
  components?: unknown
  children?: ReactNode
}

/**
 * Personalisation wrapper — if variations/components contain modular blocks, render them;
 * otherwise render children or null (SG locale has no alternate content in the capture).
 */
export function P13n({ className, variations, components, children }: Props) {
  const fromVariations = Array.isArray(variations)
    ? variations.flatMap((v) => {
        if (!v || typeof v !== "object") return [] as CmsBlock[]
        const entry = v as { components?: unknown; reference?: CmsBlock[] }
        if (entry.components) return parseModularBlock(entry.components)
        if (entry.reference) return entry.reference
        return []
      })
    : []
  const fromComponents = parseModularBlock(components)
  const blocks = [...fromVariations, ...fromComponents]

  if (blocks.length) {
    return (
      <div className={className}>
        <RenderBlocks blocks={blocks} />
      </div>
    )
  }

  if (children) return <div className={className}>{children}</div>
  return null
}
