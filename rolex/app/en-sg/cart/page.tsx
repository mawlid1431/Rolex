import type { Metadata } from "next"
import { CartPage } from "@/components/pages/cart-page"

export const metadata: Metadata = {
  title: "Your cart | Rolex",
  description: "Review the Rolex watches you selected and get in touch with an Official Rolex Retailer.",
}

export default function CartRoute() {
  return <CartPage />
}
