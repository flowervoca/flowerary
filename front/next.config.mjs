/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nihhs.go.kr',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig; 