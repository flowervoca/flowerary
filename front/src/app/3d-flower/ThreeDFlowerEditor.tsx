'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import Image from 'next/image';
import { WebGLRenderer, Scene, Camera } from 'three';
import ThreeDFlowerViewer from './ThreeDFlowerViewer/index';
import { use3DFlower } from '@/hooks/use-3d-flower';
import {
  COLORS,
  MATERIAL_COLORS,
  CATEGORY_MAPPING,
  SHARE_IMAGE_CONFIG,
  COLOR_MAP,
} from '@/utils/3d-flower-constants';
import {
  RainbowIcon,
  UndoIcon,
  RedoIcon,
  ResetIcon,
  SaveIcon,
  ShareIcon,
} from '@/components/shared/3d-flower-icons';
import {
  initKakao,
  shareToKakao,
} from './utils/shareUtils';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import ColorThief from 'colorthief';

/**
 * 색상 값을 안전하게 변환하는 유틸리티 함수
 * @param color - 변환할 색상 값
 * @returns HEX 색상 코드
 */
const getSafeColor = (color: string): string => {
  if (color.startsWith('#')) {
    return color;
  }

  // COLOR_MAP에서 색상 찾기 (타입 안전성 보장)
  const mappedColor =
    COLOR_MAP[color as keyof typeof COLOR_MAP];
  return mappedColor || '#FFB6C1';
};

/**
 * RGB 값을 HEX로 변환하는 함수
 * @param r - 빨강 값 (0-255)
 * @param g - 초록 값 (0-255)
 * @param b - 파랑 값 (0-255)
 * @returns HEX 색상 코드
 */
