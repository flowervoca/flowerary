'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const communityPosts = [
  { id: 1, title: '보랏빛 제비꽃', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 2, title: '프리지아', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 3, title: '벚꽃', content: '언제 꽃 피는게 제일 예쁜가요?', date: '2025-03-04' },
  { id: 4, title: '비어디드 아이리스', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 5, title: '수국', content: '살리는 방법 공유 부탁드려요 시급합니다', date: '2025-03-04' },
  { id: 6, title: '무궁화', content: '어디서 피고 볼 수 있나요?', date: '2025-03-04' },
  { id: 7, title: '을릉국화', content: '지금 키우고있는데 생각보다 어렵네요', date: '2025-03-04' },
  { id: 8, title: '진달래', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
];

const todayFlower = {
  image: require('@/assets/images/flower-bouquet/flower.png'),
};
const monthFlower = {
  image: require('@/assets/images/flower-bouquet/calendar.png'),
};

export function FlowerBouquet() {
  return (
    <section className="w-full">
      <h2 className="mb-6 flex items-center gap-2 font-bold text-2xl md:text-3xl font-pretendard">
        이런 꽃은 어떠세요? <span role="img" aria-label="꽃다발">💐</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 좌측: 오늘의 꽃, 이번 달의 꽃 */}
        <div className="flex flex-col gap-4 col-span-1">
          {/* 오늘의 이 꽃 */}
          <Card className="rounded-2xl bg-[#F6EDDC] p-6 flex flex-col justify-between min-h-[140px] border-0 shadow-sm">
            <div className="text-2xl font-black mb-6">오늘은 이 꽃</div>
            <div className="flex items-end justify-between w-full h-[64px]">
              <Image src={todayFlower.image} alt="오늘의 꽃" className="rounded-full w-25 h-25" />
              <button className="flex items-center gap-2 text-gray-800 font-bold text-base ml-auto">
                바로가기
                <img src="/arrow.svg" alt="arrow" className="w-5 h-5" />
              </button>
            </div>
          </Card>
          {/* 이번 달에는 이 꽃 */}
          <Card className="rounded-2xl bg-[#F1F1F3] p-6 flex flex-col justify-between min-h-[140px] border-0 shadow-sm">
            <div className="text-2xl font-black mb-6">이번 달에는 이 꽃</div>
            <div className="flex items-end justify-between w-full h-[64px]">
              <Image src={monthFlower.image} alt="이달의 꽃" className="rounded-full w-25 h-25" />
              <button className="flex items-center gap-2 text-gray-800 font-bold text-base ml-auto">
                바로가기
                <img src="/arrow.svg" alt="arrow" className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>
        {/* 우측: 3D 꽃다발 조합 만들기 */}
        <div className="col-span-2 bg-[#E5EDE6] rounded-2xl flex flex-col md:flex-row items-center justify-between p-10 min-h-[260px] relative overflow-visible">
          <div className="absolute left-10 top-10 z-10">
            <div className="text-2xl md:text-3xl font-bold mb-2">나만의 3D<br />꽃다발 조합 만들기</div>
            <div className="text-gray-500 text-base mb-4 flex items-center">
              <Link href="/3d-flower" className="flex items-center gap-2 text-gray-800 font-bold text-base">
                3D 꽃다발 만들기
                <img src="/arrow.svg" alt="arrow" className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="w-full h-full pointer-events-none">
            <div className="absolute right-0 bottom-0 w-[60vw] max-w-[480px] min-w-[180px] h-auto z-0">
              <div className="relative w-full aspect-square">
                <Image src={require('@/assets/images/flower-bouquet/flower_right-top.png')} alt="꽃다발 오른쪽 위" className="absolute top-20 left-[4.5rem] object-contain h-82" />
                <Image src={require('@/assets/images/flower-bouquet/flower_right.png')} alt="꽃다발 오른쪽" className="absolute top-40 left-[7.5rem] object-contain h-80" />
                <Image src={require('@/assets/images/flower-bouquet/flower_left.png')} alt="꽃다발 왼쪽" className="absolute top-[8.75rem] right-[7.5rem] object-contain h-88" />
                <Image src={require('@/assets/images/flower-bouquet/flower_center.png')} alt="꽃다발 중앙" className="absolute top-[5.75rem] left-0 object-contain h-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 