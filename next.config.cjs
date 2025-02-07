/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking during builds
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_TO: process.env.EMAIL_TO,
  },
};

module.exports = nextConfig;  