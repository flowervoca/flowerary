'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerItems = [
  {
    id: 1,
    backgroundImage: require('@/assets/images/flower-banner/DesertRose.png'),
    meaning: '지혜',
    name: '사막장미',
    engName: 'DesertRose',
    description: '건조한 환경에서도 피어나는 강인함과 지혜를 상징합니다.'
  },
  {
    id: 2,
    backgroundImage: require('@/assets/images/flower-banner/Magnolia.png'),
    meaning: '자연에의 사랑',
    name: '목련',
    engName: 'Magnolia',
    description: '순수함과 자연을 사랑하는 마음을 담고 있습니다.'
  },
  {
    id: 3,
    backgroundImage: require('@/assets/images/flower-banner/Gujeolcho.png'),
    meaning: '보호',
    name: '구절초',
    engName: 'Gujeolcho',
    description: '가을 들판을 지키는 보호와 헌신의 의미를 지닙니다.'
  },
  {
    id: 4,
    backgroundImage: require('@/assets/images/flower-banner/Cosmos.png'),
    meaning: '소녀의 순정',
    name: '코스모스',
    engName: 'Cosmos',
    description: '맑고 순수한 소녀의 사랑과 순정을 상징합니다.'
  }
];

export function MainBanner({ autoSlide = true }: { autoSlide?: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, slidesToScroll: 1, align: 'start' });
  const [activeFilter, setActiveFilter] = useState('전체');
  const filters = ['전체', '여자친구 선물', '봄 꽃 추천', '고백 꽃'];

  // 자동 슬라이드
  useEffect(() => {
    if (!emblaApi || !autoSlide) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, autoSlide]);

  return (
    <div className="w-full relative">
      <h2
        className="mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard"
      >
        플로러리에서 추천하는 오늘의 꽃
        <span role="img" aria-label="flower">🌷</span>
      </h2>
      <div className="flex gap-3 mb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full border font-semibold transition-colors text-base
              ${activeFilter === filter
                ? 'bg-black text-white shadow'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
            style={{ minWidth: 80 }}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex w-full">
          {bannerItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex-shrink-0 flex-grow-0 px-2 w-[439px] h-[648px]"
            >
              <div className="rounded-2xl overflow-hidden shadow-md bg-white flex flex-col h-full w-full">
                <div className="relative w-full h-[400px]">
                  <Image
                    src={item.backgroundImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 439px"
                    priority={idx === 0}
                  />
                </div>
                <div className={`flex flex-col justify-start w-full px-6 pt-6 pb-5 rounded-b-2xl text-white h-[248px] ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-neutral-700' : idx === 2 ? 'bg-yellow-500' : 'bg-pink-400'}`}
                >
                  <div className="text-xs mb-2">{item.meaning}</div>
                  <div className="text-2xl font-bold mb-1">{item.name}</div>
                  <div className="text-sm font-light italic mb-1">{item.engName}</div>
                  <div className="text-xs whitespace-pre-line mt-6">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 슬라이드 이동 버튼: 배너 하단 오른쪽 끝 */}
      <div className="w-full flex justify-end gap-3">
        <button
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition"
          aria-label="이전"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <button
          onClick={() => emblaApi && emblaApi.scrollNext()}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition"
          aria-label="다음"
          type="button"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
} 