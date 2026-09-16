"use client"

import type { ReactNode } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Icon } from "@/components/icons/icon"
import { cn } from "@/lib/utils"

type RolexModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  children: ReactNode
  /** Narrower card (col 2 → -2) used by statement / QR modals; wide covers col 1 → -1. */
  size?: "default" | "wide"
  hideTitle?: boolean
  className?: string
}

/**
 * Modal container:
 * dark 80% backdrop, full-screen white sheet on mobile, rounded 50px card from 768px.
 */
export function RolexModal({ open, onOpenChange, title, children, size = "default", hideTitle, className }: RolexModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[10000] bg-light-black/80 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            "full-grid fixed inset-0 z-[10001] items-center overflow-y-auto outline-none",
            "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] data-[ending-style]:translate-y-8 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-8 data-[starting-style]:opacity-0",
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false)
          }}
        >
          <div
            className={cn(
              "relative col-[doc] min-h-full bg-white px-[var(--grid-col-unit)] m:my-10 m:min-h-0 m:rounded-[50px] m:px-[6.25rem]",
              size === "default" ? "m:col-[col_2/col_-2]" : "m:col-[main]",
              className,
            )}
          >
            <DialogPrimitive.Close
              className="btn btn-icon absolute end-[calc(var(--outer-margin)-var(--grid-gap)/2-var(--btn-height)/2)] top-[calc(var(--outer-margin)-var(--grid-gap)/2-var(--btn-height)/2)] z-[2] [--container:rgb(var(--another-light-grey))] [--text:rgb(var(--light-black))] hover:[--text:rgb(var(--green))] m:end-[var(--btn-height)] m:top-[var(--btn-height)] [&_svg]:size-4"
              aria-label="Close"
            >
              <Icon type="close" />
            </DialogPrimitive.Close>
            <div className="py-[6.25rem]">
              <DialogPrimitive.Title className={cn("headline40 mb-6 text-light-black", hideTitle && "sr-only")}>{title}</DialogPrimitive.Title>
              {children}
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
