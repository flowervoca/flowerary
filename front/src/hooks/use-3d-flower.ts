/**
 * 3D 꽃 관련 커스텀 훅
 * 모델 데이터 로딩, 선택 상태 관리, 색상 변경, 히스토리 관리 등의 기능을 제공합니다.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 히스토리 엔트리 인터페이스
 */
interface HistoryEntry {
  selectedModels: SelectedModels;
  selectedColor: string;
  wrapperColor: string;
  decorationColor: string;
}

/**
 * 히스토리 상태 인터페이스
 */
interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
}

// ============================================================================
// 유틸리티 함수들
// ============================================================================

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

// ============================================================================
// 초기 상태 상수
// ============================================================================

const INITIAL_SELECTED_MODELS: SelectedModels = {
  꽃: null,
  포장지: null,
  장식: null,
};

const INITIAL_HISTORY_ENTRY: HistoryEntry = {
  selectedModels: INITIAL_SELECTED_MODELS,
  selectedColor: '',
  wrapperColor: '',
  decorationColor: '',
};

// ============================================================================
// 메인 훅
// ============================================================================

/**
 * 3D 꽃 관련 커스텀 훅
 * @returns 3D 꽃 관련 상태와 핸들러들
 */
export const use3DFlower = () => {
  // ============================================================================
  // 기본 상태
  // ============================================================================

  const [isMounted, setIsMounted] = useState(false);
  const [allItems, setAllItems] = useState<AllItems>({});
  const [loading, setLoading] = useState(true);
  const [selectedModels, setSelectedModels] =
    useState<SelectedModels>(INITIAL_SELECTED_MODELS);
  const [selectedColor, setSelectedColor] =
    useState<string>('');
  const [wrapperColor, setWrapperColor] =
    useState<string>('');
  const [decorationColor, setDecorationColor] =
    useState<string>('');
  const [extractedColors, setExtractedColors] = useState<
    string[]
  >([]);

  // ============================================================================
  // 히스토리 상태
  // ============================================================================

  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: INITIAL_HISTORY_ENTRY,
    future: [],
  });

  // 초기 상태 설정 여부
  const [initialStateSet, setInitialStateSet] =
    useState(false);
  const [initialColorsApplied, setInitialColorsApplied] =
    useState(false);

  // ============================================================================
  // 마운트 확인
  // ============================================================================

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ============================================================================
  // 초기 데이터 로드
  // ============================================================================

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
        const initialSelections =
          createInitialSelections(results);
        setSelectedModels(initialSelections);

        // 초기 히스토리 설정 (색상은 나중에 자동 적용된 후에 설정됨)
        if (!initialStateSet) {
          const initialHistoryEntry: HistoryEntry = {
            selectedModels: initialSelections,
            selectedColor: '',
            wrapperColor: '',
            decorationColor: '',
          };
          setHistory({
            past: [],
            present: initialHistoryEntry,
            future: [],
          });
          setInitialStateSet(true);
        }
      } catch (error) {
        // Error fetching items
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, [isMounted, initialStateSet]);

  // ============================================================================
  // 색상 추출 및 자동 적용
  // ============================================================================

  useEffect(() => {
    if (selectedModels['꽃']?.img) {
      extractColorsFromFlower(selectedModels['꽃'].img)
        .then((colors) => {
          if (colors.length > 0) {
            setExtractedColors(colors);

            // 초기 로드 시에만 자동 적용 (색상이 설정되지 않은 경우)
            // 모든 색상이 비어있는 경우에만 자동 적용
            if (
              !initialColorsApplied &&
              areAllColorsEmpty(
                selectedColor,
                wrapperColor,
                decorationColor,
              )
            ) {
              // Promise 기반 안전한 지연 실행
              safeDelayedExecution(() => {
                const newColors = {
                  selectedColor: colors[0], // 첫 번째 색상 → 배경
                  wrapperColor: colors[1], // 두 번째 색상 → 포장지
                  decorationColor: colors[2], // 세 번째 색상 → 장식
                };

                // 로컬 상태 업데이트
                setSelectedColor(newColors.selectedColor);
                setWrapperColor(newColors.wrapperColor);
                setDecorationColor(
                  newColors.decorationColor,
                );

                // 히스토리의 현재 상태를 업데이트 (새로운 히스토리 엔트리는 생성하지 않음)
                setHistory((prevHistory) => ({
                  ...prevHistory,
                  present: {
                    ...prevHistory.present,
                    ...newColors,
                  },
                }));

                // 초기 색상 적용 완료 표시
                setInitialColorsApplied(true);
              });
            }
          }
        })
        .catch((error) => {
          // console.error('🎨 색상 추출 실패:', error);
        });
    }
  }, [
    selectedModels['꽃']?.img,
    selectedColor,
    wrapperColor,
    decorationColor,
    selectedModels,
    initialColorsApplied,
  ]);

  // ============================================================================
  // 히스토리 관리 함수들
  // ============================================================================

  /**
   * 히스토리에 상태 저장
   */
  const saveToHistory = useCallback(
    (newState: HistoryEntry) => {
      setHistory((prevHistory) => ({
        past: [...prevHistory.past, prevHistory.present],
        present: newState,
        future: [],
      }));
    },
    [],
  );

  /**
   * Undo 함수
   */
  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.past.length === 0) return prevHistory;

      const previous =
        prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [
          prevHistory.present,
          ...prevHistory.future,
        ],
      };
    });
  }, []);

  /**
   * Redo 함수
   */
  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.future.length === 0)
        return prevHistory;

      const next = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);

      return {
        past: [...prevHistory.past, prevHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // ============================================================================
  // 히스토리 상태 변경 감지 및 적용
  // ============================================================================

  useEffect(() => {
    if (!initialStateSet) return;

    const currentState = history.present;

    // 상태가 실제로 변경되었는지 확인 (더 효율적인 비교)
    const hasModelChanged =
      currentState.selectedModels['꽃']?.id !==
        selectedModels['꽃']?.id ||
      currentState.selectedModels['포장지']?.id !==
        selectedModels['포장지']?.id ||
      currentState.selectedModels['장식']?.id !==
        selectedModels['장식']?.id;

    const hasColorChanged =
      currentState.selectedColor !== selectedColor ||
      currentState.wrapperColor !== wrapperColor ||
      currentState.decorationColor !== decorationColor;

    // undo/redo 시에만 상태 복원 (일반 변경 시에는 이미 로컬 상태가 업데이트됨)
    if (
      (hasModelChanged || hasColorChanged) &&
      (history.past.length > 0 || history.future.length > 0)
    ) {
      setSelectedModels(currentState.selectedModels);
      setSelectedColor(currentState.selectedColor);
      setWrapperColor(currentState.wrapperColor);
      setDecorationColor(currentState.decorationColor);
    }
  }, [
    history.present,
    initialStateSet,
    selectedModels,
    selectedColor,
    wrapperColor,
    decorationColor,
    history.past.length,
    history.future.length,
  ]);

  // ============================================================================
  // 이벤트 핸들러들
  // ============================================================================

  /**
   * 모델 선택 핸들러
   */
  const handleModelSelect = useCallback(
    (category: string, item: DisplayItem) => {
      const newSelectedModels = {
        ...selectedModels,
        [category]: item,
      };

      // 로컬 상태와 히스토리 동시 업데이트
      setSelectedModels(newSelectedModels);
      saveToHistory({
        selectedModels: newSelectedModels,
        selectedColor,
        wrapperColor,
        decorationColor,
      });
    },
    [
      selectedModels,
      selectedColor,
      wrapperColor,
      decorationColor,
      saveToHistory,
    ],
  );

  /**
   * 배경 색상 변경 핸들러
   */
  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      // 로컬 상태와 히스토리 동시 업데이트
      setSelectedColor(color);
      saveToHistory({
        selectedModels,
        selectedColor: color,
        wrapperColor,
        decorationColor,
      });
    },
    [
      selectedModels,
      wrapperColor,
      decorationColor,
      saveToHistory,
    ],
  );

  /**
   * 포장지 색상 변경 핸들러
   */
  const handleWrapperColorChange = useCallback(
    (color: string) => {
      // 로컬 상태와 히스토리 동시 업데이트
      setWrapperColor(color);
      saveToHistory({
        selectedModels,
        selectedColor,
        wrapperColor: color,
        decorationColor,
      });
    },
    [
      selectedModels,
      selectedColor,
      decorationColor,
      saveToHistory,
    ],
  );

  /**
   * 장식 색상 변경 핸들러
   */
  const handleDecorationColorChange = useCallback(
    (color: string) => {
      // 로컬 상태와 히스토리 동시 업데이트
      setDecorationColor(color);
      saveToHistory({
        selectedModels,
        selectedColor,
        wrapperColor,
        decorationColor: color,
      });
    },
    [
      selectedModels,
      selectedColor,
      wrapperColor,
      saveToHistory,
    ],
  );

  // ============================================================================
  // 위치 정보 조회 함수들
  // ============================================================================

  /**
   * 꽃 위치 정보 조회
   */
  const fetchFlowerPositions = useCallback(async (flowerModelId: string) => {
    const { data: allData, error: allError } = await supabase
      .from('flower_positions')
      .select('*');
    
    const { data, error } = await supabase
      .from('flower_positions')
      .select('*')
      .eq('flower_model_id', flowerModelId)
      .order('position_order');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }, []);

  /**
   * 고정 포장지 정보 조회
   */
  const fetchFixedWrapper = useCallback(async () => {
    const { data, error } = await supabase
      .from('wrapper_positions')
      .select('*')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  }, []);

  /**
   * 장식 위치 정보 조회
   */
  const fetchDecorationPositions = useCallback(async (decorationModelId: string) => {
    const { data, error } = await supabase
      .from('decoration_positions')
      .select('*')
      .eq('decoration_model_id', decorationModelId)
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  }, []);

  // ============================================================================
  // 반환값
  // ============================================================================

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

    // 히스토리 상태
    history,

    // 핸들러
    handleModelSelect,
    handleBackgroundColorChange,
    handleWrapperColorChange,
    handleDecorationColorChange,

    // 히스토리 핸들러
    undo,
    redo,

    // 위치 정보 조회 함수들
    fetchFlowerPositions,
    fetchFixedWrapper,
    fetchDecorationPositions,
  };
};
