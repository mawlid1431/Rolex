import Link from "next/link"
import footer from "@/lib/data/footer.json"
import type { Media } from "@/lib/media"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Icon, type IconName } from "@/components/icons/icon"
import { Picture } from "@/components/media/picture"
import { FooterA11yLink, FooterControlPanel, FooterVisibility, FooterWeChatLink } from "./footer-client"

export type BreadcrumbItem = { title: string; href: string }

type FooterLink = { label: string; href?: string; external?: string; name?: string; starts_new_group?: boolean; p13n?: unknown[] }
type Category = { label: string; href?: string; is_primary?: boolean; links?: FooterLink[] }

/** Personalised links shown for the Singapore locale. */
const SG_P13N_INCLUDED = new Set(["File a report"])

function visible(link: FooterLink) {
  return !link.p13n?.length || SG_P13N_INCLUDED.has(link.label)
}

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
                    {...(index === 0
                      ? { rel: "home" }
                      : target.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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

function CategoryItem({ category, id }: { category: Category; id: string }) {
  const headingClass = cn(
    "block font-bold",
    category.is_primary ? "text-[clamp(1.125rem,0.875rem+0.625vw,1.625rem)] leading-[1.05]" : "text-[var(--baseline-font-size)]",
  )
  const target = category.href ? resolveHref(category.href) : null
  return (
    <li className="footer-category">
      {target ? (
        <a
          id={id}
          href={target.href}
          className={cn(headingClass, "text-inherit no-underline transition-colors duration-300 hover:text-green")}
          {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {category.label}
        </a>
      ) : (
        <span id={id} className={headingClass}>
          {category.label}
        </span>
      )}
      <ul aria-labelledby={id}>
        {(category.links ?? []).filter(visible).map((link) => {
          const resolved = resolveHref(link.external ?? link.href)
          const isExternalPlatform = !!link.href?.startsWith("http") || !!link.external
          return (
            <li key={link.label} className={cn("text-[var(--baseline-font-size)] font-normal", link.starts_new_group && "mt-[var(--baseline)]")}>
              <a
                href={resolved.href}
                className={linkClass}
                {...(resolved.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={isExternalPlatform ? `${link.label} - Open in new tab` : undefined}
              >
                {link.label}
                {isExternalPlatform && category.label === "Our platforms" && (
                  <Icon type="externalLink" className="size-3 translate-y-[0.2ex]" />
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </li>
  )
}

const SOCIAL_ICONS: Record<string, IconName> = {
  youtube: "youtube",
  instagram: "instagram",
  threads: "threads",
  facebook: "facebook",
  linkedin: "linkedin",
  x: "x",
  pinterest: "pinterest",
  weibo: "weibo",
  wechat: "wechat",
  douyin: "douyin",
  line: "line",
}

function SocialCategory() {
  const social = footer.social as { label: string; links: FooterLink[] }
  return (
    <li className="footer-category">
      <span id="footer-social" className="block text-[var(--baseline-font-size)] font-bold">
        {social.label}
      </span>
      <ul aria-labelledby="footer-social">
        {social.links.map((link) => {
          const icon = SOCIAL_ICONS[link.label.toLowerCase()]
          const content = (
            <>
              {icon && <Icon type={icon} className="size-3.5 translate-y-[0.2ex]" />}
              {link.name ?? link.label}
            </>
          )
          return (
            <li key={link.label} className="text-[var(--baseline-font-size)] font-normal">
              {link.label === "WeChat" ? (
                <FooterWeChatLink label={link.label} className={linkClass} modal={footer.wechat}>
                  {content}
                </FooterWeChatLink>
              ) : (
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} - Open in new tab`} className={linkClass}>
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </li>
  )
}

function A11yCategory() {
  const a11y = footer.accessibility
  return (
    <li className="footer-category">
      <span id="footer-a11y" className="block text-[var(--baseline-font-size)] font-bold">
        {a11y.label}
      </span>
      <ul aria-labelledby="footer-a11y">
        <li className="text-[var(--baseline-font-size)] font-normal">
          <FooterA11yLink label={a11y.links[0].label} heading={a11y.modal.heading} text={a11y.modal.text} className={linkClass} />
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

/** Underfooter push revealed from behind the page. */
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
                <span
                  aria-label={push.link.aria_label}
                  className="btn btn-text text-white hover:[--text:rgb(var(--grey))] [&_svg]:size-3 s:[&_svg]:size-3.5"
                >
                  {push.heading.subtitle}
                </span>
              ) : (
                <a
                  href={target.href}
                  aria-label={push.link.aria_label}
                  className="btn btn-text text-white hover:[--text:rgb(var(--grey))] [&_svg]:size-3 s:[&_svg]:size-3.5"
                  {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {target.external ? <Icon type="externalLink" /> : null}
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

function withAppLinks(categories: Category[]): Category[] {
  return categories.map((category) => {
    if (category.label !== "Buying and servicing") return category
    const links = [...(category.links ?? [])]
    const hasGetInTouch = links.some((l) => l.href === "/get-in-touch" || l.label === "Get in touch")
    const hasCart = links.some((l) => l.href === "/cart" || l.label === "Your cart")
    if (!hasGetInTouch) {
      links.push({ starts_new_group: true, label: "Get in touch", href: "/get-in-touch" })
    }
    if (!hasCart) {
      links.push({ starts_new_group: false, label: "Your cart", href: "/cart" })
    }
    return { ...category, links }
  })
}

export function Footer({ breadcrumb }: { breadcrumb: BreadcrumbItem[] }) {
  const categories = withAppLinks(footer.categories as Category[])
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
          <nav aria-label={footer.categories_aria_label} className="contents">
            <ul className="footer-sections col-[main] columns-2 gap-x-[var(--grid-gap)] m:columns-3 xl:col-[col_3/span_9]">
              {categories.map((category, index) => (
                <FooterFragment key={category.label} index={index} total={categories.length}>
                  <CategoryItem category={category} id={`footer-cat-${index}`} />
                </FooterFragment>
              ))}
            </ul>
          </nav>
        </div>
        <div role="separator" className="mx-[var(--outer-margin)] h-px bg-grey" />
        <FooterControlPanel />
        <section className="full-grid pt-[1.875rem] pb-[0.9375rem]">
          <ul className="col-[main] flex flex-wrap justify-center gap-2.5">
            {(footer.legal_links as { label: string; href: string }[]).map((link, index, all) => {
              const target = resolveHref(link.href)
              return (
                <li
                  key={link.href}
                  className={cn(
                    "legend100 flex items-center font-normal whitespace-nowrap text-light-black",
                    index < all.length - 1 && "after:ms-2.5 after:content-['-']",
                  )}
                >
                  <a href={target.href} rel="nofollow" target="_blank" className="text-inherit no-underline hover:text-green">
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      </FooterVisibility>
      <Underfooter />
      <Link href="#main" className="sr-only">
        Back to top
      </Link>
    </footer>
  )
}

/** Inserts accessibility before the second-to-last category and social before the last. */
function FooterFragment({ index, total, children }: { index: number; total: number; children: React.ReactNode }) {
  return (
    <>
      {index === total - 2 && <A11yCategory />}
      {index === total - 1 && <SocialCategory />}
      {children}
    </>
  )
}
