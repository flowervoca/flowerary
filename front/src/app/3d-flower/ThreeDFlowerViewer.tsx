"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ThreeDFlowerViewerProps {
  filePath?: string;
}

const ThreeDFlowerViewer: React.FC<ThreeDFlowerViewerProps> = ({ filePath }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let controls: OrbitControls;
    let cleanup: (() => void) | undefined;

    async function setupThree() {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      sceneRef.current = scene;

      // Camera
      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 5000);
      camera.position.set(0, 10, 30);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false,
        preserveDrawingBuffer: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0xffffff, 1);
      mountRef.current!.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Light
      const ambient = new THREE.AmbientLight(0xffffff, 5);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 5);
      dir.position.set(5, 10, 7);
      scene.add(dir);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controlsRef.current = controls;

      // 테스트용 구체 추가 (중앙에 초록색)
      const testGeometry = new THREE.SphereGeometry(1, 32, 32);
      const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const testMesh = new THREE.Mesh(testGeometry, testMaterial);
      testMesh.position.set(0, 0, 0);
      scene.add(testMesh);

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
  }, []);

  useEffect(() => {
    if (!filePath || !sceneRef.current || !ready) return;
    let disposed = false;
    let loader: GLTFLoader;
    async function loadModel() {
      loader = new GLTFLoader();
      loader.load(
        filePath,
        (gltf: { scene: THREE.Object3D }) => {
          if (disposed) return;
          // Remove previous model
          if (modelRef.current && sceneRef.current) {
            sceneRef.current.remove(modelRef.current);
          }
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
              mesh.material = new THREE.MeshBasicMaterial({ 
                color: 0xff00ff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1.0,
                depthTest: true,
                depthWrite: true,
                wireframe: true
              });
              mesh.visible = true;
            }
            child.visible = true;
          });
          
          sceneRef.current!.add(model);
          modelRef.current = model;
        },
        undefined,
        (error: unknown) => {
          console.error('GLTF load error:', error);
        }
      );
    }
    loadModel();
    return () => {
      disposed = true;
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
    };
  }, [filePath, ready]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeDFlowerViewer; 