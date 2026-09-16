"use client"

import { useId, useState, type MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import languages from "@/lib/data/languages.json"
import { cn } from "@/lib/utils"

function pagePath(pathname: string) {
  return pathname.replace(/^\/en-sg(?=\/|$)/, "")
}

/** Keep language links on this app only (Singapore English). */
function hrefFor(lang: string, path: string) {
  if (lang === "en-sg") return `/en-sg${path}`
  return "#"
}

function Region({ id, label, countries, path }: { id: string; label: string; countries: { label: string; lang: string }[]; path: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <li className="border-b border-grey">
      <button
        type="button"
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between bg-transparent py-4 text-start font-bold text-light-black transition-colors hover:text-green"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span aria-hidden="true" className="relative size-3">
          <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" />
          <motion.span
            className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-current"
            animate={{ scaleY: open ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <ul className="grid grid-cols-2 gap-[1ex] pb-5">
              {countries.map((country) => {
                const active = country.lang === "en-sg"
                const href = hrefFor(country.lang, path)
                return (
                  <li key={country.lang} className={cn(active && "active")}>
                    <a
                      href={href}
                      lang={country.lang}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "inline-flex items-center gap-2 text-[0.875rem] font-normal no-underline transition-colors hover:text-green",
                        active ? "text-green after:size-2 after:rounded-full after:bg-current after:content-['']" : "text-light-black",
                      )}
                      {...(href === "#" ? { onClick: (e: MouseEvent) => e.preventDefault() } : {})}
                    >
                      {country.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Language and region selector. */
export function LanguagesContent({ className }: { className?: string }) {
  const path = pagePath(usePathname())
  return (
    <div className={cn("pb-10", className)}>
      <p className="headline40 mb-6">
        {languages.languagesHeading.replace(" in", "")}
        <br />
        in <em className="not-italic text-green">{languages.current}</em>
      </p>
      <ul className="mb-12 grid grid-cols-2 gap-[1ex]">
        {languages.languages.map((language) => {
          const href = hrefFor(language.lang, path)
          return (
            <li key={language.lang}>
              <a
                href={href}
                lang={language.lang}
                className="text-[0.875rem] font-bold text-light-black no-underline transition-colors hover:text-green"
                {...(href === "#" ? { onClick: (e: MouseEvent) => e.preventDefault() } : {})}
              >
                {language.label}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="mb-6">
        <p className="headline40 mb-4">
          <em className="not-italic text-green">{languages.regionHeading[0]}</em>
          <br />
          {languages.regionHeading[1]}
        </p>
        <p className="legend100">
          {languages.located}
          <br />
          {languages.viewOther}
        </p>
      </div>
      <ul className="border-t border-grey">
        {languages.regions.map((region) => (
          <Region key={region.id} id={region.id} label={region.label} countries={region.countries} path={path} />
        ))}
      </ul>
    </div>
  )
}
