import type { ReactNode } from "react"
import { RenderBlocks } from "@/components/cms/render-blocks"
import { parseModularBlock } from "@/lib/cms/parse"
import { cn } from "@/lib/utils"

/** Safe no-op / passthrough for nested types we don't fully port. */
function Passthrough({
  className,
  components,
  children,
  label,
}: {
  className?: string
  components?: unknown
  children?: ReactNode
  label?: string
}) {
  const blocks = parseModularBlock(components)
  if (blocks.length) {
    return (
      <div className={cn(className)} data-cms-passthrough={label}>
        <RenderBlocks blocks={blocks} />
      </div>
    )
  }
  if (children) return <div className={className}>{children}</div>
  return null
}

export function PopinEdito(props: { className?: string; components?: unknown; children?: ReactNode }) {
  return <Passthrough {...props} label="PopinEdito" />
}

export function InertCard(props: { className?: string; children?: ReactNode }) {
  return props.children ? <div className={props.className}>{props.children}</div> : null
}

export function CardLinkRftc(props: { className?: string; children?: ReactNode }) {
  return props.children ? <div className={props.className}>{props.children}</div> : null
}

export function NavigationBento() {
  return null
}

export function NavigationSub() {
  return null
}
