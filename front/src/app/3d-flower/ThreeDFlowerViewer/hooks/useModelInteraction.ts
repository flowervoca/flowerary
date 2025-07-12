/**
 * 3D 모델 상호작용을 담당하는 커스텀 훅
 * 마우스 클릭 이벤트, Raycaster, 모델 클릭 감지를 처리합니다.
 */

import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ModelType, LoadedModels } from '@/types/3d-flower';

interface UseModelInteractionProps {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  models: LoadedModels;
  onModelClick?: (modelType: ModelType) => void;
}

/**
 * 모델 상호작용 커스텀 훅
 * @param props - 모델 상호작용에 필요한 props
 */
export const useModelInteraction = ({
  scene,
  camera,
  renderer,
  models,
  onModelClick,
}: UseModelInteractionProps) => {
  // Raycaster 참조
  const raycasterRef = useRef<THREE.Raycaster>(
    new THREE.Raycaster(),
  );
  const mouseRef = useRef<THREE.Vector2>(
    new THREE.Vector2(),
  );

  /**
   * 마우스 클릭 이벤트 핸들러
   * @param event - 마우스 클릭 이벤트
   */
  const handleMouseClick = useCallback(
    (event: MouseEvent) => {
      if (!scene || !camera || !renderer) {
        console.warn(
          'Three.js objects not ready for interaction',
        );
        return;
      }

      // 마우스 위치를 정규화된 좌표로 변환
      const rect =
        renderer.domElement.getBoundingClientRect();
      mouseRef.current.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycaster 설정
      raycasterRef.current.setFromCamera(
        mouseRef.current,
        camera,
      );

      // 씬의 모든 객체와 교차 검사
      const intersects =
        raycasterRef.current.intersectObjects(
          scene.children,
          true,
        );

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // 클릭된 객체가 어떤 모델인지 확인
        let foundModelType: ModelType | null = null;

        // 클릭된 객체부터 부모 체인을 따라 올라가면서 모델 찾기
        let currentObject: THREE.Object3D | null =
          clickedObject;
        while (currentObject && !foundModelType) {
          // 꽃 모델 확인
          if (models.flowers.includes(currentObject)) {
            foundModelType = 'flower';
            break;
          }
          // 포장지 모델 확인
          if (models.wrapper === currentObject) {
            foundModelType = 'wrapper';
            break;
          }
          // 장식 모델 확인
          if (models.decoration === currentObject) {
            foundModelType = 'decoration';
            break;
          }
          // 부모로 이동
          currentObject = currentObject.parent;
        }

        if (foundModelType) {
          onModelClick?.(foundModelType);
        } else {
          // 모델이 아닌 경우 배경 클릭으로 처리
          onModelClick?.('background');
        }
      } else {
        // 아무 모델도 클릭되지 않았으면 배경 클릭으로 간주
        onModelClick?.('background');
      }
    },
    [scene, camera, renderer, models, onModelClick],
  );

  // 마우스 클릭 이벤트 리스너 설정
  useEffect(() => {
    if (!renderer) return;

    const canvas = renderer.domElement;
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [renderer, handleMouseClick]);
};
