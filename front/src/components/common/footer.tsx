'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t" style={{ borderColor: '#EEEEEE' }}>
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4 py-4">
        <span className="text-xs" style={{ color: '#888888' }}>© Flowerary. All rights reserved.</span>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs text-muted-foreground hover:text-primary transition"
          style={{ borderColor: '#EEEEEE' }}
        >
          <Image src={require('@/assets/images/footer/Logo-github.svg')} alt="github logo" width={16} height={16} />
          github
          <span className="ml-1">&gt;</span>
        </a>
      </div>
    </footer>
  );
} 