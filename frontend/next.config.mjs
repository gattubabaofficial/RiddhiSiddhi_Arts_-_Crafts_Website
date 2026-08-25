import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Where the FastAPI backend lives. Override with BACKEND_ORIGIN in any
// environment where it is not on the same machine.
const BACKEND_ORIGIN = (process.env.BACKEND_ORIGIN || 'http://127.0.0.1:8000').replace(
  /\/+$/,
  ''
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  reactStrictMode: false,

  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
      {
        source: '/static/uploads/:path*',
        destination: `${BACKEND_ORIGIN}/static/uploads/:path*`,
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        poll: 800,
        aggregateTimeout: 200,
        ignored: ['**/node_modules/**', '**/.next/**', '**/backend/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
