/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',
  distDir: 'build',
  images: {
    unoptimized: true
  }
}      