import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships ESM; transpile the r3f ecosystem for safety across bundlers.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  experimental: {
    optimizePackageImports: ["@react-three/drei"],
  },
};

export default nextConfig;
