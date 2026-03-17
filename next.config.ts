import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["images.unsplash.com"],
  },

  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;