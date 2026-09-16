import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { HomeScrollReset } from "@/components/navigation/home-scroll-reset"
import { NavProvider } from "@/components/navigation/nav-context"
import { SiteHeader } from "@/components/navigation/site-header"
import { PreferencesProvider, preferencesScript } from "@/components/providers/preferences"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const helveticaNow = localFont({
  variable: "--font-helvetica-now",
  display: "swap",
  src: [
    { path: "./fonts/HelveticaNowTextLight_normal_normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/HelveticaNowTextRegular_normal_normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNowTextBold_normal_normal.woff2", weight: "700", style: "normal" },
  ],
  fallback: ["Helvetica", "Arial", "sans-serif"],
})

const rolexFont = localFont({
  variable: "--font-rolex",
  display: "swap",
  src: [{ path: "./fonts/RolexFont-Regular-WebS.woff2", weight: "400", style: "normal" }],
  fallback: ["sans-serif"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: {
    default: "Rolex (SG)",
    template: "%s (SG)",
  },
  description: "Explore the Rolex collection of prestigious, high-precision timepieces.",
  applicationName: "Rolex.com",
  appleWebApp: { title: "Rolex.com" },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG" dir="ltr" className={cn(helveticaNow.variable, rolexFont.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
      </head>
      <body>
        <PreferencesProvider>
          <NavProvider>
            <HomeScrollReset />
            <SiteHeader />
            {children}
            <Footer />
          </NavProvider>
        </PreferencesProvider>
      </body>
    </html>
  )
}
