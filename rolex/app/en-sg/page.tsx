import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"

export const metadata: Metadata = {
  title: "Official Rolex Website - Swiss Luxury Watches",
  description:
    "Explore Swiss luxury watches from Rolex. Discover new watches, watchmaking excellence, and Official Rolex Retailers.",
}

/** Locale index mirrors `/` — homepage with hash sections. */
export default function LocaleIndexPage() {
  return (
    <>
      <HomePage />
    </>
  )
}
