/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  assetPrefix: '/',
};

module.exports = nextConfig;
