import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 요청 바디에서 검색 파라미터 추출
    const body = await req.json();
    const { flowNm, fmonth, fday } = body;

    // API 엔드포인트 URL 생성
    const apiUrl =
      'http://apis.data.go.kr/1390804/NihhsTodayFlowerInfo01/selectTodayFlowerList01';

    // 필수 파라미터 설정
    const serviceKey =
      'jFXMcfHJzKtCEEy%2Fd8eUE%2F5lxTn%2F4hWCzUP1%2FFfwxGXuUXl46QDJaRFmcKBIj72jo3mx9SHh2%2BZMn8XuCA%3D%3D';
    const pageNo = '1';
    const numOfRows = '10';

    // API 요청 URL 구성
    let url = `${apiUrl}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

    // 검색 파라미터가 제공된 경우 URL에 추가
    if (flowNm) {
      url += `&flowNm=${encodeURIComponent(flowNm)}`;
    }
    if (fmonth) {
      url += `&fmonth=${fmonth}`;
    }
    if (fday) {
      url += `&fday=${fday}`;
    }

    // 외부 API 호출
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 타임아웃 설정 (10초)
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `공공 API 응답 오류: ${response.status}` },
        { status: response.status },
      );
    }

    // API 응답 데이터 파싱
    const data = await response.json();

    // 클라이언트에 응답 반환
    return NextResponse.json(data);
  } catch (error) {
    console.error('꽃 검색 API 처리 중 오류 발생:', error);

    // 오류 응답 반환
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
