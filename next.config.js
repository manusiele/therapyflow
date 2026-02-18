/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Obfuscate auth routes - /a/ instead of /auth/
      {
        source: '/a/l',
        destination: '/auth/login',
      },
      {
        source: '/a/s',
        destination: '/auth/signup',
      },
      {
        source: '/a/r',
        destination: '/auth/reset-password',
      },
      {
        source: '/a/f',
        destination: '/auth/forgot-password',
      },
      {
        source: '/a/p/l',
        destination: '/auth/patient/login',
      },
      {
        source: '/a/p/s',
        destination: '/auth/patient/signup',
      },
      {
        source: '/a/t/l',
        destination: '/auth/therapist/login',
      },
      {
        source: '/a/t/s',
        destination: '/auth/therapist/signup',
      },
      // Obfuscate dashboard routes - /d/ instead of /dashboard/
      {
        source: '/d',
        destination: '/dashboard',
      },
      {
        source: '/d/s',
        destination: '/dashboard/schedule',
      },
      // Obfuscate patient routes - /p/ instead of /patient/
      {
        source: '/p',
        destination: '/patient',
      },
      // Obfuscate video routes - /v/ instead of /video/
      {
        source: '/v/:sessionId',
        destination: '/video/:sessionId',
      },
    ]
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
