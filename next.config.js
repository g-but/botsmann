/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { 
    unoptimized: true 
  },
  experimental: { 
    typedRoutes: true 
  },
  env: {
    NEXT_PUBLIC_DEPLOY_TIME: new Date().toUTCString()
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  }
};

module.exports = nextConfig;
