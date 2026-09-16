"use client"

import { motion, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { usePreferences } from "@/components/providers/preferences"
import { slideUp } from "@/lib/animations/slide-up"
import { cn } from "@/lib/utils"

/** Slide-up reveal that respects reduced motion. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "100% 0% 0% 0%", once: true })
  const { reducedMotion } = usePreferences()
  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={slideUp}
      initial="hide"
      animate={reducedMotion || inView ? "show" : "hide"}
    >
      {children}
    </motion.div>
  )
}
