"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Icon } from "@/components/icons/icon"
import { menuSections, menuShortcuts } from "@/lib/navigation"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Bento } from "./bento"
import { LanguagesContent } from "./languages-pane"
import { useNav } from "./nav-context"

export const LANGUAGES_SECTION = -1

const ease = [0.25, 1, 0.5, 1] as const
const paneTransition = { duration: 0.45, ease: "easeOut" as const }

function subscribe(callback: () => void) {
  const mql = matchMedia("(min-width: 48rem)")
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia("(min-width: 48rem)").matches,
    () => true,
  )
}

function Wordmark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logos/menu-wordmark.svg" alt="" aria-hidden="true" className="h-[50px] w-[100px] m:h-[55px] m:w-[110px]" />
  )
}

function SectionPane({ index, desktop }: { index: number; desktop: boolean }) {
  const nav = useNav()
  const languages = index === LANGUAGES_SECTION
  const section = languages ? null : menuSections[index]
  const label = languages ? "Languages" : section!.label

  return (
    <motion.nav
      key={index}
      aria-label={label}
      className={cn(
        "absolute inset-y-0 z-[1] grid overflow-y-auto overscroll-contain [scrollbar-width:thin]",
        "w-screen bg-white max-m:start-0 m:start-[var(--sub-start)] m:w-[var(--sub-width)] m:bg-white/95",
      )}
      initial={desktop ? { opacity: 0 } : { x: "100%" }}
      animate={desktop ? { opacity: 1 } : { x: 0 }}
      exit={desktop ? { opacity: 0 } : { x: "100%" }}
      transition={desktop ? { duration: 0.3 } : paneTransition}
    >
      <div
        className={cn(
          "relative mx-[var(--pane-inset)] mt-5 mb-[5.5rem] h-fit m:mt-[min(12.89vh,8.25rem)] max-m:[--inset-inline:var(--pane-inset)]",
          "[@media(max-height:680px)_and_(min-width:48rem)]:mt-[min(5vh,4rem)]",
        )}
      >
        <div className="relative mb-3 flex items-center m:hidden">
          <button
            type="button"
            aria-label="Back"
            className="-ms-2 mt-1 flex bg-transparent p-2"
            onClick={() => nav.setSection(null)}
          >
            <Icon type="chevron" className="-scale-100" />
          </button>
          <span aria-hidden="true" className="absolute start-6 h-1/2 w-[0.5px] bg-light-black" />
          <p className="ms-2.5 font-bold text-green">{label}</p>
        </div>
        {languages ? (
          <LanguagesContent />
        ) : (
          <>
            <Bento bento={section!.bento} onNavigate={nav.close} />
            {section!.actions.length > 0 && (
              <div className="flex flex-col items-center gap-3 pt-[1.87rem] m:pt-[3.75rem] l:mx-auto l:max-w-[22.5rem]">
                {section!.actions.map((action) => {
                  const target = resolveHref(action.href)
                  return (
                    <a
                      key={action.href}
                      href={target.href}
                      className="nav-action"
                      aria-label={action.ariaLabel}
                      {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {action.label}
                    </a>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </motion.nav>
  )
}

/** Main menu: primary list and section panes. */
export function MenuPanes() {
  const nav = useNav()
  const desktop = useIsDesktop()
  const open = nav.pane === "menu" || nav.pane === "languages"
  const firstButton = useRef<HTMLButtonElement>(null)
  const featured = menuSections[0]

  useEffect(() => {
    if (open) firstButton.current?.focus({ preventScroll: true })
  }, [open])

  const showSection = nav.section !== null && (desktop || nav.section !== undefined)

  return (
    <AnimatePresence>
      {open && (
        <div
          id="nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="nav-panes fixed inset-x-0 bottom-0 top-[var(--nav-main-bar-height)] z-[9997] m:top-0"
        >
          <motion.nav
            aria-label="Main navigation"
            className={cn(
              "absolute inset-y-0 start-0 grid w-screen overflow-hidden bg-white",
              "grid-rows-[1fr_var(--nav-main-bar-height)] m:z-10 m:w-[var(--primary-width)] m:grid-rows-[1fr_clamp(5rem,15vh,10rem)]",
            )}
            initial={desktop ? { x: "-100%" } : { y: "-100%" }}
            animate={desktop ? { x: 0, y: 0 } : { y: 0, x: !desktop && nav.section !== null ? "-100%" : 0 }}
            exit={desktop ? { x: "-100%" } : { y: "-100%" }}
            transition={paneTransition}
          >
            <div className="col-start-1 row-start-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              <ul
                aria-label="primary navigation"
                className={cn(
                  "mx-[var(--pane-inset)] mb-[var(--nav-main-bar-height)] flex flex-col items-start pt-2",
                  "m:mx-auto m:mt-[min(12.89vh,8.25rem)] m:mb-0 m:w-80 m:pt-0",
                  "[@media(max-height:680px)_and_(min-width:48rem)]:mt-[min(5vh,4rem)]",
                )}
              >
                <li className="mb-6 block w-full [--inset-inline:var(--pane-inset)] m:hidden">
                  <Bento bento={featured.bento} mayBeVertical={false} onNavigate={nav.close} />
                </li>
                {menuSections.map((section, index) => {
                  const active = nav.section === index
                  return (
                    <li key={section.label} className={cn("w-full", index === 0 && "max-m:hidden")}>
                      <button
                        ref={index === 1 ? firstButton : undefined}
                        type="button"
                        aria-expanded={active}
                        className={cn(
                          "mb-[min(1.2vh,0.88rem)] flex w-full items-start justify-between bg-transparent p-0 text-start text-[1.125rem] font-bold transition-colors duration-300",
                          "hover:text-green m:mb-5 m:text-[1.18rem]",
                          active ? "text-green" : "text-light-black",
                        )}
                        onClick={() => nav.setSection(index)}
                        onMouseEnter={() => desktop && nav.setSection(index)}
                      >
                        <span>{section.label}</span>
                        <Icon type="chevron" className="size-4 self-center text-light-black m:hidden" />
                      </button>
                    </li>
                  )
                })}
                <li className="mt-[calc(1.5rem-0.88rem)] flex w-full flex-col gap-[min(1vh,0.5rem)] m:my-[3.75rem] m:gap-2">
                  <ul aria-label="Shortcut links" className="flex flex-col gap-[min(1vh,0.5rem)] m:gap-2">
                    {menuShortcuts.map((shortcut) => {
                      const target = resolveHref(shortcut.href)
                      return (
                        <li key={shortcut.href}>
                          <a
                            href={target.href}
                            className="text-base font-normal text-current no-underline transition-colors duration-300 hover:text-green"
                            {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {shortcut.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li className="mt-6 m:mt-0">
                  <button
                    type="button"
                    aria-label="Switch language"
                    aria-expanded={nav.section === LANGUAGES_SECTION}
                    className={cn(
                      "flex w-fit items-center bg-transparent p-0 text-[14px] font-normal transition-colors duration-300 hover:text-green",
                      nav.section === LANGUAGES_SECTION ? "text-green" : "text-light-black",
                    )}
                    onClick={() => nav.setSection(LANGUAGES_SECTION)}
                  >
                    <Icon type="language" className="me-2 size-[15px]" />
                    Singapore
                    <span className="visually-hidden">Change language</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="relative col-start-1 row-start-2 flex justify-center overflow-hidden bg-white">
              <div className="pointer-events-none absolute inset-x-0 bottom-full h-[calc(var(--nav-main-bar-height)+1rem)] bg-gradient-to-t from-white to-transparent m:hidden" />
              <Wordmark />
            </div>
          </motion.nav>

          <AnimatePresence initial={false}>
            {showSection && nav.section !== null && <SectionPane index={nav.section} desktop={desktop} />}
          </AnimatePresence>

          {desktop && (
            <motion.div
              className="fixed top-[4.3rem] z-[9999] start-[calc(var(--sub-start)+var(--sub-width)+2rem)] max-[1100px]:start-[calc(var(--sub-start)+var(--sub-width)-3.6rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: nav.section !== null ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <button
                type="button"
                aria-label="Close"
                className="flex rounded-full bg-white p-1 text-light-black transition-colors hover:text-green"
                onClick={nav.close}
              >
                <Icon type="close" className="box-content size-[0.8rem] p-2" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
