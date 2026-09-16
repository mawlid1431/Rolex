"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { sectionForPath } from "@/lib/navigation"

export type Pane = "menu" | "search" | "languages" | "sub" | null

type NavState = {
  pane: Pane
  /** Index of the menu section shown in the secondary pane (null = list only, mobile). */
  section: number | null
  pinned: boolean
  footerVisible: boolean
  open: (pane: Exclude<Pane, null>, section?: number | null) => void
  setSection: (section: number | null) => void
  close: () => void
  toggle: (pane: Exclude<Pane, null>) => void
  setFooterVisible: (visible: boolean) => void
}

const NavContext = createContext<NavState | null>(null)

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error("useNav must be used inside <NavProvider>")
  return ctx
}

const DESKTOP = "(min-width: 48rem)"

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [pane, setPane] = useState<Pane>(null)
  const [section, setSection] = useState<number | null>(null)
  const [pinned, setPinned] = useState(true)
  const [footerVisible, setFooterVisible] = useState(false)
  const pathname = usePathname()
  const [previousPathname, setPreviousPathname] = useState(pathname)
  const lastFocus = useRef<HTMLElement | null>(null)

  const open = useCallback(
    (next: Exclude<Pane, null>, nextSection: number | null = null) => {
      lastFocus.current = document.activeElement as HTMLElement | null
      setPane(next)
      // From 768px the menu opens with the section matching the current page.
      const matching = sectionForPath(pathname)
      setSection(next === "menu" ? (nextSection ?? (matchMedia(DESKTOP).matches ? Math.max(matching, 0) : null)) : null)
    },
    [pathname],
  )

  const close = useCallback(() => {
    setPane(null)
    setSection(null)
    lastFocus.current?.focus?.({ preventScroll: true })
  }, [])

  const toggle = useCallback((next: Exclude<Pane, null>) => (pane === next ? close() : open(next)), [pane, open, close])

  // Close panes on route change.
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname)
    setPane(null)
    setSection(null)
  }

  // Scroll lock while a pane is open.
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("scroll-lock", pane !== null)
    return () => html.classList.remove("scroll-lock")
  }, [pane])

  useEffect(() => {
    if (!pane) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pane, close])

  // Main bar pin/unpin on scroll direction.
  useEffect(() => {
    let previous = window.scrollY
    let distance = 0
    let state = true
    const bar = document.querySelector<HTMLElement>("[data-main-bar]")
    let safe = bar?.offsetHeight ?? 80
    const observer = new ResizeObserver(() => { safe = bar?.offsetHeight ?? 80 })
    if (bar) observer.observe(bar)
    const onScroll = () => {
      const latest = window.scrollY
      const delta = latest - previous
      if (latest <= safe) {
        distance = 0
        if (!state) setPinned((state = true))
      } else if (delta > 0) {
        distance = distance > 0 ? distance + delta : delta
        if (state && distance > safe) {
          setPinned((state = false))
          distance = 0
        }
      } else if (delta < 0) {
        distance = distance < 0 ? distance + delta : delta
        if (!state && distance < -safe) {
          setPinned((state = true))
          distance = 0
        }
      }
      previous = latest
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect() }
  }, [])

  const value = useMemo(
    () => ({ pane, section, pinned, footerVisible, open, setSection, close, toggle, setFooterVisible }),
    [pane, section, pinned, footerVisible, open, close, toggle],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}
