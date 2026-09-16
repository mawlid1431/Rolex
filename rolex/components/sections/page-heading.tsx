import { SectionHeading } from "@/components/cms/text-blocks"
import type { HeadingData } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData | { classic?: HeadingData } | HeadingData[]
}

function normalizeHeading(heading?: Props["heading"]): HeadingData | undefined {
  if (!heading) return undefined
  if (Array.isArray(heading)) {
    const first = heading[0]
    if (!first) return undefined
    if ("classic" in first && first.classic) return first.classic
    return first as HeadingData
  }
  if ("classic" in heading && heading.classic) return heading.classic
  return heading as HeadingData
}

export function PageHeading({ className, heading }: Props) {
  const resolved = normalizeHeading(heading)
  return (
    <header className={cn("page-heading full-grid py-[var(--m-h-space)] text-center", className)}>
      <SectionHeading heading={resolved} className="col-[main]" titleClassName="headline50" />
    </header>
  )
}
