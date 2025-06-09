import { useState, useEffect } from 'react';
import { IFlower } from '@/types';
import {
  IFilters,
  ISearchRequest,
  SearchTabType,
  INITIAL_FILTERS,
} from '@/types/search';
import { searchFlowersAdvanced } from '@/services/search-api';
import {
  extractUniqueTagsFromFlowers,
  extractTagsFromFlowerLang,
} from '@/utils/search-utils';

export const useSearch = () => {
  // 상태 관리
  const [flowerList, setFlowerList] = useState<IFlower[]>(
    [],
  );
  const [filteredFlowers, setFilteredFlowers] = useState<
    IFlower[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<IFilters>(INITIAL_FILTERS);
  const [availableTags, setAvailableTags] = useState<
    string[]
  >([]);
  const [searchDate, setSearchDate] = useState<
    Date | undefined
  >(undefined);
  const [flowerNameInput, setFlowerNameInput] =
    useState<string>('');
  const [flowerDescInput, setFlowerDescInput] =
    useState<string>('');
  const [activeTab, setActiveTab] =
    useState<SearchTabType>('flowerName');

  // 태그 목록 추출 (꽃말 목록)
  useEffect(() => {
    if (flowerList.length > 0) {
      const tags = extractUniqueTagsFromFlowers(flowerList);
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
        const flowerTags = extractTagsFromFlowerLang(
          flower.f_low_lang,
        );
        return filters.tags.some((tag) =>
          flowerTags.includes(tag),
        );
      });
    }

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
    setFilters(INITIAL_FILTERS);
  };

  // 날짜 선택 핸들러
  const handleDateChange = (date: Date | undefined) => {
    setSearchDate(date);
  };

  // 날짜 초기화 핸들러
  const clearSearchDate = () => {
    setSearchDate(undefined);
  };

  // Form 초기화 함수
  const resetForm = () => {
    setFlowerNameInput('');
    setFlowerDescInput('');
    setSearchDate(undefined);
    setActiveTab('flowerName');
  };

  // 검색 실행 함수
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // 검색 시작 시 기존 결과 초기화
      setFlowerList([]);
      setFilteredFlowers([]);

      // API 요청 데이터 구성
      const requestData: ISearchRequest = {};

      // 꽃 이름 또는 꽃 설명 추가
      if (
        activeTab === 'flowerName' &&
        flowerNameInput.trim()
      ) {
        requestData.flowNm = flowerNameInput.trim();
      } else if (
        activeTab === 'flowerDesc' &&
        flowerDescInput.trim()
      ) {
        requestData.tagName = flowerDescInput.trim();
      }

      // 날짜 정보 추가 (선택된 경우만)
      if (searchDate) {
        const month = String(searchDate.getMonth() + 1);
        const day = String(searchDate.getDate());
        requestData.fmonth = month;
        requestData.fday = day;
      }

      // 태그 필터 추가 (선택된 경우만)
      if (filters.tags.length > 0) {
        const filterTags = filters.tags.join(',');
        if (requestData.tagName) {
          requestData.tagName = `${requestData.tagName},${filterTags}`;
        } else {
          requestData.tagName = filterTags;
        }
      }

      // 검색 조건이 하나도 없는 경우 경고
      if (
        !requestData.flowNm &&
        !requestData.tagName &&
        !requestData.fmonth &&
        !requestData.fday
      ) {
        setError('검색 조건을 하나 이상 입력해주세요.');
        setFlowerList([]);
        setFilteredFlowers([]);
        setIsLoading(false);
        resetForm();
        return;
      }

      // API 호출
      const result =
        await searchFlowersAdvanced(requestData);

      if (result.success && result.data) {
        setFlowerList(result.data);
        setFilteredFlowers(result.data);
        resetForm(); // 검색 성공 후 form 초기화
      } else {
        setFlowerList([]);
        setFilteredFlowers([]);
        setError(
          result.error || '알 수 없는 오류가 발생했습니다.',
        );
        resetForm(); // 검색 실패 후에도 form 초기화
      }
    } catch (err) {
      console.error('꽃 검색 오류:', err);
      setError(
        '꽃 정보를 불러오는 중 오류가 발생했습니다.',
      );
      setFlowerList([]);
      setFilteredFlowers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 페이지 로드시 초기화
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    // 상태
    flowerList,
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
    handleSearch,
    handleSubmit,
  };
};
