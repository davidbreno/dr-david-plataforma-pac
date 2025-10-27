import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // força o uso do Webpack no dev/build
  // @ts-ignore
  webpack: true,
  eslint: {
    // Desabilita falha do build por erros de ESLint no deploy
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  typescript: {
    // Permite build mesmo com erros de types
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
