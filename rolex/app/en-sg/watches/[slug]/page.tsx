import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WatchCollectionPage } from "@/components/pages/watch-collection-page"
import { getWatch, WATCH_COLLECTIONS } from "@/lib/watches"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return WATCH_COLLECTIONS.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const watch = getWatch(slug)
  if (!watch) return { title: "Watch" }
  return {
    title: `${watch.name} | Rolex`,
    description: watch.description,
  }
}

export default async function WatchCollectionRoute({ params }: Props) {
  const { slug } = await params
  const watch = getWatch(slug)
  if (!watch) notFound()
  return <WatchCollectionPage watch={watch} />
}
