import { NextConfig } from 'next';

const nextConfig: NextConfig = {
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

export default nextConfig; 