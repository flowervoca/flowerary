'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="w-full border-b !border-black/[0.08] bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <div className="text-xl font-bold">
          <Link href="/">
            <img src="/logo.svg" alt="logo" className="w-40 cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
}

