import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};
export default nextConfig;
