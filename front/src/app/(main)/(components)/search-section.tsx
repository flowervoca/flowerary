'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";
import { useState } from "react";

export function SearchSection() {
  const [activeTab, setActiveTab] = useState<'flower' | 'meaning'>('flower');

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[760px] h-[156px] flex flex-col items-center justify-between">
          {/* 타이틀 섹션 */}
          <div className="text-center mb-4 text-2xl md:text-3xl font-bold">
            꽃과 함께하는 공간, 플로러리
          </div>

          {/* 탭 전환 섹션 */}
          <div className="flex justify-center mb-4 w-[280px] h-[52px]">
            <div className="flex rounded-full p-1 bg-[#D8E4DE] gap-0 w-full h-full">
              <Button
                variant="ghost"
                className={`rounded-full px-4 md:px-6 font-semibold shadow-none border-none transition-all w-1/2 h-full
                  ${activeTab === 'flower' ? 'bg-white text-primary' : 'bg-transparent'}
                `}
                style={{
                  color: activeTab === 'flower' ? '' : '#6F8278',
                  backgroundColor: activeTab === 'flower' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onClick={() => setActiveTab('flower')}
              >
                꽃 검색
              </Button>
              <Button
                variant="ghost"
                className={`rounded-full px-4 md:px-6 font-semibold shadow-none border-none transition-all w-1/2 h-full
                  ${activeTab === 'meaning' ? 'bg-white text-primary' : 'bg-transparent'}
                `}
                style={{
                  color: activeTab === 'meaning' ? '' : '#6F8278',
                  backgroundColor: activeTab === 'meaning' ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                onClick={() => setActiveTab('meaning')}
              >
                꽃말 검색
              </Button>
            </div>
          </div>

          {/* 검색어 섹션 */}
          <div className="flex justify-center w-full h-[80px]">
            <div className="flex items-center w-full max-w-[760px] h-full border border-primary rounded-full px-4 py-2 bg-background">
              <Input
                type="search"
                placeholder="꽃의 이름을 검색하세요"
                className="border-none focus:ring-0 bg-transparent flex-1 text-base text-foreground placeholder:text-center"
                style={{ textAlign: 'center' }}
                onFocus={e => e.target.style.textAlign = 'left'}
                onBlur={e => e.target.value === '' ? e.target.style.textAlign = 'center' : null}
              />
              <Calendar className="w-5 h-5 text-primary mr-3 cursor-pointer" />
              <Search className="w-5 h-5 text-primary cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 