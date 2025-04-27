'use client';

import { useState, useEffect } from 'react';
import { FlowerCard } from '@/components/shared/flower-card';
import { IFlower } from '@/types';
import { Search, Calendar, RotateCcw } from 'lucide-react';
import flowerDummyData from './flower-dummy.json';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
  result: IFlowerResponse[];
  status: string;
  message: string;
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

  // 꽃 목록 데이터 가져오기
  useEffect(() => {
    const fetchFlowerList = async () => {
      try {
        setIsLoading(true);

        // API 호출 시도 - 실패할 경우 바로 더미 데이터 사용
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            5000,
          );

          const response = await fetch(
            'http://112.216.98.130:18080/api/flower/getFlowerList',
            {
              signal: controller.signal,
              mode: 'cors', // CORS 명시적 설정
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(
              `서버 응답 오류: ${response.status}`,
            );
          }

          const data: IFlowerListResponse =
            await response.json();

          if (data && data.result) {
            // API 응답 데이터를 IFlower[] 형식으로 변환
            const flowers: IFlower[] = data.result.map(
              (flower) => ({
                f_low_nm: flower.f_low_nm,
                f_low_lang: flower.f_low_lang,
                f_content: flower.f_content,
                f_img: flower.img_url1,
              }),
            );

            setFlowerList(flowers);
            setFilteredFlowers(flowers);
            return;
          }
        } catch (apiError) {
          console.error('API 호출 실패:', apiError);
          throw new Error('API 서버에 연결할 수 없습니다.');
        }
      } catch (err) {
        console.error('꽃 목록 fetch 오류:', err);
        setError(
          '꽃 목록을 불러오는 중 오류가 발생했습니다. 대체 데이터를 사용합니다.',
        );

        // API 오류 시 더미 데이터 사용 (flower-dummy.json에서 가져옴)
        const dummyFlowers: IFlower[] = flowerDummyData.map(
          (flower) => ({
            f_low_nm: flower.f_low_nm,
            f_low_lang: flower.f_low_lang,
            f_content: flower.f_content,
            f_img: flower.img_url1,
          }),
        );
        setFlowerList(dummyFlowers);
        setFilteredFlowers(dummyFlowers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlowerList();
  }, []);

  // todo: 로딩 인디케이터 or 스켈레톤 적용
  if (isLoading) {
    return (
      <div className='container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]'>
        <div className='text-xl font-medium'>로딩중</div>
      </div>
    );
  }

  if (error && flowerList.length === 0) {
    return (
      <div className='container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]'>
        <div className='text-red-500 text-center max-w-md'>
          <div className='text-xl font-medium mb-2'>
            오류가 발생했습니다
          </div>
          <p>{error}</p>
        </div>
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
          <Tabs
            className='flex w-full max-w-2xl justify-center items-center'
            defaultValue='flowerName'
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
            <div className='relative w-full mt-4 flex rounded-full border-2 border-primary py-3 px-8 gap-4'>
              <TabsContent value='flowerName'>
                <input
                  type='text'
                  placeholder='꽃의 이름을 검색하세요!'
                  className='w-full  text-center text-lg'
                />
              </TabsContent>
              <TabsContent value='flowerLang'>
                <input
                  type='text'
                  placeholder='꽃말을 검색하세요!'
                  className='w-full text-center text-lg'
                />
              </TabsContent>
              <button>
                <Calendar className='w-5 h-5 text-primary' />
                {/* Todo: datepicker 적용 */}
                <span className='sr-only'>날짜 선택</span>
              </button>
              <button>
                <Search className='w-5 h-5 text-primary' />
                <span className='sr-only'>검색</span>
              </button>
            </div>
          </Tabs>
        </article>

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
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
