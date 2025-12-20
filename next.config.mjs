/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
    ],
  },
  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ['framer-motion', '@tanstack/react-query'],
  },
};

export default nextConfig;
