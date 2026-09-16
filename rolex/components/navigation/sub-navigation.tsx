"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { Icon } from "@/components/icons/icon"
import type { SubNavigationData } from "@/lib/sub-navigation"
import { resolveHref } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Bento } from "./bento"
import { useNav } from "./nav-context"

const ease = [0.25, 1, 0.5, 1] as const

/**
 * Floating section navigation: a pill pinned to the bottom of the viewport while the
 * main bar is hidden, expanding into a centred card.
 */
export function SubNavigation({ data }: { data: SubNavigationData }) {
  const nav = useNav()
  const expanded = nav.pane === "sub"
  const visible = expanded || (!nav.pinned && !nav.footerVisible && nav.pane === null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  const closeButton = useRef<HTMLButtonElement>(null)
  const back = data.back ? resolveHref(data.back.href) : null

  useEffect(() => {
    if (expanded) closeButton.current?.focus({ preventScroll: true })
  }, [expanded])

  return (
    <nav aria-label="Sub navigation" className="pointer-events-none fixed inset-x-0 top-[5px] bottom-[5px] z-[9998] overflow-hidden">
      <AnimatePresence>
        {!expanded && visible && (
          <motion.div
            key="toggle"
            className="absolute start-1/2 bottom-[3.5vh] w-[min(90vw,max(55vw,512px),512px)] -translate-x-1/2 rtl:translate-x-1/2"
            initial={{ opacity: 0, y: "calc(100% + 3.5vh)" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "calc(100% + 3.5vh)" }}
            transition={{ duration: 0.4, ease }}
          >
            <button
              type="button"
              aria-expanded={false}
              className="group pointer-events-auto relative grid h-[3.375rem] w-full place-items-center overflow-hidden rounded-[0.38rem] bg-white/70 leading-[1.375rem] shadow-[0_4px_28px_0_rgba(0,0,0,0.1)] backdrop-blur-[5px] transition-[box-shadow,background] duration-300 hover:bg-white/90 hover:shadow-[0_4px_28px_0_rgba(0,0,0,0.15)]"
              onClick={() => nav.open("sub")}
            >
              <span className="flex w-full min-w-0 items-center">
                <span className="ms-5 truncate pe-11 font-bold text-green">{data.heading}</span>
              </span>
              <span className="pointer-events-none absolute end-[1.88rem] flex items-center">
                <Icon type="chevron" className="size-[1.2rem] -rotate-90 text-light-black transition-colors group-hover:text-green" />
              </span>
              <span className="absolute inset-x-0 bottom-0 h-1">
                <motion.span className="block h-full origin-left rounded-e-full bg-green" style={{ scaleX: progress }} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="pane"
            role="dialog"
            aria-modal="true"
            aria-label={data.heading}
            className="pointer-events-auto absolute start-1/2 top-1/2 flex max-h-[80dvh] w-[min(90vw,max(55vw,512px),512px)] flex-col rounded-[0.38rem] bg-white"
            initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.92, x: "-50%", y: "-40%" }}
            transition={{ duration: 0.45, ease }}
          >
            <button
              ref={closeButton}
              type="button"
              aria-label="Close"
              className="absolute end-[1.8rem] top-0 z-[3] flex translate-y-5 rounded-full border-[0.5px] border-grey bg-white p-[0.575rem] text-light-black transition-colors hover:text-green"
              onClick={nav.close}
            >
              <Icon type="close" />
            </button>
            <div className="min-h-0 overflow-y-auto overscroll-contain p-[1.8rem] [--inset-inline:1.8rem]">
              <p className="mx-auto mb-5 flex min-h-[2.4rem] max-w-[75%] items-center justify-center text-center text-[20px] leading-[1.2rem] font-bold text-green m:mx-0 m:max-w-none m:justify-start m:text-start m:text-[24px] m:leading-[1rem]">
                {data.heading}
              </p>
              <Bento bento={data.bento} mayBeVertical={false} onNavigate={nav.close} />
              {(data.actions.length > 0 || data.configure) && (
                <div className="mt-[0.9rem] flex flex-col items-center justify-center gap-3 l:mx-auto l:max-w-[22.5rem]">
                  {data.actions.map((action) => {
                    const target = resolveHref(action.href)
                    return (
                      <a
                        key={action.href}
                        href={target.href}
                        aria-label={action.ariaLabel}
                        className="nav-action"
                        {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {action.label}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
            {back && data.back && (
              <div className="absolute inset-x-0 bottom-[calc((1.88rem+2.25rem)*-1)] grid h-9 place-items-center m:bottom-[calc((1.88rem+2.75rem)*-1)] m:h-11">
                {back.external ? (
                  <a
                    href={back.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={data.back.ariaLabel}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-[50px] bg-white px-[1.88rem] text-[12px] font-bold text-current no-underline transition-colors hover:text-green",
                      "m:h-11 m:px-11 m:text-[14px]",
                    )}
                  >
                    {data.back.label}
                  </a>
                ) : (
                  <Link
                    href={back.href}
                    aria-label={data.back.ariaLabel}
                    onClick={nav.close}
                    className="flex h-9 items-center justify-center rounded-[50px] bg-white px-[1.88rem] text-[12px] font-bold no-underline transition-colors hover:text-green m:h-11 m:px-11 m:text-[14px]"
                  >
                    {data.back.label}
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
