/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
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
        source: '/blog/ayurvedic-remedies-irregular-periods',
        destination: '/blog/ayurvedic-management-pcos-guide',
        permanent: true,
      },
      {
        source: '/blog/agni-digestive-fire-ayurveda',
        destination: '/blog/ayurvedic-weight-loss-tips-agni',
        permanent: true,
      },
      {
        source: '/download',
        destination: '/app-release.apk',
        permanent: false,
      },
      {
        source: '/download/android',
        destination: '/app-release.apk',
        permanent: false,
      },
    ]
  },

}

export default nextConfig
