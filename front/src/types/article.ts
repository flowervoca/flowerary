export type SearchFieldType =
  | 'title'
  | 'subTitle'
  | 'content';

export interface IArticleFilterRequest {
  searchField: SearchFieldType;
  searchValue: string;
}

export interface IArticleFilterResponse {
  resultMsg: string;
  totalCount: number;
  data: IArticle[];
}

export interface IArticleAllResponse {
  resultMsg: string;
  totalCount: number;
  data: IArticle[];
}

export interface IArticle {
  id: number;
  title: string;
  subTitle?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  imgPath?: string;
  tag?: string;
  description?: string;
}

export const SEARCH_FIELD_OPTIONS = [
  { value: 'title' as const, label: '제목' },
  { value: 'subTitle' as const, label: '부제목' },
  { value: 'content' as const, label: '내용' },
] as const;

export const INITIAL_ARTICLE_FILTERS: IArticleFilterRequest =
  {
    searchField: 'title',
    searchValue: '',
  };
