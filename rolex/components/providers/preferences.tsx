"use client"

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react"
import { MotionConfig } from "framer-motion"

const COOKIE = "__a11y"
const MOTION_CLASS = "prefers-reduced-motion"
const CONTRAST_CLASS = "prefers-contrast"

/**
 * Runs before paint (see app/layout.tsx) so the stored accessibility preferences
 * apply without a flash, like the inline script of the reference page head.
 */
export const preferencesScript = `(function(){try{var c=(document.cookie.match(/__a11y=([0-3])/)||[])[1];var h=document.documentElement;if(c!==undefined){if(+c&1)h.classList.add("${CONTRAST_CLASS}");if(+c&2)h.classList.add("${MOTION_CLASS}")}else{if(matchMedia("(prefers-reduced-motion: reduce)").matches)h.classList.add("${MOTION_CLASS}");if(matchMedia("(prefers-contrast: more)").matches)h.classList.add("${CONTRAST_CLASS}")}}catch(e){}})();`

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

const hasClass = (name: string) => () => document.documentElement.classList.contains(name)

export function useHtmlClass(name: string) {
  return useSyncExternalStore(subscribe, hasClass(name), () => false)
}

type Preferences = {
  reducedMotion: boolean
  contrast: boolean
  toggleReducedMotion: () => void
  toggleContrast: () => void
}

const PreferencesContext = createContext<Preferences>({
  reducedMotion: false,
  contrast: false,
  toggleReducedMotion: () => {},
  toggleContrast: () => {},
})

function persist() {
  const html = document.documentElement
  const mask = (html.classList.contains(CONTRAST_CLASS) ? 1 : 0) + (html.classList.contains(MOTION_CLASS) ? 2 : 0)
  document.cookie = `${COOKIE}=${mask}; path=/; max-age=${60 * 60 * 24 * 3}; SameSite=Strict`
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useHtmlClass(MOTION_CLASS)
  const contrast = useHtmlClass(CONTRAST_CLASS)

  const toggleReducedMotion = useCallback(() => {
    document.documentElement.classList.toggle(MOTION_CLASS)
    persist()
  }, [])

  const toggleContrast = useCallback(() => {
    document.documentElement.classList.toggle(CONTRAST_CLASS)
    persist()
  }, [])

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const more = matchMedia("(prefers-contrast: more)")
    const onChange = () => {
      if (document.cookie.match(/__a11y=([0-3])/)) return
      document.documentElement.classList.toggle(MOTION_CLASS, motion.matches)
      document.documentElement.classList.toggle(CONTRAST_CLASS, more.matches)
    }
    motion.addEventListener("change", onChange)
    more.addEventListener("change", onChange)
    return () => {
      motion.removeEventListener("change", onChange)
      more.removeEventListener("change", onChange)
    }
  }, [])

  return (
    <PreferencesContext.Provider value={{ reducedMotion, contrast, toggleReducedMotion, toggleContrast }}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>{children}</MotionConfig>
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)
