declare global {
  interface Window {
    Kakao: any;
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
  description: string,
  imageUrl: string,
) => {
  try {
    const initialized = await initKakao();
    if (!initialized) {
      console.error('Kakao SDK not initialized');
      return false;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '꽃다발 감상하기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
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