const rgbToHex = (r: number, g: number, b: number): string => {
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
const extractColorsFromFlower = async (imageUrl: string): Promise<string[]> => {
  if (typeof window === 'undefined') return [];

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        const colorThief = new ColorThief();
        // 대표색 6개 추출
        const palette = colorThief.getPalette(img, 6);
        // [ [r,g,b], ... ] → [ '#rrggbb', ... ]
        const colors = palette.map(([r, g, b]: number[]) => rgbToHex(r, g, b));
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

export default function ThreeDFlowerEditor() {
  // 커스텀 훅 사용
  const {
    isMounted,
    allItems,
    loading,
    selectedModels,
    selectedColor,
    wrapperColor,
    decorationColor,
    handleModelSelect,
    handleBackgroundColorChange,
    handleWrapperColorChange,
    handleDecorationColorChange,
  } = use3DFlower();

  // 로컬 상태
  const [colorOpen, setColorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tab, setTab] =
    useState<keyof typeof CATEGORY_MAPPING>('FL');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorMode, setColorMode] = useState<
    'background' | 'wrapper' | 'decoration'
  >('background');

  // Three.js 객체 상태
  const [threeJSObjects, setThreeJSObjects] = useState<{
    renderer: WebGLRenderer | null;
    scene: Scene | null;
    camera: Camera | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
  });

  // 메모이제이션된 값들
  const currentTabItems = useMemo(
    () => allItems[CATEGORY_MAPPING[tab]] || [],
    [allItems, tab],
  );

  const filteredItems = useMemo(
    () =>
      currentTabItems.filter((item) =>
        item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [currentTabItems, searchQuery],
  );

  const hasSelectedModels = useMemo(
    () =>
      Object.values(selectedModels).every(
        (model) => !model,
      ),
    [selectedModels],
  );

  // 현재 색상 모드에 따른 색상 값
  const currentColor = useMemo(() => {
    switch (colorMode) {
      case 'background':
        return selectedColor;
      case 'wrapper':
        return wrapperColor;
      case 'decoration':
        return decorationColor;
      default:
        return selectedColor;
    }
  }, [
    colorMode,
    selectedColor,
    wrapperColor,
    decorationColor,
  ]);

  // 배경색 계산 (타입 안전성 보장)
  const backgroundColor = useMemo(() => {
    if (!selectedColor) return '#E5E5E5';
    return getSafeColor(selectedColor);
  }, [selectedColor]);

  // 동적 색상 팔레트 생성
  const [extractedColors, setExtractedColors] = useState<string[]>([]);

  // 꽃 모델 변경 시 색상 추출
  useEffect(() => {
    if (selectedModels['꽃']?.img) {
      extractColorsFromFlower(selectedModels['꽃'].img).then(colors => {
        setExtractedColors(colors);
      });
    }
  }, [selectedModels['꽃']?.img]);

  // 1. 팔레트에서 활성화(선택) 색상
  const paletteActiveColor = useMemo(() => {
    switch (colorMode) {
      case 'background':
        return selectedColor;
      case 'wrapper':
        return wrapperColor;
      case 'decoration':
        return decorationColor;
      default:
        return '';
    }
  }, [colorMode, selectedColor, wrapperColor, decorationColor]);

  // 2. 동적 색상 팔레트 (활성화 색상 한 번만, 중복 없이)
  const dynamicColorPalette = useMemo(() => {
    const activeColor = paletteActiveColor;
    const filteredExtracted = extractedColors.filter(c => c !== activeColor);
    return [activeColor, ...filteredExtracted].filter(Boolean);
  }, [paletteActiveColor, extractedColors]);

  // 색상 변경 핸들러
  const handleColorChange = useCallback(
    (color: string) => {
      switch (colorMode) {
        case 'background':
          handleBackgroundColorChange(color);
          break;
        case 'wrapper':
          handleWrapperColorChange(color);
          break;
        case 'decoration':
          handleDecorationColorChange(color);
          break;
      }
      setColorOpen(false);
    },
    [
      colorMode,
      handleBackgroundColorChange,
      handleWrapperColorChange,
      handleDecorationColorChange,
      currentColor,
    ],
  );

  // 토스트 메시지 표시 함수
  const showToastMessage = useCallback(
    (message: string) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    [],
  );

  // 다운로드 핸들러
  const handleDownload = useCallback(
    (filename: string) => {
      showToastMessage(`${filename}이(가) 저장되었습니다!`);
    },
    [showToastMessage],
  );

  // 다운로드 시작 핸들러
  const handleDownloadStart = useCallback(() => {
    setColorOpen(false);

    // 약간의 지연 후 다운로드 실행
    setTimeout(() => {
      (window as any).downloadFlower?.(
        title || '3D-Flowerary',
      );
    }, 100);
  }, [title]);

  // 클립보드 복사 핸들러
  const handleCopy = useCallback(
    (success: boolean) => {
      if (success) {
        showToastMessage('클립보드에 복사되었습니다!');
      } else {
        showToastMessage('클립보드 복사에 실패했습니다.');
      }
    },
    [showToastMessage],
  );

  // 카카오톡 공유 핸들러
  const handleShare = useCallback(async () => {
    if (!selectedModels[CATEGORY_MAPPING[tab]]) {
      showToastMessage(
        '공유할 꽃다발을 먼저 선택해주세요.',
      );
      return;
    }

    if (
      !threeJSObjects.renderer ||
      !threeJSObjects.scene ||
      !threeJSObjects.camera
    ) {
      showToastMessage('이미지를 생성할 수 없습니다.');
      return;
    }

    const success = await shareToKakao(
      title || '나만의 3D 꽃다발💐',
      SHARE_IMAGE_CONFIG.hashtags,
      SHARE_IMAGE_CONFIG.defaultImageUrl,
    );

    if (!success) {
      showToastMessage('카카오톡 공유에 실패했습니다.');
    }
  }, [
    selectedModels,
    tab,
    threeJSObjects,
    title,
    showToastMessage,
  ]);

  // 카카오 SDK 초기화
  useEffect(() => {
    if (!isMounted) return;

    const initializeKakao = async () => {
      await new Promise<void>((resolve) => {
        if (window.Kakao) {
          resolve();
        } else {
          window.addEventListener(
            'kakao-sdk-loaded',
            () => resolve(),
            { once: true },
          );
        }
      });

      const success = await initKakao();
      if (!success) {
        // 카카오 SDK 초기화 실패 처리
      }
    };
    initializeKakao();
  }, [isMounted]);

  // 이벤트 핸들러들
  const handleItemClick = useCallback(
    (item: any) => {
      // 모델 선택 시 색상 모드 변경 (꽃 제외)
      switch (CATEGORY_MAPPING[tab]) {
        case '포장지':
          setColorMode('wrapper');
          break;
        case '장식':
          setColorMode('decoration');
          break;
        case '꽃':
          break;
        default:
          setColorMode('background');
      }

      // 중복 선택이 아닌 경우에만 모델 선택
      if (
        selectedModels[CATEGORY_MAPPING[tab]]?.id !==
        item.id
      ) {
        handleModelSelect(CATEGORY_MAPPING[tab], item);
      }
    },
    [tab, handleModelSelect, selectedModels, colorMode],
  );

  const handleTabChange = useCallback(
    (newTab: keyof typeof CATEGORY_MAPPING) => {
      setTab(newTab);
    },
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  const handleRendererReady = useCallback(
    (
      renderer: WebGLRenderer,
      scene: Scene,
      camera: Camera,
    ) => {
      setThreeJSObjects({ renderer, scene, camera });
    },
    [],
  );

  // 3D 모델 클릭 핸들러
  const handleModelClick = useCallback(
    (
      modelType:
        | 'flower'
        | 'wrapper'
        | 'decoration'
        | 'background',
    ) => {
      switch (modelType) {
        case 'flower':
          break;
        case 'wrapper':
          setColorMode('wrapper');
          break;
        case 'decoration':
          setColorMode('decoration');
          break;
        case 'background':
          setColorMode('background');
          break;
      }
    },
    [],
  );

  // 마운트되지 않은 경우 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    <div className='w-full h-[calc(100vh-120px)] flex items-center justify-center bg-[#F5F5F5] py-8'>
      <div className='w-[95vw] max-w-[1400px] h-full flex gap-6'>
        {/* Sidebar */}
        <aside className='w-[260px] h-full bg-white rounded-2xl shadow flex flex-col p-4'>
          {/* 제목 입력 */}
          <input
            className='mb-4 text-lg font-bold border-b outline-none px-2 py-1'
            value={title}
            onChange={handleTitleChange}
            placeholder='이름을 지어주세요'
          />

          {/* 탭 네비게이션 */}
          <div className='flex gap-2 mb-1'>
            <div className='flex rounded-full p-1 bg-[#D8E4DE] gap-0 w-full h-9 relative'>
              {/* 슬라이딩 배경 */}
              <div
                className={`absolute h-7 rounded-full bg-white transition-all duration-300 ease-in-out ${
                  tab === 'FL'
                    ? 'left-1 w-[calc(33.333%-0.5rem)]'
                    : tab === 'WR'
                      ? 'left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.5rem)]'
                      : 'left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.5rem)]'
                }`}
              />
              {Object.entries(CATEGORY_MAPPING).map(
                ([key, value]) => (
                  <button
                    key={key}
                    className={`rounded-full px-2 text-sm font-semibold shadow-none border-none transition-all flex-1 relative z-10
                    ${tab === key ? 'text-primary' : 'text-[#6F8278]'}`}
                    onClick={() =>
                      handleTabChange(
                        key as keyof typeof CATEGORY_MAPPING,
                      )
                    }
                  >
                    {value}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* 검색 바 */}
          <div className='mb-2 flex items-center gap-2'>
            <div className='flex items-center w-full border border-primary rounded-full px-4 py-2 bg-background'>
              <input
                className='w-full border-none focus:ring-0 focus:outline-none bg-transparent flex-1 text-base text-foreground placeholder:text-left'
                placeholder='검색'
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <MagnifyingGlassIcon className='w-5 h-5 text-primary cursor-pointer' />
            </div>
          </div>

          {/* 아이템 리스트 */}
          <div className='flex-1 overflow-y-auto grid grid-cols-2 gap-2 auto-rows-min'>
            {loading ? (
              <div className='col-span-2 text-center py-4'>
                로딩 중...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className='col-span-2 text-center py-4'>
                데이터가 없습니다.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-center justify-around bg-gray-50 rounded-lg p-2 border cursor-pointer transition-all
                    ${selectedModels[CATEGORY_MAPPING[tab]]?.id === item.id ? 'border-lime-500 bg-lime-50' : 'border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className='relative w-20 h-20 flex items-center justify-center'>
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={80}
                      height={80}
                      className='rounded object-cover'
                    />
                  </div>
                  <span className='text-sm font-semibold text-gray-700 text-center'>
                    {item.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Canvas */}
        <section className='flex-1 h-full bg-white rounded-2xl shadow relative'>
          {/* 3D 미리보기 영역 - 전체 영역을 차지 */}
          <div
            className='w-full h-full relative'
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            <ThreeDFlowerViewer
              flowerModels={
                selectedModels['꽃']
                  ? [selectedModels['꽃']!.filePath]
                  : []
              }
              wrapperModel={
                selectedModels['포장지']?.filePath
              }
              decorationModel={
                selectedModels['장식']?.filePath
              }
              onDownload={handleDownload}
              onCopy={handleCopy}
              color={selectedColor || 'bg-[#E5E5E5]'}
              wrapperColor={wrapperColor}
              decorationColor={decorationColor}
              onRendererReady={handleRendererReady}
              onModelClick={handleModelClick}
            />
            {hasSelectedModels && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-gray-400 text-center'>
                  <p>왼쪽에서 모델을 선택해주세요</p>
                </div>
              </div>
            )}
          </div>

          {/* 색상 선택 패널 - 왼쪽 상단으로 이동 */}
          <div className='absolute left-4 top-4 flex flex-col items-center z-50 gap-4'>
            {/* 통합 색상 선택 */}
            <div className='relative'>
              <button
                onClick={() => {
                  setColorOpen((v) => !v);
                }}
                className='w-8 h-8 rounded-full border-2 border-white cursor-pointer shadow-lg hover:scale-110 transition-transform flex items-center justify-center'
                style={{
                  backgroundColor:
                    paletteActiveColor &&
                    paletteActiveColor !== 'bg-[#E5E5E5]' &&
                    paletteActiveColor !== '#E5E5E5'
                      ? getSafeColor(paletteActiveColor)
                      : 'transparent',
                }}
                title={
                  colorMode === 'background'
                    ? '배경 색상'
                    : colorMode === 'wrapper'
                      ? '포장지 색상'
                      : '장식 색상'
                }
              >
                {(!paletteActiveColor ||
                  paletteActiveColor === 'bg-[#E5E5E5]' ||
                  paletteActiveColor === '#E5E5E5') && (
                  <RainbowIcon className='w-4 h-4' />
                )}
              </button>
              {colorOpen && (
                <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 flex flex-col gap-2'>
                  {dynamicColorPalette.length > 0 ? (
                    dynamicColorPalette.map((c, i) => (
                      <button
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${
                          paletteActiveColor && paletteActiveColor === c
                            ? 'border-black'
                            : 'border-white'
                        } cursor-pointer hover:scale-110 transition-transform`}
                        style={{ backgroundColor: c }}
                        onClick={() => handleColorChange(c)}
                      />
                    ))
                  ) : (
                    MATERIAL_COLORS.map((c, i) => (
                      <button
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${
                          paletteActiveColor && paletteActiveColor === c
                            ? 'border-black'
                            : 'border-white'
                        } cursor-pointer hover:scale-110 transition-transform`}
                        style={{ backgroundColor: c }}
                        onClick={() => handleColorChange(c)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 하단 액션 버튼들 - 세로 정렬 */}
          <div className='absolute bottom-4 right-4 flex flex-col gap-4'>
            <button
              className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'
              onClick={handleShare}
            >
              <ShareIcon />
            </button>
            <button
              className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'
              onClick={handleDownloadStart}
            >
              <SaveIcon />
            </button>
            <button className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'>
              <ResetIcon />
            </button>
          </div>

          {/* Undo/Redo 버튼 */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
            <button className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'>
              <UndoIcon />
            </button>
            <button className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'>
              <RedoIcon />
            </button>
          </div>
        </section>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50'>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
