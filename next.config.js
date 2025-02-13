const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    unoptimized: true,
    domains: ['fonts.gstatic.com'],
  },
  // Configure static paths
  trailingSlash: true,
  // Ensure static export
  experimental: {
    mdxRs: true,
    outputFileTracingRoot: process.env.VERCEL ? '/vercel/path0' : undefined
  },
  // Vercel-specific optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = withContentlayer(nextConfig);
