"use client"

import { useCallback, useSyncExternalStore } from "react"

const KEY = "rlx-wishlist"
const EVENT = "rlx-wishlist-change"
const EMPTY: string[] = []

let cache: string[] | null = null

function read(): string[] {
  if (cache) return cache
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    cache = Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : []
  } catch {
    cache = []
  }
  return cache
}

function write(next: string[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      callback()
    }
  }
  window.addEventListener(EVENT, callback)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener("storage", onStorage)
  }
}

/** Favourite watch references (rmc), persisted locally like the reference wishlist. */
export function useFavourites() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY)
  const toggle = useCallback((rmc: string) => {
    const current = read()
    write(current.includes(rmc) ? current.filter((r) => r !== rmc) : [rmc, ...current])
  }, [])
  const remove = useCallback((rmc: string) => write(read().filter((r) => r !== rmc)), [])
  return { list, has: (rmc: string) => list.includes(rmc), toggle, remove }
}
