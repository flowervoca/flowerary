/**
 * 3D 씬 배경색 관리 컴포넌트
 * 씬의 배경색을 업데이트합니다.
 */

import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { COLOR_MAP } from '@/utils/3d-flower-constants';

interface SceneManagerProps {
  scene: THREE.Scene | null;
  color?: string;
}

/**
 * 씬 배경색 관리 컴포넌트
 * @param props - 씬 관리에 필요한 props
 */
const SceneManager: React.FC<SceneManagerProps> = ({
  scene,
  color,
}) => {
  // 배경색 계산을 메모이제이션
  const backgroundColor = useMemo(() => {
    if (!color) return '#FFB6C1';

    // color가 이미 HEX 색상 코드인 경우 그대로 사용, 아니면 COLOR_MAP에서 찾기
    if (color.startsWith('#')) {
      return color;
    }

    // COLOR_MAP에서 색상 찾기 (타입 안전성 보장)
    const mappedColor =
      COLOR_MAP[color as keyof typeof COLOR_MAP];
    return mappedColor || '#FFB6C1';
  }, [color]);

  // 배경색 변경
  useEffect(() => {
    if (!scene) return;

    const threeColor = new THREE.Color(backgroundColor);
    scene.background = threeColor;
  }, [scene, backgroundColor]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 배경색 관리만 담당
  return null;
};

// React.memo를 사용하여 불필요한 리렌더링 방지
export default React.memo(SceneManager);
