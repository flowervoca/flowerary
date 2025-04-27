'use client';

import { useState, useEffect } from 'react';
import { FlowerCard } from '@/components/shared/flower-card';
import { IFlower } from '@/types';
import { Search, RotateCcw } from 'lucide-react';
import flowerDummyData from './flower-dummy.json';

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
      const tags = [
        ...new Set(
          flowerList.map((flower) => flower.f_low_lang),
        ),
      ];
      setAvailableTags(tags);
    }
  }, [flowerList]);

  // 필터 적용
  useEffect(() => {
    if (flowerList.length === 0) return;

    let result = [...flowerList];

    // 태그 필터링
    if (filters.tags.length > 0) {
      result = result.filter((flower) =>
        filters.tags.includes(flower.f_low_lang),
      );
    }

    // 계절, 이벤트, 색상 필터링은 API에서 필요한 데이터가 제공되면 구현
    // 현재는 데모 용도로 일부만 필터링

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

  if (isLoading) {
    return (
      <div className='container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]'>
        <div className='text-xl font-medium'>
          데이터를 불러오는 중...
        </div>
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

        <div className='my-8 flex justify-center'>
          <div className='relative w-full max-w-2xl'>
            <input
              type='text'
              placeholder='꽃을 검색해보세요!'
              className='w-full px-4 py-3 rounded-full border border-2 border-primary text-center text-lg'
            />
            <button className='absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full'>
              <Search className='w-5 h-5 text-primary' />
            </button>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          {/* 필터 섹션 */}
          <aside
            id='filter'
            className='w-full md:w-64 shrink-0'
          >
            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>필터</h2>
                <button
                  onClick={resetFilters}
                  className='text-primary text-sm flex items-center'
                >
                  <RotateCcw className='w-3 h-3 mr-1' />
                  초기화
                </button>
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
                <div className='space-y-1 max-h-40 overflow-y-auto'>
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
