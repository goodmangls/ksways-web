import type { NextConfig } from 'next';

// Intercom 도메인은 공식 CSP 문서(intercom.com/help/en/articles/3894) US 리전 기준.
// 워크스페이스가 EU/AU 호스팅이면 .eu/.au 변형 추가 필요 — preview 콘솔 violation으로 검출됨.
// script-src에 nonce 대신 'unsafe-inline'을 쓰는 이유: nonce는 전 페이지를 dynamic rendering으로
// 강제해 SSG를 잃음. 이 사이트는 사용자 입력을 렌더링하지 않아 inline-XSS sink가 없음.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.intercom.io https://widget.intercom.io https://js.intercomcdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://js.intercomcdn.com https://static.intercomassets.com https://downloads.intercomcdn.com https://uploads.intercomusercontent.com https://gifs.intercomcdn.com https://video-messages.intercomcdn.com https://messenger-apps.intercom.io",
  "font-src 'self' https://js.intercomcdn.com https://fonts.intercomcdn.com",
  "connect-src 'self' https://via.intercom.io https://api.intercom.io https://api-iam.intercom.io https://api-ping.intercom.io https://*.intercom-messenger.com wss://*.intercom-messenger.com https://nexus-websocket-a.intercom.io wss://nexus-websocket-a.intercom.io https://nexus-websocket-b.intercom.io wss://nexus-websocket-b.intercom.io https://uploads.intercomcdn.com https://uploads.intercomusercontent.com",
  "frame-src https://intercom-sheets.com https://www.intercom-reporting.com https://www.youtube.com https://player.vimeo.com https://fast.wistia.net",
  "media-src https://js.intercomcdn.com https://downloads.intercomcdn.com",
  "worker-src 'self' blob:",
  "child-src blob: https://intercom-sheets.com https://www.intercom-reporting.com https://www.youtube.com https://player.vimeo.com https://fast.wistia.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://intercom.help https://api-iam.intercom.io",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
