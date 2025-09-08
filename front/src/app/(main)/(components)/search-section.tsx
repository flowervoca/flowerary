'use client';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
          <div className='flex justify-center mb-4 w-full max-w-2xl'>
            <Tabs
              className='flex w-full justify-center items-center'
              defaultValue='flowerName'
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as SearchTabType)
              }
            >
              <TabsList className='bg-secondary p-1 rounded-full h-12'>
                <TabsTrigger
                  value='flowerName'
                  className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
                >
                  꽃 검색
                </TabsTrigger>
                <TabsTrigger
                  value='flowerDesc'
                  className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
                >
                  꽃말 검색
                </TabsTrigger>
              </TabsList>

              {/* 검색어 섹션 */}
              <div className='relative w-full mt-4 flex rounded-full border-2 border-primary py-3 px-8 gap-4 bg-white'>
                <TabsContent
                  value='flowerName'
                  className='w-full'
                >
                  <input
                    id='flowerName'
                    type='text'
                    placeholder='꽃의 이름을 검색하세요!'
                    className='w-full h-full text-center text-lg outline-none focus:outline-none active:outline-none'
                    value={flowerNameInput}
                    onChange={(e) =>
                      setFlowerNameInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TabsContent>
                <TabsContent
                  value='flowerDesc'
                  className='w-full'
                >
                  <input
                    id='flowerDesc'
                    type='text'
                    placeholder='꽃의 설명을 검색하세요!'
                    className='w-full h-full text-center text-lg outline-none focus:outline-none active:outline-none'
                    value={flowerDescInput}
                    onChange={(e) =>
                      setFlowerDescInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TabsContent>

                {/* 선택된 날짜 표시 */}
                {searchDate && (
                  <div className='flex justify-center mb-4 absolute top-2.5 right-28'>
                    <div className='inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm text-primary'>
                      <span>
                        {format(searchDate, 'M월 d일', {
                          locale: ko,
                        })}{' '}
                        ({searchDate.getMonth() + 1}월{' '}
                        {searchDate.getDate()}일)
                      </span>
                      <button
                        onClick={() =>
                          setSearchDate(undefined)
                        }
                        className='hover:bg-primary/20 rounded-full p-1'
                        type='button'
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* 날짜 선택 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='ghost'
                      className='p-0 h-auto bg-transparent hover:bg-transparent w-8 h-8'
                      type='button'
                    >
                      <Calendar className='!w-5 !h-5 text-primary' />
                      <span className='sr-only'>
                        날짜 선택
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='center'
                  >
                    <CalendarComponent
                      mode='single'
                      selected={searchDate}
                      onSelect={setSearchDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* 검색 버튼 */}
                <button
                  type='button'
                  onClick={handleSearch}
                >
                  <Search className='w-5 h-5 text-primary' />
                  <span className='sr-only'>검색</span>
                </button>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
