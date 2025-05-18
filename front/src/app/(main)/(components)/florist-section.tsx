'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const columns = [
  {
    id: 1,
    tag: '계절을 담은 꽃 이야기',
    title: '봄이 왔다는 걸 가장 먼저 알려주는 꽃',
    description: '추운 겨울이 지나고 가장 먼저 피어나는 꽃은 무엇일까요? 봄의 전령사라 불리는 꽃들의 이야기를 만나보세요.',
    image: require('@/assets/images/florist/florist_1.png'),
  },
  {
    id: 2,
    tag: '함께하는 기분좋은 순간',
    title: '꽃다발에 온전한 향을 더하고 싶다면',
    description: '꽃다발을 더욱 특별하게 만드는 향기로운 꽃 추천과 관리법을 소개합니다.',
    image: require('@/assets/images/florist/florist_2.png'),
  },
  {
    id: 3,
    tag: '일상과 맞닿는 감성',
    title: '기쁨, 위로, 사랑... 색으로 말하는 꽃',
    description: '꽃의 색이 주는 다양한 감정과 의미, 그리고 그 꽃을 선물하는 방법까지 알아보세요.',
    image: require('@/assets/images/florist/florist_3.png'),
  },
];

export function FloristSection() {
  return (
    <section className="w-full">
      {/* 타이틀 */}
      <h2 className="mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard">
        플로리스트 칼럼 <span role="img" aria-label="연필">📝</span>
      </h2>
      {/* 칼럼 카드 리스트 */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        {columns.map((col) => (
          <Card key={col.id} className="w-[430px] rounded-2xl shadow-none border-0 bg-[#F1F1F3] p-0 flex flex-col mx-auto overflow-hidden">
            {/* 텍스트 영역 */}
            <div className="rounded-t-2xl px-6 pt-6 pb-4 flex flex-col">
              <div className="inline-flex self-start px-3 py-1 bg-white text-[#757575] text-xs rounded-full mb-3 font-medium">
                {col.tag}
              </div>
              <div className="text-lg font-bold mb-2 leading-snug text-black">{col.title}</div>
              <div className="text-sm mb-4 line-clamp-2 text-[#757575]">{col.description}</div>
            </div>
            {/* 이미지 영역 */}
            <div className="relative w-full h-[230px] rounded-b-2xl overflow-hidden">
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover rounded-b-2xl"
                sizes="(max-width: 768px) 100vw, 430px"
              />
            </div>
          </Card>
        ))}
      </div>
      {/* 전체보기 버튼 */}
      <div className="flex justify-center mt-4">
        <button className="px-8 py-2 rounded-full bg-[#EEEEEE] text-gray-800 font-bold shadow transition">
          뉴스 전체보기
        </button>
      </div>
    </section>
  );
} 