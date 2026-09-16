"use client"

import { Picture } from "@/components/media/picture"
import { Html } from "@/components/cms/text-blocks"
import { CmsLink } from "@/components/ui/cms-link"
import { Icon } from "@/components/icons/icon"
import model from "@/lib/data/model-m126688-0001.json"
import { useFavourites } from "@/lib/favourites"
import { useCart } from "@/lib/cart"
import type { Media } from "@/lib/media"
import { cn } from "@/lib/utils"
import { localPath, ROUTES } from "@/lib/site"
import Link from "next/link"

type Props = {
  className?: string
  brochure?: unknown
  dictionary?: unknown
  ymal?: unknown
}

type SpecBlock = {
  labels?: { title?: string; details?: string }
  specs?: Record<string, string>
}

type ModelData = {
  name?: string
  nameCode?: string
  rmc?: string
  reference_code?: string
  collection?: string
  dial?: string | SpecBlock
  case?: string | SpecBlock
  bracelet?: string | SpecBlock
  movement?: string | SpecBlock
  alt?: string
}

const COVER: Media = {
  id: "m126688-0001",
  src: "/images/m126688-0001.avif",
  portraitSrc: "/images/m126688-0001.avif",
  width: 1200,
  height: 1600,
}

function specText(value: string | SpecBlock | undefined): string | undefined {
  if (!value) return undefined
  if (typeof value === "string") return value
  return value.labels?.title ?? value.labels?.details ?? value.specs?.material
}

/**
 * Yacht-Master II model page shell — hero + key specs from `model-m126688-0001.json`.
 * Cover uses the captured catalogue still (editorial Cloudinary IDs are unresolved here).
 */
export function Model({ className }: Props) {
  const data = model as unknown as ModelData
  const rmc = data.rmc ?? "m126688-0001"
  const { has, toggle } = useFavourites()
  const { has: inCart, toggle: toggleCart } = useCart()
  const saved = has(rmc)
  const savedCart = inCart(rmc)

  const specs = [
    { label: "Reference", value: data.reference_code ?? data.rmc },
    { label: "Model", value: data.nameCode ?? data.name },
    { label: "Collection", value: data.collection },
    { label: "Dial", value: specText(data.dial) },
    { label: "Case", value: specText(data.case) },
    { label: "Bracelet", value: specText(data.bracelet) },
    { label: "Movement", value: specText(data.movement) },
  ].filter((s) => s.value)

  return (
    <section className={cn("model", className)}>
      <div className="relative full-grid min-h-[70vh] bg-light-grey">
        <div className="relative z-[1] col-[main] flex flex-col justify-end gap-3 py-[var(--m-h-space)] m:col-[col_2/span_5]">
          {data.collection && <p className="surtitle70 text-green">{data.collection}</p>}
          <h1 className="headline50 font-bold">{data.nameCode ?? data.name ?? "Yacht-Master II"}</h1>
          <p className="legend100 text-dark-grey">{rmc}</p>
          <button
            type="button"
            className="btn btn-filled btn-green mt-2 self-start"
            aria-pressed={savedCart}
            onClick={() => toggleCart(rmc)}
          >
            {savedCart ? "In cart" : "Add to cart"}
          </button>
          <button
            type="button"
            className="btn btn-text btn-green mt-2 self-start"
            aria-pressed={saved}
            onClick={() => toggle(rmc)}
          >
            <Icon type={saved ? "heartFull" : "heart"} />
            {saved ? "In wishlist" : "Add to wishlist"}
          </button>
          <Link href={localPath(ROUTES.cart)} className="legend100 mt-2 text-green underline-offset-4 hover:underline">
            View cart
          </Link>
        </div>
        <figure className="col-[main] row-start-1 m:col-[col_7/span_6] m:row-[1/-1]">
          <Picture media={COVER} alt={data.alt ?? data.nameCode ?? ""} priority className="block w-full" imgClassName="w-full object-contain" />
        </figure>
      </div>
      <div className="full-grid py-[var(--m-h-space)]">
        <dl className="col-[main] grid gap-6 m:col-[col_3/span_8] m:grid-cols-2">
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt className="surtitle70 text-dark-grey">{spec.label}</dt>
              <dd className="body100 mt-1 font-light">
                <Html html={String(spec.value)} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="col-[main] mt-10 m:col-[col_3/span_8]">
          <CmsLink href="/watches/yacht-master" label="Discover Yacht-Master" style="inline green" />
        </div>
      </div>
    </section>
  )
}
