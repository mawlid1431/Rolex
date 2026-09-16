"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Icon } from "@/components/icons/icon"
import { LANGUAGES_SECTION } from "@/components/navigation/menu-panes"
import { useNav } from "@/components/navigation/nav-context"
import { usePreferences } from "@/components/providers/preferences"
import { QrCode } from "@/components/ui/qr-code"
import { RolexModal } from "@/components/ui/rolex-modal"
import { cn } from "@/lib/utils"

/** Hides the floating sub navigation while the footer sections are on screen. */
export function FooterVisibility({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { setFooterVisible } = useNav()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting))
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
      className={cn("group flex h-[23px] items-center border-0 bg-transparent px-0", pressed ? "text-green" : "text-inherit")}
    >
      <span
        className={cn(
          "relative flex h-5 w-[37px] min-w-[37px] items-center rounded-[50px] transition-colors duration-300 group-hover:bg-green",
          pressed ? "bg-[#006139]" : "bg-black",
        )}
      >
        <span
          className={cn(
            "absolute mx-0.5 h-[calc(100%-3px)] w-[calc(50%-2px)] rounded-full bg-white transition-transform duration-300 ease-in-out",
            pressed && "translate-x-full rtl:-translate-x-full",
          )}
        />
      </span>
      <em className="ms-2.5 not-italic transition-colors duration-300 group-hover:text-green">{label}</em>
    </button>
  )
}

/** Language switch and accessibility toggles. */
export function FooterControlPanel() {
  const nav = useNav()
  const { reducedMotion, contrast, toggleReducedMotion, toggleContrast } = usePreferences()
  return (
    <div className="full-grid bg-light-grey pt-[1.875rem] pb-5">
      <div className="relative col-[main] -mt-2 grid gap-y-2 max-s:grid-rows-[repeat(2,minmax(0,max-content))] max-s:gap-y-8">
        <button
          type="button"
          aria-label="Singapore - Switch language"
          className="legend100 col-start-1 row-start-1 -mx-2 inline-flex w-fit items-center gap-[1ex] border-0 bg-transparent p-2 leading-[1.375] font-light text-inherit transition-colors duration-300 hover:text-green"
          onClick={() => nav.open("menu", LANGUAGES_SECTION)}
        >
          <Icon type="language" className="size-4 m:size-[1.125rem]" />
          Singapore
        </button>
        <div
          id="a11y"
          className="legend100 col-start-1 row-start-1 flex h-fit w-fit flex-row gap-4 self-center justify-self-end max-s:row-start-2 max-s:mb-5 max-s:flex-col max-s:justify-self-start"
        >
          <Toggle label="Reduce motion" pressed={reducedMotion} onToggle={toggleReducedMotion} />
          <Toggle label="Contrast active" pressed={contrast} onToggle={toggleContrast} />
        </div>
      </div>
    </div>
  )
}

export function FooterA11yLink({ label, heading, text, className }: { label: string; heading: string; text: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={cn("border-0 bg-transparent p-0 font-[inherit] text-[length:inherit]", className)} onClick={() => setOpen(true)}>
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
