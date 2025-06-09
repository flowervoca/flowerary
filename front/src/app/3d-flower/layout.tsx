import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { KakaoSDKLoader } from './utils/KakaoSDKLoader';

export default function ThreeDFlowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <KakaoSDKLoader />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
