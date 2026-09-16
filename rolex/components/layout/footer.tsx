import Link from "next/link"
import footer from "@/lib/data/footer.json"
import { localPath } from "@/lib/site"
import { watchPath } from "@/lib/watches"
import { FooterA11yLink, FooterBackToTop, FooterControlPanel, FooterLink, FooterVisibility } from "./footer-client"

const COLUMNS = [
  {
    id: "footer-watches",
    title: "Watches",
    links: [
      ["Submariner", localPath(watchPath("submariner"))],
      ["Cosmograph Daytona", localPath(watchPath("cosmograph-daytona"))],
      ["Datejust", localPath(watchPath("datejust"))],
      ["GMT-Master II", localPath(watchPath("gmt-master-ii"))],
    ],
  },
  {
    id: "footer-explore",
    title: "Explore",
    links: [
      ["New watches 2026", localPath(watchPath("new-watches"))],
      ["Your wishlist", localPath("/wishlist")],
      ["Your cart", localPath("/cart")],
    ],
  },
  {
    id: "footer-support",
    title: "Support",
    links: [["Get in touch", localPath("/get-in-touch")]],
  },
] as const

/** One persistent liquid-glass footer, rendered by the root layout on every route. */
export function Footer() {
  return (
    <footer id="footer" className="relative">
      <FooterVisibility className="footer-glass-shell footer-reveal w-full pt-px">
        <div className="footer-glass-panel px-[var(--outer-margin)] pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] m:pt-14 m:pb-8"><div className="mx-auto flex max-w-[1600px] flex-col gap-8">
          <div className="flex flex-col gap-9 l:flex-row l:justify-between l:gap-12">
            <div className="flex max-w-[22rem] flex-col gap-6 px-1 m:px-0">
              <Link href="/" aria-label="Go to home page" className="flex w-fit items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/footer-crown.svg" alt="" width={48} height={54} className="h-9 w-auto" />
              </Link>
              <p className="text-sm leading-relaxed text-[rgba(20,20,25,0.55)]">
                Prestigious, high-precision timepieces, crafted with care for those who love detail.
              </p>
              <Link href={localPath("/get-in-touch")} className="footer-glass-cta group relative inline-flex h-10 w-fit items-center overflow-hidden rounded-full px-5 text-sm font-semibold tracking-[0.01em] text-white">
                <span aria-hidden="true" className="footer-glass-shine" />
                <span className="relative">Get in touch</span>
              </Link>
            </div>

            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-2 gap-y-6 s:grid-cols-3 l:flex l:gap-12">
              {COLUMNS.map(column => (
                <div key={column.id} className="flex flex-col gap-1">
                  <h2 id={column.id} className="px-3 pb-2 text-xs leading-none font-semibold tracking-[0.08em] text-[rgba(20,20,25,0.4)] uppercase">
                    {column.title}
                  </h2>
                  <ul aria-labelledby={column.id} className="flex flex-col gap-1">
                    {column.links.map(([label, href]) => (
                      <li key={href}>
                        <FooterLink href={href}>{label}</FooterLink>
                      </li>
                    ))}
                    {column.id === "footer-support" && (
                      <li>
                        <FooterA11yLink label={footer.accessibility.links[0].label} heading={footer.accessibility.modal.heading} text={footer.accessibility.modal.text} />
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-black/15 to-transparent" />

          <div className="flex flex-col gap-4 px-1 m:flex-row m:items-center m:justify-between m:px-0">
            <p className="text-[13px] text-[rgba(20,20,25,0.45)]">© Rolex 2026 · Singapore</p>
            <div className="flex flex-wrap items-center gap-2">
              <FooterControlPanel />
              <FooterBackToTop />
            </div>
          </div>
        </div>
        </div>
      </FooterVisibility>
    </footer>
  )
}
