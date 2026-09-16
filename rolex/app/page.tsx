import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"

export const metadata: Metadata = {
  title: "Official Rolex Website - Swiss Luxury Watches",
  description:
    "Explore Swiss luxury watches from Rolex. Discover new watches, watchmaking excellence, and Official Rolex Retailers.",
}

/** Root marketing homepage — stays at `/` (hash sections), not a deep-link redirect. */
export default function RootPage() {
  return (
    <>
      <HomePage />
    </>
  )
}
