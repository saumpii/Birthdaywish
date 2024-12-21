/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
      domains: ['lh3.googleusercontent.com'], // For Google Auth profile pictures
    },
  }
  
  module.exports = nextConfig