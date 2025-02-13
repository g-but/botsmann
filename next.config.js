const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure static paths
  trailingSlash: true,
  distDir: 'out',
  // Vercel-specific optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = withContentlayer(nextConfig);
