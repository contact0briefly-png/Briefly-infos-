/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force la transformation du code moderne en code compatible vieux navigateurs
  transpilePackages: ['firebase', 'undici', 'lucide-react'], 
  
  images: {
    unoptimized: true, 
  },

  // 2. Désactiver SWC Minify peut parfois aider sur les très vieux terminaux 
  // car le compresseur moderne génère du code très compact que Safari 12 gère mal.
  // swcMinify: false, // À tester si le changement ci-dessous ne suffit pas

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // J'ai ajouté 'unsafe-inline' et assoupli légèrement pour laisser passer les polyfills
            value: "default-src 'self' *; script-src 'self' 'unsafe-eval' 'unsafe-inline' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: blob: *; font-src 'self' data: *; connect-src 'self' *;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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