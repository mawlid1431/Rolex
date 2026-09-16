import type { Metadata } from "next"
import { GetInTouchPage } from "@/components/pages/get-in-touch-page"

export const metadata: Metadata = {
  title: "Get in touch | Rolex",
  description: "Contact an Official Rolex Retailer about a Rolex watch or your selection.",
}

export default function GetInTouchRoute() {
  return <GetInTouchPage />
}
