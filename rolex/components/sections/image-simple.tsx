import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import type { ImageCld } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  image_cld?: ImageCld
  fig_caption?: { text?: string }
  width?: string
  popin_button?: unknown
}

const WIDTH: Record<string, string> = {
  xl: "col-[doc]",
  l: "col-[main]",
  m: "col-[main] m:col-[col_2/span_10]",
  s: "col-[main] m:col-[col_4/span_6]",
  xs: "col-[main] m:col-[col_5/span_4]",
}

export function ImageSimple({ className, image_cld, fig_caption, width = "l" }: Props) {
  if (!image_cld?.media) return null
  return (
    <figure className={cn("image-simple full-grid", className)}>
      <div className={cn(WIDTH[width] ?? WIDTH.l)}>
        <Picture media={image_cld.media} alt={image_cld.alt ?? ""} className="block w-full" imgClassName="w-full" />
        {fig_caption?.text && <Html as="figcaption" html={fig_caption.text} className="legend100 mt-3 text-dark-grey" />}
      </div>
    </figure>
  )
}
