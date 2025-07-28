/**
 * 로딩 상태 관리 커스텀 훅
 */

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { LoadedModels } from '@/types/3d-flower';

interface LoadingStateConfig {
  showLoadingDelay: number;
  hideLoadingDelay: number;
}

const DEFAULT_CONFIG: LoadingStateConfig = {
  showLoadingDelay: 0,
  hideLoadingDelay: 100,
};

/**
 * 로딩 상태 관리 훅
 */
export const useLoadingState = (
  config: LoadingStateConfig = DEFAULT_CONFIG,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoadedOnce, setModelsLoadedOnce] =
    useState(false);

  // 타이머 참조
  const hideLoadingTimerRef = useRef<NodeJS.Timeout | null>(
    null,
  );

  /**
   * 로딩 완료 처리 함수
   */
  const handleLoadingComplete = useCallback(() => {
    // 기존 타이머 정리
    if (hideLoadingTimerRef.current) {
      clearTimeout(hideLoadingTimerRef.current);
    }

    // 약간의 지연 후 로딩 상태 변경 (부드러운 전환)
    hideLoadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setModelsLoadedOnce(true);
    }, config.hideLoadingDelay);
  }, [config.hideLoadingDelay]);

  /**
   * 로딩 상태 리셋 함수
   */
  const resetLoadingState = useCallback(() => {
    if (hideLoadingTimerRef.current) {
      clearTimeout(hideLoadingTimerRef.current);
      hideLoadingTimerRef.current = null;
    }
    setIsLoading(true);
    setModelsLoadedOnce(false);
  }, []);

  /**
   * 모델 로딩 완료 콜백
   */
  const onModelsLoaded = useCallback(
    (loadedModels: LoadedModels) => {
      // 모든 필요한 모델이 로드되었는지 확인
      const hasRequiredModels =
        loadedModels.flowers.length > 0;

      if (hasRequiredModels) {
        handleLoadingComplete();
      }
    },
    [handleLoadingComplete],
  );

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      if (hideLoadingTimerRef.current) {
        clearTimeout(hideLoadingTimerRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    modelsLoadedOnce,
    onModelsLoaded,
    resetLoadingState,
  };
};
