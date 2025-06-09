// API 응답 타입 정의 (실제 Spring Boot 응답)
export interface IFlowerResponse {
  f_pk?: number;
  f_low_nm: string;
  f_low_lang: string;
  f_content: string;
  img_url1: string;
  f_reg_dt?: string;
  f_reg_id?: string;
}

// API 요청 타입 정의
export interface ISearchRequest {
  flowNm?: string;
  tagName?: string;
  fmonth?: string;
  fday?: string;
}

// 필터 타입 정의
export interface IFilters {
  seasons: string[];
  tags: string[];
  events: string[];
  colors: string[];
}

// 검색 탭 타입
export type SearchTabType = 'flowerName' | 'flowerDesc';

// 필터 초기값
export const INITIAL_FILTERS: IFilters = {
  seasons: [],
  tags: [],
  events: [],
  colors: [],
};
