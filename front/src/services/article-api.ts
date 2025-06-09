import type {
  IArticleFilterRequest,
  IArticleFilterResponse,
  IArticleAllResponse,
} from '@/types/article';

/**
 * article 필터링 API 호출
 * @param params 필터링 조건
 * @returns 필터링된 article 목록
 */
export async function filterArticles(
  params: IArticleFilterRequest,
): Promise<IArticleFilterResponse> {
  const response = await fetch('/api/article/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      '필터링 API 응답 오류:',
      response.status,
      errorText,
    );
    throw new Error('article 필터링 요청에 실패했습니다.');
  }

  const result = await response.json();
  return result;
}

/**
 * 모든 article 목록 조회 (GET 방식)
 * @returns 전체 article 목록
 */
export async function getAllArticles(): Promise<IArticleAllResponse> {
  const response = await fetch('/api/article/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      '전체 조회 API 응답 오류:',
      response.status,
      errorText,
    );
    throw new Error(
      '전체 article 목록 조회에 실패했습니다.',
    );
  }

  const result = await response.json();
  return result;
}
