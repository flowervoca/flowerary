import {
  ISearchRequest,
  IFlowerResponse,
} from '@/types/search';
import { IFlower } from '@/types';

export interface ISearchApiResponse {
  success: boolean;
  data?: IFlower[];
  error?: string;
}

/**
 * 고급 꽃 검색 API 호출
 */
export const searchFlowersAdvanced = async (
  requestData: ISearchRequest,
): Promise<ISearchApiResponse> => {
  try {
    // API 호출 (타임아웃 설정)
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      8000,
    );

    const response = await fetch(
      '/api/flower/searchFlowerAdvanced',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (
        response.status === 404 ||
        (data && data.resultMsg === '해당 꽃이 없습니다.')
      ) {
        return {
          success: false,
          error:
            '해당하는 꽃이 없습니다. 다른 검색어를 입력해 보세요.',
        };
      }
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    if (
      data &&
      data.data &&
      Array.isArray(data.data) &&
      data.data.length > 0
    ) {
      // API Route Handler에서 이미 올바른 형식으로 변환된 데이터를 사용
      const flowers: IFlower[] = data.data.map(
        (flower: IFlowerResponse) => ({
          f_low_nm: flower.f_low_nm,
          f_low_lang: flower.f_low_lang,
          f_content: flower.f_content,
          f_img: flower.img_url1,
        }),
      );

      return {
        success: true,
        data: flowers,
      };
    } else {
      return {
        success: false,
        error:
          '검색 결과가 없습니다. 다른 검색어를 입력해 보세요.',
      };
    }
  } catch (fetchError) {
    if (
      fetchError instanceof DOMException &&
      fetchError.name === 'AbortError'
    ) {
      return {
        success: false,
        error:
          'API 요청 시간이 초과되었습니다. 서버 연결을 확인해주세요.',
      };
    }

    return {
      success: false,
      error:
        fetchError instanceof Error
          ? `꽃 정보를 불러오는 중 오류가 발생했습니다: ${fetchError.message}`
          : '꽃 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.',
    };
  }
};
