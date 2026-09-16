import type { Metadata } from "next"
import { CmsPage, cmsMetadata } from "@/components/cms/cms-page"
import page from "@/lib/data/pages/sustainable-development.json"
import type { CmsPageData } from "@/lib/cms/types"

const data = page as CmsPageData

export const metadata: Metadata = cmsMetadata(data)

export default function SustainableDevelopmentPage() {
  return <CmsPage page={data} />
}
