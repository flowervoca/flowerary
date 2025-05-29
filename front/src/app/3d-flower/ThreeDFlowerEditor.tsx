"use client";
import React, { useState } from 'react';
import Image from 'next/image';

// Placeholder icons (replace with real icons/assets as needed)
const RainbowIcon = () => <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 border-2 border-white" />;
const UndoIcon = () => <span className="material-icons">undo</span>;
const RedoIcon = () => <span className="material-icons">redo</span>;
const ResetIcon = () => <span className="material-icons">refresh</span>;
const SaveIcon = () => <span className="material-icons">download</span>;
const ShareIcon = () => <span className="material-icons">share</span>;

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

export default function ThreeDFlowerEditor() {
  const [colorOpen, setColorOpen] = useState(false);
  const [title, setTitle] = useState('나만의 꽃다발');
  const [tab, setTab] = useState('꽃');

  // Dummy item list
  const items = Array.from({ length: 9 }, (_, i) => ({
    name: '장미',
    img: require('@/assets/images/footer/Logo-github.svg'),
    id: i,
  }));

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
            placeholder="나만의 꽃다발"
          />
          {/* 탭 */}
          <div className="flex gap-2 mb-2">
            {['꽃', '포장지', '장식'].map(t => (
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
            <span className="material-icons text-gray-400">search</span>
          </div>
          {/* 아이템 리스트 */}
          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2">
            {items.map(item => (
              <div key={item.id} className="flex flex-col items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
                <Image src={item.img} alt={item.name} width={32} height={32} className="mb-1" />
                <span className="text-xs text-gray-700">{item.name}</span>
              </div>
            ))}
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
          <div className="w-[700px] h-[500px] flex items-center justify-center">
            <Image 
              src={require('@/assets/images/footer/Logo-github.svg')} 
              alt="3D 미리보기" 
              width={96} 
              height={96} 
              className="opacity-60" 
            />
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