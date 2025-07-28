'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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

// ============================================================================
// 유틸리티 함수들
// ============================================================================

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

// ============================================================================
// 초기 상태 상수
// ============================================================================

const INITIAL_CUSTOM_COLORS = {
  background: '#FFB6C1',
  wrapper: '#FFB6C1',
  decoration: '#FFB6C1',
};

const INITIAL_CUSTOM_COLOR_USED = {
  background: false,
  wrapper: false,
  decoration: false,
};

const INITIAL_THREE_JS_OBJECTS: {
  renderer: WebGLRenderer | null;
  scene: Scene | null;
  camera: Camera | null;
} = {
  renderer: null,
  scene: null,
  camera: null,
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ThreeDFlowerEditor() {
  // ============================================================================
  // 커스텀 훅 사용
  // ============================================================================

  const {
    isMounted,
    allItems,
    loading,
    selectedModels,
    selectedColor,
    wrapperColor,
    decorationColor,
    extractedColors,
    history,
    handleModelSelect,
    handleBackgroundColorChange,
    handleWrapperColorChange,
    handleDecorationColorChange,
    undo,
    redo,
  } = use3DFlower();

  // ============================================================================
  // 로컬 상태
  // ============================================================================

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
  const [resetCameraFunction, setResetCameraFunction] =
    useState<(() => void) | null>(null);

  // 커스텀 색상 상태 (각 모드별로 독립적으로 관리)
  const [customColors, setCustomColors] = useState(
    INITIAL_CUSTOM_COLORS,
  );

  // 커스텀 색상 사용 여부 추적
  const [customColorUsed, setCustomColorUsed] = useState(
    INITIAL_CUSTOM_COLOR_USED,
  );

  // 숨겨진 input color ref
  const hiddenColorInputRef =
    useRef<HTMLInputElement>(null);

  // Three.js 객체 상태
  const [threeJSObjects, setThreeJSObjects] = useState(
    INITIAL_THREE_JS_OBJECTS,
  );

  // ============================================================================
  // 메모이제이션된 값들
  // ============================================================================

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
      Object.values(selectedModels).some(
        (model) => model !== null,
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
  }, [
    colorMode,
    selectedColor,
    wrapperColor,
    decorationColor,
  ]);

  // 2. 동적 색상 팔레트 (활성화 색상 한 번만, 중복 없이)
  const dynamicColorPalette = useMemo(() => {
    // 추출된 색상이 있으면 그대로 사용, 없으면 기본 색상 사용
    const baseColors =
      extractedColors.length > 0
        ? extractedColors
        : MATERIAL_COLORS;

    // 무지개 아이콘을 위한 특별한 값 추가
    return [...baseColors, 'CUSTOM_COLOR'];
  }, [extractedColors]);

  // ============================================================================
  // 이벤트 핸들러들
  // ============================================================================

  /**
   * 색상 변경 핸들러
   */
  const handleColorChange = useCallback(
    (color: string) => {
      // 커스텀 색상 선택인 경우
      if (color === 'CUSTOM_COLOR') {
        setColorOpen(false); // 색상 팔레트 닫기
        return;
      }

      // 일반 색상 선택인 경우
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
    ],
  );

  /**
   * 커스텀 색상 선택 핸들러
   */
  const handleCustomColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;

      // 커스텀 색상 상태 업데이트
      setCustomColors((prev) => ({
        ...prev,
        [colorMode]: newColor,
      }));

      // 커스텀 색상 사용 여부 업데이트
      setCustomColorUsed((prev) => ({
        ...prev,
        [colorMode]: true,
      }));

      // 실제 색상 적용 (히스토리 저장은 각 핸들러에서 처리됨)
      switch (colorMode) {
        case 'background':
          handleBackgroundColorChange(newColor);
          break;
        case 'wrapper':
          handleWrapperColorChange(newColor);
          break;
        case 'decoration':
          handleDecorationColorChange(newColor);
          break;
      }
    },
    [
      colorMode,
      handleBackgroundColorChange,
      handleWrapperColorChange,
      handleDecorationColorChange,
    ],
  );

  /**
   * 커스텀 색상 버튼 클릭 핸들러 (이미 선택된 커스텀 색상이 있는 경우)
   */
  const handleCustomColorClick = useCallback(() => {
    const currentCustomColor = customColors[colorMode];
    const isCustomColorUsed = customColorUsed[colorMode];

    // 현재 적용된 색상이 있으면 그것을 기본값으로 설정
    if (
      !isCustomColorUsed &&
      currentColor &&
      currentColor !== 'bg-[#E5E5E5]' &&
      currentColor !== '#E5E5E5'
    ) {
      setCustomColors((prev) => ({
        ...prev,
        [colorMode]: getSafeColor(currentColor),
      }));
    }

    // 숨겨진 input color 트리거
    if (hiddenColorInputRef.current) {
      hiddenColorInputRef.current.click();
    }
  }, [
    colorMode,
    customColors,
    customColorUsed,
    currentColor,
  ]);

  /**
   * 토스트 메시지 표시 함수
   */
  const showToastMessage = useCallback(
    (message: string) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    [],
  );

  /**
   * 다운로드 핸들러
   */
  const handleDownload = useCallback(
    (filename: string) => {
      showToastMessage(`${filename}이(가) 저장되었습니다!`);
    },
    [showToastMessage],
  );

  /**
   * 다운로드 시작 핸들러
   */
  const handleDownloadStart = useCallback(() => {
    setColorOpen(false);

    // 약간의 지연 후 다운로드 실행
    setTimeout(() => {
      (window as any).downloadFlower?.(
        title || '3D-Flowerary',
      );
    }, 100);
  }, [title]);

  /**
   * 클립보드 복사 핸들러
   */
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

  /**
   * 카카오톡 공유 핸들러
   */
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

  /**
   * 아이템 클릭 핸들러
   */
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

      // 색상 관련 UI 닫기
      setColorOpen(false);
    },
    [tab, handleModelSelect, selectedModels, colorMode],
  );

  /**
   * 탭 변경 핸들러
   */
  const handleTabChange = useCallback(
    (newTab: keyof typeof CATEGORY_MAPPING) => {
      setTab(newTab);
    },
    [],
  );

  /**
   * 검색 변경 핸들러
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  /**
   * 제목 변경 핸들러
   */
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  /**
   * 렌더러 준비 핸들러
   */
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

  /**
   * 카메라 리셋 핸들러
   */
  const handleCameraReset = useCallback(
    (resetFunction: () => void) => {
      setResetCameraFunction(() => resetFunction);
    },
    [],
  );

  /**
   * 초기화 버튼 클릭 핸들러
   */
  const handleResetClick = useCallback(() => {
    if (resetCameraFunction) {
      resetCameraFunction();
    }
  }, [resetCameraFunction]);

  /**
   * 3D 모델 클릭 핸들러
   */
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

  // ============================================================================
  // 사이드 이펙트
  // ============================================================================

  /**
   * 카카오 SDK 초기화
   */
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

  /**
   * 키보드 단축키 처리
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z (또는 Cmd+Z) - Undo
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === 'z' &&
        !e.shiftKey
      ) {
        e.preventDefault();
        if (history.past.length > 0) {
          undo();
        }
      }
      // Ctrl+Y (또는 Cmd+Y) - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (history.future.length > 0) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () =>
      window.removeEventListener('keydown', handleKeyDown);
  }, [
    history.past.length,
    history.future.length,
    undo,
    redo,
  ]);

  // ============================================================================
  // 렌더링 조건
  // ============================================================================

  // 마운트되지 않은 경우 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  // ============================================================================
  // 렌더링
  // ============================================================================

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
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <div className='w-16 h-16 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin mx-auto mb-4'></div>
                  <p>모델 로딩 중...</p>
                </div>
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
              onResetCamera={handleCameraReset}
            />
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
                  <RainbowIcon className='w-6 h-6' />
                )}
              </button>
              {colorOpen && (
                <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 flex flex-col gap-2'>
                  {dynamicColorPalette.length > 0
                    ? dynamicColorPalette.map((c, i) => {
                        // 커스텀 색상 버튼인 경우
                        if (c === 'CUSTOM_COLOR') {
                          const currentCustomColor =
                            customColors[colorMode];
                          const isCustomColorActive =
                            currentColor ===
                            currentCustomColor;
                          const isCustomColorUsed =
                            customColorUsed[colorMode];

                          return (
                            <div
                              key={i}
                              className='relative'
                            >
                              <button
                                className={`w-6 h-6 rounded-full border-2 ${
                                  isCustomColorActive
                                    ? 'border-black'
                                    : 'border-white'
                                } cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`}
                                style={{
                                  backgroundColor:
                                    isCustomColorActive &&
                                    isCustomColorUsed
                                      ? currentCustomColor
                                      : 'transparent',
                                }}
                                onClick={
                                  handleCustomColorClick
                                }
                                title='커스텀 색상 선택'
                              >
                                {!(
                                  isCustomColorActive &&
                                  isCustomColorUsed
                                ) && (
                                  <RainbowIcon className='w-6 h-6' />
                                )}
                              </button>
                              {/* 무지개 아이콘 위치에 숨겨진 input color */}
                              <input
                                type='color'
                                value={
                                  customColors[colorMode]
                                }
                                onChange={
                                  handleCustomColorChange
                                }
                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                ref={hiddenColorInputRef}
                              />
                            </div>
                          );
                        }

                        // 일반 색상 버튼인 경우
                        return (
                          <button
                            key={i}
                            className={`w-6 h-6 rounded-full border-2 ${
                              paletteActiveColor &&
                              paletteActiveColor === c
                                ? 'border-black'
                                : 'border-white'
                            } cursor-pointer hover:scale-110 transition-transform`}
                            style={{ backgroundColor: c }}
                            onClick={() =>
                              handleColorChange(c)
                            }
                          />
                        );
                      })
                    : MATERIAL_COLORS.map((c, i) => (
                        <button
                          key={i}
                          className={`w-6 h-6 rounded-full border-2 ${
                            paletteActiveColor &&
                            paletteActiveColor === c
                              ? 'border-black'
                              : 'border-white'
                          } cursor-pointer hover:scale-110 transition-transform`}
                          style={{ backgroundColor: c }}
                          onClick={() =>
                            handleColorChange(c)
                          }
                        />
                      ))}
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
            <button
              className='w-10 h-10 rounded-full bg-[#3E7959] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b] transition-all duration-150 ease-in-out flex items-center justify-center'
              onClick={handleResetClick}
            >
              <ResetIcon />
            </button>
          </div>

          {/* Undo/Redo 버튼 */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
            <button
              className={`w-10 h-10 rounded-full text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-150 ease-in-out flex items-center justify-center ${
                history.past.length > 0
                  ? 'bg-[#3E7959] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={undo}
              disabled={history.past.length === 0}
              title={
                history.past.length > 0
                  ? '뒤로가기 (Ctrl+Z)'
                  : '뒤로가기 불가'
              }
            >
              <UndoIcon />
            </button>
            <button
              className={`w-10 h-10 rounded-full text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-150 ease-in-out flex items-center justify-center ${
                history.future.length > 0
                  ? 'bg-[#3E7959] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#35684b]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={redo}
              disabled={history.future.length === 0}
              title={
                history.future.length > 0
                  ? '앞으로가기 (Ctrl+Y)'
                  : '앞으로가기 불가'
              }
            >
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
