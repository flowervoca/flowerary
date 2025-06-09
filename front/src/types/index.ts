/**
 * 꽃 정보를 나타내는 인터페이스
 */
export interface IFlower {
  /** 꽃 이미지 URL */
  f_img: string;
  /** 꽃 서브타이틀 (주로 영문명) */
  f_low_lang: string;
  /** 꽃 메인타이틀 (주로 국문명) */
  f_low_nm: string;
  /** 꽃 상세 설명 */
  f_content: string;
}

/**
 * 꽃 카드 컴포넌트 속성
 */
export interface IFlowerCardProps {
  /** 꽃 정보 객체 */
  flower: IFlower;
  /** 카드 배경 모드 (white: 흰색 배경, color: 이미지 색상 기반 배경) */
  mode?: 'white' | 'color';
  /** 추가 CSS 클래스 */
  className?: string;
}
