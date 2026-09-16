"use client"

import Link from "next/link"
import { WatchScrollHero } from "@/components/sections/watch-scroll-hero"
import { useCart } from "@/lib/cart"
import { useFavourites } from "@/lib/favourites"
import { localPath, ROUTES } from "@/lib/site"
import type { WatchCollection } from "@/lib/watches"
import { WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

type Props = {
  watch: WatchCollection
}

export function WatchCollectionPage({ watch }: Props) {
  const cartId = watch.rmc ?? watch.slug
  const { has: inCart, toggle: toggleCart } = useCart()
  const { has: inWish, toggle: toggleWish } = useFavourites()
  const savedCart = inCart(cartId)
  const savedWish = inWish(cartId)

  const related = WATCH_COLLECTIONS.filter(
    (w) => w.family === watch.family && w.slug !== watch.slug,
  ).slice(0, 3)

  return (
    <>
      <main id="main">
        <WatchScrollHero
          kicker={watch.kicker}
          title={watch.name}
          subtitle={watch.tagline}
          image={watch.image}
          portraitImage={watch.portraitImage}
          videoSrc={watch.videoSrc}
          videoPortraitSrc={watch.videoPortraitSrc}
          posterSrc={watch.posterSrc}
          ctaLabel="Explore details"
          ctaHref="#details"
          secondaryLabel={savedCart ? "In cart" : "Add to cart"}
          secondaryPressed={savedCart}
          onSecondaryClick={() => toggleCart(cartId)}
        />

        <section id="details" className="full-grid scroll-mt-24 bg-white px-[var(--outer-margin)] py-[clamp(3rem,8vw,5rem)]">
          <div className="col-[main] m:col-[col_3/span_8]">
            <p className="surtitle70 mb-3 text-green">{watch.kicker}</p>
            <h2 className="headline50 mb-4">{watch.name}</h2>
            <p className="body100 mb-8 max-w-2xl font-light text-dark-grey">{watch.description}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm"
                aria-pressed={savedCart}
                onClick={() => toggleCart(cartId)}
              >
                {savedCart ? "In cart" : "Add to cart"}
              </button>
              <button
                type="button"
                className="btn inline-flex min-h-11 items-center rounded-full border border-black/15 px-6 text-sm"
                aria-pressed={savedWish}
                onClick={() => toggleWish(cartId)}
              >
                {savedWish ? "In wishlist" : "Add to wishlist"}
              </button>
              <Link
                href={localPath(ROUTES.cart)}
                className="btn inline-flex min-h-11 items-center px-4 text-sm text-green underline-offset-4 hover:underline"
              >
                View cart
              </Link>
              <Link
                href={localPath(ROUTES.getInTouch)}
                className="btn inline-flex min-h-11 items-center px-4 text-sm text-green underline-offset-4 hover:underline"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="full-grid border-t border-black/5 bg-[rgb(var(--light-beige))] px-[var(--outer-margin)] py-[clamp(2.5rem,6vw,4rem)]">
            <div className="col-[main]">
              <h2 className="headline50 mb-8">You may also like</h2>
              <ul className="grid gap-8 s:grid-cols-2 m:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={localPath(watchPath(item.slug))} className="group block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt=""
                        className="mb-3 aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <p className="surtitle70 mb-1 text-dark-grey">{item.kicker}</p>
                      <h3 className="headline50 text-[1.25rem]">{item.name}</h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
