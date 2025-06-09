'use client';
import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import ThreeDFlowerViewer from './ThreeDFlowerViewer';
import logoGithub from '@/assets/images/footer/Logo-github.svg';
import {
  initKakao,
  shareToKakao,
} from './utils/shareUtils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ReloadIcon,
  DownloadIcon,
  Share1Icon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { WebGLRenderer, Scene, Camera } from 'three';

// 타입 정의
interface ModelItem {
  model_id: number;
  description: string;
  category: string;
  file_path: string;
}

interface DisplayItem {
  id: number;
  name: string;
  img: StaticImageData;
  filePath: string;
}

// 무지개 색상 아이콘
const RainbowIcon = () => (
  <div className='w-6 h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 border-2 border-white' />
);
// 실행 취소 아이콘
const UndoIcon = () => (
  <ChevronLeftIcon className='w-5 h-5' />
);
// 다시 실행 아이콘
const RedoIcon = () => (
  <ChevronRightIcon className='w-5 h-5' />
);
// 초기화 아이콘
const ResetIcon = () => <ReloadIcon className='w-5 h-5' />;
// 저장 아이콘
const SaveIcon = () => <DownloadIcon className='w-5 h-5' />;
// 공유 아이콘
const ShareIcon = () => <Share1Icon className='w-5 h-5' />;

const COLORS = [
  'bg-red-200',
  'bg-orange-200',
  'bg-yellow-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-purple-200',
  'bg-pink-200',
];

// 카테고리 매핑
const CATEGORY_MAPPING = {
  FL: '꽃',
  WR: '포장지',
  DE: '장식',
};

