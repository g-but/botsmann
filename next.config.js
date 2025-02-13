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
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Configure static paths
  trailingSlash: true,
  distDir: 'out',
};

module.exports = withContentlayer(nextConfig);
