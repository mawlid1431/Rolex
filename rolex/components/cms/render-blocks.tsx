import { cmsRegistry } from "@/components/cms/registry"
import { blockClassName, contentTypeToExportName } from "@/lib/cms/parse"
import type { CmsBlock } from "@/lib/cms/types"

function Missing({ type }: { type: string }) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="grid min-h-[20vh] place-items-center bg-red-500/20 text-sm" data-missing-cms={type}>
        Missing CMS component: {type}
      </div>
    )
  }
  return null
}

/** Map flattened CMS blocks through the registry. */
export function RenderBlocks({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const exportName = contentTypeToExportName(block._content_type_uid ?? "undefined")
        const Component = cmsRegistry[exportName]
        const className = blockClassName(block, exportName)
        const { _content_type_uid, className: _ignoredClassName, ...props } = block
        void _content_type_uid
        void _ignoredClassName
        const key = String(block.uid ?? `${exportName}-${index}`)

        if (!Component) {
          return <Missing key={key} type={exportName} />
        }

        return <Component key={key} {...props} className={className} />
      })}
    </>
  )
}
