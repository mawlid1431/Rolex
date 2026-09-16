"use client"

import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { useFavourites } from "@/lib/favourites"
import type { CmsLinkData, HeadingData, ImageCld } from "@/lib/cms/types"
import { localPath, ROUTES } from "@/lib/site"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  paragraph?: { text?: string }
  paragraph_empty_state?: { text?: string }
  watches_label?: string
  accessories_label?: string
  share_label?: string
  cta?: CmsLinkData
  cta_label?: string
  cover?: { image_cld?: ImageCld }[] | ImageCld
  modal?: unknown
  ymal?: unknown
}

export function Wishlist({
  className,
  paragraph,
  paragraph_empty_state,
  watches_label = "Watches",
  cta,
  cta_label,
  cover,
}: Props) {
  const { list, remove } = useFavourites()
  const empty = list.length === 0
  const coverImage = Array.isArray(cover) ? cover[0]?.image_cld : cover

  return (
    <section className={cn("wishlist full-grid pb-[var(--m-h-space)]", className)}>
      <div className="col-[main] m:col-[col_3/span_8]">
        {empty ? (
          <div className="text-center">
            {coverImage?.media && (
              <Picture
                media={coverImage.media}
                alt={coverImage.alt ?? ""}
                className="mx-auto mb-8 block max-w-md"
                imgClassName="w-full"
              />
            )}
            {paragraph_empty_state?.text && (
              <Html as="p" html={paragraph_empty_state.text} className="body100 font-light" />
            )}
            {(cta || cta_label) && (
              <CmsLink
                href={cta?.href ?? localPath(ROUTES.padellone)}
                external={cta?.external}
                label={cta?.label ?? cta_label ?? "Discover the collection"}
                ariaLabel={cta?.aria_label}
                style={cta?.style ?? "filled opaque-green"}
                className="mt-6"
              />
            )}
          </div>
        ) : (
          <div>
            {paragraph?.text && <Html as="p" html={paragraph.text} className="body100 mb-8 font-light" />}
            <h2 className="headline70 mb-4 font-bold">{watches_label}</h2>
            <ul className="grid gap-4">
              {list.map((rmc) => (
                <li key={rmc} className="flex items-center justify-between border-b border-grey py-4">
                  <span className="body100 font-bold">{rmc}</span>
                  <button type="button" className="btn btn-text btn-green legend100" onClick={() => remove(rmc)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/** You-may-also-like placeholder when present as a top-level / nested type. */
export function Ymal({ className, heading }: { className?: string; heading?: HeadingData }) {
  if (!heading?.title) return null
  return (
    <aside className={cn("ymal full-grid py-[var(--s-h-space)] text-center", className)}>
      <Html as="h2" html={heading.title} className="headline70 col-[main]" />
    </aside>
  )
}
