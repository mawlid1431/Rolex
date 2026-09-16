"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Icon } from "@/components/icons/icon"
import { useCart } from "@/lib/cart"
import { useFavourites } from "@/lib/favourites"
import { localPath, resolveHref, ROUTES } from "@/lib/site"
import { cn } from "@/lib/utils"
import { useNav } from "./nav-context"

const toolClass =
  "pointer-events-auto relative flex items-center gap-[0.5em] px-2 py-[0.8rem] legend100 font-normal text-light-black transition-colors duration-300 hover:text-green [&_svg]:size-[1.125rem] m:[&_svg]:size-[1.15rem]"

function Burger({ open }: { open: boolean }) {
  const transition = { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const }
  return (
    <span aria-hidden="true" className="relative block h-3 w-[1.25rem] m:w-4">
      <motion.span
        className="absolute inset-x-0 top-[2px] block h-[2px] origin-center rounded-full bg-current"
        animate={open ? { top: 5, rotate: 45 } : { top: 2, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className="absolute inset-x-0 top-[8px] block h-[2px] origin-center rounded-full bg-current"
        animate={open ? { top: 5, rotate: -45 } : { top: 8, rotate: 0 }}
        transition={transition}
      />
    </span>
  )
}

function HomeLogoLink({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { close } = useNav()

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    close()
    const onHome = pathname === "/" || pathname === "/en-sg"
    if (onHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      if (window.location.hash) {
        router.replace("/", { scroll: false })
      }
      return
    }
    sessionStorage.setItem("rlx-home-scroll-top", "1")
  }

  return (
    <Link href="/" aria-label="Go to home page" className={className} onClick={goHome}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/header-crown.svg"
        alt=""
        width={40}
        height={43}
        className="h-9 w-[33px] m:h-[43px] m:w-10"
      />
    </Link>
  )
}

/** Sticky top bar: menu toggle, crown, search / store locator / favourites. */
export function MainBar() {
  const nav = useNav()
  const { list } = useFavourites()
  const { count: cartCount } = useCart()
  const anyOpen = nav.pane !== null && nav.pane !== "sub"
  const menuOpen = nav.pane === "menu" || nav.pane === "languages"
  const storeLocator = resolveHref("/store-locator")

  return (
    <header
      data-main-bar
      className={cn(
        "nav-main-bar sticky top-0 z-[9995] grid h-[var(--nav-main-bar-height)] w-full bg-white text-light-black transition-transform duration-300 ease-out",
        "*:col-start-1 *:row-start-1",
        !nav.pinned && !anyOpen && "-translate-y-full",
      )}
    >
      <ul className="pointer-events-none flex items-center justify-between px-5 l:px-[7.25rem]">
        <li className="-ms-4 flex items-center">
          <button
            type="button"
            className={cn(toolClass, "gap-[0.466rem] p-4")}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => (menuOpen || nav.pane === "search" ? nav.close() : nav.open("menu"))}
          >
            <Burger open={anyOpen} />
            <span className="max-m:visually-hidden">{anyOpen ? "Close" : "Menu"}</span>
          </button>
        </li>
        <li className="flex items-center">
          <motion.div
            className="flex items-center gap-[0.5rem] m:gap-[1.35rem] xl:gap-[2.4rem]"
            animate={{ opacity: anyOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: anyOpen ? "none" : undefined }}
            aria-hidden={anyOpen}
          >
            <button
              type="button"
              className={toolClass}
              aria-expanded={nav.pane === "search"}
              onClick={() => nav.open("search")}
              tabIndex={anyOpen ? -1 : undefined}
            >
              <Icon type="search" />
              <span className="max-m:visually-hidden">Search</span>
            </button>
            <a
              href={storeLocator.href}
              target="_blank"
              rel="noopener noreferrer"
              className={toolClass}
              tabIndex={anyOpen ? -1 : undefined}
            >
              <Icon type="storelocator" />
              <span className="max-m:visually-hidden">Store locator</span>
            </a>
            <Link
              href={localPath(ROUTES.wishlist)}
              className={cn(toolClass, "m:pe-1")}
              tabIndex={anyOpen ? -1 : undefined}
            >
              <Icon type={list.length ? "heartFull" : "wishlist"} className={cn(list.length && "text-green")} />
              <span className="visually-hidden">Favourites</span>
              {list.length > 0 && (
                <span className="absolute end-0 top-[0.35rem] min-w-3.5 rounded-full bg-green px-1 text-center text-[0.625rem] leading-[0.875rem] font-bold text-white">
                  {list.length}
                </span>
              )}
            </Link>
            <Link href={localPath(ROUTES.cart)} className={cn(toolClass, "m:pe-1")} tabIndex={anyOpen ? -1 : undefined}>
              <span aria-hidden className="relative block size-[1.125rem] m:size-[1.15rem]">
                <svg viewBox="0 0 24 24" className="size-full fill-none stroke-current" strokeWidth="1.6">
                  <path d="M6 7h12l-1 12H7L6 7Z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </span>
              <span className="visually-hidden">Cart</span>
              {cartCount > 0 && (
                <span className="absolute end-0 top-[0.35rem] min-w-3.5 rounded-full bg-green px-1 text-center text-[0.625rem] leading-[0.875rem] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>
        </li>
      </ul>
      <div className="pointer-events-none flex items-center justify-center">
        <HomeLogoLink className="pointer-events-auto flex items-center justify-center p-2 transition-opacity" />
      </div>
    </header>
  )
}
