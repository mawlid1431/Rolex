"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** When the crown logo sends users home, land at the top of the hero. */
export function HomeScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/en-sg") return
    const flag = sessionStorage.getItem("rlx-home-scroll-top")
    if (!flag) return
    sessionStorage.removeItem("rlx-home-scroll-top")
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname])

  return null
}
