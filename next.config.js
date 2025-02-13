const { withContentlayer } = require('next-contentlayer');
const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Configure static paths
  trailingSlash: true,
  distDir: 'out',
  // Vercel-specific optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

// Combine withMDX and withContentlayer
module.exports = withContentlayer(withMDX(nextConfig));
