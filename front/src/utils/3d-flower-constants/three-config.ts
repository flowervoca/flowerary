/**
 * Three.js 설정 상수들
 * 카메라, 조명, 컨트롤 등 Three.js 관련 설정을 관리합니다.
 */

// 카메라 설정
export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.01,
  far: 5000,
  position: { x: 0, y: 10, z: 30 },
  lookAt: { x: 0, y: 0, z: 0 },
} as const;

// 조명 설정
export const LIGHTING_CONFIG = {
  ambient: { color: 0xffffff, intensity: 5 },
  directional: {
    color: 0xffffff,
    intensity: 5,
    position: { x: 5, y: 10, z: 7 },
  },
} as const;

// 컨트롤 설정
export const CONTROLS_CONFIG = {
  dampingFactor: 0.1,
} as const;
