import path from "path";
import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_HOSTS } from "./app/lib/imageHosts";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in a parent folder otherwise makes
  // Next infer the wrong project root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
};

export default nextConfig;
