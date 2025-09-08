'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeBouquetState, BouquetState } from '@/utils/url-params-utils';
import ThreeDFlowerViewer from '@/app/3d-flower/ThreeDFlowerViewer/index';
import { use3DFlower } from '@/hooks/use-3d-flower';
import { SaveIcon } from '@/components/shared/3d-flower-icons';

export default function BouquetPage() {
  const searchParams = useSearchParams();
  const [bouquetState, setBouquetState] = useState<BouquetState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { allItems, loading: modelsLoading } = use3DFlower();

  // 다운로드 핸들러
  const handleDownload = () => {
    // 다운로드 함수 호출
    const title = typeof bouquetState?.title === 'string' ? bouquetState.title : '';
    const filename = title ? `To. ${title}` : '3D-Flowerary';
    
    // 약간의 지연 후 다운로드 실행 (Three.js 객체들이 준비될 시간을 줌)
    setTimeout(() => {
      (window as { downloadFlower?: (filename: string) => void }).downloadFlower?.(filename);
    }, 100);
  };

  // URL 파라미터에서 상태 복원
  useEffect(() => {
    try {
      const state = decodeBouquetState(searchParams.toString());
      setBouquetState(state);
      setLoading(false);
    } catch (err) {
      setError('잘못된 링크입니다.');
      setLoading(false);
    }
  }, [searchParams]);

  // 로딩 상태
  if (loading || modelsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">꽃다발을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !bouquetState) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="text-6xl mb-4">💐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">꽃다발을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-4">{error || '잘못된 링크입니다.'}</p>
          <button 
            onClick={() => window.location.href = '/3d-flower'}
            className="px-6 py-2 bg-[#3E7959] text-white rounded-lg hover:bg-[#35684b] transition-colors"
          >
            3D 꽃다발 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#F5F5F5] flex flex-col">
      {/* 헤더 */}
      <header className="w-full bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {bouquetState.title ? `To. ${bouquetState.title}` : '꽃다발 배달왔어요💐'}
          </h1>
          <button 
            onClick={() => window.location.href = '/3d-flower'}
            className="px-4 py-2 bg-[#3E7959] text-white rounded-lg hover:bg-[#35684b] transition-colors text-sm"
          >
            나도 만들어보기
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex">
        {/* 3D 뷰어 */}
        <div className="flex-1 relative">
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: bouquetState.backgroundColor || '#E5E5E5',
            }}
          >
            <ThreeDFlowerViewer
              flowerModels={
                bouquetState.flowerModelId && allItems['꽃']
                  ? [allItems['꽃'].find(item => item.id === bouquetState.flowerModelId)?.filePath].filter(Boolean)
                  : []
              }
              wrapperModel={
                bouquetState.wrapperModelId && allItems['포장지']
                  ? allItems['포장지'].find(item => item.id === bouquetState.wrapperModelId)?.filePath
                  : undefined
              }
              decorationModel={
                bouquetState.decorationModelId && allItems['장식']
                  ? allItems['장식'].find(item => item.id === bouquetState.decorationModelId)?.filePath
                  : undefined
              }
              flowerModelId={bouquetState.flowerModelId}
              decorationModelId={bouquetState.decorationModelId}
              color={bouquetState.backgroundColor || 'bg-[#E5E5E5]'}
              wrapperColor={bouquetState.wrapperColor}
              decorationColor={bouquetState.decorationColor}
              onDownload={handleDownload}
              onCopy={() => {}}
              onRendererReady={() => {}}
              onModelClick={() => {}}
              onResetCamera={() => {}}
            />
          </div>
        </div>

        {/* 편지 패널 - 편지 내용이 있을 때만 표시 */}
        {bouquetState.letterContent && bouquetState.letterContent.trim() && (
          <div className="w-80 bg-white shadow-lg p-6 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">💌</div>
              <h2 className="text-lg font-semibold text-gray-800">편지</h2>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              {bouquetState.hideLetterContent ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">🔒</div>
                  <p className="text-gray-600">편지 내용을 확인하려면<br />링크를 공유한 사람에게 문의하세요</p>
                </div>
              ) : (
                <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4 w-full">
                  <p className="text-gray-800 text-center leading-relaxed">
                    {bouquetState.letterContent}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                💐 3D 꽃다발로 마음을 전해보세요
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