export default function ThreeDFlowerEditor() {
  const [isMounted, setIsMounted] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tab, setTab] = useState('꽃');
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] =
    useState<DisplayItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [renderer, setRenderer] =
    useState<WebGLRenderer | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [selectedColor, setSelectedColor] =
    useState<string>('bg-[#E5E5E5]');
  const [searchQuery, setSearchQuery] = useState('');

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 토스트 메시지 표시 함수
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 다운로드 핸들러
  const handleDownload = (filename: string) => {
    showToastMessage(`${filename}이(가) 저장되었습니다!`);
  };

  // 클립보드 복사 핸들러
  const handleCopy = (success: boolean) => {
    if (success) {
      showToastMessage('클립보드에 복사되었습니다!');
    } else {
      showToastMessage('클립보드 복사에 실패했습니다.');
    }
  };

  // 카카오톡 공유 핸들러
  const handleShare = async () => {
    if (!selectedModel) {
      showToastMessage(
        '공유할 꽃다발을 먼저 선택해주세요.',
      );
      return;
    }

    if (!renderer || !scene || !camera) {
      showToastMessage('이미지를 생성할 수 없습니다.');
      return;
    }

    // 이미지 크기 조절을 위한 임시 캔버스 생성
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      showToastMessage('이미지 생성에 실패했습니다.');
      return;
    }

    // 원본 캔버스의 크기
    const originalWidth = renderer.domElement.width;
    const originalHeight = renderer.domElement.height;

    // 공유용 이미지 크기 (더 작게 조정)
    const shareWidth = 400; // 800에서 400으로 축소
    const shareHeight =
      (originalHeight * shareWidth) / originalWidth;

    // 임시 캔버스 크기 설정
    tempCanvas.width = shareWidth;
    tempCanvas.height = shareHeight;

    // 3D 씬 렌더링
    renderer.render(scene, camera);

    // 임시 캔버스에 3D 씬 복사
    tempCtx.drawImage(
      renderer.domElement,
      0,
      0,
      originalWidth,
      originalHeight,
      0,
      0,
      shareWidth,
      shareHeight,
    );

    // 이미지 품질을 더 낮춤 (0.6 = 60% 품질)
    // const imageUrl = tempCanvas.toDataURL(
    //   'image/jpeg',
    //   0.6,
    // );
    const defaultImageUrl =
      'https://hyeonseong2023.github.io/3D-Share-Test/study/images/flower.png';
    const imageUrl = defaultImageUrl;

    const success = await shareToKakao(
      title || '나만의 3D 꽃다발💐',
      '#핑크무드 #고백선물 #향기한줌 #설렘가득',
      imageUrl,
    );

    if (success) {
      // showToastMessage('카카오톡 공유가 시작되었습니다!'); // 메시지 제거
    } else {
      showToastMessage('카카오톡 공유에 실패했습니다.');
    }
  };

  // 카카오 SDK 초기화
  useEffect(() => {
    if (!isMounted) return;

    const initializeKakao = async () => {
      // SDK 로드 완료 이벤트 대기
      await new Promise<void>((resolve) => {
        if (window.Kakao) {
          resolve();
        } else {
          window.addEventListener(
            'kakao-sdk-loaded',
            () => {
              resolve();
            },
            { once: true },
          );
        }
      });

      const success = await initKakao();
      if (!success) {
        console.error('카카오 SDK 초기화 실패');
      }
    };
    initializeKakao();
  }, [isMounted]);

  // 아이템 로드
  useEffect(() => {
    if (!isMounted) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        const categoryKey = Object.entries(
          CATEGORY_MAPPING,
        ).find((entry) => entry[1] === tab)?.[0];

        if (!categoryKey) {
          console.error('Invalid category');
          return;
        }

        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('category', categoryKey);

        if (error) throw error;

        const formattedItems: DisplayItem[] = (
          data as ModelItem[]
        ).map((item) => ({
          id: item.model_id,
          name: item.description,
          img: logoGithub,
          filePath: item.file_path,
        }));

        setItems(formattedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [tab, isMounted]);

  const handleItemClick = (item: DisplayItem) => {
    setSelectedModel(item);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  if (!isMounted) {
    return null; // 또는 로딩 컴포넌트를 표시
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder='이름을 지어주세요'
          />
          {/* 탭 */}
          <div className='flex gap-2 mb-1'>
            <div className="flex rounded-full p-1 bg-[#D8E4DE] gap-0 w-full h-9 relative">
              {/* 슬라이딩 배경 */}
              <div 
                className={`absolute h-7 rounded-full bg-white transition-all duration-300 ease-in-out ${
                  tab === '꽃' ? 'left-1 w-[calc(33.333%-0.5rem)]' :
                  tab === '포장지' ? 'left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.5rem)]' :
                  'left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.5rem)]'
                }`}
              />
              {Object.values(CATEGORY_MAPPING).map((t) => (
                <button
                  key={t}
                  className={`rounded-full px-2 text-sm font-semibold shadow-none border-none transition-all flex-1 relative z-10
                    ${tab === t ? 'text-primary' : 'text-[#6F8278]'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* 검색 */}
          <div className='mb-2 flex items-center gap-2'>
            <div className='flex items-center w-full border border-primary rounded-full px-4 py-2 bg-background'>
              <input
                className='w-full border-none focus:ring-0 focus:outline-none bg-transparent flex-1 text-base text-foreground placeholder:text-left'
                placeholder='검색'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className='w-5 h-5 text-primary cursor-pointer' />
            </div>
          </div>
          {/* 아이템 리스트 */}
          <div className='flex-1 overflow-y-auto grid grid-cols-3 gap-2 auto-rows-min'>
            {loading ? (
              <div className='col-span-3 text-center py-4'>
                로딩 중...
              </div>
            ) : items.length === 0 ? (
              <div className='col-span-3 text-center py-4'>
                데이터가 없습니다.
              </div>
            ) : (
              items
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-center bg-gray-50 rounded-lg p-2 border cursor-pointer transition-all h-24
                      ${selectedModel?.id === item.id ? 'border-lime-500 bg-lime-50' : 'border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className='relative w-8 h-8 mb-1'>
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <span className='text-xs text-gray-700'>
                      {item.name}
                    </span>
                  </div>
                ))
            )}
          </div>
        </aside>

        {/* Main Canvas */}
        <section
          className={`flex-1 h-full bg-white rounded-2xl shadow relative flex flex-col items-center justify-center`}
        >
          {/* 색상 선택 */}
          <div className='absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-10'>
            {/* 무지개 버튼 */}
            <button onClick={() => setColorOpen((v) => !v)}>
              <RainbowIcon />
            </button>
            {/* 색상 리스트 (펼쳐졌을 때만) */}
            {colorOpen && (
              <div className='flex flex-col gap-2 mt-2 absolute top-full'>
                {COLORS.map((c, i) => (
                  <button
                    key={i}
                    className={`w-6 h-6 rounded-full ${c} border-2 ${selectedColor === c ? 'border-black' : 'border-white'} cursor-pointer`}
                    onClick={() => handleColorClick(c)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* 3D 미리보기 영역 */}
          <div className='w-full h-full flex items-center justify-center relative overflow-hidden'>
            {selectedModel ? (
              <>
                <ThreeDFlowerViewer
                  key={selectedModel.filePath}
                  filePath={selectedModel.filePath}
                  onDownload={handleDownload}
                  onCopy={handleCopy}
                  onRendererReady={(
                    renderer,
                    scene,
                    camera,
                  ) => {
                    setRenderer(renderer);
                    setScene(scene);
                    setCamera(camera);
                  }}
                />
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 text-center z-10'>
                  <span className='text-sm font-medium text-gray-700'>
                    {selectedModel.name}
                  </span>
                </div>
              </>
            ) : (
              <div className='text-gray-400 text-center'>
                <p>왼쪽에서 모델을 선택해주세요</p>
              </div>
            )}
          </div>
          {/* Undo/Redo */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
            <button className='w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-gray-100 transition-all duration-150 ease-in-out flex items-center justify-center'>
              <UndoIcon />
            </button>
            <button className='w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-gray-100 transition-all duration-150 ease-in-out flex items-center justify-center'>
              <RedoIcon />
            </button>
          </div>
          {/* 오른쪽 하단 버튼 */}
          <div className='absolute bottom-4 right-8 flex gap-4'>
            <button className='w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-gray-100 transition-all duration-150 ease-in-out flex items-center justify-center'>
              <ResetIcon />
            </button>
            <button
              className='w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-gray-100 transition-all duration-150 ease-in-out flex items-center justify-center'
              onClick={() =>
                (window as any).downloadFlower?.(
                  title || '3D-Flowerary',
                )
              }
            >
              <SaveIcon />
            </button>
            <button
              className='w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-gray-100 transition-all duration-150 ease-in-out flex items-center justify-center'
              onClick={handleShare}
            >
              <div className='w-6 h-6 relative'>
                <Image
                  src='/kakaotalk_sharing_btn_small.png'
                  alt='카카오톡 공유'
                  fill
                  className='object-contain'
                />
              </div>
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
