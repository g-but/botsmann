/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { 
    unoptimized: true 
  },
  experimental: { 
    typedRoutes: true
  },
  serverRuntimeConfig: {
    mongodbTimeout: 30000,
    PROJECT_ROOT: __dirname
  },
  env: {
    NEXT_PUBLIC_DEPLOY_TIME: new Date().toUTCString()
  },
  headers: async () => [{
    source: '/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'no-store, must-revalidate'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      }
    ]
  }],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: false,
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
