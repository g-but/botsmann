const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['fonts.gstatic.com'],
  },
  experimental: {
    mdxRs: true
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development'
  },
  // Vercel deployment settings
  trailingSlash: true,
  output: 'export',
  distDir: '.next',
  generateBuildId: async () => 'build',
  // Disable server components for static export
  experimental: {
    appDir: true,
    serverComponents: false
  }
};

module.exports = withContentlayer(nextConfig);
