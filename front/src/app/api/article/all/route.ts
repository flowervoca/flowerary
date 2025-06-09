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

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
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
    console.error('Article all API 오류:', error);
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
