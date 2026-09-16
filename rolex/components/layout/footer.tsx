import Link from "next/link"
import footer from "@/lib/data/footer.json"
import type { Media } from "@/lib/media"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Picture } from "@/components/media/picture"
import { FooterA11yLink, FooterControlPanel, FooterVisibility } from "./footer-client"
import { WATCH_COLLECTIONS, watchPath } from "@/lib/watches"

export type BreadcrumbItem = { title: string; href: string }

type FooterLink = { label: string; href?: string; starts_new_group?: boolean }
type Category = { label: string; href?: string; is_primary?: boolean; links?: FooterLink[] }

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const all = [{ title: "Home", href: "/" }, ...items]
  return (
    <nav aria-label="Breadcrumbs" className="relative z-[1] bg-white px-[var(--outer-margin)] pb-[1.125rem]">
      <ol className="flex flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        {all.map((item, index) => {
          const current = index === all.length - 1
          const target = resolveHref(item.href)
          return (
            <li key={item.href + index} className="legend80" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {current ? (
                <span aria-current="page" itemProp="name" className="text-green">
                  {item.title}
                </span>
              ) : (
                <>
                  <a
                    href={index === 0 ? "/" : target.href}
                    itemProp="item"
                    className="inline-flex text-inherit no-underline transition-colors duration-300 hover:text-green"
                    {...(index === 0 ? { rel: "home" } : {})}
                  >
                    <span itemProp="name">{item.title}</span>
                  </a>
                  <span aria-hidden="true" className="mx-1 text-[0.75em] font-normal">
                    {" / "}
                  </span>
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

const linkClass = "inline-flex items-baseline gap-2 text-light-black no-underline transition-colors duration-300 hover:text-green"

function FooterAnchor({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const target = resolveHref(href)
  if (target.href === "#") {
    return <span className={className}>{children}</span>
  }
  return (
    <a href={target.href} className={className}>
      {children}
    </a>
  )
}

function CategoryItem({ category, id }: { category: Category; id: string }) {
  const headingClass = cn(
    "block font-bold",
    category.is_primary
      ? "text-[clamp(1.125rem,0.875rem+0.625vw,1.625rem)] leading-[1.05]"
      : "text-[var(--baseline-font-size)]",
  )
  return (
    <li className="footer-category break-inside-avoid">
      {category.href ? (
        <FooterAnchor href={category.href} className={cn(headingClass, "text-inherit")}>
          {category.label}
        </FooterAnchor>
      ) : (
        <span id={id} className={headingClass}>
          {category.label}
        </span>
      )}
      <ul aria-labelledby={id}>
        {(category.links ?? []).map((link) => (
          <li
            key={link.label}
            className={cn("text-[var(--baseline-font-size)] font-normal", link.starts_new_group && "mt-[var(--baseline)]")}
          >
            <FooterAnchor href={link.href ?? "#"} className={linkClass}>
              {link.label}
            </FooterAnchor>
          </li>
        ))}
      </ul>
    </li>
  )
}

function A11yCategory() {
  const a11y = footer.accessibility
  return (
    <li className="footer-category break-inside-avoid">
      <span id="footer-a11y" className="block text-[var(--baseline-font-size)] font-bold">
        {a11y.label}
      </span>
      <ul aria-labelledby="footer-a11y">
        <li className="text-[var(--baseline-font-size)] font-normal">
          <FooterA11yLink
            label={a11y.links[0].label}
            heading={a11y.modal.heading}
            text={a11y.modal.text}
            className={linkClass}
          />
        </li>
      </ul>
    </li>
  )
}

type Push = {
  heading: { title: string; subtitle: string }
  link: { external: string; aria_label: string }
  poster: { image_cld: { alt: string; media: Media } }[]
}

function Underfooter() {
  const push = (footer.push[0].reference as Push[])[0]
  const image = push.poster[0].image_cld
  const target = resolveHref(push.link.external)
  return (
    <div className="relative h-[calc(900/780*100vw)] w-full [clip-path:inset(0)] m:h-[calc(675/2880*100vw)]">
      <div className="fixed inset-x-0 bottom-0 h-[calc(900/780*100vw)] w-screen m:h-[calc(675/2880*100vw)]">
        <aside aria-label={push.heading.title} className="dark-theme relative grid size-full place-items-center">
          <figure className="col-start-1 row-start-1 size-full">
            <Picture media={image.media} alt={image.alt} className="size-full" imgClassName="size-full object-cover" />
          </figure>
          <div className="full-grid col-start-1 row-start-1 text-center">
            <div className="col-[main]">
              <p className="headline50 mb-2.5">{push.heading.title}</p>
              {target.href === "#" ? (
                <span className="btn btn-text text-white [&_svg]:size-3 s:[&_svg]:size-3.5">
                  {push.heading.subtitle}
                </span>
              ) : (
                <a
                  href={target.href}
                  aria-label={push.link.aria_label}
                  className="btn btn-text text-white hover:[--text:rgb(var(--grey))] [&_svg]:size-3 s:[&_svg]:size-3.5"
                >
                  {push.heading.subtitle}
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function slimFooterCategories(): Category[] {
  return [
    {
      label: "Rolex watches",
      href: watchPath("submariner"),
      is_primary: true,
      links: WATCH_COLLECTIONS.map((w) => ({
        label: w.name,
        href: watchPath(w.slug),
      })),
    },
    {
      label: "Contact",
      is_primary: true,
      links: [
        { label: "Get in touch", href: "/get-in-touch" },
        { label: "Your cart", href: "/cart" },
        { label: "Wishlist", href: "/wishlist" },
      ],
    },
  ]
}

export function Footer({ breadcrumb }: { breadcrumb: BreadcrumbItem[] }) {
  const categories = slimFooterCategories()
  return (
    <footer role="contentinfo" id="footer" className="w-full">
      <section className="flex justify-center pt-10 pb-[3.75rem] m:pb-10">
        <Link href="/" aria-label="Go to home page" className="inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/footer-crown.svg" alt="" aria-hidden="true" className="h-[50px] w-auto m:h-[77px]" />
        </Link>
      </section>
      <Breadcrumbs items={breadcrumb} />
      <FooterVisibility className="relative z-[1] bg-light-grey">
        <div className="full-grid pt-10 pb-6 m:pt-[3.75rem] m:pb-11">
          <nav aria-label="Footer navigation" className="contents">
            <ul className="footer-sections col-[main] columns-2 gap-x-[var(--grid-gap)] m:columns-2 xl:col-[col_3/span_9]">
              {categories.map((category, index) => (
                <CategoryItem key={category.label} category={category} id={`footer-cat-${index}`} />
              ))}
              <A11yCategory />
            </ul>
          </nav>
        </div>
        <div role="separator" className="mx-[var(--outer-margin)] h-px bg-grey" />
        <FooterControlPanel />
      </FooterVisibility>
      <Underfooter />
      <Link href="#main" className="sr-only">
        Back to top
      </Link>
    </footer>
  )
}
