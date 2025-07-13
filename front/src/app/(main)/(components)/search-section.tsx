'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SearchTabType } from '@/types/search';

export function SearchSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<SearchTabType>('flowerName');
  const [flowerNameInput, setFlowerNameInput] =
    useState<string>('');
  const [flowerDescInput, setFlowerDescInput] =
    useState<string>('');
  const [searchDate, setSearchDate] = useState<
    Date | undefined
  >(undefined);

  // 검색 실행 함수
  const handleSearch = () => {
    // 검색 조건 검증
    const hasFlowerName =
      activeTab === 'flowerName' && flowerNameInput.trim();
    const hasFlowerDesc =
      activeTab === 'flowerDesc' && flowerDescInput.trim();
    const hasDate = searchDate;

    if (!hasFlowerName && !hasFlowerDesc && !hasDate) {
      alert('검색 조건을 하나 이상 입력해주세요.');
      return;
    }

    // URL 쿼리 파라미터 구성
    const params = new URLSearchParams();

    if (hasFlowerName) {
      params.set('flowNm', flowerNameInput.trim());
      params.set('searchType', 'flowerName');
    } else if (hasFlowerDesc) {
      params.set('tagName', flowerDescInput.trim());
      params.set('searchType', 'flowerDesc');
    }

    if (searchDate) {
      params.set(
        'fmonth',
        String(searchDate.getMonth() + 1),
      );
      params.set('fday', String(searchDate.getDate()));
    }

    // 검색 페이지로 이동
    router.push(`/search?${params.toString()}`);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className='w-full'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-[760px] h-[156px] flex flex-col items-center justify-between'>
          {/* 타이틀 섹션 */}
          <div className='text-center mb-4 text-2xl md:text-3xl font-bold'>
            꽃과 함께하는 공간, 플로러리
          </div>

          {/* 탭 전환 섹션 */}
          <div className='flex justify-center mb-4 w-[280px] h-[52px]'>
            <div className='flex rounded-full p-1 bg-[#D8E4DE] gap-0 w-full h-full relative'>
              {/* 슬라이딩 배경 */}
              <div
                className={`absolute h-[calc(100%-0.5rem)] rounded-full bg-white transition-all duration-300 ease-in-out ${
                  activeTab === 'flowerName'
                    ? 'left-1 w-[calc(50%-0.5rem)]'
                    : 'left-[calc(50%+0.25rem)] w-[calc(50%-0.5rem)]'
                }`}
              />
              <Button
                variant='ghost'
                className={`rounded-full px-4 md:px-6 font-semibold shadow-none border-none transition-all w-1/2 h-full relative z-10
                  ${activeTab === 'flowerName' ? 'text-primary' : 'text-[#6F8278]'}`}
                onClick={() => setActiveTab('flowerName')}
              >
                꽃이름 검색
              </Button>
              <Button
                variant='ghost'
                className={`rounded-full px-4 md:px-6 font-semibold shadow-none border-none transition-all w-1/2 h-full relative z-10
                  ${activeTab === 'flowerDesc' ? 'text-primary' : 'text-[#6F8278]'}`}
                onClick={() => setActiveTab('flowerDesc')}
              >
                꽃말 검색
              </Button>
            </div>
          </div>

          {/* 검색어 섹션 */}
          <form
            onSubmit={handleSubmit}
            className='flex justify-center w-full h-[80px]'
          >
            <div className='flex items-center w-full max-w-[760px] h-full border border-primary rounded-full px-4 py-2 bg-background'>
              <Input
                type='search'
                placeholder={
                  activeTab === 'flowerName'
                    ? '꽃의 이름을 검색하세요'
                    : '꽃말을 검색하세요'
                }
                value={
                  activeTab === 'flowerName'
                    ? flowerNameInput
                    : flowerDescInput
                }
                onChange={(e) =>
                  activeTab === 'flowerName'
                    ? setFlowerNameInput(e.target.value)
                    : setFlowerDescInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                className='border-none focus:ring-0 bg-transparent flex-1 text-base text-foreground placeholder:text-center'
                style={{ textAlign: 'center' }}
                onFocus={(e) =>
                  (e.target.style.textAlign = 'left')
                }
                onBlur={(e) =>
                  e.target.value === ''
                    ? (e.target.style.textAlign = 'center')
                    : null
                }
              />

              {/* 날짜 선택 */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='p-0 h-auto w-auto mr-3'
                  >
                    <Calendar className='w-5 h-5 text-primary cursor-pointer' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0'
                  align='end'
                >
                  <CalendarComponent
                    mode='single'
                    selected={searchDate}
                    onSelect={setSearchDate}
                    locale={ko}
                    initialFocus
                  />
                  {searchDate && (
                    <div className='p-3 border-t'>
                      <div className='text-sm text-gray-600 mb-2'>
                        선택된 날짜:{' '}
                        {format(searchDate, 'M월 d일', {
                          locale: ko,
                        })}
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setSearchDate(undefined)
                        }
                        className='w-full'
                      >
                        날짜 초기화
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* 검색 버튼 */}
              <Button
                type='submit'
                variant='ghost'
                size='sm'
                className='p-0 h-auto w-auto'
              >
                <Search className='w-5 h-5 text-primary cursor-pointer' />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
