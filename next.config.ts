import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'y2o3zwwnns.ufs.sh',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'another-subdomain.ufs.sh',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
