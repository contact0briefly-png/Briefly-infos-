/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['firebase', 'undici', 'lucide-react'], 

  images: {
    unoptimized: true, 
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Ajout de frame-ancestors 'self' * pour autoriser l'affichage dans ton app
            value: "default-src 'self' *; script-src 'self' 'unsafe-eval' 'unsafe-inline' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: blob: *; font-src 'self' data: *; connect-src 'self' *; frame-ancestors 'self' *;",
          },
          {
            key: 'X-Frame-Options',
            // On change 'DENY' par 'SAMEORIGIN' ou 'ALLOWALL'
            // 'ALLOWALL' est le plus sûr pour débloquer ton application d'administration
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
