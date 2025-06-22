import { NextRequest, NextResponse } from 'next/server';

interface ISearchFlowerRequest {
  flowNm?: string;
  tagName?: string;
  fmonth?: string;
  fday?: string;
}

// 실제 Spring Boot API 응답 구조
interface ISpringBootFlowerResponse {
  id: number;
  flowNm: string;
  flowLang: string;
  imgUrl1: string;
  imgUrl2?: string;
  imgUrl3?: string;
  hashtags: string[];
  fmonth: string;
  fday: string;
  fsctNm?: string;
  fengNm?: string;
  fuse?: string;
  fgrow?: string;
  ftype?: string;
  fcontent: string;
}

// 프론트엔드에서 사용하는 구조
interface IFlowerData {
  f_pk?: number;
  f_low_nm: string;
  f_low_lang: string;
  f_content: string;
  img_url1: string;
  f_reg_dt?: string;
  f_reg_id?: string;
}

interface IApiResponse {
  resultMsg: string;
  totalCount: number;
  data: IFlowerData[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ISearchFlowerRequest = await request.json();
    const { flowNm, tagName, fmonth, fday } = body;

    // 검색 조건이 하나도 없는 경우
    if (!flowNm && !tagName && !fmonth && !fday) {
      return NextResponse.json(
        {
          resultMsg: '검색 조건을 하나 이상 입력해주세요.',
          totalCount: 0,
          data: [],
        },
        { status: 400 },
      );
    }

    // 외부 API URL 설정 (환경변수에서 가져오거나 기본값 사용)
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8080';
    const apiUrl = `${apiBaseUrl}/api/flower/searchFlowerAdvanced`;

    // 외부 REST API 호출
    const requestBody = {
      flowNm: flowNm || '',
      tagName: tagName || '',
      fmonth: fmonth || '',
      fday: fday || '',
    };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('외부 API 오류:', errorText);

      if (apiResponse.status === 404) {
        return NextResponse.json({
          resultMsg: '해당 꽃이 없습니다.',
          totalCount: 0,
          data: [],
        });
      }

      return NextResponse.json(
        {
          resultMsg: `외부 API 호출 중 오류가 발생했습니다: ${apiResponse.status}`,
          totalCount: 0,
          data: [],
        },
        { status: 500 },
      );
    }

    const responseData = await apiResponse.json();

    // Spring Boot API 응답 구조에 맞게 데이터 변환
    if (
      responseData &&
      responseData.data &&
      responseData.data.flowers &&
      Array.isArray(responseData.data.flowers)
    ) {
      // Spring Boot 응답을 프론트엔드 형식으로 변환
      const transformedFlowers: IFlowerData[] =
        responseData.data.flowers.map(
          (flower: ISpringBootFlowerResponse) => ({
            f_pk: flower.id,
            f_low_nm: flower.flowNm || '',
            f_low_lang: flower.flowLang || '',
            f_content: flower.fcontent || '',
            img_url1: flower.imgUrl1 || '',
            f_reg_dt: '', // 필요시 매핑
            f_reg_id: '', // 필요시 매핑
          }),
        );

      const response: IApiResponse = {
        resultMsg: responseData.resultMsg || '검색 성공',
        totalCount:
          responseData.totalCount ||
          transformedFlowers.length,
        data: transformedFlowers,
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json({
        resultMsg: '해당 꽃이 없습니다.',
        totalCount: 0,
        data: [],
      });
    }
  } catch (error) {
    console.error('API 처리 오류:', error);

    if (
      error instanceof TypeError &&
      error.message.includes('fetch')
    ) {
      return NextResponse.json(
        {
          resultMsg:
            '외부 API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
          totalCount: 0,
          data: [],
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        resultMsg: `서버 내부 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalCount: 0,
        data: [],
      },
      { status: 500 },
    );
  }
}
