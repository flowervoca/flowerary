import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Flowerary',
  description:
    '꽃말 정보와 함께 큐레이션을 제공하는 꽃 도서관',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
