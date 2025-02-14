const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: false,
    outputFileTracingRoot: process.env.VERCEL ? '/vercel/path0' : undefined,
  }
};

module.exports = withContentlayer(nextConfig);
