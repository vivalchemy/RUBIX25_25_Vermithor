import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Matches any route under /api
        destination: 'http://localhost:8080/api/:path*', // Proxies to your backend
      },
    ];
  },
};

export default nextConfig;
