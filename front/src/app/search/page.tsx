'use client';

import { useState, useEffect } from 'react';
import { FlowerCard } from '@/components/shared/flower-card';
import { IFlower } from '@/types';
import { Search, Calendar, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// API 응답 타입 정의
interface IFlowerResponse {
  f_pk?: number;
  f_low_nm: string;
  f_low_lang: string;
  f_content: string;
  img_url1: string;
  f_reg_dt?: string;
  f_reg_id?: string;
}

interface IFlowerListResponse {
  resultMsg: string;
  totalCount: number;
  data: IFlowerResponse[];
}

// 필터 타입 정의
interface IFilters {
  seasons: string[];
  tags: string[];
  events: string[];
  colors: string[];
}

// 필터 초기값
const initialFilters: IFilters = {
  seasons: [],
  tags: [],
  events: [],
  colors: [],
};

// 계절 데이터
const seasonOptions = ['봄', '여름', '가을', '겨울'];

// 기념일 데이터 (임시)
const eventOptions = [
  '발렌타인데이',
  '화이트데이',
  '입학식',
  '졸업식',
];

// 색상 데이터 (임시)
const colorOptions = ['빨간색', '분홍색', '노란색', '흰색'];

export default function SearchPage() {
  const [flowerList, setFlowerList] = useState<IFlower[]>(
    [],
  );
  const [filteredFlowers, setFilteredFlowers] = useState<
    IFlower[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<IFilters>(initialFilters);
  const [availableTags, setAvailableTags] = useState<
    string[]
  >([]);
  const [searchDate, setSearchDate] = useState<
    Date | undefined
  >(undefined);
  const [dateValues, setDateValues] = useState<{
    fday: string;
    fmonth: string;
  }>({ fday: '', fmonth: '' });
  const [flowerNameInput, setFlowerNameInput] =
    useState<string>('');
  const [flowerLangInput, setFlowerLangInput] =
    useState<string>('');
  const [activeTab, setActiveTab] =
    useState<string>('flowerName');

  // 검색 키워드는 상수로 정의
  const keyword = '꽃';

  // 태그 목록 추출 (꽃말 목록)
  useEffect(() => {
    if (flowerList.length > 0) {
      // 쉼표로 구분된 꽃말을 개별 태그로 분리하고 중복 제거
      const allTags = flowerList.flatMap((flower) =>
        flower.f_low_lang
          .split(',')
          .map((tag) => tag.trim()),
      );
      const tags = [...new Set(allTags)];
      setAvailableTags(tags);
    }
  }, [flowerList]);

  // 필터 적용
  useEffect(() => {
    if (flowerList.length === 0) return;

    let result = [...flowerList];

    // 태그 필터링 (쉼표로 구분된 꽃말 고려)
    if (filters.tags.length > 0) {
      result = result.filter((flower) => {
        const flowerTags = flower.f_low_lang
          .split(',')
          .map((tag) => tag.trim());
        return filters.tags.some((tag) =>
          flowerTags.includes(tag),
        );
      });
    }

    // 계절, 이벤트, 색상 필터링은 그대로 유지
    setFilteredFlowers(result);
  }, [flowerList, filters]);

  // 필터 토글 핸들러
  const toggleFilter = (
    type: keyof IFilters,
    value: string,
  ) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      return {
        ...prev,
        [type]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // 날짜 선택 핸들러
  const handleDateChange = (
    date: Date | undefined,
    values?: { fday: string; fmonth: string },
  ) => {
    setSearchDate(date);
    if (values) {
      // API 형식에 맞게 가공 (fday: mm, fmonth: dd)
      setDateValues(values);
    } else {
      setDateValues({ fday: '', fmonth: '' });
    }
  };

  // 날짜 초기화 핸들러
  const clearSearchDate = () => {
    setSearchDate(undefined);
    setDateValues({ fday: '', fmonth: '' });
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 검색 실행 함수
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 검색할 꽃 이름 (현재 활성화된 탭에 따라 다른 입력값 사용)
      const flowNm =
        activeTab === 'flowerName'
          ? flowerNameInput
          : flowerLangInput;

      // API 요청 데이터
      const requestData = {
        flowNm: flowNm || '꽃', // 테스트용 기본값
        fday: dateValues.fday || '',
        fmonth: dateValues.fmonth || '',
      };

      console.log('검색 요청 데이터:', requestData);

      // API 호출 (타임아웃 설정)
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        8000,
      ); // 8초 타임아웃

      try {
        // API 요청 전송 (내부 API 라우트 사용)
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // 응답 결과 처리
        const data = await response
          .json()
          .catch(() => null);
        console.log('API 응답 데이터:', data);

        if (!response.ok) {
          if (
            response.status === 404 ||
            (data &&
              data.resultMsg === '해당 꽃이 없습니다.')
          ) {
            setFlowerList([]);
            setFilteredFlowers([]);
            setError(
              '해당하는 꽃이 없습니다. 다른 검색어를 입력해 보세요.',
            );
            return;
          }
          throw new Error(
            `서버 응답 오류: ${response.status}`,
          );
        }

        if (data && data.data && data.data.length > 0) {
          // API 응답 데이터를 IFlower[] 형식으로 변환
          const flowers: IFlower[] = data.data.map(
            (flower: IFlowerResponse) => ({
              f_low_nm: flower.f_low_nm,
              f_low_lang: flower.f_low_lang,
              f_content: flower.f_content,
              f_img: flower.img_url1,
            }),
          );

          setFlowerList(flowers);
          setFilteredFlowers(flowers);
        } else {
          setFlowerList([]);
          setFilteredFlowers([]);
          setError(
            '검색 결과가 없습니다. 다른 검색어를 입력해 보세요.',
          );
        }
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === 'AbortError'
        ) {
          throw new Error(
            'API 요청 시간이 초과되었습니다. 서버 연결을 확인해주세요.',
          );
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('꽃 검색 오류:', err);
      setError(
        err instanceof Error
          ? `꽃 정보를 불러오는 중 오류가 발생했습니다: ${err.message}`
          : '꽃 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.',
      );
      setFlowerList([]);
      setFilteredFlowers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 페이지 로드시 데이터 초기화
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className='container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]'>
        <div className='text-xl font-medium'>로딩중</div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800'>
          <span className='text-primary'>{keyword}</span>에
          대한 검색 결과
        </h1>
        <article
          id='search'
          className='my-8 flex justify-center'
        >
          <h2 className='sr-only'>검색</h2>
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-2xl'
          >
            <Tabs
              className='flex w-full justify-center items-center'
              defaultValue='flowerName'
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className='bg-[#D8E4DE] p-1 rounded-full h-12'>
                <TabsTrigger
                  value='flowerName'
                  className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
                >
                  꽃 검색
                </TabsTrigger>
                <TabsTrigger
                  value='flowerLang'
                  className='text-lg rounded-full py-4 px-16 flex-1 text-gray-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold'
                >
                  꽃말 검색
                </TabsTrigger>
              </TabsList>
              <div className='relative w-full mt-4 flex rounded-full border-2 border-primary py-3 px-8 gap-4 bg-white'>
                <TabsContent
                  value='flowerName'
                  className='w-full'
                >
                  <input
                    id='flowerName'
                    type='text'
                    placeholder='꽃의 이름을 검색하세요!'
                    className='w-full text-center text-lg'
                    value={flowerNameInput}
                    onChange={(e) =>
                      setFlowerNameInput(e.target.value)
                    }
                  />
                </TabsContent>
                <TabsContent
                  value='flowerLang'
                  className='w-full'
                >
                  <input
                    id='flowerLang'
                    type='text'
                    placeholder='꽃말을 검색하세요!'
                    className='w-full text-center text-lg'
                    value={flowerLangInput}
                    onChange={(e) =>
                      setFlowerLangInput(e.target.value)
                    }
                  />
                </TabsContent>
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
                      onSelect={(
                        date: Date | undefined,
                      ) => {
                        if (date) {
                          const day = String(
                            date.getDate(),
                          ).padStart(2, '0');
                          const month = String(
                            date.getMonth() + 1,
                          ).padStart(2, '0');
                          // API 요구사항에 맞게 변경: fday는 날짜, fmonth는 월
                          handleDateChange(date, {
                            fday: day,
                            fmonth: month,
                          });
                        } else {
                          handleDateChange(undefined);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <button type='submit'>
                  <Search className='w-5 h-5 text-primary' />
                  <span className='sr-only'>검색</span>
                </button>
              </div>
            </Tabs>
          </form>
        </article>

        {/* 선택된 날짜 표시 */}
        {searchDate && (
          <div className='flex justify-center mb-4'>
            <div className='inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm text-primary'>
              <span>
                선택한 날짜: {formatDate(searchDate)}
              </span>
              <button
                onClick={clearSearchDate}
                className='hover:bg-primary/20 rounded-full p-1'
                type='button'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className='flex flex-col md:flex-row gap-6'>
          {/* 필터 섹션 */}
          <aside
            id='filter'
            className='w-full md:w-64 shrink-0'
          >
            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>필터</h2>
                <Button
                  variant='outline'
                  onClick={resetFilters}
                >
                  <RotateCcw className='w-3 h-3 mr-1' />
                  초기화
                </Button>
              </div>

              {/* 계절 필터 */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold mb-2'>
                  계절
                </h3>
                <div className='space-y-1'>
                  {seasonOptions.map((season) => (
                    <div
                      key={season}
                      className='flex items-center'
                    >
                      <input
                        type='checkbox'
                        id={`season-${season}`}
                        checked={filters.seasons.includes(
                          season,
                        )}
                        onChange={() =>
                          toggleFilter('seasons', season)
                        }
                        className='w-4 h-4 rounded'
                      />
                      <label
                        htmlFor={`season-${season}`}
                        className='ml-2 text-sm'
                      >
                        {season}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 태그 필터 (꽃말) */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold mb-2'>
                  태그
                </h3>
                <div className='space-y-1 max-h- 48 overflow-y-auto'>
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className='flex items-center'
                    >
                      <input
                        type='checkbox'
                        id={`tag-${tag}`}
                        checked={filters.tags.includes(tag)}
                        onChange={() =>
                          toggleFilter('tags', tag)
                        }
                        className='w-4 h-4 rounded'
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className='ml-2 text-sm'
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 기념일 필터 */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold mb-2'>
                  기념일
                </h3>
                <div className='space-y-1'>
                  {eventOptions.map((event) => (
                    <div
                      key={event}
                      className='flex items-center'
                    >
                      <input
                        type='checkbox'
                        id={`event-${event}`}
                        checked={filters.events.includes(
                          event,
                        )}
                        onChange={() =>
                          toggleFilter('events', event)
                        }
                        className='w-4 h-4 rounded'
                      />
                      <label
                        htmlFor={`event-${event}`}
                        className='ml-2 text-sm'
                      >
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 색상 필터 */}
              <div className='mb-4'>
                <h3 className='text-lg font-bold mb-2'>
                  색상
                </h3>
                <div className='space-y-1'>
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      className='flex items-center'
                    >
                      <input
                        type='checkbox'
                        id={`color-${color}`}
                        checked={filters.colors.includes(
                          color,
                        )}
                        onChange={() =>
                          toggleFilter('colors', color)
                        }
                        className='w-4 h-4 rounded'
                      />
                      <label
                        htmlFor={`color-${color}`}
                        className='ml-2 text-sm'
                      >
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 꽃 목록 */}
          <div className='flex-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4'>
              {filteredFlowers.map((flower, index) => (
                <FlowerCard
                  key={index}
                  flower={flower}
                  mode='white'
                  className='h-full'
                />
              ))}
            </div>

            {filteredFlowers.length === 0 && (
              <div className='text-center py-10'>
                <p className='text-gray-500'>
                  {error
                    ? error
                    : flowerNameInput || flowerLangInput
                      ? '검색 결과가 없습니다. 다른 검색어를 입력해보세요.'
                      : '검색어를 입력하세요.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
