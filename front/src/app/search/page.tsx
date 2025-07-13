'use client';

import { useSearch } from '@/hooks/use-search';
import { SearchForm } from './components/search-form';
import { SearchFilters } from './components/search-filters';
import { SearchResults } from './components/search-results';
import { Header } from '@/components/common/header';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { SearchTabType } from '@/types/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialSearchExecuted = useRef(false);

  const {
    // 상태
    filteredFlowers,
    isLoading,
    error,
    filters,
    availableTags,
    searchDate,
    flowerNameInput,
    flowerDescInput,
    activeTab,

    // 액션
    setFlowerNameInput,
    setFlowerDescInput,
    setActiveTab,
    toggleFilter,
    resetFilters,
    handleDateChange,
    clearSearchDate,
    handleSubmit,
    handleSearch,
  } = useSearch();

  // URL 파라미터에서 검색 키워드 추출
  const getSearchKeyword = () => {
    const flowNm = searchParams.get('flowNm');
    const tagName = searchParams.get('tagName');

    if (flowNm) return flowNm;
    if (tagName) return tagName;
    return '꽃';
  };

  // URL 파라미터 기반 초기 검색 실행 (한 번만)
  useEffect(() => {
    const flowNm = searchParams.get('flowNm');
    const tagName = searchParams.get('tagName');
    const searchType = searchParams.get('searchType');
    const fmonth = searchParams.get('fmonth');
    const fday = searchParams.get('fday');

    // URL 파라미터가 있으면 자동 검색 실행
    if (flowNm || tagName || (fmonth && fday)) {
      // 탭 설정 (상태 업데이트)
      if (searchType === 'flowerName') {
        setActiveTab('flowerName');
        setFlowerNameInput(flowNm || '');
      } else if (searchType === 'flowerDesc') {
        setActiveTab('flowerDesc');
        setFlowerDescInput(tagName || '');
      }

      // 날짜 설정
      if (fmonth && fday) {
        const currentYear = new Date().getFullYear();
        const dateToSet = new Date(
          currentYear,
          parseInt(fmonth) - 1,
          parseInt(fday),
        );
        handleDateChange(dateToSet);
      }

      // 검색 실행 - 파라미터 직접 전달로 상태 업데이트 타이밍 문제 해결
      const searchParams_obj = {
        flowNm: flowNm || undefined,
        tagName: tagName || undefined,
        fmonth: fmonth || undefined,
        fday: fday || undefined,
        activeTab: (searchType === 'flowerName'
          ? 'flowerName'
          : 'flowerDesc') as SearchTabType,
      };

      handleSearch(true, searchParams_obj); // 자동 검색 + 파라미터 직접 전달
      initialSearchExecuted.current = true; // 초기 검색 완료 플래그 설정
    } 
  }, [searchParams]); // handleSearch 제거하여 무한 루프 방지

  // 검색 키워드는 URL 파라미터에서 추출
  const keyword = getSearchKeyword();

  if (isLoading && filteredFlowers.length === 0) {
    return (
      <div className='container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]'>
        <div className='text-xl font-medium'>로딩중</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800'>
            <span className='text-primary'>{keyword}</span>
            에 대한 검색 결과
          </h1>

          <SearchForm
            activeTab={activeTab}
            flowerNameInput={flowerNameInput}
            flowerDescInput={flowerDescInput}
            searchDate={searchDate}
            onActiveTabChange={setActiveTab}
            onFlowerNameChange={setFlowerNameInput}
            onFlowerDescChange={setFlowerDescInput}
            onDateChange={handleDateChange}
            onDateClear={clearSearchDate}
            onSubmit={handleSubmit}
          />

          <div className='flex flex-col md:flex-row gap-6'>
            {filteredFlowers.length > 0 && (
              <SearchFilters
                filters={filters}
                availableTags={availableTags}
                onToggleFilter={toggleFilter}
                onResetFilters={resetFilters}
              />
            )}

            <SearchResults
              flowers={filteredFlowers}
              isLoading={isLoading}
              error={error}
              keyword={keyword}
            />
          </div>
        </div>
      </main>
    </>
  );
}
