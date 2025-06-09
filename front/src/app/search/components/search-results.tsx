import { FlowerCard } from '@/components/shared/flower-card';
import { IFlower } from '@/types';
import { SearchX } from 'lucide-react';

interface ISearchResultsProps {
  flowers: IFlower[];
  isLoading: boolean;
  error: string | null;
  keyword: string;
}

export function SearchResults({
  flowers,
  isLoading,
  error,
  keyword,
}: ISearchResultsProps) {
  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center min-h-[50vh]'>
        <div className='text-xl font-medium'>로딩중</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 flex flex-col gap-5 items-center justify-center min-h-[50vh]'>
        <SearchX className='w-16 h-16 text-gray-300' />
        <div className='text-xl font-medium'>
          검색 결과가 없습니다
        </div>
      </div>
    );
  }

  if (flowers.length === 0) {
    return (
      <div className='flex-1 flex flex-col gap-5 items-center justify-center min-h-[50vh]'>
        <SearchX className='w-16 h-16 text-gray-300' />
        <div className='text-xl font-medium mb-2'>
          검색 결과가 없습니다
        </div>
      </div>
    );
  }

  return (
    <main className='flex-1'>
      <div className='mb-6'>
        <h2 className='text-xl font-bold mb-2'>
          검색 결과 ({flowers.length}개)
        </h2>
        <p className='text-gray-600'>
          <span className='text-primary font-medium'>
            {keyword}
          </span>
          에 대한 검색 결과입니다.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
        {flowers.map((flower, index) => (
          <FlowerCard
            key={`${flower.f_low_nm}-${index}`}
            flower={flower}
          />
        ))}
      </div>
    </main>
  );
}
