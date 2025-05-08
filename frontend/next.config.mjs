// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // any other Next.js settings you already have...
  webpack(config) {
    // make "@" point to "./src"
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(process.cwd(), 'src'),
    };
    return config;
  },
};

export default nextConfig;