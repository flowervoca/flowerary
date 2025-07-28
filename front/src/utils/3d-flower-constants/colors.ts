/**
 * 3D 꽃 관련 색상 상수들
 * 배경색, 포장지 색상, 장식 색상 등 색상 관련 설정을 관리합니다.
 */

// Tailwind CSS 클래스 기반 색상 옵션
export const COLORS = [
  'bg-red-200',
  'bg-orange-200',
  'bg-yellow-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-purple-200',
  'bg-pink-200',
] as const;

// 포장지/장식 색상 옵션 (HEX 색상)
export const MATERIAL_COLORS = [
  '#FF6B6B', // 빨강
  '#4ECDC4', // 청록
  '#45B7D1', // 파랑
  '#96CEB4', // 연두
  '#FFEAA7', // 노랑
  '#DDA0DD', // 연보라
  '#FFB6C1', // 연분홍
  '#F8BBD9', // 분홍
  '#D2B48C', // 베이지
  '#FFFFFF', // 흰색
] as const;

// 색상 매핑 객체 - HEX 색상 코드를 그대로 사용
export const COLOR_MAP = {
  '#FF6B6B': '#FF6B6B', // 빨강
  '#4ECDC4': '#4ECDC4', // 청록
  '#45B7D1': '#45B7D1', // 파랑
  '#96CEB4': '#96CEB4', // 연두
  '#FFEAA7': '#FFEAA7', // 노랑
  '#DDA0DD': '#DDA0DD', // 연보라
  '#FFB6C1': '#FFB6C1', // 연분홍
  '#F8BBD9': '#F8BBD9', // 분홍
  '#D2B48C': '#D2B48C', // 베이지
  '#FFFFFF': '#FFFFFF', // 흰색
  'bg-[#E5E5E5]': '#E5E5E5', // 기본 배경색
} as const;
