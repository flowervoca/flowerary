'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';

const bannerItems = [
  {
    id: 1,
    title: '꽃과 함께하는 공간',
    subtitle: '플로러리 florary',
    description: '🌼 꽃말 정보와 함께 큐레이션을 제공하는 꽃 도서관 📚',
    backgroundImage: 'https://mblogthumb-phinf.pstatic.net/MjAxNzAzMDdfMjMw/MDAxNDg4ODcyMzgwNjU2.669-9ZRgZJ-EQTJjcfRzp05wrMqwjPaJF0UxvFs1nOog.f_g5wz8Wzt2f_XsTPmFQRWjaPdFsSr8PzGG_m7wH7UUg.JPEG.rallycap/beautiful_spring_season-wallpaper-1920x1080.jpg?type=w800'
  },
  {
    id: 2,
    title: '나만의 꽃다발 만들기',
    subtitle: '3D 꽃다발 디자인',
    description: '🎨 직접 디자인하는 나만의 특별한 꽃다발 💐',
    backgroundImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_B8EUX5p7ZIKM1Gxegsm9VMNed3mTKz55g&s'
  },
  {
    id: 3,
    title: '플로리스트 추천',
    subtitle: '전문가의 선택',
    description: '👨‍🌾 검증된 플로리스트가 추천하는 꽃과 식물 🌺',
    backgroundImage: 'https://img.freepik.com/premium-photo/blooming-pink-cosmos-flowers_41929-1336.jpg'
  },
  {
    id: 4,
    title: '오늘의 꽃',
    subtitle: '매일 새로운 꽃 이야기',
    description: '🌸 매일 다른 꽃의 의미와 이야기를 만나보세요 🌸',
    backgroundImage: 'https://blog.kakaocdn.net/dn/bzZE1I/btqI4dbbDhp/gslcrGqHgR1DcohvTkwMT1/img.jpg'
  }
];

export function MainBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative bg-gray-100">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannerItems.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_100%] min-w-0 relative h-[400px] flex items-center justify-center"
              style={{
                backgroundImage: `url(${item.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="text-center bg-black/30 p-6 rounded-lg">
                <h1 className="text-4xl font-bold mb-2 text-white">{item.title}</h1>
                <h2 className="text-2xl mb-4 text-white">{item.subtitle}</h2>
                <p className="text-white">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 