'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold">
          florary
        </Link>

        {/* 로그인/회원가입 버튼 */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            로그인
          </Button>
          <Button variant="outline" size="sm">
            회원가입
          </Button>
        </div>
      </div>
    </header>
  );
} 