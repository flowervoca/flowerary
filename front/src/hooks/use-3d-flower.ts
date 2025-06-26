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
import {
  CATEGORY_MAPPING,
  DEFAULT_COLORS,
} from '@/utils/3d-flower-constants';
import {
  formatModelItems,
  createInitialSelections,
} from '@/utils/3d-flower-utils';

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
            key,
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
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, [isMounted]);

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

    // 핸들러
    handleModelSelect,
    handleBackgroundColorChange,
    handleWrapperColorChange,
    handleDecorationColorChange,
  };
};
