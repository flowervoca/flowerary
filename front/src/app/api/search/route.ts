import { NextResponse } from 'next/server';
import { DEVELOPMENT_URL, API_PATH } from '@/lib/constants';

// 꽃 검색 API 프록시
export async function POST(request: Request) {
  try {
    // 요청 본문 추출
    const body = await request.json();

    // 백엔드 API 호출
    const response = await fetch(
      `${DEVELOPMENT_URL}${API_PATH.POST_FILTER_FLOWER}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(body),
      },
    );

    // 응답 데이터 추출
    const data = await response.json();

    // 응답 반환
    return NextResponse.json(data);
  } catch (error) {
    console.error('꽃 검색 API 프록시 오류:', error);
    return NextResponse.json(
      {
        resultMsg: '검색 중 오류가 발생했습니다',
        totalCount: 0,
        data: [],
      },
      { status: 500 },
    );
  }
}
