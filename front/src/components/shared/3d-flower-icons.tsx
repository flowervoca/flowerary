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
    className={`w-full h-full rounded-full ${className || ''}`}
    style={{
      background: `conic-gradient(
        from 0deg,
        #ff0000 0deg,
        #ff8000 60deg,
        #ffff00 120deg,
        #80ff00 180deg,
        #00ff80 240deg,
        #0080ff 300deg,
        #8000ff 360deg
      )`,
    }}
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

// 리셋 아이콘
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
