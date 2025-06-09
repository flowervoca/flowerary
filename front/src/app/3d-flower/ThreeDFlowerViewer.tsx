'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  saveScreenshot,
  copyToClipboard,
} from './utils/downloadUtils';

interface ThreeDFlowerViewerProps {
  filePath: string;
  onDownload?: (filename: string) => void;
  onCopy?: (success: boolean) => void;
  color?: string;
  onRendererReady?: (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) => void;
}

const ThreeDFlowerViewer: React.FC<
  ThreeDFlowerViewerProps
> = ({ filePath, onDownload, onCopy, color = 'bg-[#E5E5E5]', onRendererReady }) => {
  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(
    null,
  );
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(
    null,
  );
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelsRef = useRef<{ [key: string]: THREE.Object3D | null }>({});
  const [ready, setReady] = useState(false);

  // 색상 매핑 정의
  const colorMap: { [key: string]: string } = {
    'bg-red-200': '#fecaca',
    'bg-orange-200': '#fed7aa',
    'bg-yellow-200': '#fef08a',
    'bg-green-200': '#bbf7d0',
    'bg-blue-200': '#bfdbfe',
    'bg-purple-200': '#e9d5ff',
    'bg-pink-200': '#fbcfe8',
    'bg-[#E5E5E5]': '#E5E5E5'
  };

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;

    let controls: OrbitControls;
    let cleanup: (() => void) | undefined;

    async function setupThree() {
      // Scene
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Camera
      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.01,
        5000,
      );
      camera.position.set(0, 10, 30);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer
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

      // Light
      const ambient = new THREE.AmbientLight(0xffffff, 5);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 5);
      dir.position.set(5, 10, 7);
      scene.add(dir);

      // Controls
      controls = new OrbitControls(
        camera,
        renderer.domElement,
      );
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controlsRef.current = controls;

      // Animation loop
      let frameId: number;
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      // Resize handler
      const handleResize = () => {
        if (!mountRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        controls.dispose();
        renderer.dispose();
        mountRef.current?.removeChild(renderer.domElement);
      };

      setReady(true);
    }

    setupThree();

    return () => {
      if (cleanup) cleanup();
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !filePath || !sceneRef.current || !ready) return;

    let disposed = false;
    let loader: GLTFLoader;

    async function loadModel() {
      loader = new GLTFLoader();
      loader.load(
        filePath,
        (gltf: { scene: THREE.Object3D }) => {
          if (disposed) return;
          
          const model = gltf.scene;
          // 모델의 바운딩 박스 중심을 (0,0,0)에 맞추기
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxSize = Math.max(size.x, size.y, size.z);
          const scale = 10.0 / maxSize;

          model.scale.setScalar(scale);
          model.position.set(0, 5, 0);
          model.updateMatrix();
          model.updateMatrixWorld(true);

          model.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const originalMaterial = mesh.material as THREE.MeshStandardMaterial;
              mesh.material = originalMaterial;
              mesh.visible = true;
            }
            child.visible = true;
          });

          // 이전 모델 제거
          if (modelsRef.current[filePath] && sceneRef.current) {
            sceneRef.current.remove(modelsRef.current[filePath]!);
          }

          sceneRef.current!.add(model);
          modelsRef.current[filePath] = model;
        },
        undefined,
        (error: unknown) => {
          console.error('GLTF load error:', error);
        },
      );
    }

    loadModel();

    return () => {
      disposed = true;
      if (modelsRef.current[filePath] && sceneRef.current) {
        sceneRef.current.remove(modelsRef.current[filePath]!);
        modelsRef.current[filePath] = null;
      }
    };
  }, [filePath, ready, isMounted]);

  // 배경색 변경을 위한 useEffect
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // 매핑된 색상값 가져오기
    const hexColor = colorMap[color] || '#E5E5E5';
    const threeColor = new THREE.Color(hexColor);
    
    // 배경색 설정
    sceneRef.current.background = threeColor;
  }, [color]);

  useEffect(() => {
    if (!isMounted) return;

    if (
      rendererRef.current &&
      sceneRef.current &&
      cameraRef.current
    ) {
      onRendererReady?.(
        rendererRef.current,
        sceneRef.current,
        cameraRef.current,
      );
    }
  }, [onRendererReady, isMounted]);

  // 다운로드 함수 추가
  const handleDownload = (title?: string) => {
    if (
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;
    const filename = saveScreenshot(
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      title,
    );
    onDownload?.(filename);
  };

  // 클립보드 복사 함수 추가
  const handleCopy = async () => {
    if (
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;
    const success = await copyToClipboard(
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
    );
    onCopy?.(success);
  };

  // 컴포넌트 외부로 함수 노출
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    (window as any).downloadFlower = handleDownload;
    (window as any).copyFlower = handleCopy;
  }, [isMounted]);

  if (!isMounted) {
    return null; // 또는 로딩 컴포넌트를 표시
  }

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ThreeDFlowerViewer;
