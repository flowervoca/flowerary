/**
 * 3D 모델 색상 적용을 담당하는 커스텀 훅
 */

import {
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import * as THREE from 'three';
import { LoadedModels } from '@/types/3d-flower';
import {
  applyColorToModel,
  countModelMaterials,
  ColorStateManager,
} from '../utils/colorUtils';

// ============================================================================
// 타입 정의
// ============================================================================

interface UseColorApplicationProps {
  models: LoadedModels;
  modelsLoadedOnce: boolean;
}

interface ColorApplicationConfig {
  maxRetries: number;
  retryInterval: number;
  initialDelay: number;
}

// ============================================================================
// 상수 정의
// ============================================================================

const DEFAULT_CONFIG: ColorApplicationConfig = {
  maxRetries: 10,
  retryInterval: 200,
  initialDelay: 50,
};

const DEFAULT_COLOR = '#FFB6C1';

// ============================================================================
// 초기 상태 상수
// ============================================================================

const INITIAL_LOADED_MODELS: LoadedModels = {
  flowers: [],
  wrapper: null,
  decoration: null,
};

// ============================================================================
// 메인 훅
// ============================================================================

/**
 * 색상 적용 커스텀 훅
 */
export const useColorApplication = ({
  models,
  modelsLoadedOnce,
}: UseColorApplicationProps) => {
  // ============================================================================
  // 참조 및 상태
  // ============================================================================

  // 색상 상태 관리자 (메모이제이션)
  const colorStateManager = useMemo(
    () => new ColorStateManager(),
    [],
  );

  // 재시도 타이머 관리
  const retryTimersRef = useRef<{
    wrapper?: NodeJS.Timeout;
    decoration?: NodeJS.Timeout;
  }>({});

  // 이전 모델 참조 (모델 변경 감지용)
  const prevModelsRef = useRef<LoadedModels>(
    INITIAL_LOADED_MODELS,
  );

  // ============================================================================
  // 유틸리티 함수들
  // ============================================================================

  /**
   * 타이머 정리 함수
   */
  const clearTimer = useCallback(
    (modelType: 'wrapper' | 'decoration') => {
      if (retryTimersRef.current[modelType]) {
        clearTimeout(retryTimersRef.current[modelType]);
        delete retryTimersRef.current[modelType];
      }
    },
    [],
  );

  /**
   * 모든 타이머 정리 함수
   */
  const clearAllTimers = useCallback(() => {
    Object.keys(retryTimersRef.current).forEach((key) => {
      clearTimer(key as 'wrapper' | 'decoration');
    });
  }, [clearTimer]);

  /**
   * 모델에서 현재 색상 추출
   */
  const getCurrentModelColor = useCallback(
    (model: THREE.Object3D): string => {
      let currentColor = DEFAULT_COLOR;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            const firstMaterial = child.material[0];
            if (firstMaterial && firstMaterial.color) {
              currentColor =
                '#' + firstMaterial.color.getHexString();
            }
          } else {
            if (child.material.color) {
              currentColor =
                '#' + child.material.color.getHexString();
            }
          }
        }
      });

      return currentColor;
    },
    [],
  );

  // ============================================================================
  // 색상 적용 함수들
  // ============================================================================

  /**
   * 색상 적용 시도 함수
   */
  const attemptColorApplication = useCallback(
    (
      model: THREE.Object3D,
      color: string,
      modelType: 'wrapper' | 'decoration',
      config: ColorApplicationConfig = DEFAULT_CONFIG,
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        let retryCount = 0;

        const tryApply = () => {
          const materialsUpdated = applyColorToModel(
            model,
            color,
          );
          const materialsCount = countModelMaterials(model);

          // 재질이 있고 색상이 적용되었으면 성공
          if (materialsCount > 0 && materialsUpdated > 0) {
            colorStateManager.setAppliedState(
              modelType,
              color,
              model.uuid,
            );
            resolve(true);
            return;
          }

          // 재시도 조건 확인
          if (retryCount < config.maxRetries) {
            retryCount++;
            retryTimersRef.current[modelType] = setTimeout(
              tryApply,
              config.retryInterval,
            );
          } else {
            // 최대 재시도 횟수 도달
            resolve(false);
          }
        };

        // 첫 번째 시도
        tryApply();
      });
    },
    [colorStateManager],
  );

  /**
   * 색상 적용 메인 함수
   */
  const applyColor = useCallback(
    async (
      model: THREE.Object3D,
      color: string,
      modelType: 'wrapper' | 'decoration',
    ): Promise<boolean> => {
      // 조건 확인
      if (!model || !color || !modelsLoadedOnce) {
        return false;
      }

      // 이미 적용된 색상인지 확인
      if (
        colorStateManager.isAlreadyApplied(
          modelType,
          color,
          model.uuid,
        )
      ) {
        return true;
      }

      // 기존 타이머 정리
      clearTimer(modelType);

      // 현재 색상 가져오기
      const currentColor = getCurrentModelColor(model);

      // 색상 적용 시도
      const success = await attemptColorApplication(
        model,
        color,
        modelType,
      );

      if (success) {
        colorStateManager.setAppliedState(
          modelType,
          color,
          model.uuid,
        );
      }

      return success;
    },
    [
      modelsLoadedOnce,
      clearTimer,
      attemptColorApplication,
      colorStateManager,
      getCurrentModelColor,
    ],
  );

  // ============================================================================
  // 특정 모델 타입별 색상 적용 함수들
  // ============================================================================

  /**
   * 포장지 색상 적용
   */
  const applyWrapperColor = useCallback(
    async (color: string): Promise<boolean> => {
      if (!models.wrapper) return false;
      return applyColor(models.wrapper, color, 'wrapper');
    },
    [models.wrapper, applyColor],
  );

  /**
   * 장식 색상 적용
   */
  const applyDecorationColor = useCallback(
    async (color: string): Promise<boolean> => {
      if (!models.decoration) return false;
      return applyColor(
        models.decoration,
        color,
        'decoration',
      );
    },
    [models.decoration, applyColor],
  );

  // ============================================================================
  // 사이드 이펙트
  // ============================================================================

  /**
   * 모델 변경 감지 및 상태 정리
   */
  useEffect(() => {
    const prevWrapper = prevModelsRef.current.wrapper;
    const prevDecoration = prevModelsRef.current.decoration;
    const currentWrapper = models.wrapper;
    const currentDecoration = models.decoration;

    // 모델이 변경된 경우 해당 상태 정리
    if (prevWrapper !== currentWrapper) {
      colorStateManager.clearState('wrapper');
      clearTimer('wrapper');
    }

    if (prevDecoration !== currentDecoration) {
      colorStateManager.clearState('decoration');
      clearTimer('decoration');
    }

    // 이전 모델 참조 업데이트
    prevModelsRef.current = {
      flowers: models.flowers,
      wrapper: models.wrapper,
      decoration: models.decoration,
    };
  }, [models, clearTimer, colorStateManager]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      clearAllTimers();
      colorStateManager.clearAllStates();
    };
  }, [clearAllTimers, colorStateManager]);

  // ============================================================================
  // 반환값
  // ============================================================================

  // 반환값 메모이제이션
  return useMemo(
    () => ({
      applyWrapperColor,
      applyDecorationColor,
    }),
    [applyWrapperColor, applyDecorationColor],
  );
};
