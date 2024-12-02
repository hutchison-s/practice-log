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
      },
      {
        protocol: 'https',
        hostname: "*.s3.us-east-2.amazonaws.com",
        pathname: '/**'
      },
    ],
  },
};

export default nextConfig;
