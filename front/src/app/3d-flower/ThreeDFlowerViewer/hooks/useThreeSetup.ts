/**
 * Three.js 초기화를 담당하는 커스텀 훅
 * Scene, Camera, Renderer, Controls, Lighting을 설정합니다.
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CAMERA_CONFIG,
  LIGHTING_CONFIG,
  CONTROLS_CONFIG,
} from '@/utils/3d-flower-constants';

interface ThreeSetupResult {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  controls: OrbitControls | null;
  ready: boolean;
}

/**
 * Three.js 초기화 커스텀 훅
 * @param mountRef - Three.js를 마운트할 DOM 요소 참조
 * @param isMounted - 컴포넌트 마운트 상태
 * @returns Three.js 객체들과 준비 상태
 */
export const useThreeSetup = (
  mountRef: React.RefObject<HTMLDivElement | null>,
  isMounted: boolean,
): ThreeSetupResult => {
  const [ready, setReady] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(
    null,
  );
  const rendererRef = useRef<THREE.WebGLRenderer | null>(
    null,
  );
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;

    let controls: OrbitControls;
    let frameId: number;

    const setupThree = async (): Promise<void> => {
      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;

      // Scene 초기화
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera 초기화
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
      cameraRef.current = camera;

      // Renderer 초기화
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      mountRef.current!.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 조명 설정
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

      // 컨트롤 설정
      controls = new OrbitControls(
        camera,
        renderer.domElement,
      );
      controls.enableDamping = true;
      controls.dampingFactor =
        CONTROLS_CONFIG.dampingFactor;
      controlsRef.current = controls;

      // 애니메이션 루프 시작
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      // 리사이즈 핸들러 설정
      const handleResize = () => {
        if (!mountRef.current || !camera || !renderer)
          return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      setReady(true);
    };

    setupThree();

    return () => {
      window.removeEventListener('resize', () => {});
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
      if (controls) {
        controls.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        mountRef.current?.removeChild(
          rendererRef.current.domElement,
        );
      }
    };
  }, [isMounted, mountRef]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    ready,
  };
};
