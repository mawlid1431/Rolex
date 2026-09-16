"use client"

import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/lib/cart"
import { localPath } from "@/lib/site"
import { getWatch, WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

export function CartPage() {
  const { list, remove, clear } = useCart()
  const items = list
    .map((id) => WATCH_COLLECTIONS.find((w) => w.rmc === id || w.slug === id) ?? getWatch(id))
    .filter(Boolean)

  return (
    <>
      <main id="main" className="full-grid px-[var(--outer-margin)] py-[clamp(3rem,8vw,5rem)]">
        <div className="col-[main] m:col-[col_2/span_10]">
          <h1 className="headline50 mb-2">Your cart</h1>
          <p className="body100 mb-8 font-light text-dark-grey">
            Selected Rolex watches. Contact an Official Rolex Retailer to continue your purchase.
          </p>

          {items.length === 0 ? (
            <div className="rounded-sm border border-black/10 p-8 text-center">
              <p className="body100 mb-4 text-dark-grey">Your cart is empty.</p>
              <Link href={localPath("/watches/submariner")} className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm">
                Explore watches
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {items.map((watch) =>
                  watch ? (
                    <li key={watch.slug} className="flex flex-col gap-4 py-6 s:flex-row s:items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={watch.image} alt="" className="aspect-square w-full max-w-[140px] object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="surtitle70 text-dark-grey">{watch.kicker}</p>
                        <Link href={localPath(watchPath(watch.slug))} className="headline50 text-[1.35rem] hover:underline">
                          {watch.name}
                        </Link>
                        <p className="legend100 mt-1 text-dark-grey">{watch.rmc ?? watch.slug}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={localPath("/get-in-touch")}
                          className="btn btn-filled inline-flex min-h-10 items-center rounded-full px-5 text-sm"
                        >
                          Get in touch
                        </Link>
                        <button
                          type="button"
                          className="btn inline-flex min-h-10 items-center rounded-full border border-black/15 px-5 text-sm"
                          onClick={() => remove(watch.rmc ?? watch.slug)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ) : null,
                )}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={localPath("/get-in-touch")}
                  className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm"
                >
                  Contact a retailer
                </Link>
                <button
                  type="button"
                  className="btn inline-flex min-h-11 items-center px-4 text-sm text-dark-grey underline-offset-4 hover:underline"
                  onClick={() => clear()}
                >
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer breadcrumb={[{ title: "Home", href: "/" }, { title: "Cart", href: "/cart" }]} />
    </>
  )
}
