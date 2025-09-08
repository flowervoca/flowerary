/**
 * 3D 모델 로딩을 담당하는 커스텀 훅
 * 모델 캐싱, 로딩 상태 관리, 모델 업데이트를 처리합니다.
 */

import {
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  ModelType,
  ModelCache,
  LoadedModels,
  LoadingState,
} from '@/types/3d-flower';
import { MODEL_TRANSFORM_CONFIG } from '@/utils/3d-flower-constants';

// ============================================================================
// 타입 정의
// ============================================================================

interface UseModelLoadingProps {
  scene: THREE.Scene | null;
  ready: boolean;
  flowerModels: string[];
  wrapperModel?: string;
  decorationModel?: string;
  onModelsLoaded?: (models: LoadedModels) => void; // 모든 모델 로딩 완료 콜백 추가
  positionData?: {
    flowerPositions: any[];
    wrapperPosition: any | null;
    decorationPosition: any | null;
  };
  positionsReady?: boolean; // 위치 데이터가 준비되었는지 여부
}

interface UseModelLoadingResult {
  models: LoadedModels;
  loading: LoadingState;
  allModelsLoaded: boolean; // 모든 모델 로딩 완료 상태 추가
}

// ============================================================================
// 유틸리티 함수들
// ============================================================================

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

// ============================================================================
// 초기 상태 상수
// ============================================================================

const INITIAL_LOADED_MODELS: LoadedModels = {
  flowers: [],
  wrapper: null,
  decoration: null,
};

const INITIAL_LOADING_STATE: LoadingState = {
  flowers: false,
  wrapper: false,
  decoration: false,
};

