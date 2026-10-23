/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react', 'framer-motion'],

  images: {
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }, { source: '/admin/', destination: '/admin/index.html' }];
  },

  async headers() {
    return [
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/admin/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }, { key: 'Service-Worker-Allowed', value: '/admin/' }] },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' *",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *",
              "style-src 'self' 'unsafe-inline' *",
              "img-src 'self' data: blob: *",
              "font-src 'self' data: *",
              "connect-src 'self' *",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.dailymotion.com *",
              "frame-ancestors 'self' *",
              "media-src 'self' *",
            ].join('; '),
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