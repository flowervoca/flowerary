/**
 * 3D 모델 색상 관련 유틸리티 함수들
 */

import * as THREE from 'three';

/**
 * 색상 형식 검증 함수
 * @param color - 검증할 색상
 * @returns 유효한 색상인지 여부
 */
export const isValidColor = (color: string): boolean => {
  return Boolean(
    color && color.startsWith('#') && color.length === 7,
  );
};

/**
 * 색상을 THREE.js에서 사용할 수 있는 형태로 변환
 * @param color - HEX 색상 코드
 * @returns 변환된 색상 값
 */
export const convertColorToThreeJS = (
  color: string,
): number => {
  return parseInt(color.replace('#', ''), 16);
};

/**
 * 모델의 재질에 색상을 적용하는 함수
 * @param model - 색상을 적용할 모델
 * @param color - 적용할 색상 (HEX 코드)
 * @returns 적용된 재질의 개수
 */
export const applyColorToModel = (
  model: THREE.Object3D,
  color: string,
): number => {
  if (!isValidColor(color)) {
    console.warn('Invalid color format:', color);
    return 0;
  }

  const colorValue = convertColorToThreeJS(color);
  let materialsUpdated = 0;

  model.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        // 배열 형태의 재질 처리
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            if (
              material instanceof THREE.MeshStandardMaterial
            ) {
              material.color.setHex(colorValue);
              material.needsUpdate = true;
              materialsUpdated++;
            }
          });
        } else if (
          mesh.material instanceof
          THREE.MeshStandardMaterial
        ) {
          mesh.material.color.setHex(colorValue);
          mesh.material.needsUpdate = true;
          materialsUpdated++;
        }
      }
    }
  });

  return materialsUpdated;
};

/**
 * 모델에서 재질의 개수를 세는 함수
 * @param model - 재질을 세어볼 모델
 * @returns 재질의 개수
 */
export const countModelMaterials = (
  model: THREE.Object3D,
): number => {
  let materialsCount = 0;

  model.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          materialsCount += mesh.material.length;
        } else {
          materialsCount++;
        }
      }
    }
  });

  return materialsCount;
};

/**
 * 색상 적용 상태를 나타내는 인터페이스
 */
export interface ColorApplicationState {
  color: string;
  modelId: string;
  appliedAt: number;
}

/**
 * 색상 적용 상태 매니저 클래스
 */
export class ColorStateManager {
  private states: Map<string, ColorApplicationState> =
    new Map();

  /**
   * 색상 적용 상태 저장
   * @param modelType - 모델 타입
   * @param color - 적용된 색상
   * @param modelId - 모델 ID
   */
  setAppliedState(
    modelType: string,
    color: string,
    modelId: string,
  ): void {
    this.states.set(modelType, {
      color,
      modelId,
      appliedAt: Date.now(),
    });
  }

  /**
   * 색상이 이미 적용되었는지 확인
   * @param modelType - 모델 타입
   * @param color - 확인할 색상
   * @param modelId - 모델 ID
   * @returns 이미 적용되었는지 여부
   */
  isAlreadyApplied(
    modelType: string,
    color: string,
    modelId: string,
  ): boolean {
    const state = this.states.get(modelType);
    return (
      state !== undefined &&
      state.color === color &&
      state.modelId === modelId
    );
  }

  /**
   * 특정 모델 타입의 상태 제거
   * @param modelType - 모델 타입
   */
  clearState(modelType: string): void {
    this.states.delete(modelType);
  }

  /**
   * 모든 상태 제거
   */
  clearAllStates(): void {
    this.states.clear();
  }
}
