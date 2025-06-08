"use client";
import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import ThreeDFlowerViewer from './ThreeDFlowerViewer';
import logoGithub from '@/assets/images/footer/Logo-github.svg';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ResetIcon as RadixResetIcon,
  DownloadIcon,
  Share1Icon,
  MagnifyingGlassIcon 
} from '@radix-ui/react-icons';

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
const RainbowIcon = () => <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 border-2 border-white" />;
// 실행 취소 아이콘
const UndoIcon = () => <ChevronLeftIcon className="w-5 h-5" />;
// 다시 실행 아이콘
const RedoIcon = () => <ChevronRightIcon className="w-5 h-5" />;
// 초기화 아이콘
const ResetIcon = () => <RadixResetIcon className="w-5 h-5" />;
// 저장 아이콘
const SaveIcon = () => <DownloadIcon className="w-5 h-5" />;
// 공유 아이콘
const ShareIcon = () => <Share1Icon className="w-5 h-5" />;

const COLORS = [
  'bg-red-500',
  'bg-orange-400',
  'bg-yellow-300',
  'bg-green-600',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-300',
  'bg-gray-400',
];

// 카테고리 매핑
const CATEGORY_MAPPING = {
  'FL': '꽃',
  'WR': '포장지',
  'DE': '장식'
};

export default function ThreeDFlowerEditor() {
  const [colorOpen, setColorOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tab, setTab] = useState('꽃');
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<DisplayItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const categoryKey = Object.entries(CATEGORY_MAPPING).find((entry) => entry[1] === tab)?.[0];
        
        if (!categoryKey) {
          console.error('Invalid category');
          return;
        }

        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('category', categoryKey);

        if (error) throw error;

        // 데이터를 items 형식으로 변환
        const formattedItems: DisplayItem[] = (data as ModelItem[]).map(item => ({
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
  }, [tab]);

  const handleItemClick = (item: DisplayItem) => {
    setSelectedModel(item);
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center bg-[#F5F5F5] py-8">
      <div className="w-[95vw] max-w-[1400px] h-full flex gap-6">
        {/* Sidebar */}
        <aside className="w-[260px] h-full bg-white rounded-2xl shadow flex flex-col p-4 gap-4">
          {/* 제목 입력 */}
          <input
            className="mb-2 text-lg font-bold border-b outline-none px-2 py-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
          />
          {/* 탭 */}
          <div className="flex gap-2 mb-2">
            {Object.values(CATEGORY_MAPPING).map(t => (
              <button
                key={t}
                className={`flex-1 py-1 rounded-full text-sm ${tab === t ? 'bg-[#D8E4DE] font-bold' : 'bg-gray-100'}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {/* 검색 */}
          <div className="mb-2 flex items-center gap-2">
            <input className="w-full border rounded px-2 py-1 text-sm" placeholder="검색" />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </div>
          {/* 아이템 리스트 */}
          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2 auto-rows-min">
            {loading ? (
              <div className="col-span-3 text-center py-4">로딩 중...</div>
            ) : items.length === 0 ? (
              <div className="col-span-3 text-center py-4">데이터가 없습니다.</div>
            ) : (
              items.map(item => (
                <div 
                  key={item.id} 
                  className={`flex flex-col items-center bg-gray-50 rounded-lg p-2 border cursor-pointer transition-all h-24
                    ${selectedModel?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative w-8 h-8 mb-1">
                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span className="text-xs text-gray-700">{item.name}</span>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Canvas */}
        <section className="flex-1 h-full bg-[#E5E5E5] rounded-2xl relative flex flex-col items-center justify-center">
          {/* 색상 선택 */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            {/* 무지개 버튼 */}
            <button onClick={() => setColorOpen(v => !v)}>
              <RainbowIcon />
            </button>
            {/* 색상 리스트 (펼쳐졌을 때만) */}
            {colorOpen && (
              <div className="flex flex-col gap-2 mt-2">
                {COLORS.map((c, i) => (
                  <button key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white`} />
                ))}
              </div>
            )}
          </div>
          {/* 3D 미리보기 영역 */}
          <div className="w-[700px] h-[500px] flex items-center justify-center relative overflow-hidden">
            {selectedModel ? (
              <div className="w-full h-full relative overflow-hidden">
                <ThreeDFlowerViewer key={selectedModel.filePath} filePath={selectedModel.filePath} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 text-center z-10">
                  <span className="text-sm font-medium text-gray-700">{selectedModel.name}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                <div className="relative w-24 h-24 mb-4">
                  <Image 
                    src={logoGithub} 
                    alt="3D 미리보기" 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="opacity-60" 
                  />
                </div>
                <p>왼쪽에서 모델을 선택해주세요</p>
              </div>
            )}
          </div>
          {/* Undo/Redo */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><UndoIcon /></button>
            <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><RedoIcon /></button>
          </div>
          {/* 오른쪽 하단 버튼 */}
          <div className="absolute bottom-8 right-8 flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><ResetIcon /></button>
            <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><SaveIcon /></button>
            <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><ShareIcon /></button>
          </div>
        </section>
      </div>
    </div>
  );
} 