import Link from "next/link"
import { HeroMediaOverlay } from "@/components/sections/hero-media-overlay"
import { WatchScrollHero } from "@/components/sections/watch-scroll-hero"
import { localPath, ROUTES, resolveHref } from "@/lib/site"
import { WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

const ROLLER = [
  {
    id: "new-watches",
    href: "/watches/new-watches",
    kicker: "Where a new world begins",
    title: "New watches 2026",
    image: "/images/homepage/roller-new-watches-2026.avif",
    imageAlt: "New watches 2026 — Perpetual Padellone",
  },
  {
    id: "sail-gp",
    href: "#sail-gp",
    kicker: "Rolex and yachting",
    title: "Rolex Switzerland Sail Grand Prix Geneva",
    image: "/images/homepage/roller-sailgp-geneva.avif",
    imageAlt: "Rolex Switzerland Sail Grand Prix Geneva",
  },
  {
    id: "tom-slingsby",
    href: "#tom-slingsby",
    kicker: "The Rolex family",
    title: "Tom Slingsby",
    image: "/images/homepage/roller-tom-slingsby.avif",
    imageAlt: "Tom Slingsby",
  },
] as const

const FEATURED_WATCHES = WATCH_COLLECTIONS.filter((w) =>
  ["submariner", "cosmograph-daytona", "gmt-master-ii", "datejust", "yacht-master-ii", "day-date"].includes(
    w.slug,
  ),
)

const SCROLL_CHAPTERS = ["submariner", "cosmograph-daytona", "gmt-master-ii"]
  .map((slug) => WATCH_COLLECTIONS.find((w) => w.slug === slug)!)
  .filter(Boolean)

/**
 * Rolex.com homepage: sticky hero film scrubbed by scroll + featured roller + more scroll chapters.
 */
export function HomePage() {
  const padellone = resolveHref(ROUTES.padellone)

  return (
    <main id="main">
      <HeroMediaOverlay
        kicker="WHEN TIMES ALIGN"
        title="The new Perpetual Padellone"
        ctaLabel="Discover more"
        ctaHref={ROUTES.padellone}
        videoSrc="/videos/rolex-new-watches-2026-padellone-m53505-0003-film.mp4"
        videoPortraitSrc="/videos/rolex-new-watches-2026-padellone-m53505-0003-film-portrait.mp4"
        posterSrc="/images/homepage/film-posterframe.avif"
        posterPortraitSrc="/images/homepage/film-posterframe-portrait.avif"
        items={[...ROLLER]}
      />

      <section
        id="welcome-back"
        className="full-grid bg-white px-[var(--outer-margin)] py-[clamp(3rem,8vw,6rem)]"
      >
        <div className="col-[main] m:col-[col_2/span_10] grid gap-8 m:grid-cols-2 m:items-center">
          <div>
            <p className="surtitle70 mb-3 text-dark-grey">Resume your visit</p>
            <h2 className="headline50 mb-4">Welcome back</h2>
            <p className="body100 mb-6 max-w-md font-light text-dark-grey">
              Continue exploring the collection, or discover the new Perpetual Padellone.
            </p>
            <Link
              href={padellone.href}
              className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm"
            >
              Continue
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/homepage/welcome-back-push.avif"
            alt=""
            className="w-full max-w-xl justify-self-center object-cover"
          />
        </div>
      </section>

      <section className="full-grid border-t border-black/5 bg-[rgb(var(--light-beige))] px-[var(--outer-margin)] py-[clamp(2.5rem,6vw,4.5rem)]">
        <div className="col-[main] grid gap-10 m:grid-cols-3">
          {ROLLER.map((item) => (
            <article key={item.id} id={item.id} className="scroll-mt-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.imageAlt}
                className="mb-4 aspect-[4/5] w-full object-cover m:aspect-[3/4]"
              />
              <p className="surtitle70 mb-1 uppercase text-dark-grey">{item.kicker}</p>
              <h2 className="headline50 mb-3">{item.title}</h2>
              <Link
                href={
                  item.id === "new-watches"
                    ? localPath(ROUTES.padellone)
                    : resolveHref(
                        item.id === "sail-gp"
                          ? "/rolex-event/yachting/rolex-switzerland-sail-grand-prix-geneva"
                          : "/rolex-family/yachting/tom-slingsby",
                      ).href
                }
                className="legend100 inline-flex items-center gap-1 text-green underline-offset-4 hover:underline"
              >
                Discover more
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Scroll chapters after hero + cards — same expand language as each watch page */}
      {SCROLL_CHAPTERS.map((watch, index) => (
        <div key={watch.slug}>
          {index === 1 && (
            <section
              id="collection"
              className="full-grid scroll-mt-24 bg-white px-[var(--outer-margin)] py-[clamp(3rem,8vw,5rem)]"
            >
              <div className="col-[main]">
                <p className="surtitle70 mb-3 text-green">Rolex watches</p>
                <h2 className="headline50 mb-3">Explore the collection</h2>
                <p className="body100 mb-10 max-w-2xl font-light text-dark-grey">
                  Each model opens with the same scroll animation. Choose a watch, scroll the story, then add it to
                  your cart.
                </p>
                <ul className="grid gap-8 s:grid-cols-2 m:grid-cols-3">
                  {FEATURED_WATCHES.map((item) => (
                    <li key={item.slug} id={`watch-${item.slug}`} className="scroll-mt-28">
                      <Link href={localPath(watchPath(item.slug))} className="group block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          className="mb-3 aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <p className="surtitle70 mb-1 text-dark-grey">{item.kicker}</p>
                        <h3 className="headline50 mb-2 text-[1.35rem]">{item.name}</h3>
                        <span className="legend100 text-green underline-offset-4 group-hover:underline">
                          Discover more
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
          <WatchScrollHero
            kicker={watch.kicker}
            title={watch.name}
            subtitle={watch.tagline}
            image={watch.image}
            portraitImage={watch.portraitImage}
            videoSrc={watch.videoSrc}
            videoPortraitSrc={watch.videoPortraitSrc}
            posterSrc={watch.posterSrc}
            ctaLabel={`Discover the ${watch.name}`}
            ctaHref={watchPath(watch.slug)}
          />
        </div>
      ))}

      <section
        id="watchmaking"
        className="full-grid scroll-mt-24 border-t border-black/5 bg-[rgb(var(--light-beige))] px-[var(--outer-margin)] py-[clamp(3rem,8vw,5rem)]"
      >
        <div className="col-[main] m:col-[col_2/span_10] grid gap-8 m:grid-cols-2 m:items-center">
          <div>
            <p className="surtitle70 mb-3 text-dark-grey">Excellence in the making</p>
            <h2 className="headline50 mb-4">Watchmaking</h2>
            <p className="body100 mb-6 max-w-md font-light text-dark-grey">
              From design to assembly, every Rolex watch is the result of unmatched expertise.
            </p>
            <Link
              href={localPath(ROUTES.watchmaking)}
              className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm"
            >
              Discover more
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/homepage/welcome-back-push.avif"
            alt=""
            className="w-full max-w-xl justify-self-center object-cover"
          />
        </div>
      </section>

      <section
        id="get-in-touch"
        className="full-grid scroll-mt-24 bg-[rgb(var(--light-black))] px-[var(--outer-margin)] py-[clamp(3rem,8vw,5rem)] text-white"
      >
        <div className="col-[main] m:col-[col_3/span_8] text-center m:text-start">
          <p className="surtitle70 mb-3 opacity-80">Official Rolex Retailers</p>
          <h2 className="headline50 mb-4">Get in touch</h2>
          <p className="body100 mb-8 max-w-xl font-light opacity-90">
            Ready to continue? Contact an Official Rolex Retailer about a watch from your cart.
          </p>
          <div className="flex flex-wrap justify-center gap-3 m:justify-start">
            <Link
              href={localPath(ROUTES.getInTouch)}
              className="btn btn-filled inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm text-black"
            >
              Get in touch
            </Link>
            <Link
              href={localPath(ROUTES.cart)}
              className="btn inline-flex min-h-11 items-center rounded-full border border-white/50 px-6 text-sm"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
