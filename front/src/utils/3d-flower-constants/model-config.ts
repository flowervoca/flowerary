/**
 * 모델 관련 설정 상수들
 * 모델 변환, 위치, 회전 등 3D 모델 관련 설정을 관리합니다.
 */

// 모델 변환 설정
export const MODEL_TRANSFORM_CONFIG = {
  baseScale: 10.0,
  flower: {
    scale: 1,
    position: { x: 0, y: 10, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  wrapper: {
    scale: 3,
    position: { x: 0, y: -14, z: 0 },
    rotation: { x: 0, y: -(Math.PI / 36), z: 0 },
  },
  decoration: {
    scale: 1,
    position: { x: 0, y: -12, z: 3.8 },
    rotation: { x: 0, y: -(Math.PI / 186), z: 0 },
  },
} as const;

// 카테고리 매핑
export const CATEGORY_MAPPING = {
  FL: '꽃',
  WR: '포장지',
  DE: '장식',
} as const;
