import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ReloadIcon,
  DownloadIcon,
  Share1Icon,
  Crosshair1Icon,
} from '@radix-ui/react-icons';

// 무지개 아이콘
export const RainbowIcon = ({
  className,
}: {
  className?: string;
}) => (
  <div
    className={`w-6 h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 border-2 border-white ${className || ''}`}
  />
);

// 되돌리기 아이콘
export const UndoIcon = () => (
  <ChevronLeftIcon className='w-5 h-5' />
);

// 다시 실행 아이콘
export const RedoIcon = () => (
  <ChevronRightIcon className='w-5 h-5' />
);

// 리셋 아이콘 (crosshair로 변경)
export const ResetIcon = () => (
  <Crosshair1Icon className='w-5 h-5' />
);

// 저장 아이콘
export const SaveIcon = () => (
  <DownloadIcon className='w-5 h-5' />
);

// 공유 아이콘
export const ShareIcon = () => (
  <Share1Icon className='w-5 h-5' />
);
