/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/g-but/botsmann-blog-content/**',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['onnxruntime-node', '@xenova/transformers', 'sharp'],
  },
  env: {
    NEXT_PUBLIC_DEPLOY_TIME: new Date().toUTCString(),
  },
  // Redirects for URL structure migration
  async redirects() {
    return [
      // Documents -> My Data
      {
        source: '/documents',
        destination: '/my-data',
        permanent: true,
      },
      // Create -> Personal
      {
        source: '/create',
        destination: '/personal',
        permanent: true,
      },
      // Solutions -> Enterprise (consolidation)
      {
        source: '/solutions/businesses',
        destination: '/enterprise',
        permanent: true,
      },
      {
        source: '/solutions/governments',
        destination: '/enterprise',
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0',
        },
      ],
    },
    {
      source: '/((?!api).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=60',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
