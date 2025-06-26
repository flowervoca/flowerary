/**
 * 3D 꽃 관련 유틸리티 함수들
 * 모델 포맷팅, 초기 선택 생성 등의 유틸리티 기능을 제공합니다.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  ModelItem,
  DisplayItem,
  SelectedModels,
  ModelType,
} from '@/types/3d-flower';
import {
  CAMERA_CONFIG,
  LIGHTING_CONFIG,
  CONTROLS_CONFIG,
  MODEL_TRANSFORM_CONFIG,
} from './3d-flower-constants';

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
 * 모델 아이템 포맷팅 함수
 * @param data - 포맷팅할 모델 아이템 배열
 * @param category - 카테고리 (선택사항)
 * @returns 포맷팅된 디스플레이 아이템 배열
 */
export const formatModelItems = (
  data: ModelItem[],
  category?: string,
): DisplayItem[] => {
  // 카테고리별 이모지 매핑
  const categoryEmojis: { [key: string]: string } = {
    FL: '🌺', // 꽃
    WR: '🎀', // 포장지
    DE: '✨', // 장식
  };

  const defaultEmoji = '🌺';
  const emoji = category
    ? categoryEmojis[category] || defaultEmoji
    : defaultEmoji;

  return data.map((item) => ({
    id: item.model_id,
    name: item.description,
    img: emoji,
    filePath: item.file_path,
  }));
};

/**
 * 초기 선택 모델 생성 함수
 * @param results - 카테고리별 결과 배열
 * @returns 초기 선택된 모델들
 */
export const createInitialSelections = (
  results: Array<{
    category: string;
    items: DisplayItem[];
  }>,
): SelectedModels => {
  return results.reduce((acc, { category, items }) => {
    if (items.length > 0) {
      acc[category] = items[0];
    }
    return acc;
  }, {} as SelectedModels);
};

/**
 * Scene 생성 함수
 * @returns 새로운 Three.js Scene 객체
 */
export const createScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
};

/**
 * Camera 생성 함수
 * @param width - 뷰포트 너비
 * @param height - 뷰포트 높이
 * @returns 새로운 Three.js PerspectiveCamera 객체
 */
export const createCamera = (
  width: number,
  height: number,
): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    width / height,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far,
  );
  camera.position.set(
    CAMERA_CONFIG.position.x,
    CAMERA_CONFIG.position.y,
    CAMERA_CONFIG.position.z,
  );
  camera.lookAt(
    CAMERA_CONFIG.lookAt.x,
    CAMERA_CONFIG.lookAt.y,
    CAMERA_CONFIG.lookAt.z,
  );
  return camera;
};

/**
 * Renderer 생성 함수
 * @param width - 뷰포트 너비
 * @param height - 뷰포트 높이
 * @returns 새로운 Three.js WebGLRenderer 객체
 */
export const createRenderer = (
  width: number,
  height: number,
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  return renderer;
};

/**
 * 조명 설정 함수
 * @param scene - 조명을 설정할 Scene 객체
 */
export const setupLighting = (scene: THREE.Scene): void => {
  const ambient = new THREE.AmbientLight(
    LIGHTING_CONFIG.ambient.color,
    LIGHTING_CONFIG.ambient.intensity,
  );
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(
    LIGHTING_CONFIG.directional.color,
    LIGHTING_CONFIG.directional.intensity,
  );
  directional.position.set(
    LIGHTING_CONFIG.directional.position.x,
    LIGHTING_CONFIG.directional.position.y,
    LIGHTING_CONFIG.directional.position.z,
  );
  scene.add(directional);
};

/**
 * 컨트롤 생성 함수
 * @param camera - 컨트롤할 Camera 객체
 * @param renderer - 렌더러 객체
 * @returns 새로운 OrbitControls 객체
 */
export const createControls = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): OrbitControls => {
  const controls = new OrbitControls(
    camera,
    renderer.domElement,
  );
  controls.enableDamping = true;
  controls.dampingFactor = CONTROLS_CONFIG.dampingFactor;
  return controls;
};

/**
 * 모델 변환 조정 함수
 * @param model - 변환할 모델 객체
 * @param type - 모델 타입
 */
export const adjustModelTransform = (
  model: THREE.Object3D,
  type: ModelType,
): void => {
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
};

/**
 * 모델 재질 설정 함수
 * @param model - 재질을 설정할 모델 객체
 * @param type - 모델 타입
 */
export const setupModelMaterials = (
  model: THREE.Object3D,
  type: ModelType,
): void => {
  model.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const originalMaterial =
        mesh.material as THREE.MeshStandardMaterial;
      mesh.material = originalMaterial;
      mesh.visible = true;
    }
    child.visible = true;
  });
};

/**
 * 단일 모델 로드 함수
 * @param modelPath - 모델 파일 경로
 * @param type - 모델 타입
 * @returns 로드된 모델 객체를 포함한 Promise
 */
export const loadSingleModel = (
  modelPath: string,
  type: ModelType,
): Promise<THREE.Object3D> => {
  return new Promise<THREE.Object3D>((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf: { scene: THREE.Object3D }) => {
        const model = gltf.scene;
        setupModelMaterials(model, type);
        resolve(model);
      },
      undefined,
      (error: unknown) => {
        reject(error);
      },
    );
  });
};

/**
 * 윈도우 리사이즈 핸들러
 * @param mountRef - 마운트된 DOM 요소 참조
 * @param camera - 카메라 객체
 * @param renderer - 렌더러 객체
 */
export const handleWindowResize = (
  mountRef: React.RefObject<HTMLDivElement | null>,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): void => {
  if (!mountRef.current) return;

  const width = mountRef.current.clientWidth;
  const height = mountRef.current.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};
