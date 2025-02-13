const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure static site generation works with Contentlayer
  experimental: {
    appDir: true,
  },
  // Disable server components for static export
  serverComponents: false,
};

module.exports = withContentlayer(nextConfig);
