import type { MetadataRoute } from "next"

/** Web app manifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Rolex.com",
    name: "Rolex.com",
    icons: [{ src: "/icon.png", sizes: "48x48", type: "image/png" }],
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
  }
}
