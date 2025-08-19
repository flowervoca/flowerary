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
import { useLoadingState } from './hooks/useLoadingState';
import { use3DFlower } from '@/hooks/use-3d-flower';
import { usePositionData } from './hooks/usePositionData';

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
  onResetCamera,
}) => {
  // 클라이언트 사이드 마운트 상태
  const [isMounted, setIsMounted] = useState(false);

  // DOM 참조
  const mountRef = useRef<HTMLDivElement>(null);

  // 로딩 상태 관리
  const { isLoading, modelsLoadedOnce, onModelsLoaded } =
    useLoadingState();

  // 3D 꽃 훅에서 위치 정보 조회 함수들 가져오기
  const {
    fetchFlowerPositions,
    fetchFixedWrapper,
    fetchDecorationPositions,
  } = use3DFlower();

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js 초기 설정
  const {
    scene,
    camera,
    renderer,
    controls,
    ready,
    resetCameraPosition,
  } = useThreeSetup(mountRef, isMounted);

  // 위치 정보 데이터 조회
  const { positionData, loading: positionLoading } = usePositionData({
    ready,
    flowerModelId: '60b38cf0-c9ca-4510-94a3-4a13807e95c9', // rose 모델 ID
    decorationModelId: '05223b34-2d63-4a59-9f63-6de42b2384ff',
    fetchFlowerPositions,
    fetchFixedWrapper,
    fetchDecorationPositions,
  });

  // 모델 로딩 관리
  const { models, loading } = useModelLoading({
    scene,
    ready,
    flowerModels,
    wrapperModel,
    decorationModel,
    onModelsLoaded,
    positionData,
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

  // 카메라 리셋 함수 전달
  useEffect(() => {
    if (!isMounted || !resetCameraPosition) return;

    onResetCamera?.(resetCameraPosition);
  }, [onResetCamera, isMounted, resetCameraPosition]);

  // 모델 표시 제어
  useEffect(() => {
    if (!scene) return;

    // 모든 모델들의 visibility 제어
    const allModels = [
      ...models.flowers,
      ...(models.wrapper ? [models.wrapper] : []),
      ...(models.decoration ? [models.decoration] : []),
    ];

    allModels.forEach((model) => {
      if (model) {
        model.visible = modelsLoadedOnce;
      }
    });
  }, [scene, models, modelsLoadedOnce]);

  // 마운트되지 않은 경우 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    <div ref={mountRef} className='w-full h-full relative'>
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4'></div>
            <p className='text-gray-600 font-medium'>
              모델 로딩 중...
            </p>
          </div>
        </div>
      )}

      {/* 모델 색상 관리 */}
      <ModelManager
        models={models}
        wrapperColor={wrapperColor}
        decorationColor={decorationColor}
        modelsLoadedOnce={modelsLoadedOnce}
      />

      {/* 씬 배경색 관리 */}
      <SceneManager scene={scene} color={color} />
    </div>
  );
};

export default ThreeDFlowerViewer;
