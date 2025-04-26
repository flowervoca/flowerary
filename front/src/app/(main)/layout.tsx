import { Header } from '@/components/common/header';
import { Navigation } from '@/components/common/navigation';
import { Footer } from '@/components/common/footer';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Navigation />
      <main className='flex-1'>{children}</main>
      <Footer />
    </>
  );
}
