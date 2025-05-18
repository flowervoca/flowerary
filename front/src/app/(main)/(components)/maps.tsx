'use client';

import { Card } from "@/components/ui/card";
import Image from 'next/image';

const flowerShops = [
  { id: 1, name: '꽃집 하나', address: '서울시 강남구', phone: '02-123-4567' },
  { id: 2, name: '플라워샵 둘', address: '서울시 서초구', phone: '02-234-5678' },
  { id: 3, name: '로즈플라워', address: '서울시 송파구', phone: '02-345-6789' },
  { id: 4, name: '튤립가든', address: '서울시 강동구', phone: '02-456-7890' },
];

export function Maps() {
  return (
    <section className="w-full">
      <h2 className="mb-6 flex items-center gap-2 font-bold text-2xl md:text-3xl font-pretendard">
        내 주변 꽃집 <span role="img" aria-label="꽃집">📍</span>
      </h2>
      <div className="flex items-center justify-center">
        <Image src={require('@/assets/images/maps/temp_maps.png')} alt="주변 꽃집 지도" className="rounded-2xl object-cover w-full h-auto" />
      </div>
    </section>
  );
} 