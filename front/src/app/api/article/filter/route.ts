import { NextRequest } from 'next/server';
import type { IArticleFilterRequest } from '@/types/article';

export async function POST(request: NextRequest) {
  try {
    const filterParams: IArticleFilterRequest =
      await request.json();

    // 선택된 필드에 따라 백엔드 API 파라미터 구성
    const backendParams = {
      [filterParams.searchField]: filterParams.searchValue,
    };

    // Spring Boot API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/article/filter`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendParams),
      },
    );

    // API 응답이 실패한 경우, 실제 상태 코드로 응답
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({}));
      return Response.json(
        {
          resultMsg:
            errorData.message ||
            '서버 오류가 발생했습니다.',
          totalCount: 0,
          data: [],
        },
        { status: response.status },
      );
    }

    const result = await response.json();

    // Spring Boot API 응답을 프론트엔드 형식으로 변환
    const transformedResult = {
      resultMsg: result.resultMsg,
      totalCount: result.totalCount,
      data: result.data || [],
    };

    return Response.json(transformedResult);
  } catch (error) {
    console.error('Article filter API 오류:', error);

    // 네트워크 오류나 예상치 못한 오류는 500으로 처리
    return Response.json(
      {
        resultMsg: 'API 호출에 실패했습니다.',
        totalCount: 0,
        data: [],
      },
      { status: 500 },
    );
  }
}
