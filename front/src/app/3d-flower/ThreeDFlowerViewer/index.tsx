/**
 * 3D 꽃 뷰어 메인 컴포넌트
 * Three.js를 사용하여 3D 꽃 모델을 렌더링하고 상호작용을 제공합니다.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeDFlowerViewerProps } from '@/types/3d-flower';

// 커스텀 훅들
import { useThreeSetup } from './hooks/useThreeSetup';
import { useModelLoading } from './hooks/useModelLoading';
import { useModelInteraction } from './hooks/useModelInteraction';
import { useDownloadUtils } from './hooks/useDownloadUtils';

// 컴포넌트들
import ModelManager from './components/ModelManager';
import SceneManager from './components/SceneManager';

/**
 * 3D 꽃 뷰어 컴포넌트
 * @param props - ThreeDFlowerViewerProps
 * @returns 3D 꽃 뷰어 JSX 요소
 */
const ThreeDFlowerViewer: React.FC<
  ThreeDFlowerViewerProps
> = ({
  flowerModels,
  wrapperModel,
  decorationModel,
  onDownload,
  onCopy,
  color = 'bg-[#E5E5E5]',
  wrapperColor,
  decorationColor,
  onRendererReady,
  onModelClick,
}) => {
  // 클라이언트 사이드 마운트 상태
  const [isMounted, setIsMounted] = useState(false);

  // DOM 참조
  const mountRef = useRef<HTMLDivElement>(null);

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js 초기 설정
  const { scene, camera, renderer, controls, ready } =
    useThreeSetup(mountRef, isMounted);

  // 모델 로딩 관리
  const { models, loading } = useModelLoading({
    scene,
    ready,
    flowerModels,
    wrapperModel,
    decorationModel,
  });

  // 모델 상호작용 관리
  useModelInteraction({
    scene,
    camera,
    renderer,
    models,
    onModelClick,
  });

  // 다운로드 유틸리티 관리
  const { handleDownload, handleCopy } = useDownloadUtils({
    renderer,
    scene,
    camera,
    isMounted,
    onDownload,
    onCopy,
  });

  // 렌더러 준비 완료 콜백
  useEffect(() => {
    if (!isMounted) return;

    if (renderer && scene && camera) {
      onRendererReady?.(renderer, scene, camera);
    }
  }, [onRendererReady, isMounted, renderer, scene, camera]);

  // 마운트되지 않은 경우 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    <div ref={mountRef} className='w-full h-full'>
      {/* 모델 색상 관리 */}
      <ModelManager
        models={models}
        wrapperColor={wrapperColor}
        decorationColor={decorationColor}
      />

      {/* 씬 배경색 관리 */}
      <SceneManager scene={scene} color={color} />
    </div>
  );
};

export default ThreeDFlowerViewer;
