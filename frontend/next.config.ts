import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'freshindiaorganics.com',
      'moorlandseater.com',
      'www.nipponexpress.com',
      'extension.colostate.edu',
      'media.istockphoto.com',
      'images.jdmagicbox.com',
      'shutterstock.com',
      'liveorganic.co.in',
      'iorganicmilk.com',
      'static.toiimg.com',
      'm.media-amazon.com',
      'epigamiastore.com',
      'pintola.in',
      'dulwichhillgourmetmeats.com.au',
      '5.imimg.com',
      'www.licious.in',
      'www.heinens.com',
      'encrypted-tbn0.gstatic.com'
    ], // Allow external images from this domain
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Matches any route under /api
        destination: "http://localhost:8080/api/:path*", // Proxies to your backend
      },
    ];
  },
};

export default nextConfig;
