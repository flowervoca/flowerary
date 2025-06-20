'use client';

import { useArticles } from '@/hooks/use-articles';
import { ArticleFilter } from './components/article-filter';
import { ArticleList } from './components/article-list';
import { Header } from '@/components/common/header';
export default function ColumnPage() {
  const {
    articles,
    isLoading,
    error,
    totalCount,
    handleFilter,
    handleLoadAll,
    clearError,
  } = useArticles();

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 text-lg mb-4'>
            {error}
          </p>
          <button
            onClick={clearError}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/80'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />{' '}
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <div className='space-y-8'>
          {/* 페이지 제목 */}
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-2'>
              플로리스트 칼럼
            </h1>
            <p className='text-gray-600'>
              전문 플로리스트들의 꽃과 관련된 다양한
              이야기를 만나보세요
            </p>
          </div>

          {/* 필터링 섹션 */}
          <ArticleFilter
            onFilter={handleFilter}
            onLoadAll={handleLoadAll}
            isLoading={isLoading}
          />

          {/* 칼럼 목록 */}
          <ArticleList
            articles={articles}
            totalCount={totalCount}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
