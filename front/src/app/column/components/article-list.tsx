'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import type { IArticle } from '@/types/article';
import { Flower2 } from 'lucide-react';

interface IArticleListProps {
  articles: IArticle[];
  totalCount: number;
  isLoading: boolean;
}

export function ArticleList({
  articles,
  totalCount,
  isLoading,
}: IArticleListProps) {
  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 text-lg'>
          칼럼을 불러오는 중...
        </p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className='text-center py-12'>
        <Flower2 className='w-12 h-12 text-gray-300 mx-auto mb-4' />
        <p className='text-gray-500 text-lg'>
          등록된 칼럼이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 mb-12'>
      {/* 총 개수 표시 */}
      <div className='flex justify-start gap-2 items-center'>
        <Flower2 className='w-6 h-6 text-gray-300' />
        <h3 className='text-lg font-semibold'>
          총{' '}
          <span className='text-primary'>{totalCount}</span>
          개의 칼럼이 있습니다
        </h3>
      </div>

      {/* 칼럼 카드 리스트 */}
      <div className='w-full grid grid-cols-3 gap-4'>
        {articles.map((article) => (
          <Card
            key={article.id}
            className='w-full rounded-2xl shadow-none border-0 bg-[#F1F1F3] p-0 flex flex-col mx-auto overflow-hidden'
          >
            <div className='rounded-t-2xl px-6 py-16 flex flex-col space-y-4'>
              {/* 서브 타이틀 */}
              {article.subTitle && (
                <div className='inline-flex self-start px-3 py-1 bg-white text-[#757575] text-xs rounded-full mb-3 font-medium'>
                  {article.subTitle}
                </div>
              )}

              {/* 제목 */}
              <div className='text-xl font-bold truncate text-black'>
                {article.title}
              </div>

              {/* 설명 */}
              <div className='text-sm mb-4 line-clamp-4 text-[#757575]'>
                {article.content}
              </div>
            </div>

            {/* 이미지 영역 */}
            {article.image && (
              <div className='relative w-full h-[230px] rounded-b-2xl overflow-hidden'>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
