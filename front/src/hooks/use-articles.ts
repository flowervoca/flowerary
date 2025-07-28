'use client';

import { useState, useEffect } from 'react';
import {
  filterArticles,
  getAllArticles,
} from '@/services/article-api';
import type {
  IArticle,
  IArticleFilterRequest,
} from '@/types/article';

interface IUseArticlesReturn {
  articles: IArticle[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  handleFilter: (
    params: IArticleFilterRequest,
  ) => Promise<void>;
  handleLoadAll: () => Promise<void>;
  clearError: () => void;
}

export function useArticles(): IUseArticlesReturn {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const clearError = () => setError(null);

  const handleFilter = async (
    params: IArticleFilterRequest,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await filterArticles(params);
      setArticles(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '칼럼 검색 중 오류가 발생했습니다.',
      );
      setArticles([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadAll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllArticles();

      // 디버깅: 받아온 데이터 구조 확인
      console.log('🔍 useArticles - 전체 응답:', response);
      console.log(
        '🔍 useArticles - 총 개수:',
        response.totalCount,
      );
      if (response.data && response.data.length > 0) {
        console.log(
          '🔍 useArticles - 첫 번째 article:',
          response.data[0],
        );
        console.log(
          '🔍 useArticles - imgPath 필드:',
          response.data[0].imgPath,
        );
      }

      setArticles(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '칼럼 목록 조회 중 오류가 발생했습니다.',
      );
      setArticles([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트시 전체 칼럼 로드
  useEffect(() => {
    handleLoadAll();
  }, []);

  return {
    articles,
    isLoading,
    error,
    totalCount,
    handleFilter,
    handleLoadAll,
    clearError,
  };
}
