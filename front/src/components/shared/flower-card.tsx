'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IFlowerCardProps } from '@/types';

/**
 * 꽃 정보를 표시하는 카드 컴포넌트
 * 모드에 따라 배경색이 다르게 표시됨
 * - white: 흰색 배경 (기본값)
 * - color: 이미지에서 추출한 주요 색상을 배경으로 사용
 *
 * 참고: 실제 프로덕션에서는 color-thief 라이브러리 사용 권장
 * ```
 * npm install colorthief 또는 pnpm add colorthief
 * ```
 *
 * 라이브러리 사용 시 코드:
 * ```
 * import ColorThief from 'colorthief';
 *
 * const colorThief = new ColorThief();
 * const img = document.createElement('img');
 * img.crossOrigin = 'Anonymous';
 * img.onload = () => {
 *   const dominantColor = colorThief.getColor(img);
 *   const [r, g, b] = dominantColor;
 *   setDominantColor(`rgb(${r}, ${g}, ${b})`);
 * };
 * ```
 */
export function FlowerCard({
  flower,
  mode = 'white',
  className = '',
}: IFlowerCardProps) {
  const [dominantColor, setDominantColor] =
    useState<string>('#a9b438');
  const [hasError, setHasError] = useState(false);
  const [isColorDark, setIsColorDark] = useState(false);

  useEffect(() => {
    // 서버 사이드에서 실행되지 않도록 체크
    if (typeof window === 'undefined') return;

    // color 모드일 때만 이미지 색상 추출 수행
    if (mode === 'color' && flower.f_img) {
      extractDominantColor(flower.f_img);
    }
  }, [flower.f_img, mode]);

  // 이미지에서 주요 색상 추출하는 함수
  const extractDominantColor = async (imageUrl: string) => {
    if (typeof window === 'undefined') return;

    try {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.warn(
              'Canvas 2D 컨텍스트를 가져올 수 없습니다.',
            );
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const data = imageData.data;

          let r = 0,
            g = 0,
            b = 0;
          const pixelCount = data.length / 4;

          // 간단한 평균값 추출 방식
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          // 색상의 밝기 계산 (간단한 방법으로)
          // 밝기 = 0.299*R + 0.587*G + 0.114*B
          const brightness =
            (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsColorDark(brightness < 0.5);

          // 추출된 색상 설정
          setDominantColor(`rgb(${r}, ${g}, ${b})`);
        } catch (error) {
          console.error(
            '이미지 데이터 처리 중 오류 발생:',
            error,
          );
          setDominantColor('#a9b438'); // 기본 녹색 계열 색상
          setIsColorDark(false);
          setHasError(true);
        }
      };

      img.onerror = () => {
        console.error('이미지 로드 실패:', imageUrl);
        setDominantColor('#a9b438'); // 기본 녹색 계열 색상
        setIsColorDark(false);
        setHasError(true);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('색상 추출 중 오류 발생:', error);
      setDominantColor('#a9b438'); // 기본 녹색 계열 색상
      setIsColorDark(false);
      setHasError(true);
    }
  };

  // 배경색 계산
  const backgroundColor =
    mode === 'color'
      ? hasError
        ? '#a9b438'
        : dominantColor
      : undefined;

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition duration-300 ease-in-out pb-4',
        mode === 'color'
          ? 'hover:brightness-95'
          : 'bg-white hover:bg-gray-50',
        className,
      )}
      style={{ backgroundColor }}
    >
      <div className='relative h-48 w-full mb-8'>
        <Image
          src={
            flower.f_img || '/images/placeholder-flower.jpg'
          }
          alt={flower.f_low_nm || '꽃 이미지'}
          className='object-cover w-full'
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
      <div className='p-4 space-y-4'>
        <h3
          className={cn(
            'text-sm font-bold mb-1',
            mode === 'color'
              ? isColorDark
                ? 'text-gray-200'
                : 'text-gray-700'
              : 'text-gray-500',
          )}
        >
          {flower.f_low_lang || '분류 정보 없음'}
        </h3>
        <h2
          className={cn(
            'text-xl font-bold mb-2',
            mode === 'color'
              ? isColorDark
                ? 'text-white'
                : 'text-gray-900'
              : 'text-gray-900',
          )}
        >
          {flower.f_low_nm || '이름 정보 없음'}
        </h2>
        <p
          className={cn(
            'line-clamp-2 text-sm',
            mode === 'color'
              ? isColorDark
                ? 'text-gray-200'
                : 'text-gray-700'
              : 'text-gray-600',
          )}
        >
          {flower.f_content || '설명 정보 없음'}
        </p>
      </div>
    </div>
  );
}
