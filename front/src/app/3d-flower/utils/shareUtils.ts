import { captureAndUploadScene } from '@/utils/supabase-storage-utils';
import { createBouquetUrl, BouquetState } from '@/utils/url-params-utils';
import { WebGLRenderer, Scene, Camera } from 'three';

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

const KAKAO_JAVASCRIPT_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

if (!KAKAO_JAVASCRIPT_KEY) {
  throw new Error('Missing Kakao SDK environment variable');
}

export const initKakao = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return false;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
      console.log('Kakao SDK initialized');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize Kakao SDK:', error);
    return false;
  }
};

export const shareToKakao = async (
  title: string,
  hashtags: string,
  imageUrl: string,
  letterContent?: string,
  hideLetterContent?: boolean,
  bouquetState?: BouquetState,
  threeJSObjects?: {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
  }
) => {
  try {
    const initialized = await initKakao();
    if (!initialized) {
      console.error('Kakao SDK not initialized');
      return false;
    }

    // 편지 내용 처리
    let finalHashtags = '';
    if (letterContent && letterContent.trim()) {
      if (hideLetterContent) {
        // 편지 내용 숨기기 활성화 시
        finalHashtags = '#편지 내용을 확인하세요📩';
      } else {
        // 편지 내용 표시
        finalHashtags = letterContent;
      }
    } else {
      // 편지 내용이 없으면 기본 해시태그 사용
      finalHashtags = hashtags;
    }

    // 썸네일 이미지 생성 및 업로드
    let thumbnailUrl = imageUrl; // 기본 이미지로 fallback
    if (threeJSObjects && bouquetState) {
      try {
        const uploadedThumbnailUrl = await captureAndUploadScene(
          threeJSObjects.renderer,
          threeJSObjects.scene,
          threeJSObjects.camera,
          `bouquet-${crypto.randomUUID()}.png`
        );
        if (uploadedThumbnailUrl) {
          thumbnailUrl = uploadedThumbnailUrl;
        } else {
          console.warn('Failed to upload thumbnail, using default image');
        }
      } catch (error) {
        console.error('Failed to capture and upload thumbnail:', error);
        // 썸네일 생성 실패 시 기본 이미지 사용
      }
    }

    // 공유 링크 생성
    const shareUrl = bouquetState 
      ? createBouquetUrl(bouquetState)
      : window.location.href;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description: finalHashtags,
        imageUrl: thumbnailUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '꽃다발 감상하기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Failed to share to Kakao:', error);
    return false;
  }
};
