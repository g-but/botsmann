const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['fonts.gstatic.com'],
  },
  experimental: {
    mdxRs: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development'
  },
  // Vercel deployment settings
  trailingSlash: true,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Vercel build output configuration
  distDir: '.vercel/output',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
};

module.exports = withContentlayer(nextConfig);
