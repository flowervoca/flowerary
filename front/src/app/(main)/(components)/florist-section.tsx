'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const florists = [
  { id: 1, name: '보랏빛제비꽃', initial: 'B' },
  { id: 2, name: '프리지아', initial: 'F' },
  { id: 3, name: '노란장미', initial: 'Y' },
  { id: 4, name: '진달래', initial: 'P' },
];

export function FloristSection() {
  return (
    <div className="w-full h-[500px] bg-gray-50">
      <div className="flex flex-col md:flex-row items-center gap-8 h-full w-full">
        {/* 타이틀 섹션 */}
        <div className="md:w-1/3 text-center h-full md:text-left flex flex-col justify-center items-end bg-gray-300">
          <span className="text-sm text-gray-500">florary</span>
          <h2 className="text-2xl font-bold mt-2">꽃을 소개합니다.</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm">
              추천 꽃
            </button>
            <button className="text-gray-500 text-sm">
              새로운 꽃
            </button>
            <button className="text-gray-500 text-sm">
              꽃 감상평
            </button>
          </div>
        </div>

        {/* 플로리스트 프로필 */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
          {florists.map((florist) => (
            <div key={florist.id} className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {florist.initial}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold">{florist.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 