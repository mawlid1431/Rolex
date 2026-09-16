/** Framer Motion slide-up variants. */
export const slideUp = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      ease: "easeOut" as const,
      duration: 0.4,
    },
  },
  hide: {
    opacity: 0,
    y: 50,
  },
}
