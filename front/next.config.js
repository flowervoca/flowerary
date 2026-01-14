/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 무시 (프로덕션 배포용)
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'mblogthumb-phinf.pstatic.net',
      'encrypted-tbn0.gstatic.com',
      'img.freepik.com',
      'blog.kakaocdn.net',
      'www.nihhs.go.kr',
      'oolkuscvkgdziqfysead.storage.supabase.co',
      'oolkuscvkgdziqfysead.supabase.co'
    ],
  },
};

module.exports = nextConfig;