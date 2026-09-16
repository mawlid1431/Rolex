"use client"

import { useCallback, useSyncExternalStore } from "react"

const KEY = "rlx-cart"
const EVENT = "rlx-cart-change"
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
  } catch {
    /* ignore quota */
  }
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

/** Simple local cart of watch ids (rmc / slug), parallel to the wishlist. */
export function useCart() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY)
  const add = useCallback((id: string) => {
    const current = read()
    if (!current.includes(id)) write([id, ...current])
  }, [])
  const remove = useCallback((id: string) => write(read().filter((r) => r !== id)), [])
  const toggle = useCallback((id: string) => {
    const current = read()
    write(current.includes(id) ? current.filter((r) => r !== id) : [id, ...current])
  }, [])
  const clear = useCallback(() => write([]), [])
  return {
    list,
    count: list.length,
    has: (id: string) => list.includes(id),
    add,
    remove,
    toggle,
    clear,
  }
}
