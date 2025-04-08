'use client';

import Link from 'next/link';

const footerLinks = [
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/terms', label: '이용약관' },
  { href: '/about-data', label: '이메일무단수집거부' },
  { href: '/notice', label: '사이트맵' },
];

export function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 링크 섹션 */}
        <div className="flex justify-center gap-4 mb-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 회사 정보 */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">광주 광산구 픙영로 179 플로러리도서관</p>
          <p>TEL: 062) 222-2222</p>
          <p className="mt-4">© 2025 Flowerary</p>
        </div>
      </div>
    </footer>
  );
} 