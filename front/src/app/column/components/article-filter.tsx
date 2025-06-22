'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import type {
  IArticleFilterRequest,
  SearchFieldType,
} from '@/types/article';
import {
  SEARCH_FIELD_OPTIONS,
  INITIAL_ARTICLE_FILTERS,
} from '@/types/article';

interface IArticleFilterProps {
  onFilter: (
    params: IArticleFilterRequest,
  ) => Promise<void>;
  onLoadAll: () => Promise<void>;
  isLoading: boolean;
}

export function ArticleFilter({
  onFilter,
  onLoadAll,
  isLoading,
}: IArticleFilterProps) {
  const [filters, setFilters] =
    useState<IArticleFilterRequest>(
      INITIAL_ARTICLE_FILTERS,
    );

  const handleFieldChange = (field: SearchFieldType) => {
    setFilters((prev) => ({
      ...prev,
      searchField: field,
    }));
  };

  const handleValueChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchValue: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 검색어가 비어있으면 전체 조회
    if (!filters.searchValue.trim()) {
      await onLoadAll();
    } else {
      await onFilter(filters);
    }

    // 검색 완료 후 초기화
    setFilters(INITIAL_ARTICLE_FILTERS);
  };

  const handleReset = async () => {
    setFilters(INITIAL_ARTICLE_FILTERS);
    await onLoadAll();
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex gap-4 items-end'>
            {/* 검색 필드 선택 */}
            <div className='min-w-[120px]'>
              <label
                htmlFor='searchField'
                className='block text-sm font-medium mb-2'
              >
                검색 분류
              </label>
              <select
                id='searchField'
                value={filters.searchField}
                onChange={(e) =>
                  handleFieldChange(
                    e.target.value as SearchFieldType,
                  )
                }
                disabled={isLoading}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
              >
                {SEARCH_FIELD_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색어 입력 */}
            <div className='flex-1'>
              <label
                htmlFor='searchValue'
                className='block text-sm font-medium mb-2'
              >
                검색어
              </label>
              <Input
                id='searchValue'
                type='text'
                value={filters.searchValue}
                onChange={(e) =>
                  handleValueChange(e.target.value)
                }
                placeholder={`${SEARCH_FIELD_OPTIONS.find((opt) => opt.value === filters.searchField)?.label}로 검색...`}
                disabled={isLoading}
              />
            </div>

            {/* 버튼들 */}
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleReset}
                disabled={isLoading}
              >
                초기화
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className='bg-primary text-white'
              >
                <Search className='w-4 h-4 mr-2' />
                {isLoading ? '검색 중...' : '검색'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
