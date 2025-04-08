'use client';

import Link from 'next/link';

const navItems = [
  { href: '/flower-info', label: '꽃정보' },
  { href: '/recommendations', label: '맞춤추천' },
  { href: '/flower-db', label: '꽃다발 제작&공유' },
  { href: '/community', label: '커뮤니티' },
];

export function Navigation() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 