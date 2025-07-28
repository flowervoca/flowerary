'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useArticles } from '@/hooks/use-articles';
import type { IArticle } from '@/types/article';

// 정적 이미지 import (API 보강 전까지 사용)
import floristImage1 from '@/assets/images/florist/florist_1.png';

export function FloristSection() {
  const { articles, isLoading, error } = useArticles();
  const [displayCount, setDisplayCount] = useState(3); // 표시할 카드 개수

  // 디버깅: articles 데이터 확인
  console.log('🔍 FloristSection - articles:', articles);
  if (articles.length > 0) {
    console.log(
      '🔍 FloristSection - 첫 번째 article:',
      articles[0],
    );
    console.log(
      '🔍 FloristSection - imgPath:',
      articles[0].imgPath,
    );
    console.log(
      '🔍 FloristSection - 모든 필드:',
      Object.keys(articles[0]),
    );
  }
  const [selectedArticle, setSelectedArticle] =
    useState<IArticle | null>(null); // 선택된 아티클
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 표시할 아티클 목록 (최대 displayCount개)
  const displayedArticles = articles.slice(0, displayCount);

  // 더 보기 버튼 핸들러
  const handleLoadMore = () => {
    setDisplayCount((prev) =>
      Math.min(prev + 3, articles.length),
    );
  };

  // 카드 클릭 핸들러
  const handleCardClick = (article: IArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <section className='w-full'>
        <h2 className='mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard'>
          플로리스트 칼럼{' '}
          <span role='img' aria-label='연필'>
            📝
          </span>
        </h2>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>
            칼럼을 불러오는 중...
          </p>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section className='w-full'>
        <h2 className='mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard'>
          플로리스트 칼럼{' '}
          <span role='img' aria-label='연필'>
            📝
          </span>
        </h2>
        <div className='text-center py-12'>
          <p className='text-red-500 text-lg'>{error}</p>
        </div>
      </section>
    );
  }

  // 아티클이 없는 경우
  if (displayedArticles.length === 0) {
    return (
      <section className='w-full'>
        <h2 className='mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard'>
          플로리스트 칼럼{' '}
          <span role='img' aria-label='연필'>
            📝
          </span>
        </h2>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>
            등록된 칼럼이 없습니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='w-full'>
        {/* 타이틀 */}
        <h2 className='mb-2 flex items-center gap-2 font-bold text-[40px] font-pretendard'>
          플로리스트 칼럼{' '}
          <span role='img' aria-label='연필'>
            📝
          </span>
        </h2>

        {/* 칼럼 카드 리스트 */}
        <div className='w-full flex flex-col md:flex-row gap-6 flex-wrap'>
          {displayedArticles.map((article) => (
            <Card
              key={article.id}
              className='w-[430px] rounded-2xl shadow-none border-0 bg-[#F1F1F3] p-0 flex flex-col mx-auto overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
              onClick={() => handleCardClick(article)}
            >
              {/* 텍스트 영역 */}
              <div className='rounded-t-2xl px-6 pt-6 pb-4 flex flex-col'>
                {article.subTitle && (
                  <div className='inline-flex self-start px-3 py-1 bg-white text-[#757575] text-xs rounded-full mb-3 font-medium'>
                    {article.subTitle}
                  </div>
                )}
                <div className='text-lg font-bold mb-2 leading-snug text-black'>
                  {article.title}
                </div>
                <div className='text-sm mb-4 line-clamp-2 text-[#757575]'>
                  {article.content}
                </div>
              </div>

              {/* 이미지 영역 */}
              <div className='relative w-full h-[230px] rounded-b-2xl overflow-hidden'>
                {/* API imgPath 사용 */}
                {article.imgPath ? (
                  <Image
                    src={article.imgPath}
                    alt={article.title}
                    fill
                    className='object-cover rounded-b-2xl'
                    sizes='(max-width: 768px) 100vw, 430px'
                  />
                ) : (
                  /* 대체 이미지 */
                  <Image
                    src={floristImage1}
                    alt={article.title}
                    fill
                    className='object-cover rounded-b-2xl'
                    sizes='(max-width: 768px) 100vw, 430px'
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {displayCount < articles.length && (
          <div className='flex justify-center mt-6'>
            <Button
              onClick={handleLoadMore}
              className='px-8 py-2 rounded-full bg-[#EEEEEE] text-gray-800 font-bold shadow transition hover:bg-gray-200'
              variant='ghost'
            >
              뉴스 전체보기
            </Button>
          </div>
        )}
      </section>

      {/* 상세보기 모달 */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className='max-w-4xl max-h-[80dvh] h-[800px] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <div className='space-y-6'>
              {/* 부제목 */}
              {selectedArticle.subTitle && (
                <div className='inline-flex px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full font-medium'>
                  {selectedArticle.subTitle}
                </div>
              )}

              {/* 이미지 영역 */}
              <div className='relative w-full h-[400px] rounded-lg overflow-hidden'>
                {/* API imgPath 사용 */}
                {selectedArticle.imgPath ? (
                  <Image
                    src={selectedArticle.imgPath}
                    alt={selectedArticle.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 1024px) 100vw, 800px'
                  />
                ) : (
                  /* 대체 이미지 */
                  <Image
                    src={floristImage1} // 기본 이미지
                    alt={selectedArticle.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 1024px) 100vw, 800px'
                  />
                )}
              </div>

              {/* 본문 내용 */}
              <div className='prose max-w-none'>
                <div className='text-gray-800 leading-relaxed whitespace-pre-wrap'>
                  {selectedArticle.content}
                </div>
              </div>

              {/* 작성일 */}
              {selectedArticle.createdAt && (
                <div className='text-sm text-gray-500 pt-4 border-t'>
                  작성일:{' '}
                  {new Date(
                    selectedArticle.createdAt,
                  ).toLocaleDateString('ko-KR')}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
