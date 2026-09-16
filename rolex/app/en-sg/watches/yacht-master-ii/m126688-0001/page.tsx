import type { Metadata } from "next"
import { CmsPage, cmsMetadata } from "@/components/cms/cms-page"
import { interpolateModelMeta } from "@/lib/cms/model-meta"
import page from "@/lib/data/pages/yacht-master-ii-m126688-0001.json"
import type { CmsPageData } from "@/lib/cms/types"

const data = page as CmsPageData
const base = cmsMetadata(data)

export const metadata: Metadata = {
  ...base,
  title: interpolateModelMeta(data.meta?.title) ?? base.title,
  description: interpolateModelMeta(data.meta?.description) ?? base.description,
  openGraph: {
    ...base.openGraph,
    title: interpolateModelMeta(data.meta?.title_og ?? data.meta?.title) ?? base.openGraph?.title,
    description:
      interpolateModelMeta(data.meta?.description_og ?? data.meta?.description) ?? base.openGraph?.description,
  },
}

export default function YachtMasterIIPage() {
  return <CmsPage page={data} />
}
