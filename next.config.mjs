/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ajout de 'framer-motion' pour forcer sa conversion en ES5 compatible Smart TV
  transpilePackages: ['firebase', 'undici', 'lucide-react', 'framer-motion'], 

  images: {
    unoptimized: true, 
  },

  compiler: {
    // Supprime les console.log en production pour optimiser la mémoire des TV
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Maintien de ton autorisation large pour l'affichage de ton app d'admin
            value: "default-src 'self' *; script-src 'self' 'unsafe-eval' 'unsafe-inline' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: blob: *; font-src 'self' data: *; connect-src 'self' *; frame-ancestors 'self' *;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;