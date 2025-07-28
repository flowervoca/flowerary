/**
 * 3D 모델 색상 관리 컴포넌트
 * 포장지와 장식 모델의 색상을 업데이트합니다.
 */

import React, { useEffect } from 'react';
import { LoadedModels } from '@/types/3d-flower';
import { useColorApplication } from '../hooks/useColorApplication';

interface ModelManagerProps {
  models: LoadedModels;
  wrapperColor?: string;
  decorationColor?: string;
  modelsLoadedOnce?: boolean; // 모델 로딩 완료 여부
}

/**
 * 모델 색상 관리 컴포넌트
 * @param props - 모델 관리에 필요한 props
 */
const ModelManager: React.FC<ModelManagerProps> = ({
  models,
  wrapperColor,
  decorationColor,
  modelsLoadedOnce = false,
}) => {
  // 색상 적용 훅 사용
  const { applyWrapperColor, applyDecorationColor } =
    useColorApplication({
      models,
      modelsLoadedOnce,
    });

  // 포장지 색상 적용
  useEffect(() => {
    if (
      wrapperColor &&
      models.wrapper &&
      modelsLoadedOnce
    ) {
      applyWrapperColor(wrapperColor);
    }
  }, [
    wrapperColor,
    models.wrapper,
    modelsLoadedOnce,
    applyWrapperColor,
  ]);

  // 장식 색상 적용
  useEffect(() => {
    if (
      decorationColor &&
      models.decoration &&
      modelsLoadedOnce
    ) {
      applyDecorationColor(decorationColor);
    }
  }, [
    decorationColor,
    models.decoration,
    modelsLoadedOnce,
    applyDecorationColor,
  ]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 색상 관리만 담당
  return null;
};

// React.memo를 사용하여 불필요한 리렌더링 방지
export default React.memo(ModelManager);
