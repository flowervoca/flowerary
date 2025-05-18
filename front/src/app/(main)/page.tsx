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
import { Maps } from './(components)/maps';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1400px] flex flex-col gap-[80px] pt-[160px] pb-[160px] px-4">
      {/* 검색 섹션 */}
      <SearchSection />

      {/* 메인 배너 */}
      <MainBanner />

      {/* 플로리스트 추천 */}
      <FloristSection />

      {/* 3D 꽃다발 및 커뮤니티 */}
      <FlowerBouquet />      

      {/* 지도 */}
      <Maps />
      </div>
    </div>
  );
}
