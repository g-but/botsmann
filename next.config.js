/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/vercel/path0/src'
    };
    return config;
  }
};

module.exports = nextConfig;
