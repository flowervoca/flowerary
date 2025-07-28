export async function GET() {
  try {
    // Spring Boot API 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/article/all`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

    // 디버깅: 실제 API 응답 구조 확인
    console.log('🔍 Spring Boot API 응답:', JSON.stringify(result, null, 2));
    if (result.data && result.data.length > 0) {
      console.log('🔍 첫 번째 article 데이터:', JSON.stringify(result.data[0], null, 2));
    }

    // Spring Boot API 응답을 프론트엔드 형식으로 변환
    const transformedResult = {
      resultMsg: result.resultMsg,
      totalCount: result.totalCount,
      data: result.data || [],
    };

    return Response.json(transformedResult);
  } catch (error) {
    console.error('Article all API 오류:', error);

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
