"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Icon } from "@/components/icons/icon"
import { searchShortcuts } from "@/lib/navigation"
import { resolveHref } from "@/lib/site"
import { useNav } from "./nav-context"

const HISTORY_KEY = "searchList"

function readHistory(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]")
    return Array.isArray(parsed) ? parsed.slice(0, 5) : []
  } catch {
    return []
  }
}

/** Search pane dropping from the top bar. */
export function SearchPane() {
  const nav = useNav()
  const open = nav.pane === "search"
  const input = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    setHistory(readHistory())
    const id = setTimeout(() => input.current?.focus({ preventScroll: true }), 150)
    return () => clearTimeout(id)
  }, [open])

  const submit = (query: string) => {
    const q = query.trim()
    if (!q) return
    const next = [q, ...readHistory().filter((item) => item !== q)].slice(0, 5)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {}
    setHistory(next)
    nav.close()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-x-0 top-0 z-[9994] bg-white pt-[var(--nav-main-bar-height)] pb-12 m:pb-16"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="full-grid">
            <div className="col-[main] mx-auto w-[calc(var(--grid-col-unit)*6+var(--grid-gap)*5)] max-w-[500px]">
              <form
                role="search"
                className="mt-10 m:mt-[8.25rem]"
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(value)
                }}
              >
                <div className="relative flex flex-col justify-center">
                  <button type="submit" aria-label="Search" className="absolute start-0 bg-transparent px-5 text-dark-grey">
                    <Icon type="search" className="mt-1" />
                  </button>
                  <input
                    ref={input}
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="Search for a watch, a city, a material..."
                    placeholder="Search"
                    className="w-full appearance-none rounded-[50px] border-0 bg-light-grey py-2.5 ps-[2.9375rem] pe-10 text-base font-light text-light-black outline-none placeholder:text-dark-grey focus-visible:outline-2 focus-visible:outline-light-green [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  {value && (
                    <button
                      type="button"
                      aria-label="Clear"
                      className="absolute end-2 flex size-5 items-center justify-center rounded-full bg-green text-white"
                      onClick={() => {
                        setValue("")
                        input.current?.focus()
                      }}
                    >
                      <Icon type="close" className="size-[0.4rem]" />
                    </button>
                  )}
                </div>
              </form>
              <div className="pt-5">
                {history.length > 0 && (
                  <div className="mb-6">
                    <div className="flex w-full items-center justify-between pb-4">
                      <span className="body40 font-bold text-green">Recently searched</span>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-transparent text-xs font-normal text-black"
                        onClick={() => {
                          localStorage.removeItem(HISTORY_KEY)
                          setHistory([])
                        }}
                      >
                        Clear
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#f2f2f2]">
                          <Icon type="close" className="size-1.5" />
                        </span>
                      </button>
                    </div>
                    <ul>
                      {history.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            className="body40 w-full bg-transparent py-[0.3125rem] text-start font-normal text-dark-grey m:hover:font-bold"
                            onClick={() => {
                              setValue(item)
                              submit(item)
                            }}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="body40 pb-4 font-bold text-green">Shortcuts</p>
                <ul className="flex flex-col">
                  {searchShortcuts.map((shortcut) => {
                    const target = resolveHref(shortcut.href)
                    return (
                      <li key={shortcut.href}>
                        <a
                          href={target.href}
                          aria-label={shortcut.ariaLabel}
                          className="body40 block py-[0.3125rem] font-normal text-light-black no-underline transition-colors hover:text-green"
                          {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {shortcut.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
