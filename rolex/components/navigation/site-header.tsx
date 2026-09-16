"use client"

import { AnimatePresence, motion } from "framer-motion"
import { MainBar } from "./main-bar"
import { MenuPanes } from "./menu-panes"
import { useNav } from "./nav-context"
import { SearchPane } from "./search-pane"

function SkipLinks() {
  const skip =
    "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[10000] focus:h-auto focus:w-auto focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:font-bold focus:text-green focus:[clip:auto] focus:[clip-path:none]"
  return (
    <div id="skipLinks">
      <a href="#a11y" className={skip}>
        Skip to accessibility
      </a>
      <a href="#main" className={skip}>
        Skip to content
      </a>
      <a href="#footer" className={skip}>
        Skip to footer
      </a>
    </div>
  )
}

/** Dimmed, blurred backdrop behind open navigation panes. */
function Overlay() {
  const nav = useNav()
  return (
    <AnimatePresence>
      {nav.pane && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[9996] bg-black/30 backdrop-blur-[5px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          onClick={nav.close}
        />
      )}
    </AnimatePresence>
  )
}

export function SiteHeader() {
  return (
    <>
      <SkipLinks />
      <MainBar />
      <SearchPane />
      <MenuPanes />
      <Overlay />
    </>
  )
}
