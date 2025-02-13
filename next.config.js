const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['fonts.gstatic.com'],
  },
  experimental: {
    mdxRs: true,
    serverActions: true
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development'
  }
};

module.exports = withContentlayer(nextConfig);
