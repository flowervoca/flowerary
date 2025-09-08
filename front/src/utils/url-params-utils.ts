/**
 * URL 파라미터 인코딩/디코딩 유틸리티
 * 3D 꽃다발 상태를 URL 파라미터로 변환하고 복원하는 기능을 제공합니다.
 */

export interface BouquetState {
  // 모델 정보
  flowerModelId?: string;
  wrapperModelId?: string;
  decorationModelId?: string;
  
  // 색상 정보
  backgroundColor?: string;
  wrapperColor?: string;
  decorationColor?: string;
  
  // 편지 정보
  title?: string;
  letterContent?: string;
  hideLetterContent?: boolean;
}

/**
 * 현재 상태를 URL 파라미터로 인코딩
 */
export const encodeBouquetState = (state: BouquetState): string => {
  const params = new URLSearchParams();
  
  // 모델 정보
  if (state.flowerModelId) params.set('flower', state.flowerModelId);
  if (state.wrapperModelId) params.set('wrapper', state.wrapperModelId);
  if (state.decorationModelId) params.set('decoration', state.decorationModelId);
  
  // 색상 정보
  if (state.backgroundColor) params.set('bg', state.backgroundColor);
  if (state.wrapperColor) params.set('wc', state.wrapperColor);
  if (state.decorationColor) params.set('dc', state.decorationColor);
  
  // 편지 정보
  if (state.title) params.set('title', state.title);
  if (state.letterContent) params.set('letter', state.letterContent);
  if (state.hideLetterContent) params.set('hide', 'true');
  
  return params.toString();
};

/**
 * URL 파라미터를 상태로 디코딩
 */
export const decodeBouquetState = (searchParams: string | URLSearchParams): BouquetState => {
  const params = typeof searchParams === 'string' 
    ? new URLSearchParams(searchParams) 
    : searchParams;
  
  return {
    flowerModelId: params.get('flower') || undefined,
    wrapperModelId: params.get('wrapper') || undefined,
    decorationModelId: params.get('decoration') || undefined,
    backgroundColor: params.get('bg') || undefined,
    wrapperColor: params.get('wc') || undefined,
    decorationColor: params.get('dc') || undefined,
    title: params.get('title') || undefined,
    letterContent: params.get('letter') || undefined,
    hideLetterContent: params.get('hide') === 'true',
  };
};

/**
 * 현재 URL에 상태 파라미터를 추가한 새로운 URL 생성
 */
export const createBouquetUrl = (state: BouquetState, baseUrl?: string): string => {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = encodeBouquetState(state);
  return `${base}/bouquet?${params}`;
};
