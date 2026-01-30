/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://files.catbox.moe/hksic7.apk',
        permanent: false,
      },
      {
        source: '/download',
        destination: 'https://files.catbox.moe/hksic7.apk',
        permanent: false,
      },
      {
        source: '/download/android',
        destination: 'https://files.catbox.moe/hksic7.apk',
        permanent: false,
      },
    ]
  },

}

export default nextConfig
