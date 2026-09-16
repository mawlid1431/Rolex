import type { Metadata } from "next"
import { SubNavigation } from "@/components/navigation/sub-navigation"
import { RenderBlocks } from "@/components/cms/render-blocks"
import { parseModularBlock } from "@/lib/cms/parse"
import type { CmsPageData } from "@/lib/cms/types"
import { toSubNavigation } from "@/lib/sub-navigation"

export function cmsMetadata(page: CmsPageData): Metadata {
  const meta = page.meta
  return {
    title: meta?.title ?? page.title,
    description: meta?.description,
    openGraph: {
      title: meta?.title_og ?? meta?.title ?? page.title,
      description: meta?.description_og ?? meta?.description,
    },
    robots: meta?.noindexing ? { index: false, follow: false } : undefined,
  }
}

export function CmsPage({ page }: { page: CmsPageData }) {
  const blocks = parseModularBlock(page.components)
  const subNav = toSubNavigation(page.sub_navigation as Parameters<typeof toSubNavigation>[0])

  return (
    <>
      {subNav && <SubNavigation data={subNav} />}
      <main id="main">
        <RenderBlocks blocks={blocks} />
      </main>
    </>
  )
}
