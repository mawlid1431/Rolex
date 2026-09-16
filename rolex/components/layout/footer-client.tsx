"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Icon } from "@/components/icons/icon"
import { LANGUAGES_SECTION } from "@/components/navigation/menu-panes"
import { useNav } from "@/components/navigation/nav-context"
import { usePreferences } from "@/components/providers/preferences"
import { QrCode } from "@/components/ui/qr-code"
import { RolexModal } from "@/components/ui/rolex-modal"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const PILL = "footer-glass-pill inline-flex items-center rounded-full transition-[background-color,box-shadow,color] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
const LINK_CLASS = `${PILL} px-3 py-1.5 text-start text-sm leading-snug font-medium tracking-[0.01em] text-[rgba(20,20,25,0.55)] hover:text-[rgb(10_10_12)] aria-[current=page]:text-green`

/** Footer link that highlights itself when it points at the current page. */
export function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  return (
    <Link href={href} aria-current={pathname === href ? "page" : undefined} className={LINK_CLASS}>
      {children}
    </Link>
  )
}

export function FooterBackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduce = document.documentElement.classList.contains("prefers-reduced-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }}
      className={`${PILL} footer-glass-chip size-9 justify-center border-0 text-sm text-[rgb(10_10_12)]`}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}

/** Hides the floating sub navigation while the footer is on screen, and reveals the footer content once. */
export function FooterVisibility({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { setFooterVisible } = useNav()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting)
      if (entry.isIntersecting) node.dataset.revealed = "true"
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
      setFooterVisible(false)
    }
  }, [setFooterVisible])
  return (
    <div ref={ref} className={cn("sections", className)}>
      {children}
    </div>
  )
}

function Toggle({ label, pressed, onToggle }: { label: string; pressed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={onToggle}
      className={cn(PILL, "footer-glass-chip h-9 gap-2 border-0 ps-2 pe-3.5 text-[13px] font-medium", pressed ? "text-green" : "text-[rgba(20,20,25,0.7)]")}
    >
      <span className={cn("relative h-4 w-7 rounded-full transition-colors duration-300", pressed ? "bg-green" : "bg-black/20")}>
        <span className={cn("absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out", pressed && "translate-x-3 rtl:-translate-x-3")} />
      </span>
      {label}
    </button>
  )
}

/** Language switch and accessibility toggles, as glass chips. */
export function FooterControlPanel() {
  const nav = useNav()
  const { reducedMotion, contrast, toggleReducedMotion, toggleContrast } = usePreferences()
  return (
    <>
      <button
        type="button"
        aria-label="Singapore - Switch language"
        className={`${PILL} footer-glass-chip h-9 gap-2 border-0 px-3.5 text-[13px] font-medium text-[rgba(20,20,25,0.7)]`}
        onClick={() => nav.open("menu", LANGUAGES_SECTION)}
      >
        <Icon type="language" className="size-3.5" />
        English
      </button>
      <span id="a11y" className="contents">
        <Toggle label="Reduce motion" pressed={reducedMotion} onToggle={toggleReducedMotion} />
        <Toggle label="Contrast" pressed={contrast} onToggle={toggleContrast} />
      </span>
    </>
  )
}

export function FooterA11yLink({ label, heading, text, className }: { label: string; heading: string; text: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={cn(LINK_CLASS, "border-0", className)} onClick={() => setOpen(true)}>
        {label}
      </button>
      <RolexModal open={open} onOpenChange={setOpen} title={heading}>
        <div className="body50 space-y-4 [&_a]:text-green [&_a]:no-underline" dangerouslySetInnerHTML={{ __html: text }} />
      </RolexModal>
    </>
  )
}

export function FooterWeChatLink({
  label,
  className,
  modal,
  children,
}: {
  label: string
  className?: string
  modal: { label: string; text: string; alt: string }
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        aria-label={`${label} - Open in popin`}
        className={cn("border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]", className)}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <RolexModal open={open} onOpenChange={setOpen} title={modal.label} className="text-center">
        <p className="body50 mb-8">{modal.text}</p>
        <QrCode value="https://weixin.qq.com/r/LkjSykbE3xugrQKp9x08" label={modal.alt} className="mx-auto size-48 [&_svg]:size-full" />
      </RolexModal>
    </>
  )
}
