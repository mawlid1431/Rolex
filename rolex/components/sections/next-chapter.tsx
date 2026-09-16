import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import type { CmsLinkData } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  label?: string
  jump_line?: string
  link?: CmsLinkData
}

export function NextChapter({ className, label, jump_line, link }: Props) {
  return (
    <aside className={cn("next-chapter full-grid justify-items-center bg-white py-[15vh] text-center", className)}>
      {label && (
        <p className="surtitle70 col-[main] m:col-[col_4/span_6] mb-2.5 text-gradient [background-image:linear-gradient(45deg,rgb(var(--gradient-green-from)),rgb(var(--gradient-green-to)))]">
          {label}
        </p>
      )}
      {jump_line && (
        <Html
          as="h2"
          html={jump_line}
          className="headline70 col-[main] m:col-[col_4/span_6] mb-5 text-balance text-gradient [background-image:linear-gradient(45deg,rgb(var(--gradient-green-from)),rgb(var(--gradient-green-to)))]"
        />
      )}
      {link && (
        <CmsLink
          href={link.href}
          external={link.external}
          label={link.label}
          ariaLabel={link.aria_label}
          style={link.style ?? "filled opaque-green"}
          className="col-[main] m:col-[col_4/span_6]"
        />
      )}
    </aside>
  )
}
