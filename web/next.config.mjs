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
    ],
      },
    ]
  },
  async redirects() {
  return [
    {
      source: '/app-v2.apk',
      destination: 'http://tmpfiles.org/dl/21750301/app-release.apk', // TODO: REPLACE with permanent URL (Supabase/Firebase)
      permanent: false,
    },
    {
      source: '/app-release.apk', // Legacy link support
      destination: 'http://tmpfiles.org/dl/21750301/app-release.apk',
      permanent: false,
    },
  ]
},
}

export default nextConfig
