'use client';

import { useSearch } from '@/hooks/use-search';
import { SearchForm } from './components/search-form';
import { SearchFilters } from './components/search-filters';
import { SearchResults } from './components/search-results';

export default function SearchPage() {
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
  } = useSearch();

  // 검색 키워드는 상수로 정의
  const keyword = '꽃';

  if (isLoading && filteredFlowers.length === 0) {
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
  );
}
