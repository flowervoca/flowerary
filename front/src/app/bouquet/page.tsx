'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  decodeBouquetState,
  BouquetState,
} from '@/utils/url-params-utils';
import ThreeDFlowerViewer from '@/app/3d-flower/ThreeDFlowerViewer/index';
import { use3DFlower } from '@/hooks/use-3d-flower';

export default function BouquetPage() {
  const searchParams = useSearchParams();
  const [bouquetState, setBouquetState] =
    useState<BouquetState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { allItems, loading: modelsLoading } =
    use3DFlower();

  // 다운로드 핸들러
  const handleDownload = () => {
    // 다운로드 함수 호출
    const title =
      typeof bouquetState?.title === 'string'
        ? bouquetState.title
        : '';
    const filename = title
      ? `To. ${title}`
      : '3D-Flowerary';

    // 약간의 지연 후 다운로드 실행 (Three.js 객체들이 준비될 시간을 줌)
    setTimeout(() => {
      (
        window as {
          downloadFlower?: (filename: string) => void;
        }
      ).downloadFlower?.(filename);
    }, 100);
  };

  // URL 파라미터에서 상태 복원
  useEffect(() => {
    try {
      const state = decodeBouquetState(
        searchParams.toString(),
      );
      setBouquetState(state);
      setLoading(false);
    } catch {
      setError('잘못된 링크입니다.');
      setLoading(false);
    }
  }, [searchParams]);

  // 로딩 상태
  if (loading || modelsLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-[#F5F5F5]'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-lg text-gray-600'>
            꽃다발을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !bouquetState) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-[#F5F5F5]'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>💐</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            꽃다발을 찾을 수 없습니다
          </h1>
          <p className='text-gray-600 mb-4'>
            {error || '잘못된 링크입니다.'}
          </p>
          <button
            onClick={() =>
              (window.location.href = '/3d-flower')
            }
            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#35684b] transition-colors'
          >
            3D 꽃다발 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-xl h-screen bg-white mx-auto flex flex-col justify-center items-center overflow-hidden p-4'>
      {/* 3D 뷰어 영역 */}
      <div className='w-full aspect-square px-4 py-10 relative rounded-lg bg-[#d4f0e3] flex flex-col justify-start items-center gap-6 overflow-hidden'>
        <div className='w-full h-full absolute left-0 top-0'>
          <ThreeDFlowerViewer
            flowerModels={
              bouquetState.flowerModelId && allItems['꽃']
                ? [
                    allItems['꽃'].find(
                      (item) =>
                        item.id &&
                        bouquetState.flowerModelId &&
                        String(item.id) ===
                          String(
                            bouquetState.flowerModelId,
                          ),
                    )?.filePath || '',
                  ]
                : []
            }
            wrapperModel={
              bouquetState.wrapperModelId &&
              allItems['포장지']
                ? allItems['포장지'].find(
                    (item) =>
                      item.id &&
                      bouquetState.wrapperModelId &&
                      String(item.id) ===
                        String(bouquetState.wrapperModelId),
                  )?.filePath || ''
                : undefined
            }
            decorationModel={
              bouquetState.decorationModelId &&
              allItems['장식']
                ? allItems['장식'].find(
                    (item) =>
                      item.id &&
                      bouquetState.decorationModelId &&
                      String(item.id) ===
                        String(
                          bouquetState.decorationModelId,
                        ),
                  )?.filePath || ''
                : undefined
            }
            flowerModelId={bouquetState.flowerModelId}
            decorationModelId={
              bouquetState.decorationModelId
            }
            color={
              bouquetState.backgroundColor || 'bg-[#d4f0e3]'
            }
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

      {/* 하단 콘텐츠 영역 */}
      <div className='self-stretch p-4 flex flex-col justify-center items-center gap-6'>
        {/* 텍스트 영역 */}
        <div className='self-stretch flex flex-col justify-start items-start gap-2'>
          <div className='self-stretch inline-flex justify-start items-center gap-1'>
            <div className="text-[#37c99b] text-xl font-bold font-['SUIT'] leading-7">
              {bouquetState.title}
            </div>
            <div className="flex-1 text-[#333333] text-xl font-bold font-['SUIT'] leading-7">
              님께 꽃다발이 도착했어요 💐
            </div>
          </div>

          {/* 편지 내용 */}
          {bouquetState.letterContent &&
            !bouquetState.hideLetterContent && (
              <div className="self-stretch text-[#555555] text-base font-normal font-['SUIT'] leading-normal">
                {bouquetState.letterContent}
              </div>
            )}

          {/* 숨겨진 편지 내용 */}
          {bouquetState.letterContent &&
            bouquetState.hideLetterContent && (
              <div className="self-stretch text-[#555555] text-base font-normal font-['SUIT'] leading-normal">
                편지 내용을 확인하려면 링크를 공유한
                사람에게 문의하세요
              </div>
            )}
        </div>

        {/* 버튼 영역 */}
        <div className='self-stretch flex flex-col justify-start items-start gap-2'>
          {/* 나도 만들어 보기 버튼 */}
          <button
            onClick={() =>
              (window.location.href = '/3d-flower')
            }
            className='self-stretch h-12 px-4 py-2 bg-[#37c99b] rounded-lg inline-flex justify-center items-center gap-2'
          >
            <div className="text-neutral-50 text-base font-semibold font-['SUIT'] leading-normal">
              나도 만들어 보기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
