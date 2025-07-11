/**
 * 3D 모델 색상 관리 컴포넌트
 * 포장지와 장식 모델의 색상을 업데이트합니다.
 */

import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { LoadedModels } from '@/types/3d-flower';

interface ModelManagerProps {
  models: LoadedModels;
  wrapperColor?: string;
  decorationColor?: string;
}

/**
 * 모델 색상 관리 컴포넌트
 * @param props - 모델 관리에 필요한 props
 */
const ModelManager: React.FC<ModelManagerProps> = ({
  models,
  wrapperColor,
  decorationColor,
}) => {
  /**
   * 모델 색상 업데이트 함수
   * @param model - 색상을 변경할 모델
   * @param color - 적용할 색상 (HEX 코드)
   */
  const updateModelColor = useMemo(
    () => (model: THREE.Object3D, color: string) => {
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material =
            mesh.material as THREE.MeshStandardMaterial;
          if (material) {
            material.color.setHex(
              parseInt(color.replace('#', ''), 16),
            );
          }
        }
      });
    },
    [],
  );

  // 포장지 색상 업데이트
  useEffect(() => {
    if (models.wrapper && wrapperColor) {
      updateModelColor(models.wrapper, wrapperColor);
    }
  }, [models.wrapper, wrapperColor, updateModelColor]);

  // 장식 색상 업데이트
  useEffect(() => {
    if (models.decoration && decorationColor) {
      updateModelColor(models.decoration, decorationColor);
    }
  }, [
    models.decoration,
    decorationColor,
    updateModelColor,
  ]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 색상 관리만 담당
  return null;
};

// React.memo를 사용하여 불필요한 리렌더링 방지
export default React.memo(ModelManager);