// ============================================================================
// 메인 훅
// ============================================================================

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
  onModelsLoaded,
  positionData,
  positionsReady,
}: UseModelLoadingProps): UseModelLoadingResult => {
  // ============================================================================
  // 참조 및 상태
  // ============================================================================

  // 모델 캐시 참조
  const modelCacheRef = useRef<ModelCache>({});

  // 로드된 모델들 상태 (useState로 변경)
  const [models, setModels] = useState<LoadedModels>(
    INITIAL_LOADED_MODELS,
  );

  // 로딩 상태 참조
  const loadingRef = useRef<LoadingState>(
    INITIAL_LOADING_STATE,
  );

  // 모든 모델 로딩 완료 상태 참조
  const allModelsLoadedRef = useRef<boolean>(false);

  // 로딩 중인지 확인하는 플래그
  const isLoadingRef = useRef<boolean>(false);

  // ============================================================================
  // 모델 변환 및 설정 함수들
  // ============================================================================

  // DB 값 안전 숫자 변환 헬퍼
  const toNumberOr = (
    value: unknown,
    defaultValue: number,
  ): number => {
    const n =
      typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : defaultValue;
  };

  /**
   * 모델 변환 조정 함수
   * @param model - 변환할 모델
   * @param type - 모델 타입
   * @param positionIndex - 위치 인덱스 (꽃 모델의 경우)
   * @param baseScale - 기본 스케일 (꽃 모델의 경우 동일한 스케일 사용)
   */
  const adjustModelTransform = useCallback(
    (
      model: THREE.Object3D,
      type: ModelType,
      positionIndex: number = 0,
      baseScale?: number,
    ): void => {
      if (!isValidModelType(type)) {
        console.warn(
          `Invalid model type for transform: ${type}`,
        );
        return;
      }

      // baseScale이 전달되지 않으면 계산
      let calculatedBaseScale = baseScale;
      if (calculatedBaseScale === undefined) {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        calculatedBaseScale =
          MODEL_TRANSFORM_CONFIG.baseScale / maxSize;
      }

      // positionData가 있으면 사용, 없으면 기본 설정 사용
      if (positionData) {
        let positionConfig;

        if (
          type === 'flower' &&
          positionData.flowerPositions[positionIndex]
        ) {
          const flowerPos =
            positionData.flowerPositions[positionIndex];
          positionConfig = {
            scale: toNumberOr(flowerPos.scale_factor, 1),
            position: {
              x: toNumberOr(flowerPos.x_coordinate, 0),
              y: toNumberOr(flowerPos.y_coordinate, 0),
              z: toNumberOr(flowerPos.z_coordinate, 0),
            },
            rotation: {
              x: toNumberOr(flowerPos.rotation_x, 0),
              y: toNumberOr(flowerPos.rotation_y, 0),
              z: toNumberOr(flowerPos.rotation_z, 0),
            },
          };
        } else if (
          type === 'wrapper' &&
          positionData.wrapperPosition
        ) {
          const wrapperPos = positionData.wrapperPosition;
          positionConfig = {
            scale: toNumberOr(wrapperPos.scale_factor, 3),
            position: {
              x: toNumberOr(wrapperPos.x_coordinate, 0),
              y: toNumberOr(wrapperPos.y_coordinate, 0),
              z: toNumberOr(wrapperPos.z_coordinate, 0),
            },
            rotation: {
              x: toNumberOr(wrapperPos.rotation_x, 0),
              y: toNumberOr(wrapperPos.rotation_y, 0),
              z: toNumberOr(wrapperPos.rotation_z, 0),
            },
          };
        } else if (
          type === 'decoration' &&
          positionData.decorationPosition
        ) {
          const decorationPos =
            positionData.decorationPosition;
          positionConfig = {
            scale: toNumberOr(
              decorationPos.scale_factor,
              1,
            ),
            position: {
              x: toNumberOr(decorationPos.x_coordinate, 0),
              y: toNumberOr(decorationPos.y_coordinate, 0),
              z: toNumberOr(decorationPos.z_coordinate, 0),
            },
            rotation: {
              x: toNumberOr(decorationPos.rotation_x, 0),
              y: toNumberOr(decorationPos.rotation_y, 0),
              z: toNumberOr(decorationPos.rotation_z, 0),
            },
          };
        }

        if (positionConfig) {
          model.scale.setScalar(
            calculatedBaseScale * positionConfig.scale,
          );
          model.position.set(
            positionConfig.position.x,
            positionConfig.position.y,
            positionConfig.position.z,
          );
          model.rotation.set(
            positionConfig.rotation.x,
            positionConfig.rotation.y,
            positionConfig.rotation.z,
          );
          // (디버깅용 로그 제거됨)
        } else {
          // 기본 설정 사용
          const config = MODEL_TRANSFORM_CONFIG[type];
          model.scale.setScalar(
            calculatedBaseScale * config.scale,
          );
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
        }
      } else {
        // positionData가 없으면 기본 설정 사용
        const config = MODEL_TRANSFORM_CONFIG[type];
        model.scale.setScalar(
          calculatedBaseScale * config.scale,
        );
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
      }

      model.updateMatrix();
      model.updateMatrixWorld(true);
    },
    [positionData?.flowerPositions, positionData?.wrapperPosition, positionData?.decorationPosition],
  );

  /**
   * 모델 재질 설정 함수
   * @param model - 재질을 설정할 모델
   * @param type - 모델 타입
   */
  const setupModelMaterials = useCallback(
    (model: THREE.Object3D, type: ModelType): void => {
      // 모델 초기에는 보이지 않도록 설정
      model.visible = false;

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

  // ============================================================================
  // 모델 로딩 함수들
  // ============================================================================

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

  // ============================================================================
  // 모델 상태 관리 함수들
  // ============================================================================

  /**
   * 모든 모델 로딩 완료 여부 확인
   */
  const checkAllModelsLoaded = useCallback(() => {
    const hasFlowers =
      flowerModels.length === 0 ||
      models.flowers.length > 0;
    const hasWrapper =
      !wrapperModel || models.wrapper !== null;
    const hasDecoration =
      !decorationModel || models.decoration !== null;

    const allLoaded =
      hasFlowers && hasWrapper && hasDecoration;

    // 로딩 상태도 확인
    const notLoading =
      !loadingRef.current.flowers &&
      !loadingRef.current.wrapper &&
      !loadingRef.current.decoration;

    const previouslyLoaded = allModelsLoadedRef.current;
    allModelsLoadedRef.current = allLoaded && notLoading;

    // 새로 로딩이 완료된 경우에만 콜백 호출
    if (allModelsLoadedRef.current && !previouslyLoaded) {
      onModelsLoaded?.(models);
    }
  }, [
    flowerModels.length,
    wrapperModel,
    decorationModel,
    models.flowers.length,
    models.wrapper,
    models.decoration,
    onModelsLoaded,
  ]);

  // ============================================================================
  // 꽃 모델 업데이트 함수
  // ============================================================================

  /**
   * 꽃 모델 업데이트
   */
  const updateFlowerModels = useCallback(
    async (disposed: boolean): Promise<void> => {
      if (flowerModels && flowerModels.length > 0) {
        if (!loadingRef.current.flowers) {
          loadingRef.current.flowers = true;

          const newFlowerModels: THREE.Object3D[] = [];

          // 첫 번째 꽃 모델 로드
          const firstModelPath = flowerModels[0];
          const firstModel = await loadOrGetCachedModel(
            firstModelPath,
            'flower',
          );

          if (firstModel) {
            // baseScale을 한 번만 계산 (모든 꽃 모델이 동일한 크기를 가지도록)
            const scaleRef =
              modelCacheRef.current[firstModelPath] ||
              firstModel;
            const box = new THREE.Box3().setFromObject(
              scaleRef,
            );
            const size = box.getSize(new THREE.Vector3());
            const maxSize = Math.max(
              size.x,
              size.y,
              size.z,
            );
            const flowerBaseScale =
              MODEL_TRANSFORM_CONFIG.baseScale / maxSize;

            // positionData가 있으면 각 위치 데이터에 따라 모델 생성
            if (
              positionData &&
              positionData.flowerPositions.length > 0
            ) {
              positionData.flowerPositions.forEach(
                (_, index) => {
                  if (index === 0) {
                    // 첫 번째 모델은 이미 로드된 것 사용 (변환 초기화 후 적용)
                    firstModel.scale.setScalar(1);
                    firstModel.position.set(0, 0, 0);
                    firstModel.rotation.set(0, 0, 0);
                    adjustModelTransform(
                      firstModel,
                      'flower',
                      index,
                      flowerBaseScale,
                    );
                    (firstModel as any).userData = {
                      ...((firstModel as any).userData ||
                        {}),
                      flowerIndex: index,
                      position_order:
                        positionData.flowerPositions?.[
                          index
                        ]?.position_order ?? index + 1,
                      position_record:
                        positionData.flowerPositions?.[
                          index
                        ] || null,
                    };
                    newFlowerModels.push(firstModel);
                  } else {
                    // 나머지는 복제본 생성
                    const clonedModel = firstModel.clone();
                    clonedModel.scale.setScalar(1);
                    clonedModel.position.set(0, 0, 0);
                    clonedModel.rotation.set(0, 0, 0);
                    adjustModelTransform(
                      clonedModel,
                      'flower',
                      index,
                      flowerBaseScale,
                    );
                    (clonedModel as any).userData = {
                      ...((clonedModel as any).userData ||
                        {}),
                      flowerIndex: index,
                      position_order:
                        positionData.flowerPositions?.[
                          index
                        ]?.position_order ?? index + 1,
                      position_record:
                        positionData.flowerPositions?.[
                          index
                        ] || null,
                    };
                    newFlowerModels.push(clonedModel);
                  }
                },
              );
            } else {
              // positionData가 없으면 기존 방식 사용
              firstModel.scale.setScalar(1);
              firstModel.position.set(0, 0, 0);
              firstModel.rotation.set(0, 0, 0);
              adjustModelTransform(
                firstModel,
                'flower',
                0,
                flowerBaseScale,
              );
              (firstModel as any).userData = {
                ...((firstModel as any).userData || {}),
                flowerIndex: 0,
                position_order: 1,
                position_record: null,
              };
              newFlowerModels.push(firstModel);

              // 두 번째 모델 (복제본) 생성
              const secondModel = firstModel.clone();
              secondModel.scale.setScalar(1);
              secondModel.position.set(0, 0, 0);
              secondModel.rotation.set(0, 0, 0);
              adjustModelTransform(
                secondModel,
                'flower',
                1,
                flowerBaseScale,
              );
              (secondModel as any).userData = {
                ...((secondModel as any).userData || {}),
                flowerIndex: 1,
                position_order: 2,
                position_record: null,
              };

              // 두 번째 모델의 위치를 약간 이동
              const originalPosition =
                firstModel.position.clone();
              secondModel.position.set(
                originalPosition.x - 2, // 왼쪽으로 2단위 이동
                originalPosition.y,
                originalPosition.z,
              );

              newFlowerModels.push(secondModel);
            }
          }

          if (!disposed && newFlowerModels.length > 0) {
            setModels((prev) => {
              // 기존 꽃 모델들 제거
              prev.flowers.forEach((model) => {
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

              return {
                ...prev,
                flowers: newFlowerModels,
              };
            });
          }

          loadingRef.current.flowers = false;
        }
      } else {
        // 꽃 모델이 없으면 기존 모델들 제거
        setModels((prev) => {
          prev.flowers.forEach((model) => {
            if (scene) {
              scene.remove(model);
            }
          });
          return {
            ...prev,
            flowers: [],
          };
        });
      }
    },
    [
      flowerModels,
      loadOrGetCachedModel,
      scene,
      positionData,
      adjustModelTransform,
    ],
  );

  // ============================================================================
  // 포장지 모델 업데이트 함수
  // ============================================================================

  /**
   * 포장지 모델 업데이트
   */
  const updateWrapperModel = useCallback(
    async (disposed: boolean): Promise<void> => {
      if (wrapperModel) {
        if (!loadingRef.current.wrapper) {
          loadingRef.current.wrapper = true;

          const newWrapperModel =
            await loadOrGetCachedModel(
              wrapperModel,
              'wrapper',
            );

          if (!disposed && newWrapperModel) {
            setModels((prev) => {
              // 기존 포장지 모델 제거
              if (prev.wrapper && scene) {
                scene.remove(prev.wrapper);
              }

              // 새로운 포장지 모델을 씬에 추가
              scene!.add(newWrapperModel);

              return {
                ...prev,
                wrapper: newWrapperModel,
              };
            });
          }

          loadingRef.current.wrapper = false;
        }
      } else {
        // 포장지 모델이 없으면 기존 모델 제거
        setModels((prev) => {
          if (prev.wrapper && scene) {
            scene.remove(prev.wrapper);
          }
          return {
            ...prev,
            wrapper: null,
          };
        });
      }
    },
    [wrapperModel, loadOrGetCachedModel, scene, adjustModelTransform],
  );

  // ============================================================================
  // 장식 모델 업데이트 함수
  // ============================================================================

  /**
   * 장식 모델 업데이트
   */
  const updateDecorationModel = useCallback(
    async (disposed: boolean): Promise<void> => {
      if (decorationModel) {
        if (!loadingRef.current.decoration) {
          loadingRef.current.decoration = true;

          const newDecorationModel =
            await loadOrGetCachedModel(
              decorationModel,
              'decoration',
            );

          if (!disposed && newDecorationModel) {
            setModels((prev) => {
              // 기존 장식 모델 제거
              if (prev.decoration && scene) {
                scene.remove(prev.decoration);
              }

              // 새로운 장식 모델을 씬에 추가
              scene!.add(newDecorationModel);

              return {
                ...prev,
                decoration: newDecorationModel,
              };
            });
          }

          loadingRef.current.decoration = false;
        }
      } else {
        // 장식 모델이 없으면 기존 모델 제거
        setModels((prev) => {
          if (prev.decoration && scene) {
            scene.remove(prev.decoration);
          }
          return {
            ...prev,
            decoration: null,
          };
        });
      }
    },
    [decorationModel, loadOrGetCachedModel, scene, adjustModelTransform],
  );

  // ============================================================================
  // 메인 모델 업데이트 함수
  // ============================================================================

  /**
   * 모델 업데이트 함수
   */
  const updateModels =
    useCallback(async (): Promise<void> => {
      if (!scene || !ready || isLoadingRef.current) return;

      // 위치 데이터가 제공되는 경우, 준비될 때까지 대기하여 즉시 올바른 배치로 표시
      if (positionData && positionsReady === false) return;

      isLoadingRef.current = true;

      try {
        const disposed = false;

        // 모든 모델 타입을 병렬로 업데이트
        await Promise.all([
          updateFlowerModels(disposed),
          updateWrapperModel(disposed),
          updateDecorationModel(disposed),
        ]);
      } finally {
        isLoadingRef.current = false;
      }
    }, [
      scene,
      ready,
      updateFlowerModels,
      updateWrapperModel,
      updateDecorationModel,
      positionData,
      positionsReady,
    ]);

  // ============================================================================
  // 사이드 이펙트
  // ============================================================================

  // 모델 로딩 및 관리
  useEffect(() => {
    updateModels();
  }, [
    scene,
    ready,
    flowerModels,
    wrapperModel,
    decorationModel,
    positionData,
    positionsReady,
  ]);

  // 모델 상태 변경 시 로딩 완료 확인
  useEffect(() => {
    checkAllModelsLoaded();
  }, [
    flowerModels.length,
    wrapperModel,
    decorationModel,
    models.flowers.length,
    models.wrapper,
    models.decoration,
    onModelsLoaded,
  ]);

  // ============================================================================
  // 반환값
  // ============================================================================

  return {
    models,
    loading: loadingRef.current,
    allModelsLoaded: allModelsLoadedRef.current,
  };
};
