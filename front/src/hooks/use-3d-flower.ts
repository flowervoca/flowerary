/**
 * 3D 꽃 관련 커스텀 훅
 * 모델 데이터 로딩, 선택 상태 관리, 색상 변경 등의 기능을 제공합니다.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  ModelItem,
  DisplayItem,
  SelectedModels,
  AllItems,
} from '@/types/3d-flower';
import { CATEGORY_MAPPING } from '@/utils/3d-flower-constants';
import {
  formatModelItems,
  createInitialSelections,
} from '@/utils/3d-flower-utils';

/**
 * RGB 값을 HEX로 변환하는 함수
 * @param r - 빨강 값 (0-255)
 * @param g - 초록 값 (0-255)
 * @param b - 파랑 값 (0-255)
 * @returns HEX 색상 코드
 */
const rgbToHex = (
  r: number,
  g: number,
  b: number,
): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

/**
 * 꽃 이미지에서 색상들을 추출하는 함수 (Color Thief 사용, HEX 반환)
 * @param imageUrl - 꽃 이미지 URL
 * @returns 추출된 색상 배열 (HEX)
 */
const extractColorsFromFlower = async (
  imageUrl: string,
): Promise<string[]> => {
  if (typeof window === 'undefined') return [];

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        // ColorThief 동적 import (any 타입으로 처리)
        const ColorThief = (
          await import('colorthief' as any)
        ).default;
        const colorThief = new ColorThief();
        // 대표색 6개 추출
        const palette = colorThief.getPalette(img, 6);
        // [ [r,g,b], ... ] → [ '#rrggbb', ... ]
        const colors = palette.map(([r, g, b]: number[]) =>
          rgbToHex(r, g, b),
        );
        resolve(colors);
      } catch {
        resolve([]);
      }
    };
    img.onerror = () => {
      resolve([]);
    };
    img.src = imageUrl;
  });
};

/**
 * 안전한 지연 실행 함수
 * @param fn - 실행할 함수
 * @param delay - 지연 시간 (ms)
 * @returns Promise
 */
const safeDelayedExecution = (
  fn: () => void,
  delay: number = 100,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
};

/**
 * 모든 색상이 비어있는지 확인하는 함수
 * @param selectedColor - 배경 색상
 * @param wrapperColor - 포장지 색상
 * @param decorationColor - 장식 색상
 * @returns 모든 색상이 비어있는지 여부
 */
const areAllColorsEmpty = (
  selectedColor: string,
  wrapperColor: string,
  decorationColor: string,
): boolean => {
  return (
    !selectedColor && !wrapperColor && !decorationColor
  );
};

/**
 * 3D 꽃 관련 커스텀 훅
 * @returns 3D 꽃 관련 상태와 핸들러들
 */
export const use3DFlower = () => {
  // 상태 관리
  const [isMounted, setIsMounted] = useState(false);
  const [allItems, setAllItems] = useState<AllItems>({});
  const [loading, setLoading] = useState(true);
  const [selectedModels, setSelectedModels] =
    useState<SelectedModels>({
      꽃: null,
      포장지: null,
      장식: null,
    });
  const [selectedColor, setSelectedColor] =
    useState<string>('');
  const [wrapperColor, setWrapperColor] =
    useState<string>('');
  const [decorationColor, setDecorationColor] =
    useState<string>('');
  const [extractedColors, setExtractedColors] = useState<
    string[]
  >([]);

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isMounted) return;

    const fetchAllCategories = async () => {
      try {
        setLoading(true);

        const categoryPromises = Object.entries(
          CATEGORY_MAPPING,
        ).map(async ([key, value]) => {
          const { data, error } = await supabase
            .from('models')
            .select('*')
            .eq('category', key);

          if (error) throw error;

          const formattedItems = formatModelItems(
            data as ModelItem[],
          );
          return { category: value, items: formattedItems };
        });

        const results = await Promise.all(categoryPromises);

        const allItemsData = results.reduce(
          (acc, { category, items }) => {
            acc[category] = items;
            return acc;
          },
          {} as AllItems,
        );

        setAllItems(allItemsData);
        setSelectedModels(createInitialSelections(results));
      } catch (error) {
        // Error fetching items
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, [isMounted]);

  // 꽃 모델 변경 시 색상 추출 및 자동 적용
  useEffect(() => {
    if (selectedModels['꽃']?.img) {
      extractColorsFromFlower(selectedModels['꽃'].img)
        .then((colors) => {
          if (colors.length > 0) {
            setExtractedColors(colors);

            // 초기 로드 시에만 자동 적용 (색상이 설정되지 않은 경우)
            // 모든 색상이 비어있는 경우에만 자동 적용
            if (
              areAllColorsEmpty(
                selectedColor,
                wrapperColor,
                decorationColor,
              )
            ) {
              // Promise 기반 안전한 지연 실행
              safeDelayedExecution(() => {
                setSelectedColor(colors[0]); // 첫 번째 색상 → 배경
                setWrapperColor(colors[1]); // 두 번째 색상 → 포장지
                setDecorationColor(colors[2]); // 세 번째 색상 → 장식
              });
            } else {
              // 이미 색상이 설정된 경우 추출된 색상만 업데이트
              setExtractedColors(colors);
            }
          } else {
            // console.warn(
            //   '🎨 추출된 색상이 3개 미만:',
            //   colors.length,
            // );
          }
        })
        .catch((error) => {
          // console.error('🎨 색상 추출 실패:', error);
        });
    } else {
      // console.log('🌸 꽃 모델 이미지가 없음');
    }
  }, [
    selectedModels['꽃']?.img,
    selectedColor,
    wrapperColor,
    decorationColor,
  ]);

  // 모델 선택 핸들러
  const handleModelSelect = useCallback(
    (category: string, item: DisplayItem) => {
      setSelectedModels((prev) => ({
        ...prev,
        [category]: item,
      }));
    },
    [],
  );

  // 색상 변경 핸들러들
  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
    },
    [],
  );

  const handleWrapperColorChange = useCallback(
    (color: string) => {
      setWrapperColor(color);
    },
    [],
  );

  const handleDecorationColorChange = useCallback(
    (color: string) => {
      setDecorationColor(color);
    },
    [],
  );

  return {
    // 상태
    isMounted,
    allItems,
    loading,
    selectedModels,
    selectedColor,
    wrapperColor,
    decorationColor,
    extractedColors,

    // 핸들러
    handleModelSelect,
    handleBackgroundColorChange,
    handleWrapperColorChange,
    handleDecorationColorChange,
  };
};
