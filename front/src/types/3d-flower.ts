import * as THREE from 'three';

// 모델 아이템 인터페이스
export interface ModelItem {
  model_id: number;
  description: string;
  category: string;
  file_path: string;
  thumbnail: string;
}

// 디스플레이 아이템 인터페이스
export interface DisplayItem {
  id: number;
  name: string;
  img: string;
  filePath: string;
}

// 선택된 모델들 인터페이스
export interface SelectedModels {
  [key: string]: DisplayItem | null;
}

// 모든 아이템들 인터페이스
export interface AllItems {
  [key: string]: DisplayItem[];
}

// Three.js 객체들 인터페이스
export interface ThreeJSObjects {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
}

// 모델 타입 정의
export type ModelType =
  | 'flower'
  | 'wrapper'
  | 'decoration'
  | 'background';

// 모델 캐시 인터페이스
export interface ModelCache {
  [key: string]: THREE.Object3D;
}

// 로드된 모델들 인터페이스
export interface LoadedModels {
  flowers: THREE.Object3D[];
  wrapper: THREE.Object3D | null;
  decoration: THREE.Object3D | null;
}

// 로딩 상태 인터페이스
export interface LoadingState {
  flowers: boolean;
  wrapper: boolean;
  decoration: boolean;
}

// ThreeDFlowerViewer Props 인터페이스
export interface ThreeDFlowerViewerProps {
  flowerModels: string[]; // 꽃 모델 파일 경로 배열
  wrapperModel?: string; // 포장지 모델 파일 경로 (선택사항)
  decorationModel?: string; // 장식 모델 파일 경로 (선택사항)
  flowerModelId?: string | number; // 선택된 꽃 모델 ID (DB 조회용)
  decorationModelId?: string | number; // 선택된 장식 모델 ID (DB 조회용)
  onDownload?: (filename: string) => void; // 다운로드 완료 콜백
  onCopy?: (success: boolean) => void; // 클립보드 복사 완료 콜백
  color?: string; // 배경색 (Tailwind CSS 클래스명)
  wrapperColor?: string; // 포장지 색상 (HEX 색상 코드)
  decorationColor?: string; // 장식 색상 (HEX 색상 코드)
  onRendererReady?: (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) => void; // 렌더러 준비 완료 콜백
  onModelClick?: (modelType: ModelType) => void; // 3D 모델 클릭 콜백
  onResetCamera?: (resetFunction: () => void) => void; // 카메라 리셋 함수 전달 콜백
}

// 카테고리 매핑 타입
export type CategoryMapping = {
  FL: '꽃';
  WR: '포장지';
  DE: '장식';
};

// 색상 매핑 타입
export type ColorMap = {
  [key: string]: string;
};

// 위치 데이터 인터페이스
export interface PositionData {
  scale_factor: number;
  is_mirrored?: boolean; // 좌우반전 여부
  x_coordinate: number;
  y_coordinate: number;
  z_coordinate: number;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
}

// 꽃 위치 데이터 인터페이스
export interface FlowerPositionData extends PositionData {
  id: string;
  flower_model_id: string;
  position_order: number;
}

// 포장지 위치 데이터 인터페이스
export interface WrapperPositionData extends PositionData {
  id: string;
}

// 장식 위치 데이터 인터페이스
export interface DecorationPositionData extends PositionData {
  id: string;
  decoration_model_id: string;
}