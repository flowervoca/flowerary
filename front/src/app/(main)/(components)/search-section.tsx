'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const searchTags = ['#여자친구선물', '#꽃추천', '#고백꽃'];

const categories = [
  { id: 1, name: '꽃말확인하기', icon: '🌸' },
  { id: 2, name: '기념일 추천', icon: '💐' },
  { id: 3, name: '감정 추천', icon: '🌺' },
  { id: 4, name: '가격별 추천', icon: '🌷' },
  { id: 5, name: '근처 꽃집 보기', icon: '🏪' },
  { id: 6, name: '꽃말확인하기', icon: '🌸' },
  { id: 7, name: '기념일 추천', icon: '💐' },
  { id: 8, name: '감정 추천', icon: '🌺' },
  { id: 9, name: '가격별 추천', icon: '🌷' },
  { id: 10, name: '근처 꽃집 보기', icon: '🏪' },
];

export function SearchSection() {
  return (
    <div className="container mx-auto px-2 py-20">
      <div className="grid grid-cols-12 gap-2">
        {/* 오늘의 꽃 섹션 - 왼쪽 4칸 */}
        <div className="col-span-4 bg-gray-200 rounded-lg aspect-square flex items-center justify-center max-h-[480px]">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">오늘의 꽃</h3>
            <div className="w-60 h-60 bg-gray-300 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* 오른쪽 섹션 - 8칸 */}
        <div className="col-span-8 h-full max-h-[480px]">
          <div className="h-full flex flex-col">
            {/* 검색 섹션 */}
            <div className="mb-6">
              <div className="relative flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="찾으시는 검색어를 입력하세요."
                    className="h-16 pl-4 text-lg [&:not(:placeholder-shown)]:text-lg"
                    style={{ fontSize: '1.125rem' }}
                  />
                </div>
                <Button variant="secondary" className="h-16 w-16 px-0 bg-gray-100 hover:bg-gray-200">
                  <Search strokeWidth={2.5} size={20} />
                </Button>
                <Button variant="default" className="h-16 px-8 bg-gray-800 hover:bg-gray-900 text-white text-lg">
                  상세검색
                </Button>
              </div>

              {/* 검색 태그 */}
              <div className="flex flex-wrap gap-3">
                {searchTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 카테고리 그리드 */}
            <div className="flex-1 border border-gray-100 rounded-lg p-5">
              <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-6xl mb-3">{category.icon}</span>
                    <span className="text-base text-center font-semibold text-gray-800">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 