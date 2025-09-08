/**
 * Supabase Storage 유틸리티
 * 3D 씬 캡처 및 이미지 업로드 기능을 제공합니다.
 */

import { createClient } from '@supabase/supabase-js';
import { WebGLRenderer, Scene, Camera, Vector2 } from 'three';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 3D 씬을 캡처하여 이미지 데이터 URL로 변환
 */
export const captureScene = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  width: number = 400,
  height: number = 400
): string | null => {
  try {
    // 렌더러 크기 임시 저장
    const originalSize = renderer.getSize(new Vector2());
    
    // 캡처용 크기로 설정
    renderer.setSize(width, height);
    
    // 씬 렌더링
    renderer.render(scene, camera);
    
    // 캔버스에서 이미지 데이터 추출
    const canvas = renderer.domElement;
    const dataURL = canvas.toDataURL('image/png', 0.9);
    
    // 원래 크기로 복원
    renderer.setSize(originalSize.x, originalSize.y);
    
    return dataURL;
  } catch (error) {
    console.error('Failed to capture scene:', error);
    return null;
  }
};

/**
 * 이미지 데이터 URL을 Blob으로 변환
 */
export const dataURLToBlob = (dataURL: string): Blob | null => {
  try {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error('Failed to convert dataURL to blob:', error);
    return null;
  }
};

/**
 * 이미지를 Supabase Storage에 업로드
 */
export const uploadImageToStorage = async (
  imageBlob: Blob,
  fileName: string = `bouquet-${Date.now()}.png`
): Promise<string | null> => {
  try {
    // Storage에 업로드
    const { data, error } = await supabase.storage
      .from('bouquet-thumbnails')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // 공개 URL 생성
    const { data: publicData } = supabase.storage
      .from('bouquet-thumbnails')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
};

/**
 * 3D 씬을 캡처하고 Supabase Storage에 업로드하는 통합 함수
 */
export const captureAndUploadScene = async (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  fileName?: string
): Promise<string | null> => {
  try {
    // 씬 캡처
    const dataURL = captureScene(renderer, scene, camera);
    if (!dataURL) {
      console.error('Failed to capture scene');
      return null;
    }

    // Blob으로 변환
    const blob = dataURLToBlob(dataURL);
    if (!blob) {
      console.error('Failed to convert to blob');
      return null;
    }

    // Storage에 업로드
    const publicUrl = await uploadImageToStorage(blob, fileName);
    if (!publicUrl) {
      console.error('Failed to upload to storage');
      return null;
    }

    return publicUrl;
  } catch (error) {
    console.error('Failed to capture and upload scene:', error);
    return null;
  }
};
