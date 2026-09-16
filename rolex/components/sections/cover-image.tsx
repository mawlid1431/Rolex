import { Picture } from "@/components/media/picture"
import { SectionHeading } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import type { CmsLinkData, HeadingData, ImageCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  heading?: HeadingData
  image_cld?: ImageCld
  link?: CmsLinkData
  dark_theme?: boolean
}

export function CoverImage({ className, heading, image_cld, link }: Props) {
  return (
    <section
      className={cn(
        "relative full-grid min-h-[max(400px,calc(100svh-var(--nav-bar-height,3.5rem)))] overflow-hidden",
        className,
      )}
    >
      <div className="relative z-[1] col-[main] row-[1/-1] flex flex-col items-center justify-center gap-6 text-center">
        <SectionHeading heading={heading} />
        {link?.href || link?.external ? (
          <CmsLink href={link.href} external={link.external} label={link.label} ariaLabel={link.aria_label} style={link.style ?? "filled opaque-white"} />
        ) : null}
      </div>
      <figure className="absolute inset-0 col-[doc] row-[1/-1]">
        {image_cld?.media && (
          <Picture media={image_cld.media} alt={image_cld.alt ?? ""} priority className="size-full" imgClassName="size-full object-cover" />
        )}
      </figure>
    </section>
  )
}
