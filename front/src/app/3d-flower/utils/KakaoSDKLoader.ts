'use client';

export function KakaoSDKLoader() {
  if (typeof window === 'undefined') return;

  // 이미 로드되어 있는지 확인
  if (document.querySelector('script[src*="kakao.min.js"]'))
    return;

  const script = document.createElement('script');
  script.src =
    'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js';
  script.async = true;
  script.onload = () => {
    console.log('Kakao SDK loaded');
    // 스크립트 로드 완료 이벤트 발생
    window.dispatchEvent(new Event('kakao-sdk-loaded'));
  };
  document.head.appendChild(script);
}
