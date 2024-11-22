import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
        protocol: 'http',
        pathname: '/**',
      },
      {
        hostname: 'practice-log.vercel.app',
        protocol: 'https',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
