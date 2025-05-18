import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';

export default function ThreeDFlowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
} 