/**
 * 다운로드 및 클립보드 복사 기능을 담당하는 커스텀 훅
 * 스크린샷 저장, 클립보드 복사, 전역 함수 노출을 처리합니다.
 */

import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import {
  saveScreenshot,
  copyToClipboard,
} from '../../utils/downloadUtils';

interface UseDownloadUtilsProps {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  isMounted: boolean;
  onDownload?: (filename: string) => void;
  onCopy?: (success: boolean) => void;
}

/**
 * 다운로드 유틸리티 커스텀 훅
 * @param props - 다운로드 유틸리티에 필요한 props
 * @returns 다운로드 및 복사 함수들
 */
export const useDownloadUtils = ({
  renderer,
  scene,
  camera,
  isMounted,
  onDownload,
  onCopy,
}: UseDownloadUtilsProps) => {
  /**
   * 다운로드 함수
   * @param title - 파일명에 포함할 제목 (선택사항)
   */
  const handleDownload = useCallback(
    (title?: string) => {
      if (!renderer || !scene || !camera) {
        console.warn(
          'Three.js objects not ready for download',
        );
        return;
      }

      const filename = saveScreenshot(
        renderer,
        scene,
        camera,
        title,
      );
      onDownload?.(filename);
    },
    [renderer, scene, camera, onDownload],
  );

  /**
   * 클립보드 복사 함수
   */
  const handleCopy = useCallback(async () => {
    if (!renderer || !scene || !camera) {
      console.warn('Three.js objects not ready for copy');
      return;
    }

    const success = await copyToClipboard(
      renderer,
      scene,
      camera,
    );
    onCopy?.(success);
  }, [renderer, scene, camera, onCopy]);

  // 컴포넌트 외부로 함수 노출 (전역 접근용)
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    (window as any).downloadFlower = handleDownload;
    (window as any).copyFlower = handleCopy;

    return () => {
      delete (window as any).downloadFlower;
      delete (window as any).copyFlower;
    };
  }, [isMounted, handleDownload, handleCopy]);

  return {
    handleDownload,
    handleCopy,
  };
};
