'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { MainBanner } from './(components)/main-banner';
import { SearchSection } from './(components)/search-section';
import { FlowerBouquet } from './(components)/flower-bouquet';
import { FloristSection } from './(components)/florist-section';
import { BottomBanners } from './(components)/bottom-banners';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 메인 배너 */}
      <MainBanner />

      {/* 검색 섹션 */}
      <SearchSection />

      {/* 3D 꽃다발 및 커뮤니티 */}
      <FlowerBouquet />

      {/* 플로리스트 추천 */}
      <FloristSection />

      {/* 하단 배너 */}
      <BottomBanners />
    </div>
  );
}
