/**
 * 3D 모델 로딩을 담당하는 커스텀 훅
 * 모델 캐싱, 로딩 상태 관리, 모델 업데이트를 처리합니다.
 */

import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  ModelType,
  ModelCache,
  LoadedModels,
  LoadingState,
} from '@/types/3d-flower';
import { MODEL_TRANSFORM_CONFIG } from '@/utils/3d-flower-constants';

interface UseModelLoadingProps {
  scene: THREE.Scene | null;
  ready: boolean;
  flowerModels: string[];
  wrapperModel?: string;
  decorationModel?: string;
}

interface UseModelLoadingResult {
  models: LoadedModels;
  loading: LoadingState;
}

/**
 * 모델 타입이 변환 가능한지 확인하는 타입 가드
 * @param type - 확인할 모델 타입
 * @returns 변환 가능한 모델 타입인지 여부
 */
const isValidModelType = (
  type: ModelType,
): type is 'flower' | 'wrapper' | 'decoration' => {
  return type !== 'background';
};

/**
 * 모델 로딩 커스텀 훅
 * @param props - 모델 로딩에 필요한 props
 * @returns 로드된 모델들과 로딩 상태
 */
export const useModelLoading = ({
  scene,
  ready,
  flowerModels,
  wrapperModel,
  decorationModel,
}: UseModelLoadingProps): UseModelLoadingResult => {
  // 모델 캐시 참조
  const modelCacheRef = useRef<ModelCache>({});

  // 로드된 모델들 참조
  const modelsRef = useRef<LoadedModels>({
    flowers: [],
    wrapper: null,
    decoration: null,
  });

  // 로딩 상태 참조
  const loadingRef = useRef<LoadingState>({
    flowers: false,
    wrapper: false,
    decoration: false,
  });

  /**
   * 모델 변환 조정 함수
   * @param model - 변환할 모델
   * @param type - 모델 타입
   */
  const adjustModelTransform = useCallback(
    (model: THREE.Object3D, type: ModelType): void => {
      if (!isValidModelType(type)) {
        console.warn(
          `Invalid model type for transform: ${type}`,
        );
        return;
      }

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const baseScale =
        MODEL_TRANSFORM_CONFIG.baseScale / maxSize;

      const config = MODEL_TRANSFORM_CONFIG[type];
      model.scale.setScalar(baseScale * config.scale);
      model.position.set(
        config.position.x,
        config.position.y,
        config.position.z,
      );
      model.rotation.set(
        config.rotation.x,
        config.rotation.y,
        config.rotation.z,
      );

      model.updateMatrix();
      model.updateMatrixWorld(true);
    },
    [],
  );

  /**
   * 모델 재질 설정 함수
   * @param model - 재질을 설정할 모델
   * @param type - 모델 타입
   */
  const setupModelMaterials = useCallback(
    (model: THREE.Object3D, type: ModelType): void => {
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material =
              mesh.material as THREE.MeshStandardMaterial;
            material.needsUpdate = true;
          }
        }
      });
    },
    [],
  );

  /**
   * 단일 모델 로드 함수
   * @param modelPath - 모델 파일 경로
   * @param type - 모델 타입
   * @returns 로드된 모델 또는 null
   */
  const loadSingleModel = useCallback(
    async (
      modelPath: string,
      type: ModelType,
    ): Promise<THREE.Object3D | null> => {
      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelPath);
        const model = gltf.scene;

        adjustModelTransform(model, type);
        setupModelMaterials(model, type);

        return model;
      } catch (error) {
        console.error(
          `Failed to load model: ${modelPath}`,
          error,
        );
        return null;
      }
    },
    [adjustModelTransform, setupModelMaterials],
  );

  /**
   * 캐시된 모델 로드 또는 새로 로드하는 함수
   * @param modelPath - 모델 파일 경로
   * @param type - 모델 타입
   * @returns 로드된 모델 또는 null
   */
  const loadOrGetCachedModel = useCallback(
    async (
      modelPath: string,
      type: ModelType,
    ): Promise<THREE.Object3D | null> => {
      // 캐시에 있는지 확인
      if (modelCacheRef.current[modelPath]) {
        const cachedModel =
          modelCacheRef.current[modelPath];
        const clonedModel = cachedModel.clone();
        adjustModelTransform(clonedModel, type);
        setupModelMaterials(clonedModel, type);
        return clonedModel;
      }

      // 캐시에 없으면 새로 로드
      try {
        const model = await loadSingleModel(
          modelPath,
          type,
        );

        if (model) {
          // 원본 모델을 캐시에 저장 (변환 적용 전)
          const originalModel = model.clone();
          originalModel.scale.setScalar(1);
          originalModel.position.set(0, 0, 0);
          originalModel.rotation.set(0, 0, 0);
          originalModel.updateMatrix();
          originalModel.updateMatrixWorld(true);

          modelCacheRef.current[modelPath] = originalModel;
        }

        return model;
      } catch (error) {
        console.error(
          `Failed to load model: ${modelPath}`,
          error,
        );
        return null;
      }
    },
    [
      loadSingleModel,
      adjustModelTransform,
      setupModelMaterials,
    ],
  );

  /**
   * 모델 업데이트 함수
   */
  const updateModels =
    useCallback(async (): Promise<void> => {
      if (!scene || !ready) return;

      let disposed = false;

      // 꽃 모델 업데이트
      if (flowerModels && flowerModels.length > 0) {
        if (!loadingRef.current.flowers) {
          loadingRef.current.flowers = true;

          const newFlowerModels: THREE.Object3D[] = [];
          for (const modelPath of flowerModels) {
            if (disposed) return;
            const model = await loadOrGetCachedModel(
              modelPath,
              'flower',
            );
            if (model) {
              newFlowerModels.push(model);
            }
          }

          if (!disposed && newFlowerModels.length > 0) {
            // 기존 꽃 모델들 제거
            modelsRef.current.flowers.forEach((model) => {
              if (scene) {
                scene.remove(model);
              }
            });

            // 새로운 꽃 모델들을 씬에 추가
            newFlowerModels.forEach((model) => {
              if (scene) {
                scene.add(model);
              }
            });

            modelsRef.current.flowers = newFlowerModels;
          }

          loadingRef.current.flowers = false;
        }
      } else {
        // 꽃 모델이 없으면 기존 모델들 제거
        modelsRef.current.flowers.forEach((model) => {
          if (scene) {
            scene.remove(model);
          }
        });
        modelsRef.current.flowers = [];
      }

      // 포장지 모델 업데이트
      if (wrapperModel) {
        if (!loadingRef.current.wrapper) {
          loadingRef.current.wrapper = true;

          const newWrapperModel =
            await loadOrGetCachedModel(
              wrapperModel,
              'wrapper',
            );

          if (!disposed && newWrapperModel) {
            // 기존 포장지 모델 제거
            if (modelsRef.current.wrapper && scene) {
              scene.remove(modelsRef.current.wrapper);
            }

            // 새로운 포장지 모델을 씬에 추가
            scene!.add(newWrapperModel);
            modelsRef.current.wrapper = newWrapperModel;
          }

          loadingRef.current.wrapper = false;
        }
      } else {
        // 포장지 모델이 없으면 기존 모델 제거
        if (modelsRef.current.wrapper && scene) {
          scene.remove(modelsRef.current.wrapper);
          modelsRef.current.wrapper = null;
        }
      }

      // 장식 모델 업데이트
      if (decorationModel) {
        if (!loadingRef.current.decoration) {
          loadingRef.current.decoration = true;

          const newDecorationModel =
            await loadOrGetCachedModel(
              decorationModel,
              'decoration',
            );

          if (!disposed && newDecorationModel) {
            // 기존 장식 모델 제거
            if (modelsRef.current.decoration && scene) {
              scene.remove(modelsRef.current.decoration);
            }

            // 새로운 장식 모델을 씬에 추가
            scene!.add(newDecorationModel);
            modelsRef.current.decoration =
              newDecorationModel;
          }

          loadingRef.current.decoration = false;
        }
      } else {
        // 장식 모델이 없으면 기존 모델 제거
        if (modelsRef.current.decoration && scene) {
          scene.remove(modelsRef.current.decoration);
          modelsRef.current.decoration = null;
        }
      }
    }, [
      scene,
      ready,
      flowerModels,
      wrapperModel,
      decorationModel,
      loadOrGetCachedModel,
    ]);

  // 모델 로딩 및 관리
  useEffect(() => {
    updateModels();
  }, [updateModels]);

  return {
    models: modelsRef.current,
    loading: loadingRef.current,
  };
};
