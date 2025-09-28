import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
      {
        protocol: 'https',
        hostname: 'sc04.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  }
  // Temporarily disabled turbopack to fix build issues
  // turbopack: {
  //   rules: {
  //     "*.{jsx,tsx}": {
  //       loaders: [LOADER]
  //     }
  //   }
  // }
};

export default nextConfig;
// Orchids restart: 1758095340220
